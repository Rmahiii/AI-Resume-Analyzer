import { BarChart3, FileSearch, History, LogOut, MoonStar, Shield, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";

const links = [
  { to: "/", icon: FileSearch, label: "Analyzer" },
  { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { to: "/history", icon: History, label: "History" }
];

export function AppShell({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [dark, setDark] = useState(() => localStorage.getItem("resume-signal-theme") !== "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("resume-signal-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-[#eef2f6] dark:bg-[#0d131a]">
      <div className="mx-auto grid min-h-screen max-w-[1480px] gap-4 p-3 lg:grid-cols-[240px_1fr] lg:p-5">
        <aside className="panel flex flex-col gap-5 p-4">
          <div>
            <p className="eyebrow">Resume Signal</p>
            <h1 className="mt-2 text-2xl font-bold">ATS command center</h1>
          </div>
          <nav className="grid gap-1">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                title={label}
                className={({ isActive }) =>
                  `button justify-start ${isActive ? "bg-blue-700 text-white dark:bg-blue-300 dark:text-slate-950" : "hover:bg-white/80 dark:hover:bg-white/10"}`
                }
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink className="button justify-start hover:bg-white/80 dark:hover:bg-white/10" to="/admin">
                <Shield size={17} /> Admin
              </NavLink>
            )}
          </nav>
          <div className="mt-auto grid gap-2 rounded-lg border border-zinc-200/80 p-3 dark:border-white/10">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-300">{user?.email}</p>
            <div className="flex gap-2">
              <button className="button-quiet w-10 px-0" title="Toggle dark mode" onClick={() => setDark(!dark)}>
                {dark ? <Sun size={17} /> : <MoonStar size={17} />}
              </button>
              <button className="button-quiet flex-1" onClick={() => dispatch(logout())}>
                <LogOut size={17} /> Sign out
              </button>
            </div>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
