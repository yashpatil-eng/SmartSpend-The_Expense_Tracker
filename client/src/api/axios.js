import axios from "axios";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Ensure /api suffix
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartspend_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[AXIOS] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[AXIOS ERROR] ${error.response.status}: ${error.response.data?.message || error.message}`);
    } else {
      console.error(`[AXIOS ERROR] ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default api;
