import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AppstoreOutlined, ShoppingOutlined, UserOutlined,
    PlusOutlined, DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import axiosInstance from "../../api/axiosInstance";
import "./AdminDashboard.css";

function StatCard({ icon, label, value, color }) {
    return (
        <div className="admin-stat-card" style={{ borderTop: `3px solid ${color}` }}>
            <div className="admin-stat-icon" style={{ color }}>{icon}</div>
            <div className="admin-stat-info">
                <div className="admin-stat-value">{value ?? "—"}</div>
                <div className="admin-stat-label">{label}</div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { userName } = useSelector((s) => s.auth);
    const [collapsed, setCollapsed] = useState(false);
    const [stats, setStats] = useState({ products: null, users: null, orders: null });

    useEffect(() => {
        // Fetch quick stats
        Promise.all([
            axiosInstance.get("/ecommerce/getproducts?limit=1"),
            axiosInstance.get("/user/getAllUsers?limit=1"),
        ]).then(([prodRes, userRes]) => {
            setStats({
                products: prodRes.data.total,
                users: userRes.data.total ?? null,
            });
        }).catch(() => {});
    }, []);

    const navItems = [
        { key: "/admin", label: "Overview", icon: <DashboardOutlined /> },
        { key: "/admin/products", label: "Products", icon: <AppstoreOutlined /> },
        { key: "/admin/users", label: "Users", icon: <UserOutlined /> },
    ];

    const isActive = (key) => {
        if (key === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(key);
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="admin-sidebar-header">
                    {!collapsed && <span className="admin-sidebar-brand">Admin Panel</span>}
                    <button className="admin-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            className={`admin-nav-item ${isActive(item.key) ? "active" : ""}`}
                            onClick={() => navigate(item.key)}
                            title={collapsed ? item.label : ""}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            {!collapsed && <span className="admin-nav-label">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-nav-item" onClick={() => navigate("/")} title="Back to Store">
                        <span className="admin-nav-icon"><ShoppingOutlined /></span>
                        {!collapsed && <span className="admin-nav-label">Back to Store</span>}
                    </button>
                    <button className="admin-nav-item danger" onClick={() => { dispatch(logout()); navigate("/"); }} title="Logout">
                        <span className="admin-nav-icon"><LogoutOutlined /></span>
                        {!collapsed && <span className="admin-nav-label">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="admin-main">
                {/* Top bar */}
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <h1 className="admin-topbar-title">
                            {navItems.find((n) => isActive(n.key))?.label || "Admin"}
                        </h1>
                    </div>
                    <div className="admin-topbar-right">
                        <UserOutlined style={{ marginRight: "0.4rem" }} />
                        <span>{userName}</span>
                    </div>
                </header>

                {/* Page content */}
                <div className="admin-content">
                    {location.pathname === "/admin" ? (
                        <>
                            <div className="admin-stats-grid">
                                <StatCard icon={<AppstoreOutlined />} label="Total Products" value={stats.products} color="#1976D2" />
                                <StatCard icon={<UserOutlined />} label="Registered Users" value={stats.users} color="#7B1FA2" />
                                <StatCard icon={<ShoppingOutlined />} label="Categories" value="9" color="#E65100" />
                            </div>
                            <div className="admin-quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="admin-quick-btns">
                                    <button className="admin-quick-btn primary" onClick={() => navigate("/admin/products")}>
                                        <AppstoreOutlined /> Manage Products
                                    </button>
                                    <button className="admin-quick-btn" onClick={() => navigate("/admin/users")}>
                                        <UserOutlined /> Manage Users
                                    </button>
                                    <button className="admin-quick-btn" onClick={() => navigate("/newproduct")}>
                                        <PlusOutlined /> Add New Product
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
}
