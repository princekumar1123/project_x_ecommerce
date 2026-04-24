import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "./store/authSlice";

import DashBoard from "./pages/DashBoad";
import DashboardMainContent from "./components/DashboardMainContent";
import CategoriesList from "./pages/CategoriesList";
import CardDetails from "./pages/CardDetails";
import AddProduct from "./pages/AddProduct";
import AddToCart from "./pages/AddTocart";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import OrderConfirmation from "./pages/OrderConfirmation";
import UserProfile from "./pages/UserProfile";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(restoreAuth());
    }, [dispatch]);

    return (
        <Routes>
            {/* ── Store routes ── */}
            <Route path="/" element={<DashBoard />}>
                <Route index element={<DashboardMainContent />} />
                <Route path="category" element={<CategoriesList />} />
                <Route path="detail" element={<CardDetails />} />
                <Route path="newproduct" element={<AdminRoute><AddProduct /></AdminRoute>} />
                <Route path="cart" element={<ProtectedRoute><AddToCart /></ProtectedRoute>} />
                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                <Route path="orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="*" element={<PageNotFound />} />
            </Route>

            {/* ── Admin routes ── */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
                <Route path="products" element={<AdminProducts />} />
            </Route>
        </Routes>
    );
}

export default App;
