import { useEffect } from "react";
import { Clock3 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ReportPanel } from "../components/ReportPanel.jsx";
import { loadDashboard, selectReport } from "../features/analysis/analysisSlice.js";

export function HistoryPage() {
  const dispatch = useDispatch();
  const { dashboard, current } = useSelector((state) => state.analysis);
  useEffect(() => { dispatch(loadDashboard()); }, [dispatch]);
  const reports = dashboard?.savedReports || [];

  return (
    <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
      <section className="panel grid content-start gap-2 p-4">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Clock3 size={18} /> Saved reports</h2>
        {reports.map((report) => (
          <button key={report.id} className="button-quiet grid justify-items-start text-left" onClick={() => dispatch(selectReport(report))}>
            <span className="font-semibold">{report.jobDescription?.title}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-300">ATS {report.scores.ats} | {new Date(report.createdAt).toLocaleDateString()}</span>
          </button>
        ))}
        {!reports.length && <p className="text-sm text-zinc-500">Your reports will appear here.</p>}
      </section>
      <ReportPanel report={current || reports[0]} />
    </div>
  );
}
