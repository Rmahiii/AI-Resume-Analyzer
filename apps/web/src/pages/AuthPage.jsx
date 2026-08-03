import { motion } from "framer-motion";
import { Github, Linkedin, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { SocialLoginButton } from "../components/SocialLoginButton.jsx";
import { login, signup } from "../features/auth/authSlice.js";
import { oauthProviderConfig } from "../utils/oauthConfig.ts";

function GoogleLogo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.52Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.51H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.49l3.35-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 2.99 14.69 2 12 2a10 10 0 0 0-8.94 5.51l3.35 2.59C7.2 7.74 9.4 5.98 12 5.98Z"
      />
    </svg>
  );
}

const socialProviders = [
  { id: "google", icon: <GoogleLogo /> },
  { id: "linkedin", icon: <Linkedin aria-hidden="true" size={20} className="text-[#0a66c2]" /> },
  { id: "github", icon: <Github aria-hidden="true" size={20} /> }
];

export function AuthPage({ mode }) {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [toast, setToast] = useState("");
  const [socialLoading, setSocialLoading] = useState("");
  const isSignup = mode === "signup";

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  if (user) return <Navigate to="/" replace />;

  const submit = (event) => {
    event.preventDefault();
    dispatch(isSignup ? signup(form) : login({ email: form.email, password: form.password }));
  };

  const handleSocialLogin = (provider) => {
    const config = oauthProviderConfig[provider];

    if (!config.enabled) {
      setToast(config.unavailableMessage);
      return;
    }

    if (config.authUrl) {
      setSocialLoading(provider);
      window.location.assign(config.authUrl);
    }
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
          <div className="grid gap-3">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase text-zinc-400">
              <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
              Or continue with
              <span className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
            </div>
            <div className="flex items-center justify-center gap-3">
              {socialProviders.map(({ id, icon }) => {
                const config = oauthProviderConfig[id];
                return (
                  <SocialLoginButton
                    key={id}
                    icon={icon}
                    enabled={config.enabled}
                    loading={socialLoading === id}
                    label={config.label}
                    loadingLabel={config.loadingLabel}
                    disabledTooltip={config.disabledTooltip}
                    onClick={() => handleSocialLogin(id)}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Already registered?" : "Need an account?"}</Link>
            <Link to="/forgot-password">Forgot password</Link>
          </div>
        </form>
      </motion.section>
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#17202a] shadow-2xl dark:border-white/10 dark:bg-[#18212b] dark:text-white"
        >
          {toast}
        </div>
      )}
    </main>
  );
}
