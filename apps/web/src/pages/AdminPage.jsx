import { Activity, MessageSquareText, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { api } from "../services/api.js";

export function AdminPage() {
  const user = useSelector((state) => state.auth.user);
  const [overview, setOverview] = useState(null);
  useEffect(() => { if (user?.role === "admin") api.get("/admin/overview").then(({ data }) => setOverview(data)); }, [user]);
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="grid gap-4">
      <header className="panel p-5">
        <p className="eyebrow">Admin panel</p>
        <h2 className="mt-2 text-3xl font-bold">Usage and feedback</h2>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="panel p-4"><UsersRound /><strong className="mt-4 block text-3xl">{overview?.users || 0}</strong><span>Users</span></div>
        <div className="panel p-4"><Activity /><strong className="mt-4 block text-3xl">{overview?.analyses || 0}</strong><span>Analyses</span></div>
        <div className="panel p-4"><MessageSquareText /><strong className="mt-4 block text-3xl">{overview?.feedback?.length || 0}</strong><span>Recent feedback</span></div>
      </div>
      <section className="panel p-4">
        <h3 className="text-lg font-bold">AI API usage</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {overview?.providerUsage?.map((provider) => (
            <p key={provider.provider} className="rounded-lg border border-zinc-200 p-3 dark:border-white/10">
              <strong className="block">{provider.provider}</strong>{provider.requests} requests
            </p>
          ))}
        </div>
      </section>
      <section className="panel p-4">
        <h3 className="text-lg font-bold">Feedback dashboard</h3>
        <div className="mt-3 grid gap-2">
          {overview?.feedback?.map((item) => (
            <article key={item._id} className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-white/10">
              <strong>{item.rating}/5 from {item.user?.email}</strong>
              <p className="mt-1 text-zinc-600 dark:text-zinc-200">{item.message || "No message."}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
