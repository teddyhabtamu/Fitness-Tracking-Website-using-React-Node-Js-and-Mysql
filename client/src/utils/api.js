import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => {
  return api.post("/login", { email, password });
};

export const signup = (email, password) => {
  return api.post("/signup", {full_name, email, password });
};

export const getProtectedData = () => {
  return api.get("/protected-route");
};

export default api;
