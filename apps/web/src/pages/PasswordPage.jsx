import { KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../services/api.js";

export function PasswordPage({ mode }) {
  const [params] = useSearchParams();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const reset = mode === "reset";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSending(true);
    try {
      const body = reset ? { token: params.get("token"), password: value } : { email: value };
      const { data } = await api.post(reset ? "/auth/reset-password" : "/auth/forgot-password", body);
      setMessage(data.message || "Password updated. Return to the analyzer.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Cannot reach the API. Start the backend and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form className="panel grid w-full max-w-md gap-4 p-6" onSubmit={submit}>
        <p className="eyebrow">Resume Signal</p>
        <h1 className="text-2xl font-bold">{reset ? "Set new password" : "Password recovery"}</h1>
        <label className="grid gap-1 text-sm">
          {reset ? "New password" : "Account email"}
          <span className="relative">
            {reset ? <KeyRound className="absolute left-3 top-2.5" size={16} /> : <Mail className="absolute left-3 top-2.5" size={16} />}
            <input className="field pl-9" type={reset ? "password" : "email"} value={value} onChange={(event) => setValue(event.target.value)} />
          </span>
        </label>
        {message && <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-200">{message}</p>}
        {error && <p className="rounded-lg bg-rose-500/15 p-3 text-sm text-rose-700 dark:text-rose-200">{error}</p>}
        <button className="button-primary" disabled={sending}>
          {sending ? "Sending" : reset ? "Update password" : "Send reset link"}
        </button>
        <Link className="text-sm" to="/login">Back to sign in</Link>
      </form>
    </main>
  );
}
