import axios from "axios";
import environment from "../environments/environment";

const axiosInstance = axios.create({
    baseURL: environment.baseURL,
    withCredentials: true,          // send the httpOnly refresh-token cookie automatically
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

// ── Request: attach access token ──────────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const raw = localStorage.getItem("token");
        if (raw) {
            try {
                config.headers["Authorization"] = `Bearer ${JSON.parse(raw)}`;
            } catch {
                config.headers["Authorization"] = `Bearer ${raw}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response: silent token refresh on 401 ────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];   // requests that arrived while a refresh was in progress

const processQueue = (error, token = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        // Only attempt refresh for 401s on authenticated requests.
        // Skip: login, register, refresh itself (avoid infinite loop).
        const isAuthRoute = original.url?.includes("/login") ||
                            original.url?.includes("/register") ||
                            original.url?.includes("/refresh");

        if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
            if (isRefreshing) {
                // Queue this request until the refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    original.headers["Authorization"] = `Bearer ${token}`;
                    return axiosInstance(original);
                }).catch((err) => Promise.reject(err));
            }

            original._retry = true;
            isRefreshing = true;

            try {
                // Cookie is sent automatically (withCredentials: true)
                const res = await axiosInstance.post("/user/refresh");
                const { token, id, name, role } = res.data;

                // Persist the new access token
                localStorage.setItem("token", JSON.stringify(token));
                localStorage.setItem("id", JSON.stringify(id));
                localStorage.setItem("name", JSON.stringify(name));
                localStorage.setItem("role", role || "user");

                axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
                original.headers["Authorization"] = `Bearer ${token}`;

                processQueue(null, token);
                return axiosInstance(original);
            } catch (refreshError) {
                // Both tokens expired — fire a custom event so the app can show
                // the "Session Expired" popup without a hard redirect
                processQueue(refreshError, null);
                localStorage.removeItem("token");
                localStorage.removeItem("id");
                localStorage.removeItem("name");
                localStorage.removeItem("role");
                window.dispatchEvent(new CustomEvent("session-expired"));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
