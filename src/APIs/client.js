import axios from "axios";
import { beginRequest, endRequest } from "../store/slices/uiSlice";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let accessToken = localStorage.getItem("accessToken") || null;
let storeRef = null;

/** Call once from main.jsx to avoid circular imports with the Redux store. */
export function injectStore(store) {
  storeRef = store;
}

function trackRequestStart(config) {
  if (config?.skipGlobalLoader || !storeRef) return;
  storeRef.dispatch(beginRequest());
  config.__globalLoaderTracked = true;
}

function trackRequestEnd(config) {
  if (!config?.__globalLoaderTracked || !storeRef) return;
  storeRef.dispatch(endRequest());
  config.__globalLoaderTracked = false;
}

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
}

export function getAccessToken() {
  return accessToken;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  trackRequestStart(config);
  return config;
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => {
    trackRequestEnd(response.config);
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};
    trackRequestEnd(originalRequest);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post("/auth/refresh", null, {
          skipGlobalLoader: true,
        });
        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
