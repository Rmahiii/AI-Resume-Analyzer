import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export function apiNetworkErrorMessage() {
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    return "Cannot reach the API. Set VITE_API_URL in Vercel to your deployed backend URL ending in /api/v1, then redeploy.";
  }

  return `Cannot reach the API at ${API_BASE_URL}. Start the backend or check the deployed backend URL.`;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("resume-signal-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
