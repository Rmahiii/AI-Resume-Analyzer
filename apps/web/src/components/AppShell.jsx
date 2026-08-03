import { BarChart3, ChevronDown, FileSearch, History, LogOut, MoonStar, Shield, Sun, UserRound, WandSparkles } from "lucide-react";
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
  const [dark, setDark] = useState(() => localStorage.getItem("resume-signal-theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("resume-signal-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-[#06152f] text-slate-50">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/90 shadow-[0_18px_50px_rgba(5,16,45,0.12)] backdrop-blur-xl dark:bg-[#06152f]/90">
        <div className="mx-auto flex min-h-[88px] max-w-[1560px] items-center justify-between gap-4 px-5 md:px-8">
          <NavLink to="/" className="flex items-center gap-3 text-[#07142d] dark:text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#5e6bff] to-[#42c8ff] text-white shadow-lg shadow-blue-500/25">
              <WandSparkles size={21} />
            </span>
            <span className="text-xl font-black tracking-normal">
              <span className="bg-gradient-to-r from-[#5e6bff] to-[#42c8ff] bg-clip-text text-transparent">Resume</span> Signal
            </span>
          </NavLink>
          <nav className="hidden items-center gap-2 lg:flex">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                title={label}
                className={({ isActive }) =>
                  `button rounded-full px-4 text-[#07142d] hover:bg-blue-50 dark:text-slate-100 dark:hover:bg-white/10 ${isActive ? "bg-blue-50 text-[#4f5fff] dark:bg-white/10" : ""}`
                }
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink className="button rounded-full px-4 text-[#07142d] hover:bg-blue-50 dark:text-slate-100 dark:hover:bg-white/10" to="/admin">
                <Shield size={17} /> Admin
              </NavLink>
            )}
            <span className="button rounded-full px-4 text-[#07142d] dark:text-slate-100">Resources <ChevronDown size={16} /></span>
          </nav>
          <div className="flex items-center gap-2">
            <button className="button-quiet hidden w-10 rounded-full px-0 sm:inline-flex" title="Toggle dark mode" onClick={() => setDark(!dark)}>
              {dark ? <Sun size={17} /> : <MoonStar size={17} />}
            </button>
            <button className="button hidden rounded-full border-0 text-[#07142d] hover:bg-blue-50 md:inline-flex dark:text-white dark:hover:bg-white/10" onClick={() => dispatch(logout())}>
              <UserRound size={18} /> Sign out
            </button>
            <NavLink to="/" className="button rounded-full bg-gradient-to-r from-[#5965f8] to-[#6d79ff] px-5 text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02] hover:shadow-indigo-500/40">
              Get Started Free
            </NavLink>
            <button className="button-quiet w-10 rounded-full px-0 md:hidden" title="Sign out" onClick={() => dispatch(logout())}>
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
