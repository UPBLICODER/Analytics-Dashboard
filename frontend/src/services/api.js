import axios from "axios";

const api = axios.create({
  baseURL: "https://analytics-dashboard-c0x7.onrender.com/api",
});

// attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
