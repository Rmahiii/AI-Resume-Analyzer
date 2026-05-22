import { motion } from "framer-motion";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { GoogleButton } from "../components/GoogleButton.jsx";
import { login, signup } from "../features/auth/authSlice.js";

export function AuthPage({ mode }) {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const isSignup = mode === "signup";
  if (user) return <Navigate to="/" replace />;

  const submit = (event) => {
    event.preventDefault();
    dispatch(isSignup ? signup(form) : login({ email: form.email, password: form.password }));
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#eef2f6] p-4 dark:bg-[#0d131a]">
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel grid w-full max-w-5xl overflow-hidden md:grid-cols-[1.05fr_.95fr]"
      >
        <div className="grid content-between gap-12 bg-[#18212b] p-6 text-white md:p-10">
          <div>
            <p className="text-sm font-semibold text-blue-200">Resume Signal</p>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight">
              Resume intelligence built for recruiter filters and human decisions.
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {["ATS score", "Skill gaps", "Rewrite cues"].map((item) => (
              <span key={item} className="rounded-lg border border-white/15 bg-white/10 p-3">{item}</span>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="grid content-center gap-4 p-6 md:p-10">
          <div>
            <p className="eyebrow">{isSignup ? "Create account" : "Welcome back"}</p>
            <h2 className="mt-2 text-3xl font-bold">{isSignup ? "Start analyzing" : "Sign in"}</h2>
          </div>
          {isSignup && (
            <label className="grid gap-1 text-sm">
              Name
              <span className="relative"><UserRound className="absolute left-3 top-2.5" size={16} /><input className="field pl-9" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></span>
            </label>
          )}
          <label className="grid gap-1 text-sm">
            Email
            <span className="relative"><Mail className="absolute left-3 top-2.5" size={16} /><input className="field pl-9" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></span>
          </label>
          <label className="grid gap-1 text-sm">
            Password
            <span className="relative"><LockKeyhole className="absolute left-3 top-2.5" size={16} /><input className="field pl-9" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></span>
          </label>
          {error && <p className="rounded-lg bg-rose-500/15 p-3 text-sm text-rose-700 dark:text-rose-200">{error}</p>}
          <button className="button-primary" disabled={status === "loading"}>
            {isSignup ? "Create account" : "Sign in"}
          </button>
          <GoogleButton />
          <div className="flex flex-wrap justify-between gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Already registered?" : "Need an account?"}</Link>
            <Link to="/forgot-password">Forgot password</Link>
          </div>
        </form>
      </motion.section>
    </main>
  );
}
