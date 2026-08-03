import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { googleLogin } from "../features/auth/authSlice.js";

export function GoogleButton() {
  const dispatch = useDispatch();
  const holder = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !holder.current) return undefined;
    const render = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => dispatch(googleLogin(credential))
      });
      window.google?.accounts.id.renderButton(holder.current, { theme: "outline", size: "large", width: 320 });
    };
    if (window.google) render();
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = render;
      document.head.appendChild(script);
    }
  }, [clientId, dispatch]);

  return clientId ? <div ref={holder} className="min-h-10 overflow-hidden rounded-lg" /> : null;
}
