import { lazy } from "react";

/* ===============================
   LAZY IMPORTS (AUTH)
================================ */

const Login = lazy(() => import("../pages/auth/Login.jsx"));
const Register = lazy(() => import("../pages/auth/Register.jsx"));
const VerifyEmailOtp = lazy(() => import("../pages/auth/VerifyEmailOtp.jsx"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword.jsx"));

export const AUTH_ROUTES = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/verify-email",
    component: VerifyEmailOtp,
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    component: ResetPassword,
  },
];
