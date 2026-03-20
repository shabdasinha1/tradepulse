import { GetCookie } from "./CookieManager.jsx";

const USER_EMAIL_KEY = "tp_user_email";

export const isAdminUser = () => {
  const userEmail = GetCookie(USER_EMAIL_KEY);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (!userEmail || !adminEmail) return false;

  return userEmail.toLowerCase() === adminEmail.toLowerCase();
};