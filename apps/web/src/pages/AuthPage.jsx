import { motion } from "framer-motion";
import { Check, Clipboard, LockKeyhole, Mail, Sparkles, UserRound, Wand2 } from "lucide-react";
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
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-app-bg p-4 text-app-text md:p-8">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-[var(--color-accent-indigo)]/25 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[8%] right-[10%] h-80 w-80 rounded-full bg-[var(--color-accent-blue)]/20 blur-3xl"
      />
      <div className="auth-radial-field absolute inset-0" />
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 grid w-full max-w-6xl gap-6 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[var(--color-hero-start)] via-[var(--color-hero-mid)] to-[var(--color-hero-end)] p-4 shadow-[0_35px_90px_rgba(0,0,0,0.35)] md:grid-cols-[1.04fr_.96fr] md:p-5 lg:p-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="order-2 grid content-between gap-10 rounded-[24px] border border-white/10 bg-white/[0.05] p-6 text-white backdrop-blur md:order-1 md:p-10"
        >
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 backdrop-blur">
              <Sparkles size={17} className="text-[var(--color-accent-gold)]" /> Resume Signal
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.05] tracking-normal text-white md:text-5xl xl:text-6xl">
              Resume intelligence built for recruiter filters and{" "}
              <span className="bg-gradient-to-r from-[var(--color-accent-purple)] via-[var(--color-accent-blue)] to-[var(--color-accent-indigo)] bg-clip-text text-transparent">
                human decisions.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-blue-50/90">
              Upload your resume, paste the role you want, and get an instant ATS score with skill insights and actionable suggestions to stand out.
            </p>
            {!isSignup && (
              <motion.section
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="auth-glass mt-8 max-w-md p-5 text-blue-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-bold text-white">Try Demo</p>
                    <p className="mt-1 text-sm leading-6 text-blue-100/75">Use the seeded account to explore the analyzer.</p>
                  </div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200 shadow-lg shadow-emerald-900/10">
                    Ready to use
                  </span>
                </div>
                <div className="mt-5 grid gap-3 rounded-[18px] border border-white/10 bg-white/[0.06] p-4 text-sm">
                  <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <span className="font-semibold text-blue-100/70">Email</span>
                    <span className="font-bold text-white">{demoCredentials.email}</span>
                  </p>
                  <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <span className="font-semibold text-blue-100/70">Password</span>
                    <span className="font-bold text-white">{demoCredentials.password}</span>
                  </p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button type="button" className="button-quiet min-h-12 rounded-2xl border-white/10 bg-white/[0.07] hover:bg-white/[0.11]" onClick={copyDemoCredentials}>
                    {copied ? <Check size={16} /> : <Clipboard size={16} />}
                    {copied ? "Copied" : "Copy Credentials"}
                  </button>
                  <button type="button" className="button-primary group relative min-h-12 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--color-accent-indigo)] to-[var(--color-cta-end)] shadow-lg shadow-indigo-500/25 hover:scale-[1.01]" onClick={useDemoAccount}>
                    <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-full" />
                    <Wand2 size={16} />
                    Use Demo Account
                  </button>
                </div>
              </motion.section>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            {["ATS score", "Skill gaps", "Rewrite cues"].map((item) => (
              <span key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center font-bold text-blue-50 shadow-lg shadow-blue-950/10 transition duration-200 hover:-translate-y-1 hover:bg-white/[0.13]">{item}</span>
            ))}
          </div>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          onSubmit={submit}
          className="auth-card order-1 grid content-center gap-5 p-6 md:order-2 md:p-10 lg:p-12"
        >
          <div>
            <p className="eyebrow">{isSignup ? "Create account" : "Welcome back"}</p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal text-white">{isSignup ? "Start analyzing" : "Sign in"}</h2>
            <p className="mt-3 text-sm leading-6 text-blue-100/75">
              {isSignup ? "Create your workspace and start scoring resumes with AI." : "Continue to your AI resume analyzer workspace."}
            </p>
          </div>
          {isSignup && (
            <label className="grid gap-2 text-sm font-semibold text-blue-50">
              Name
              <span className="relative"><UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-100/60 transition-colors" size={18} /><input className="auth-input pl-12" placeholder="Maya Chen" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></span>
            </label>
          )}
          <label className="grid gap-2 text-sm font-semibold text-blue-50">
            Email
            <span className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-100/60 transition-colors" size={18} /><input className="auth-input pl-12" type="email" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></span>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-blue-50">
            Password
            <span className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-100/60 transition-colors" size={18} /><input className="auth-input pl-12" type="password" placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></span>
          </label>
          {error && <p className="rounded-2xl border border-rose-300/15 bg-rose-500/15 p-3 text-sm font-semibold text-rose-100">{error}</p>}
          <button className="button-primary group relative min-h-12 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--color-accent-indigo)] to-[var(--color-cta-end)] text-base shadow-lg shadow-indigo-500/25 hover:scale-[1.01]" disabled={status === "loading"}>
            <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-full" />
            {status === "loading" ? "Please wait" : isSignup ? "Create account" : "Sign in"}
          </button>
          <GoogleButton />
          <div className="flex flex-wrap justify-between gap-3 text-sm font-semibold text-blue-100/75">
            <Link className="transition hover:text-white" to={isSignup ? "/login" : "/signup"}>{isSignup ? "Already registered?" : "Need an account?"}</Link>
            <Link className="transition hover:text-white" to="/forgot-password">Forgot password</Link>
          </div>
        </motion.form>
      </motion.section>
    </main>
  );
}
