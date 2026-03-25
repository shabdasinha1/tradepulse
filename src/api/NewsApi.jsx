import axios from "axios";

const NewsApi = axios.create({
  baseURL: "",   // ✅ VERY IMPORTANT (empty)
  timeout: 10000,
});

export default NewsApi;