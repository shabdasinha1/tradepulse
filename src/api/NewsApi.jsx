import axios from "axios";

const NewsApi = axios.create({
  baseURL: import.meta.env.VITE_PROXY_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default NewsApi;