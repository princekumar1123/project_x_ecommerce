import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/user/wishlist");
            return res.data.wishlist;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Failed to fetch wishlist");
        }
    }
);

export const addToWishlistAsync = createAsyncThunk(
    "wishlist/add",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/wishlist", { productId });
            return res.data.wishlist;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Failed to add to wishlist");
        }
    }
);

export const removeFromWishlistAsync = createAsyncThunk(
    "wishlist/remove",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/user/wishlist/${productId}`);
            return res.data.wishlist;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Failed to remove from wishlist");
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [],      // array of populated product objects
        loading: false,
        error: null,
    },
    reducers: {
        clearWishlistState: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        const setLoading = (state) => { state.loading = true; state.error = null; };
        const setError   = (state, action) => { state.loading = false; state.error = action.payload; };
        const setItems   = (state, action) => { state.loading = false; state.items = action.payload; };

        builder
            .addCase(fetchWishlist.pending,  setLoading)
            .addCase(fetchWishlist.fulfilled, setItems)
            .addCase(fetchWishlist.rejected,  setError)

            .addCase(addToWishlistAsync.pending,   setLoading)
            .addCase(addToWishlistAsync.fulfilled,  setItems)
            .addCase(addToWishlistAsync.rejected,   setError)

            .addCase(removeFromWishlistAsync.pending,   setLoading)
            .addCase(removeFromWishlistAsync.fulfilled,  setItems)
            .addCase(removeFromWishlistAsync.rejected,   setError);
    },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
