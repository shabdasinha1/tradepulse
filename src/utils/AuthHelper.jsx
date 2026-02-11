import Cookies from "js-cookie";

const TOKEN_KEY = "tp_auth_token";

/* ===============================
   SET TOKEN
================================ */
export const SetToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 1,          // 1 day
    sameSite: "strict",
    secure: true,        // works on HTTPS (prod)
  });
};

/* ===============================
   GET TOKEN
================================ */
export const GetToken = () => {
  return Cookies.get(TOKEN_KEY);
};

/* ===============================
   REMOVE TOKEN
================================ */
export const RemoveToken = () => {
  Cookies.remove(TOKEN_KEY);
};

/* ===============================
   AUTH CHECK
================================ */
export const IsAuthenticated = () => {
  return !!GetToken();
};
