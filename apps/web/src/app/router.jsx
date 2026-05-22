import { useEffect } from "react";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppShell } from "../components/AppShell.jsx";
import { AuthPage } from "../pages/AuthPage.jsx";
import { AnalyzerPage } from "../pages/AnalyzerPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { HistoryPage } from "../pages/HistoryPage.jsx";
import { AdminPage } from "../pages/AdminPage.jsx";
import { PasswordPage } from "../pages/PasswordPage.jsx";
import { loadMe } from "../features/auth/authSlice.js";

function ProtectedLayout() {
  const dispatch = useDispatch();
  const { user, checked } = useSelector((state) => state.auth);
  useEffect(() => { if (!checked) dispatch(loadMe()); }, [checked, dispatch]);
  if (!checked) return <div className="grid min-h-screen place-items-center">Loading session...</div>;
  return user ? <AppShell><Outlet /></AppShell> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/signup", element: <AuthPage mode="signup" /> },
  { path: "/forgot-password", element: <PasswordPage mode="forgot" /> },
  { path: "/reset-password", element: <PasswordPage mode="reset" /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: "/", element: <AnalyzerPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/admin", element: <AdminPage /> }
    ]
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);
