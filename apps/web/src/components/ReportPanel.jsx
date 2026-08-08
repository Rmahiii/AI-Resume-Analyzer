import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, CircleAlert, Sparkles } from "lucide-react";
import { ScoreRing } from "./ScoreRing.jsx";

function List({ title, items, icon: Icon }) {
  return (
    <section className="rounded-lg border border-zinc-200/80 p-4 dark:border-white/10">
      <h3 className="flex items-center gap-2 text-sm font-bold"><Icon size={16} /> {title}</h3>
      <div className="mt-3 grid gap-2 text-sm text-zinc-600 dark:text-zinc-200">
        {items?.length ? items.map((item) => (
          <p key={item} className="rounded-md bg-zinc-950/[0.04] px-2 py-2 dark:bg-white/[0.06]">{item}</p>
        )) : <p>No items flagged.</p>}
      </div>
    </section>
  );
}

export function ReportPanel({ report }) {
  if (!report) {
    return (
      <section className="panel grid min-h-[360px] place-items-center p-6 text-center">
        <div>
          <p className="eyebrow">Report</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Upload a resume to score it</h2>
        </div>
      </section>
    );
  }

  const scoreCards = [
    ["ATS", report.scores.ats, "blue"],
    ["Job match", report.scores.match, "green"],
    ["Readability", report.scores.readability, "gold"]
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel grid gap-5 p-4 md:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{report.jobDescription?.company || "Target role"}</p>
          <h2 className="mt-1 text-2xl font-bold">{report.jobDescription?.title || "Analysis report"}</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">{report.resume?.fileName}</p>
        </div>
        <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-200">
          {report.provider}
        </span>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        {scoreCards.map(([label, score, tone]) => <ScoreRing key={label} label={label} score={score} tone={tone} />)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <List title="Missing skills" items={report.missingSkills} icon={CircleAlert} />
        <List title="Strength areas" items={report.strengthAreas} icon={BadgeCheck} />
        <List title="Optimization suggestions" items={[...(report.suggestions || []), ...(report.ai?.atsSuggestions || [])].slice(0, 7)} icon={Sparkles} />
        <List title="Interview questions" items={report.ai?.interviewQuestions} icon={ArrowUpRight} />
      </div>
      <div className="rounded-lg border border-zinc-200/80 p-4 dark:border-white/10">
        <p className="eyebrow">AI resume summary</p>
        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-100">
          {report.ai?.summary || report.ai?.review || "AI enrichment is ready when a provider key is configured."}
        </p>
      </div>
    </motion.section>
  );
}
