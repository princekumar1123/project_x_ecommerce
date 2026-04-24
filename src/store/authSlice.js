import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    userId: null,
    userName: null,
    role: null,
    isAuthenticated: false,
    isAdmin: false,
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
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            localStorage.removeItem("role");
        },
        restoreAuth: (state) => {
            const token = localStorage.getItem("token");
            const id = localStorage.getItem("id");
            const name = localStorage.getItem("name");
            const role = localStorage.getItem("role") || "user";
            if (token && id && name) {
                state.token = JSON.parse(token);
                state.userId = JSON.parse(id);
                state.userName = JSON.parse(name);
                state.role = role;
                state.isAuthenticated = true;
                state.isAdmin = role === "admin";
            }
        },
    },
});

export const { loginSuccess, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
