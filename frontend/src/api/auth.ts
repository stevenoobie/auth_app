import axios from "axios";

const API_URL = "http://localhost:3000/auth";

let accessToken = localStorage.getItem("access_token") || null;
let refreshToken = localStorage.getItem("refresh_token") || null;

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/refresh`, {
          refresh_token: refreshToken,
        });

        accessToken = data.access_token;
        refreshToken = data.refresh_token;
        localStorage.setItem("access_token", accessToken ?? "");
        localStorage.setItem("refresh_token", refreshToken ?? "");

        originalRequest.headers.Authorization = `Bearer ${accessToken ?? ""}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const login = (username: string, password: string) =>
  api.post("/auth/signin", { username, password });

export const register = (name: string, email: string, password: string) =>
  api.post("/auth/register", { name, email, password });

export default api;
