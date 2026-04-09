import { GetCookie } from "./CookieManager.jsx";

export const getUserRole = () => {
  return GetCookie("tp_user_role");
};

export const isAdmin = () => {
  return getUserRole() === "ADMIN";
};