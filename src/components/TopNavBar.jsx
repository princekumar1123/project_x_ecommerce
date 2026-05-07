import { useState, useEffect, useRef } from "react";
import { LogoutOutlined, PlusCircleOutlined, MenuOutlined, LoginOutlined, UserOutlined, ShoppingCartOutlined, HistoryOutlined, SearchOutlined, DashboardOutlined, HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Modal, Badge } from "antd";
import "../Styles/TopNavBar.css";
import Credential from "../pages/credential";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { fetchCart } from "../store/cartSlice";
import { fetchWishlist } from "../store/wishlistSlice";
import SearchSuggestions from "./SearchSuggestions";
import { toastSuccess } from "../utils/swal";
import axiosInstance from "../api/axiosInstance";

const TopNavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, userName, isAdmin } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchWrapRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [isAuthenticated, dispatch]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Open login modal when session-expired popup triggers it
    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener("open-login-modal", handler);
        return () => window.removeEventListener("open-login-modal", handler);
    }, []);

    const handleClose = () => setOpen(false);

    const handleLogout = async () => {
        try {
            // Tell the server to clear the httpOnly refresh-token cookie
            await axiosInstance.post("/user/logout");
        } catch {
            // Ignore — we still clear client state regardless
        }
        dispatch(logout());
        navigate("/");
        toastSuccess("Logged out successfully");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setShowSuggestions(false);
        }
    };

    const handleSearchKeyDown = (e) => {
        // Forward keyboard events to the suggestions dropdown
        const dropdown = searchWrapRef.current?.querySelector("[data-suggestions]");
        if (dropdown?._handleKeyDown) {
            dropdown._handleKeyDown(e);
        }
    };

    const cartCount = cartItems?.length || 0;
    const wishlistCount = wishlistItems?.length || 0;

    return (
        <div className="top-nav-bar">
            <Modal footer={null} open={open} onCancel={() => setOpen(false)}>
                <Credential handleClose={handleClose} />
            </Modal>

            <div className="nav-container">
                {/* Logo */}
                <div className="nav-left" onClick={() => navigate("/")}>
                    <img src="e-logo.png" alt="Logo" className="icon" />
                    <span className="title-text">Prince Shopify</span>
                </div>

                {/* Search bar with suggestions */}
                <div ref={searchWrapRef} style={{ position: "relative", flex: 1, maxWidth: 420, margin: "0 0.5rem" }}>
                    <form className="nav-search" style={{ maxWidth: "100%", margin: 0 }} onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="nav-search-input"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(e.target.value.trim().length > 0);
                            }}
                            onFocus={() => {
                                if (searchQuery.trim()) setShowSuggestions(true);
                            }}
                            onKeyDown={handleSearchKeyDown}
                            autoComplete="off"
                        />
                        <button type="submit" className="nav-search-btn">
                            <SearchOutlined />
                        </button>
                    </form>
                    <div data-suggestions>
                        <SearchSuggestions
                            query={searchQuery}
                            visible={showSuggestions}
                            onSelect={() => setSearchQuery("")}
                            onClose={() => setShowSuggestions(false)}
                        />
                    </div>
                </div>

                {/* Desktop nav */}
                <div className="nav-right desktop-only">
                    {isAuthenticated && (
                        <span className="user-name">
                            Welcome, {userName?.toUpperCase()}
                        </span>
                    )}

                    {isAuthenticated ? (
                        <>
                            <div className="nav-icon" onClick={() => navigate("/wishlist")} title="My Wishlist" style={{ cursor: "pointer" }}>
                                <Badge count={wishlistCount} size="small" offset={[2, 0]}>
                                    <HeartOutlined style={{ fontSize: "22px", color: "#fff" }} />
                                </Badge>
                            </div>
                            <div className="nav-icon" onClick={() => navigate("/cart")} title="My Cart" style={{ cursor: "pointer" }}>
                                <Badge count={cartCount} size="small" offset={[2, 0]}>
                                    <ShoppingCartOutlined style={{ fontSize: "26px", color: "#fff" }} />
                                </Badge>
                            </div>
                            <HistoryOutlined
                                className="nav-icon"
                                onClick={() => navigate("/orders")}
                                title="Order History"
                            />
                            <UserOutlined
                                className="nav-icon"
                                onClick={() => navigate("/profile")}
                                title="My Profile"
                            />
                            {isAdmin && (
                                <>
                                    <DashboardOutlined
                                        className="nav-icon"
                                        onClick={() => navigate("/admin")}
                                        title="Admin Panel"
                                    />
                                    <PlusCircleOutlined
                                        className="nav-icon add-icon"
                                        onClick={() => { navigate("/newproduct"); window.scrollTo(0, 0); }}
                                        title="Add Product"
                                    />
                                </>
                            )}
                            <LogoutOutlined
                                className="nav-icon logout-icon"
                                onClick={handleLogout}
                                title="Logout"
                            />
                        </>
                    ) : (
                        <LoginOutlined
                            className="nav-icon login-icon"
                            onClick={() => setOpen(true)}
                            title="Login"
                        />
                    )}
                </div>

                {/* Mobile hamburger */}
                <MenuOutlined
                    className="nav-icon mobile-only hamburger-icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <>
                                    <div className="menu-item" onClick={() => { navigate("/admin"); setIsMobileMenuOpen(false); }}>
                                        <DashboardOutlined className="menu-icon" />
                                        <span>Admin Panel</span>
                                    </div>
                                    <div className="menu-item" onClick={() => { navigate("/newproduct"); setIsMobileMenuOpen(false); }}>
                                        <PlusCircleOutlined className="menu-icon" />
                                        <span>Add Product</span>
                                    </div>
                                </>
                            )}
                            <div className="menu-item" onClick={() => { navigate("/wishlist"); setIsMobileMenuOpen(false); }}>
                                <HeartOutlined className="menu-icon" />
                                <span>My Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
                            </div>
                            <div className="menu-item" onClick={() => { navigate("/cart"); setIsMobileMenuOpen(false); }}>
                                <ShoppingCartOutlined className="menu-icon" />
                                <span>My Cart {cartCount > 0 && `(${cartCount})`}</span>
                            </div>
                            <div className="menu-item" onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}>
                                <UserOutlined className="menu-icon" />
                                <span>My Profile</span>
                            </div>
                            <div className="menu-item" onClick={() => { navigate("/orders"); setIsMobileMenuOpen(false); }}>
                                <HistoryOutlined className="menu-icon" />
                                <span>My Orders</span>
                            </div>
                            <div className="menu-item" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                                <LogoutOutlined className="menu-icon" />
                                <span>Logout</span>
                            </div>
                        </>
                    ) : (
                        <div className="menu-item" onClick={() => { setOpen(true); setIsMobileMenuOpen(false); }}>
                            <LoginOutlined className="menu-icon" />
                            <span>Login</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default TopNavBar;
