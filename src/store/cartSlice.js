import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/user/cart");
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error?.message || "Failed to fetch cart");
    }
});

export const addToCartAsync = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/cart", { productId, quantity });
            return res.data.cart;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Failed to add to cart");
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/user/cart/${productId}`);
            return res.data.cart;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Failed to remove item");
        }
    }
);

export const updateCartItemAsync = createAsyncThunk(
    "cart/updateCartItem",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/user/cart/${productId}`, { quantity });
            return res.data.cart;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Failed to update cart");
        }
    }
);

export const placeOrderAsync = createAsyncThunk(
    "cart/placeOrder",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/orders");
            return res.data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Failed to place order");
        }
    }
);

export const createPaymentOrderAsync = createAsyncThunk(
    "cart/createPaymentOrder",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/payment/create-order");
            return res.data; // { orderId, amount, currency }
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Failed to create payment order");
        }
    }
);

export const verifyPaymentAsync = createAsyncThunk(
    "cart/verifyPayment",
    async (paymentData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/payment/verify-payment", paymentData);
            return res.data.order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error?.message || "Payment verification failed");
        }
    }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        loading: false,
        error: null,
        lastOrder: null,
    },
    reducers: {
        clearCartState: (state) => {
            state.items = [];
            state.lastOrder = null;
        },
    },
    extraReducers: (builder) => {
        const setLoading = (state) => { state.loading = true; state.error = null; };
        const setError = (state, action) => { state.loading = false; state.error = action.payload; };

        builder
            .addCase(fetchCart.pending, setLoading)
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, setError)

            .addCase(addToCartAsync.pending, setLoading)
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(addToCartAsync.rejected, setError)

            .addCase(removeFromCartAsync.pending, setLoading)
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(removeFromCartAsync.rejected, setError)

            .addCase(updateCartItemAsync.pending, setLoading)
            .addCase(updateCartItemAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(updateCartItemAsync.rejected, setError)

            .addCase(placeOrderAsync.pending, setLoading)
            .addCase(placeOrderAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.items = [];
                state.lastOrder = action.payload;
            })
            .addCase(placeOrderAsync.rejected, setError)

            .addCase(createPaymentOrderAsync.pending, setLoading)
            .addCase(createPaymentOrderAsync.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createPaymentOrderAsync.rejected, setError)

            .addCase(verifyPaymentAsync.pending, setLoading)
            .addCase(verifyPaymentAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.items = [];
                state.lastOrder = action.payload;
            })
            .addCase(verifyPaymentAsync.rejected, setError);
    },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
