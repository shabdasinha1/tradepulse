import axios from "axios";

const NEWS_BASE_URL = import.meta.env.VITE_PROXY_API_BASE_URL;

const NewsApi = axios.create({
  baseURL: NEWS_BASE_URL, 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default NewsApi;