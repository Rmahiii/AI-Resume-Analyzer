import sanitizeHtml from "sanitize-html";
import { createHash, randomBytes } from "node:crypto";

export function cleanText(value = "") {
  return sanitizeHtml(String(value), { allowedTags: [], allowedAttributes: {} })
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function uniqueStrings(values = []) {
  return [...new Set(values.map((value) => cleanText(value)).filter(Boolean))];
}

export function hash(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

export function token() {
  return randomBytes(32).toString("hex");
}
