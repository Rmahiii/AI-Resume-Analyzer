import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { loadDashboard } from "../features/analysis/analysisSlice.js";

function ChartFrame({ title, children }) {
  return (
    <section className="panel min-h-[300px] p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4 h-[235px]">{children}</div>
    </section>
  );
}

export function DashboardPage() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.analysis.dashboard);
  useEffect(() => { dispatch(loadDashboard()); }, [dispatch]);

  return (
    <div className="grid gap-4">
      <header className="panel flex flex-wrap items-end justify-between gap-3 p-5">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2 className="mt-2 text-3xl font-bold">Improvement trend</h2>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-300">{dashboard?.savedReports?.length || 0} saved reports</p>
      </header>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartFrame title="ATS score trend">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dashboard?.trend || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
              <XAxis dataKey="title" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area dataKey="ats" stroke="#2854a1" fill="#2854a1" fillOpacity={0.22} />
              <Area dataKey="match" stroke="#3d8b6e" fill="#3d8b6e" fillOpacity={0.14} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame title="Resume improvement progress">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard?.progress || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
              <XAxis dataKey="attempt" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="completeness" fill="#b7791f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="readability" fill="#5b6fc5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
      <ChartFrame title="Skill distribution">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dashboard?.skillDistribution || []} layout="vertical">
            <XAxis type="number" hide />
            <YAxis dataKey="skill" type="category" width={110} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#3d8b6e" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}
