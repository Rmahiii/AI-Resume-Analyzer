import pdf from "pdf-parse";
import mammoth from "mammoth";
import { cleanText, uniqueStrings } from "../utils/text.js";
import { AppError } from "../utils/appError.js";

const skillCatalog = [
  "JavaScript", "TypeScript", "React", "Redux", "Node.js", "Express", "MongoDB",
  "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git",
  "REST", "GraphQL", "Python", "Java", "C++", "SQL", "HTML", "CSS", "Tailwind",
  "Jest", "Vitest", "Cypress", "Playwright", "CI/CD", "Machine Learning", "NLP",
  "Data Analysis", "Leadership", "Agile", "Figma", "OAuth", "JWT", "Mongoose"
];

const sectionAliases = {
  skills: /^(technical )?skills\b/i,
  education: /^education\b/i,
  experience: /^(work |professional )?experience\b|^employment\b/i,
  projects: /^projects?\b/i,
  certifications: /^certifications?\b|^licenses?\b/i,
  summary: /^(summary|profile|objective)\b/i
};

function extractBlock(lines, aliases) {
  const start = lines.findIndex((line) => aliases.test(line));
  if (start < 0) return [];
  const end = lines.findIndex((line, index) =>
    index > start && Object.values(sectionAliases).some((pattern) => pattern.test(line))
  );
  return lines.slice(start + 1, end < 0 ? start + 7 : end).filter(Boolean).slice(0, 10);
}

function findSkills(text) {
  const lowerText = text.toLowerCase();
  return skillCatalog.filter((skill) => lowerText.includes(skill.toLowerCase()));
}

export async function extractResumeText(file) {
  if (!file) throw new AppError(400, "Resume file is required.");
  if (file.mimetype === "application/pdf") {
    const parsed = await pdf(file.buffer);
    return cleanText(parsed.text);
  }
  const parsed = await mammoth.extractRawText({ buffer: file.buffer });
  return cleanText(parsed.value);
}

export function parseResumeText(text) {
  const lines = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((line) => cleanText(line))
    .filter((line) => line.length > 1);
  const links = text.match(/https?:\/\/\S+|(?:github|linkedin)\.com\/\S+/gi) || [];
  const sections = Object.entries(sectionAliases)
    .filter(([, pattern]) => lines.some((line) => pattern.test(line)))
    .map(([section]) => section);

  return {
    contact: {
      email: text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0] || "",
      phone: text.match(/(?:\+?\d[\d()\s.-]{8,}\d)/)?.[0] || "",
      links: uniqueStrings(links).slice(0, 5)
    },
    skills: findSkills(text),
    education: extractBlock(lines, sectionAliases.education),
    experience: extractBlock(lines, sectionAliases.experience),
    projects: extractBlock(lines, sectionAliases.projects),
    certifications: extractBlock(lines, sectionAliases.certifications),
    sections
  };
}

export function extractKeywords(text) {
  const stopWords = new Set([
    "about", "after", "also", "and", "are", "can", "for", "from", "have", "into",
    "job", "our", "role", "that", "the", "their", "this", "with", "will", "you",
    "years", "work", "working", "using", "team", "teams", "skills", "ability"
  ]);
  const terms = text.toLowerCase().match(/[a-z][a-z+#./-]{2,}/g) || [];
  const counts = terms.reduce((map, term) => {
    if (!stopWords.has(term)) map.set(term, (map.get(term) || 0) + 1);
    return map;
  }, new Map());
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term)
    .slice(0, 28);
}

export function catalogSkillsFromText(text) {
  return findSkills(text);
}
