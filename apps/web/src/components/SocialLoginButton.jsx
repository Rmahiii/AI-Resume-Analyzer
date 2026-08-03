import { LoaderCircle } from "lucide-react";

export function SocialLoginButton({ icon, enabled, loading = false, onClick, label, loadingLabel, disabledTooltip }) {
  const stateLabel = loading ? loadingLabel : label;
  const unavailable = !enabled && !loading;

  return (
    <button
      type="button"
      aria-label={stateLabel}
      aria-disabled={unavailable || loading}
      disabled={loading}
      title={enabled ? label : disabledTooltip}
      className="social-icon-button"
      onClick={onClick}
    >
      <span className="sr-only">{stateLabel}</span>
      {loading ? <LoaderCircle aria-hidden="true" size={20} className="animate-spin" /> : icon}
    </button>
  );
}
