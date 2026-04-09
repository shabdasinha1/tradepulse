import Cookies from "js-cookie";

/* ========= SET ========= */
export const SetCookie = (key, value, options = {}) => {
  Cookies.set(key, value, {
    expires: 1,        // 1 day default
    sameSite: "strict",
    secure: window.location.protocol === "https:",
    ...options,
  });
};

/* ========= GET ========= */
export const GetCookie = (key) => {
  return Cookies.get(key);
};

/* ========= REMOVE ========= */
export const RemoveCookie = (key) => {
  Cookies.remove(key);
};
