import { connectDatabase } from "../src/config/db.js";
import { User } from "../src/models/User.js";
import { Resume } from "../src/models/Resume.js";
import { JobDescription } from "../src/models/JobDescription.js";
import { Analysis } from "../src/models/Analysis.js";
import { parseResumeText } from "../src/services/resumeParser.js";
import { scoreResume } from "../src/services/atsScorer.js";
import { demoAccount, ensureDemoAccount } from "../src/services/demoAccount.js";

const resumeText = `Maya Shah maya@example.com +91 99999 11111
Skills React Node.js Express MongoDB Redis Docker
Experience Built recruiter dashboards and improved API latency by 35%.
Education B.Tech Computer Science
Projects Resume screening portal with JWT, PDF parsing, and Recharts analytics.`;
const jobText = "Full-stack engineer using React Node.js Express MongoDB Redis Docker CI/CD and ATS analytics.";

await connectDatabase();
const user = await ensureDemoAccount();

const personalEmail = "rmahi0773@gmail.com";
let personalUser = await User.findOne({ email: personalEmail });
if (!personalUser) {
  personalUser = new User({ name: "R Mahi", email: personalEmail, role: "admin" });
  await personalUser.setPassword("DemoPassword123!");
  await personalUser.save();
}

const parsed = parseResumeText(resumeText);
const deterministic = scoreResume({ resumeText, parsedResume: parsed, jobText });
const resume = await Resume.create({
  user: user.id,
  fileName: "demo-resume.pdf",
  mimeType: "application/pdf",
  byteSize: resumeText.length,
  text: resumeText,
  parsed
});
const jd = await JobDescription.create({
  user: user.id,
  title: "Full-stack Engineer",
  company: "Signal Labs",
  text: jobText,
  keywords: ["react", "node.js", "redis", "docker"]
});
await Analysis.create({
  user: user.id,
  resume: resume.id,
  jobDescription: jd.id,
  provider: "seed",
  ...deterministic,
  ai: { summary: "Seeded sample analysis for dashboard previews." }
});
console.log(`Seeded ${demoAccount.email} with password ${demoAccount.password}`);
console.log(`Seeded ${personalEmail} with password DemoPassword123!`);
process.exit(0);
