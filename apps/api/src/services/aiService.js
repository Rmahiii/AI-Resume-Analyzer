import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

const emptyAI = {
  review: "",
  summary: "",
  bulletEnhancements: [],
  atsSuggestions: [],
  projectSuggestions: [],
  careerSuggestions: [],
  skillGap: [],
  interviewQuestions: [],
  rewriteSuggestions: []
};

function safeJson(value) {
  const normalized = value.replace(/^```json\s*|```$/gim, "").trim();
  return JSON.parse(normalized);
}

function promptFor({ resumeText, jobText, deterministic }) {
  return `You are a careful ATS resume analyst. Return only valid JSON with these keys:
review string, summary string, bulletEnhancements string[], atsSuggestions string[],
projectSuggestions string[], careerSuggestions string[], skillGap string[],
interviewQuestions string[], rewriteSuggestions string[].
Do not invent credentials. Prefer concise suggestions grounded in the resume and job description.
Deterministic ATS findings: ${JSON.stringify(deterministic)}
Job description: ${jobText.slice(0, 9000)}
Resume: ${resumeText.slice(0, 14000)}`;
}

function fallbackAI(deterministic) {
  return {
    ...emptyAI,
    review: "Deterministic review completed. Configure an AI provider for deeper rewriting.",
    summary: "Resume evidence has been compared with the target job description.",
    bulletEnhancements: ["Rewrite one high-impact bullet with action, scale, toolset, and outcome."],
    atsSuggestions: deterministic.suggestions,
    skillGap: deterministic.missingSkills,
    interviewQuestions: deterministic.missingSkills
      .slice(0, 4)
      .map((skill) => `How have you applied ${skill} in a production or project setting?`),
    rewriteSuggestions: deterministic.missingKeywords
      .slice(0, 4)
      .map((keyword) => `Surface truthful "${keyword}" evidence in a relevant bullet.`)
  };
}

async function runOpenAI(input) {
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: env.OPENAI_MODEL,
    input,
    text: { format: { type: "json_object" } }
  });
  return safeJson(response.output_text);
}

async function runGemini(input) {
  const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const response = await client.getGenerativeModel({
    model: env.GEMINI_MODEL,
    generationConfig: { responseMimeType: "application/json" }
  }).generateContent(input);
  return safeJson(response.response.text());
}

async function runGroq(input) {
  const client = new Groq({ apiKey: env.GROQ_API_KEY });
  const response = await client.chat.completions.create({
    model: env.GROQ_MODEL,
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: input }],
    temperature: 0.2
  });
  return safeJson(response.choices[0].message.content);
}

export async function enrichAnalysis(payload) {
  const prompt = promptFor(payload);
  const isConfigured = {
    openai: Boolean(env.OPENAI_API_KEY),
    gemini: Boolean(env.GEMINI_API_KEY),
    groq: Boolean(env.GROQ_API_KEY),
    mock: false
  }[env.AI_PROVIDER];

  if (!isConfigured) return { provider: "mock", ai: fallbackAI(payload.deterministic) };

  try {
    const ai = {
      openai: runOpenAI,
      gemini: runGemini,
      groq: runGroq
    }[env.AI_PROVIDER];
    return { provider: env.AI_PROVIDER, ai: { ...emptyAI, ...(await ai(prompt)) } };
  } catch (error) {
    logger.warn("AI enrichment failed; using deterministic fallback", { error: error.message });
    return { provider: `${env.AI_PROVIDER}-fallback`, ai: fallbackAI(payload.deterministic) };
  }
}
