import { ScanSearch } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReportPanel } from "../components/ReportPanel.jsx";
import { ResumeDropzone } from "../components/ResumeDropzone.jsx";
import { runAnalysis } from "../features/analysis/analysisSlice.js";

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
    <div className="grid gap-4 xl:grid-cols-[minmax(360px,.8fr)_1.2fr]">
      <form onSubmit={submit} className="panel grid content-start gap-4 p-4 md:p-6">
        <header>
          <p className="eyebrow">Resume analyzer</p>
          <h2 className="mt-2 text-3xl font-bold">Match a resume to a live role</h2>
        </header>
        <ResumeDropzone file={file} onFile={setFile} />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">Role title<input className="field" placeholder="Full-stack Engineer" value={job.jobTitle} onChange={(event) => setJob({ ...job, jobTitle: event.target.value })} /></label>
          <label className="grid gap-1 text-sm">Company<input className="field" placeholder="Amazon" value={job.company} onChange={(event) => setJob({ ...job, company: event.target.value })} /></label>
        </div>
        <label className="grid gap-1 text-sm">
          Job description
          <textarea
            className="field min-h-[260px] resize-y"
            value={job.jobDescription}
            onChange={(event) => setJob({ ...job, jobDescription: event.target.value })}
            placeholder="Paste responsibilities, qualifications, and tooling from the target job description."
          />
        </label>
        {error && <p className="rounded-lg bg-rose-500/15 p-3 text-sm text-rose-700 dark:text-rose-200">{error}</p>}
        <button className="button-primary" disabled={!file || job.jobDescription.length < 80 || status === "loading"}>
          <ScanSearch size={17} /> {status === "loading" ? "Analyzing" : "Generate report"}
        </button>
      </form>
      <ReportPanel report={current} />
    </div>
  );
}
