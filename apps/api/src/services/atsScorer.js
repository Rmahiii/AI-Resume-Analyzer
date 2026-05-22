import { catalogSkillsFromText, extractKeywords } from "./resumeParser.js";
import { uniqueStrings } from "../utils/text.js";

const clamp = (score) => Math.max(0, Math.min(100, Math.round(score)));

function percent(part, total) {
  return total ? clamp((part / total) * 100) : 0;
}

function readabilityScore(text) {
  const words = text.match(/\b[\w'-]+\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 10);
  const averageSentence = words.length / Math.max(sentences.length, 1);
  const longWords = words.filter((word) => word.length > 12).length;
  return clamp(100 - Math.max(0, averageSentence - 22) * 2 - percent(longWords, words.length) / 2);
}

function formattingScore(text) {
  const hasBullets = /[•*-]\s+\w/.test(text);
  const characterPenalty = (text.match(/[|{}]/g) || []).length * 2;
  const lengthPenalty = text.length < 900 ? 18 : text.length > 12000 ? 10 : 0;
  return clamp(78 + (hasBullets ? 12 : 0) - characterPenalty - lengthPenalty);
}

export function scoreResume({ resumeText, parsedResume, jobText }) {
  const keywords = extractKeywords(jobText);
  const resumeLower = resumeText.toLowerCase();
  const matchedKeywords = keywords.filter((keyword) => resumeLower.includes(keyword));
  const missingKeywords = keywords.filter((keyword) => !resumeLower.includes(keyword)).slice(0, 12);
  const jobSkills = catalogSkillsFromText(jobText);
  const missingSkills = jobSkills.filter((skill) => !parsedResume.skills.includes(skill));
  const completeness = percent(
    ["contact", "skills", "education", "experience", "projects"].filter((section) => {
      if (section === "contact") return parsedResume.contact.email && parsedResume.contact.phone;
      return parsedResume[section]?.length;
    }).length,
    5
  );
  const keywordMatch = percent(matchedKeywords.length, keywords.length);
  const formatting = formattingScore(resumeText);
  const readability = readabilityScore(resumeText);
  const compatibility = clamp((formatting * 0.55) + (completeness * 0.45));
  const match = clamp((keywordMatch * 0.7) + (percent(jobSkills.length - missingSkills.length, jobSkills.length) * 0.3));
  const ats = clamp(
    keywordMatch * 0.3 +
    formatting * 0.18 +
    completeness * 0.2 +
    readability * 0.12 +
    compatibility * 0.2
  );

  return {
    scores: { ats, keywordMatch, formatting, completeness, readability, compatibility, match },
    missingSkills: uniqueStrings(missingSkills).slice(0, 10),
    missingKeywords,
    strengthAreas: [
      keywordMatch >= 65 ? "Role language appears in the resume" : null,
      parsedResume.projects.length ? "Projects section demonstrates applied work" : null,
      parsedResume.contact.links.length ? "Recruiter links are discoverable" : null
    ].filter(Boolean),
    weakAreas: [
      completeness < 80 ? "Core resume sections need fuller coverage" : null,
      formatting < 80 ? "Formatting may lose signal in parser-heavy ATS flows" : null,
      missingSkills.length ? "Target-role skill gaps remain visible" : null
    ].filter(Boolean),
    suggestions: [
      ...missingKeywords.slice(0, 4).map((keyword) => `Add evidence for "${keyword}" where it truthfully fits.`),
      completeness < 100 ? "Include contact, skills, experience, education, and project evidence." : null,
      "Lead bullets with action, scope, tools, and measurable outcome."
    ].filter(Boolean).slice(0, 7)
  };
}
