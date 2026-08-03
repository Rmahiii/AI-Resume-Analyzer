export type OAuthProvider = "google" | "github" | "linkedin";

type OAuthEnvironment = {
  VITE_API_URL?: string;
  VITE_GITHUB_CLIENT_ID?: string;
  VITE_GITHUB_OAUTH_URL?: string;
  VITE_LINKEDIN_CLIENT_ID?: string;
  VITE_LINKEDIN_OAUTH_URL?: string;
};

type OAuthProviderConfig = {
  authUrl?: string;
  disabledTooltip: string;
  enabled: boolean;
  label: string;
  loadingLabel: string;
  unavailableMessage: string;
};

const env = import.meta.env as OAuthEnvironment;

const hasValue = (value?: string) => Boolean(value?.trim());
const apiUrl = (env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

export const oauthProviders = {
  google: hasValue(apiUrl),
  github: hasValue(env.VITE_GITHUB_CLIENT_ID) && hasValue(env.VITE_GITHUB_OAUTH_URL),
  linkedin: hasValue(env.VITE_LINKEDIN_CLIENT_ID) && hasValue(env.VITE_LINKEDIN_OAUTH_URL)
} satisfies Record<OAuthProvider, boolean>;

export const oauthProviderConfig = {
  google: {
    authUrl: `${apiUrl}/auth/google`,
    disabledTooltip: "Currently unavailable",
    enabled: oauthProviders.google,
    label: "Sign in with Google",
    loadingLabel: "Signing in with Google",
    unavailableMessage: "Google sign in is temporarily unavailable."
  },
  github: {
    authUrl: env.VITE_GITHUB_OAUTH_URL,
    disabledTooltip: "Coming Soon",
    enabled: oauthProviders.github,
    label: "Sign in with GitHub",
    loadingLabel: "Signing in with GitHub",
    unavailableMessage: "GitHub sign in is coming soon."
  },
  linkedin: {
    authUrl: env.VITE_LINKEDIN_OAUTH_URL,
    disabledTooltip: "Coming Soon",
    enabled: oauthProviders.linkedin,
    label: "Sign in with LinkedIn",
    loadingLabel: "Signing in with LinkedIn",
    unavailableMessage: "LinkedIn sign in is coming soon."
  }
} satisfies Record<OAuthProvider, OAuthProviderConfig>;
