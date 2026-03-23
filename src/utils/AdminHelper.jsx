import { GetCookie } from "./CookieManager.jsx";

const USER_EMAIL_KEY = "tp_user_email";

export const isAdminUser = () => {
  const userEmail = GetCookie(USER_EMAIL_KEY);
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS;

  if (!userEmail || !adminEmails) return false;

  // Convert env string → array
  const adminEmailList = adminEmails
    .split(",")
    .map(email => email.trim().toLowerCase());

  return adminEmailList.includes(userEmail.toLowerCase());
};