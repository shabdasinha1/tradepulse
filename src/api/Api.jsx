import axios from "axios";
import { GetToken } from "../utils/AuthHelper";

/* ===============================
   ENV CONFIG
================================ */
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === "true";
// const token = GetToken()

/* ===============================
   AXIOS INSTANCE
================================ */
const Api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`
  },
});

/* ===============================
   REQUEST INTERCEPTOR
================================ */
Api.interceptors.request.use(
  (config) => {
    const token = GetToken();

    // Attach token if exists
    // const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug log (optional)
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ===============================
   RESPONSE INTERCEPTOR
================================ */
Api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  },
);
/* ===============================
   EXPORTS
================================ */
export { Api, ENABLE_MOCK };
export default Api;
