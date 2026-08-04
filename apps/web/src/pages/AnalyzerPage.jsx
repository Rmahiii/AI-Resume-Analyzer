import { motion } from "framer-motion";
import { Bot, BrainCircuit, FileCheck2, LockKeyhole, ScanSearch, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReportPanel } from "../components/ReportPanel.jsx";
import { ResumeDropzone } from "../components/ResumeDropzone.jsx";
import { runAnalysis } from "../features/analysis/analysisSlice.js";

const stats = [
  { description: "analyzed", heading: "Resumes", value: "2M+", icon: Users },
  { description: "interview rate", heading: "Better", value: "30%", icon: TrendingUp },
  { description: "optimized", heading: "ATS", value: "Top rated", icon: ShieldCheck },
  { description: "protected", heading: "Privacy", value: "100%", icon: LockKeyhole }
];

const formats = ["PDF", "DOCX", "DOC", "TXT", "RTF", "HTML"];

export function AnalyzerPage() {
  const dispatch = useDispatch();
  const { current, status, error } = useSelector((state) => state.analysis);
  const [file, setFile] = useState(null);
  const [job, setJob] = useState({
    jobTitle: "",
    company: "",
    jobDescription: ""
  });

  const submit = (event) => {
    event.preventDefault();
    if (file) dispatch(runAnalysis({ file, job }));
  };

  return (
    <div className="bg-[#06152f]">
      <section className="relative mx-auto min-h-[calc(100vh-88px)] max-w-[1560px] overflow-hidden rounded-b-[34px] bg-gradient-to-br from-[#081B3A] via-[#092758] to-[#0F2E67] px-5 py-10 shadow-[0_35px_90px_rgba(0,0,0,0.35)] md:px-10 lg:px-16">
        <AnimatedGlow />
        <div className="relative z-10 grid min-h-[calc(100vh-168px)] items-center gap-12 2xl:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="grid gap-7"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 backdrop-blur">
              <Sparkles size={17} className="text-[#ffe06b]" /> AI-Powered Resume Analysis
            </span>
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black leading-[1.05] tracking-normal text-white md:text-6xl xl:text-7xl">
                Resume intelligence built for recruiter filters and{" "}
                <span className="bg-gradient-to-r from-[#7a87ff] via-[#6ecbff] to-[#5372ff] bg-clip-text text-transparent">
                  human decisions.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-50/90 md:text-xl">
                Upload your resume, paste the role you want, and get an instant ATS score with skill insights and actionable suggestions to stand out.
              </p>
            </div>
            <form onSubmit={submit} className="grid max-w-3xl gap-5">
              <ResumeDropzone file={file} onFile={setFile} />
              <div className="grid gap-3 rounded-[24px] border border-white/10 bg-white/[0.08] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-blue-50">
                  Role title
                  <input className="field border-white/15 bg-white/95 !text-slate-950 placeholder:!text-slate-500" placeholder="Product Designer" value={job.jobTitle} onChange={(event) => setJob({ ...job, jobTitle: event.target.value })} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-blue-50">
                  Company
                  <input className="field border-white/15 bg-white/95 !text-slate-950 placeholder:!text-slate-500" placeholder="Notion" value={job.company} onChange={(event) => setJob({ ...job, company: event.target.value })} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-blue-50 md:col-span-2">
                  Job description
                  <textarea
                    className="field min-h-[116px] resize-y border-white/15 bg-white/95 !text-slate-950 placeholder:!text-slate-500"
                    value={job.jobDescription}
                    onChange={(event) => setJob({ ...job, jobDescription: event.target.value })}
                    placeholder="Paste the responsibilities, qualifications, and keywords from the job post."
                  />
                </label>
                {error && <p className="rounded-2xl bg-rose-500/20 p-3 text-sm text-rose-100 md:col-span-2">{error}</p>}
                <button className="button-primary min-h-12 rounded-2xl bg-gradient-to-r from-[#5c63f1] to-[#6d78ff] text-base shadow-lg shadow-indigo-500/25 hover:scale-[1.01] md:col-span-2" disabled={!file || job.jobDescription.length < 80 || status === "loading"}>
                  <ScanSearch size={19} /> {status === "loading" ? "Analyzing resume" : "Analyze my resume"}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formats.map((format) => (
                  <span key={format} className="rounded-xl border border-white/10 bg-white/10 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-950/10">
                    {format}
                  </span>
                ))}
              </div>
              <div className="grid max-w-5xl grid-cols-1 items-stretch gap-4 rounded-[24px] border border-white/10 bg-white/[0.07] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ description, heading, value, icon: Icon }) => (
                  <motion.div
                    key={`${value}-${heading}`}
                    whileHover={{ y: -4, scale: 1.015 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex min-h-[224px] min-w-0 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.09]"
                  >
                    <div className="flex w-full min-w-0 flex-col items-center justify-center px-1">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#5c63f1] to-[#233b8f] text-white shadow-lg shadow-indigo-500/25">
                        <Icon size={23} />
                      </span>
                      <strong className="mt-5 block max-w-full whitespace-nowrap text-xl font-black leading-none text-white">{value}</strong>
                      <span className="mt-3 block max-w-full whitespace-nowrap text-base font-semibold leading-5 text-blue-50">{heading}</span>
                      <span className="mt-2 block max-w-full text-sm leading-6 text-blue-100/80">{description}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </form>
          </motion.div>
          <HeroResumeMockup />
        </div>
      </section>
      <section className="mx-auto max-w-[1560px] bg-[#f4f7fb] px-5 py-10 text-[#17202a] md:px-10 lg:px-16 dark:bg-[#071227] dark:text-white">
        <ReportPanel report={current} />
      </section>
    </div>
  );
}

