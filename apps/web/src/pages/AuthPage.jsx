import { motion } from "framer-motion";
import { Check, Clipboard, LockKeyhole, Mail, UserRound, Wand2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { GoogleButton } from "../components/GoogleButton.jsx";
import { login, signup } from "../features/auth/authSlice.js";

const demoCredentials = {
  email: "demo@resumesignal.com",
  password: "Demo@123"
};

export function AuthPage({ mode }) {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [copied, setCopied] = useState(false);
  const isSignup = mode === "signup";
  if (user) return <Navigate to="/" replace />;

  const submit = (event) => {
    event.preventDefault();
    dispatch(isSignup ? signup(form) : login({ email: form.email, password: form.password }));
  };

  const copyDemoCredentials = async () => {
    const value = `Email: ${demoCredentials.email}\nPassword: ${demoCredentials.password}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const useDemoAccount = () => {
    setForm((current) => ({
      ...current,
      email: demoCredentials.email,
      password: demoCredentials.password
    }));
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#0d131a] p-4 text-slate-50">
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
            {!isSignup && (
              <section className="mt-6 max-w-md rounded-2xl border border-[#6973ff]/25 bg-[#101821]/95 p-4 text-slate-100 shadow-lg shadow-[#06152f]/10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-blue-200">Try Demo</p>
                    <p className="mt-1 text-xs text-slate-400">Use the seeded account to explore the analyzer.</p>
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Ready to use
                  </span>
                </div>
                <div className="mt-4 grid gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-slate-400">Email</span>
                    <span className="font-semibold text-white">{demoCredentials.email}</span>
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-slate-400">Password</span>
                    <span className="font-semibold text-white">{demoCredentials.password}</span>
                  </p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button type="button" className="button-quiet" onClick={copyDemoCredentials}>
                    {copied ? <Check size={16} /> : <Clipboard size={16} />}
                    {copied ? "Copied" : "Copy Credentials"}
                  </button>
                  <button type="button" className="button-primary" onClick={useDemoAccount}>
                    <Wand2 size={16} />
                    Use Demo Account
                  </button>
                </div>
              </section>
            )}
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
