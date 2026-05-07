import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
    token: null,
    userId: null,
    userName: null,
    role: null,
    isAuthenticated: false,
    isAdmin: false,
    sessionExpired: false,   // true → show "Session Expired" popup
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.userId = action.payload.id;
            state.userName = action.payload.name;
            state.role = action.payload.role || "user";
            state.isAuthenticated = true;
            state.isAdmin = action.payload.role === "admin";
            localStorage.setItem("token", JSON.stringify(action.payload.token));
            localStorage.setItem("id", JSON.stringify(action.payload.id));
            localStorage.setItem("name", JSON.stringify(action.payload.name));
            localStorage.setItem("role", action.payload.role || "user");
        },
        logout: (state) => {
            state.token = null;
            state.userId = null;
            state.userName = null;
            state.role = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.sessionExpired = false;
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            localStorage.removeItem("role");
        },
        sessionExpiredAction: (state) => {
            // Clear auth state but keep sessionExpired flag so the popup shows
            state.token = null;
            state.userId = null;
            state.userName = null;
            state.role = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.sessionExpired = true;
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            localStorage.removeItem("role");
        },
        clearSessionExpired: (state) => {
            state.sessionExpired = false;
        },
        restoreAuth: (state) => {
            const raw   = localStorage.getItem("token");
            const id    = localStorage.getItem("id");
            const name  = localStorage.getItem("name");
            const role  = localStorage.getItem("role") || "user";

            if (!raw || !id || !name) return;

            try {
                const token = JSON.parse(raw);

                // Check expiry before restoring — don't put an expired token in state.
                // The axios interceptor will silently refresh it on the first API call,
                // but we shouldn't mark the user as authenticated with a dead token.
                const { exp } = jwtDecode(token);
                if (exp * 1000 < Date.now()) {
                    // Token expired — clear storage; refresh will happen on next API call
                    localStorage.removeItem("token");
                    return;
                }

                state.token = token;
                state.userId = JSON.parse(id);
                state.userName = JSON.parse(name);
                state.role = role;
                state.isAuthenticated = true;
                state.isAdmin = role === "admin";
            } catch {
                // Malformed token — clear everything
                localStorage.removeItem("token");
                localStorage.removeItem("id");
                localStorage.removeItem("name");
                localStorage.removeItem("role");
            }
        },
    },
});

export const { loginSuccess, logout, restoreAuth, sessionExpiredAction, clearSessionExpired } = authSlice.actions;
export default authSlice.reducer;