function AnimatedGlow() {
  return (
    <>
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.65, 0.95, 0.65] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[45%] top-[23%] h-[470px] w-[470px] rounded-full bg-[#584bff]/35 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-12 top-32 h-72 w-72 rounded-full bg-[#42c8ff]/20 blur-3xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(110,203,255,0.18),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(92,99,241,0.18),transparent_30%)]" />
    </>
  );
}

function HeroResumeMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75, ease: "easeOut", delay: 0.15 }}
      className="relative min-h-[620px] lg:min-h-[760px]"
    >
      <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#665dff]/70 to-[#155fff]/40 blur-[1px]" />
      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 760 760" aria-hidden="true">
        <path d="M152 158 C 250 40, 362 112, 330 246 S 542 318, 646 246 C 754 172, 760 354, 668 476 S 736 712, 534 650 C 362 596, 288 766, 190 628 S 80 430, 206 360 C 314 300, 44 294, 152 158" fill="none" stroke="#6d78ff" strokeWidth="2" strokeDasharray="8 9" />
      </svg>
      <FloatingIcon className="left-[8%] top-[23%]" icon={FileCheck2} />
      <FloatingIcon className="right-[10%] bottom-[24%]" icon={BrainCircuit} light />
      <FloatingIcon className="left-[15%] bottom-[17%]" icon={Bot} small />
      <motion.article
        animate={{ y: [0, -18, 0], rotate: [-7, -5.5, -7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-10 z-20 w-[min(82vw,520px)] -translate-x-1/2 rotate-[-7deg] rounded-[28px] bg-white p-8 text-[#0b1020] shadow-[0_38px_100px_rgba(0,0,0,0.38)] md:p-10"
      >
        <div className="grid gap-7">
          <header className="grid gap-4 border-b border-slate-200 pb-5">
            <h2 className="max-w-sm text-5xl font-black leading-[0.95] tracking-normal text-black md:text-6xl">Maya Chen</h2>
            <div className="grid gap-2 text-xs font-semibold text-slate-700 sm:grid-cols-2">
              <p>San Francisco, CA</p>
              <p>+1 609-870-2200</p>
              <p>maya.chen@resume.io</p>
              <p>linkedin.com/in/mayachen</p>
            </div>
          </header>
          <section className="grid gap-6 md:grid-cols-[1.05fr_.95fr]">
            <div>
              <h3 className="resume-heading">Profile</h3>
              <p className="mt-2 text-[13px] leading-5 text-slate-700">
                AI product designer with six years of experience translating customer research into polished recruiter-facing workflows, dashboards, and automation tools.
              </p>
            </div>
            <div>
              <h3 className="resume-heading">Skills</h3>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-slate-700">
                <span>Product strategy</span>
                <span>Excellent</span>
                <span>UX systems</span>
                <span>Advanced</span>
                <span>ATS keywords</span>
                <span>Strong</span>
              </div>
            </div>
          </section>
          <section>
            <h3 className="resume-heading">Employment History</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <TimelineItem title="Senior Product Designer" company="North Star Design, San Francisco" date="Apr 2021 - Present" />
              <TimelineItem title="UX Designer" company="Porter Barn, San Francisco" date="Feb 2019 - Mar 2021" />
            </div>
          </section>
          <section className="grid gap-6 border-t border-slate-200 pt-5 md:grid-cols-2">
            <div>
              <h3 className="resume-heading">Education</h3>
              <p className="mt-2 text-[13px] font-semibold text-slate-800">BFA Interaction Design</p>
              <p className="text-[12px] text-slate-600">California College of the Arts</p>
            </div>
            <div>
              <h3 className="resume-heading">Languages</h3>
              <p className="mt-2 text-[13px] text-slate-700">English fluent, Spanish advanced, Mandarin conversational</p>
            </div>
          </section>
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 pt-2 text-[10px] font-semibold text-slate-500">
            <span className="h-2 rounded-full bg-black" />
            <span>ATS timeline score</span>
            <span className="h-2 rounded-full bg-black" />
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function FloatingIcon({ icon: Icon, className, light = false, small = false }) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: small ? 4.2 : 5.5, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute z-30 grid ${small ? "h-16 w-16" : "h-20 w-20"} place-items-center rounded-full ${
        light ? "bg-white text-[#4f5fff]" : "bg-gradient-to-br from-[#6f73ff] to-[#233bca] text-white"
      } shadow-[0_18px_45px_rgba(28,52,190,0.35)] ${className}`}
    >
      <Icon size={small ? 28 : 34} />
    </motion.div>
  );
}

function TimelineItem({ title, company, date }) {
  return (
    <div className="relative pl-5">
      <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-black" />
      <h4 className="text-[13px] font-black text-black">{title}</h4>
      <p className="mt-1 text-[12px] font-semibold text-slate-700">{company}</p>
      <p className="mt-1 text-[11px] text-slate-500">{date}</p>
      <ul className="mt-3 grid gap-1 text-[11px] leading-4 text-slate-700">
        <li>Led resume scoring surfaces with measurable completion gains.</li>
        <li>Designed keyword insights used across hiring workflows.</li>
        <li>Partnered with engineering to ship accessible SaaS UI systems.</li>
      </ul>
    </div>
  );
}
