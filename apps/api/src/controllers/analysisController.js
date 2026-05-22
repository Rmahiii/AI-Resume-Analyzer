import { Analysis } from "../models/Analysis.js";
import { JobDescription } from "../models/JobDescription.js";
import { Resume } from "../models/Resume.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import { cleanText, hash } from "../utils/text.js";
import { extractResumeText, extractKeywords, parseResumeText } from "../services/resumeParser.js";
import { scoreResume } from "../services/atsScorer.js";
import { enrichAnalysis } from "../services/aiService.js";
import { readCache, writeCache } from "../config/redis.js";

function serializeAnalysis(analysis) {
  return {
    id: analysis.id,
    createdAt: analysis.createdAt,
    provider: analysis.provider,
    scores: analysis.scores,
    missingSkills: analysis.missingSkills,
    missingKeywords: analysis.missingKeywords,
    strengthAreas: analysis.strengthAreas,
    weakAreas: analysis.weakAreas,
    suggestions: analysis.suggestions,
    ai: analysis.ai,
    resume: analysis.resume,
    jobDescription: analysis.jobDescription
  };
}

export const analyzeResume = asyncHandler(async (req, res) => {
  const resumeText = await extractResumeText(req.file);
  if (resumeText.length < 120) throw new AppError(422, "Resume text could not be extracted reliably.");

  const jobText = cleanText(req.body.jobDescription);
  const parsed = parseResumeText(resumeText);
  const cacheKey = `analysis:${hash(`${resumeText}:${jobText}`)}`;
  const deterministic = scoreResume({ resumeText, parsedResume: parsed, jobText });
  const cachedAI = await readCache(cacheKey);
  const enriched = cachedAI || await enrichAnalysis({ resumeText, jobText, deterministic });
  if (!cachedAI) await writeCache(cacheKey, enriched);

  const [resume, jobDescription] = await Promise.all([
    Resume.create({
      user: req.user.id,
      fileName: cleanText(req.file.originalname),
      mimeType: req.file.mimetype,
      byteSize: req.file.size,
      text: resumeText,
      parsed
    }),
    JobDescription.create({
      user: req.user.id,
      title: cleanText(req.body.jobTitle),
      company: cleanText(req.body.company),
      text: jobText,
      keywords: extractKeywords(jobText)
    })
  ]);

  const analysis = await Analysis.create({
    user: req.user.id,
    resume: resume.id,
    jobDescription: jobDescription.id,
    ...deterministic,
    ...enriched
  });
  await analysis.populate([
    { path: "resume", select: "fileName parsed createdAt" },
    { path: "jobDescription", select: "title company keywords createdAt" }
  ]);
  res.status(201).json({ analysis: serializeAnalysis(analysis) });
});

export const listAnalyses = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("resume", "fileName parsed createdAt")
    .populate("jobDescription", "title company keywords createdAt");
  res.json({ analyses: analyses.map(serializeAnalysis) });
});

export const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user.id })
    .populate("resume", "fileName parsed createdAt")
    .populate("jobDescription", "title company keywords createdAt");
  if (!analysis) throw new AppError(404, "Analysis report not found.");
  res.json({ analysis: serializeAnalysis(analysis) });
});

export const dashboard = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(12)
    .populate("resume", "parsed")
    .populate("jobDescription", "title");
  const latestSkills = analyses[0]?.resume?.parsed?.skills || [];
  res.json({
    trend: analyses.slice().reverse().map((analysis) => ({
      date: analysis.createdAt,
      ats: analysis.scores.ats,
      match: analysis.scores.match,
      title: analysis.jobDescription?.title
    })),
    progress: analyses.slice().reverse().map((analysis, index) => ({
      attempt: index + 1,
      completeness: analysis.scores.completeness,
      readability: analysis.scores.readability
    })),
    skillDistribution: latestSkills.map((skill) => ({ skill, value: 1 })),
    savedReports: analyses.map(serializeAnalysis)
  });
});
