import { useState, useEffect } from "react";
import { LogoutOutlined, PlusCircleOutlined, MenuOutlined, LoginOutlined, UserOutlined, ShoppingCartOutlined, HistoryOutlined, SearchOutlined, DashboardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Modal, notification, Badge } from "antd";
import "../Styles/TopNavBar.css";
import Credential from "../pages/credential";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { fetchCart } from "../store/cartSlice";

const TopNavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, userName, isAdmin } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [isAuthenticated, dispatch]);

    const handleClose = () => setOpen(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
        api.open({
            type: "success",
            message: "Logged out",
            description: "You have been logged out successfully.",
            duration: 2,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    const cartCount = cartItems?.length || 0;

    return (
        <div className="top-nav-bar">
            <Modal footer={null} open={open} onCancel={() => setOpen(false)}>
                <Credential handleClose={handleClose} />
            </Modal>

            <div className="nav-container">
                {/* Logo */}
                <div className="nav-left" onClick={() => navigate("/")}>
                    <img src="e-logo.png" alt="Logo" className="icon" />
                    <span className="title-text">ECom Shopify</span>
                </div>

                {/* Search bar */}
                <form className="nav-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="nav-search-input"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="nav-search-btn">
                        <SearchOutlined />
                    </button>
                </form>

                {/* Desktop nav */}
                <div className="nav-right desktop-only">
                    {isAuthenticated && (
                        <span className="user-name">
                            Welcome, {userName?.toUpperCase()}
                        </span>
                    )}

                    {isAuthenticated ? (
                        <>
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
            {contextHolder}
        </div>
    );
};

export default TopNavBar;
