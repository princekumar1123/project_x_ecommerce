import axios from "axios";
import environment from "../environments/environment";

const axiosInstance = axios.create({
    baseURL: environment.baseURL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

// Attach JWT token to every request automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const raw = localStorage.getItem("token");
        if (raw) {
            try {
                const token = JSON.parse(raw);
                config.headers["Authorization"] = `Bearer ${token}`;
            } catch {
                config.headers["Authorization"] = `Bearer ${raw}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global response error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear storage and redirect to home
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
