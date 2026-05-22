import { describe, expect, it } from "vitest";
import { parseResumeText } from "../services/resumeParser.js";
import { scoreResume } from "../services/atsScorer.js";

describe("ATS scoring", () => {
  it("rewards a resume that matches the target description", () => {
    const resumeText = `Alex Dev alex@example.com +1 555 555 1212
    Skills React Node.js MongoDB Docker
    Experience Built React dashboards and Node.js REST APIs for analytics.
    Education BS Computer Science
    Projects Dockerized MongoDB service with CI/CD.`;
    const jobText = "Need React Node.js MongoDB Docker REST analytics engineer for dashboard delivery.";
    const result = scoreResume({ resumeText, parsedResume: parseResumeText(resumeText), jobText });

    expect(result.scores.match).toBeGreaterThan(60);
    expect(result.missingSkills).toEqual([]);
    expect(result.scores.ats).toBeGreaterThan(50);
  });
});
