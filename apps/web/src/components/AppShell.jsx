import { BarChart3, ChevronDown, FileSearch, History, LogOut, Shield, UserRound, WandSparkles } from "lucide-react";
import { useEffect } from "react";
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

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("resume-signal-theme", "dark");
  }, []);

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-app-nav/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[88px] max-w-[1560px] items-center justify-between gap-4 px-5 md:px-8">
          <NavLink to="/" className="flex items-center gap-3 text-app-text">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-app-primary to-app-secondary text-app-text shadow-lg shadow-app-secondary/20">
              <WandSparkles size={21} />
            </span>
            <span className="text-xl font-black tracking-normal">
              <span className="bg-gradient-to-r from-app-primary to-app-secondary bg-clip-text text-transparent">Resume</span> Signal
            </span>
          </NavLink>
          <nav className="hidden items-center gap-2 lg:flex">
            {links.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                title={label}
                className={({ isActive }) =>
                  `button rounded-full px-4 text-app-text hover:-translate-y-0.5 hover:bg-white/10 ${isActive ? "bg-white/10 text-[#dbeafe]" : ""}`
                }
              >
                <Icon size={17} /> {label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink className="button rounded-full px-4 text-app-text hover:-translate-y-0.5 hover:bg-white/10" to="/admin">
                <Shield size={17} /> Admin
              </NavLink>
            )}
            <span className="button rounded-full px-4 text-app-text">Resources <ChevronDown size={16} /></span>
          </nav>
          <div className="flex items-center gap-2">
            <button className="button hidden rounded-full border-0 text-app-text hover:-translate-y-0.5 hover:bg-white/10 md:inline-flex" onClick={() => dispatch(logout())}>
              <UserRound size={18} /> Sign out
            </button>
            <NavLink to="/" className="button rounded-full bg-app-primary px-5 text-app-text hover:-translate-y-0.5 hover:bg-[#5457dc]">
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
