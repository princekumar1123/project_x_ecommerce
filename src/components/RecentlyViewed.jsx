import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HistoryOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";
import WishlistButton from "./WishlistButton";

export default function RecentlyViewed({ onLoginRequired }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((s) => s.auth);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        setLoading(true);
        axiosInstance
            .get("/user/recently-viewed")
            .then((res) => setItems(res.data.recentlyViewed || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isAuthenticated]);

    if (!isAuthenticated || (!loading && items.length === 0)) return null;

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem 2rem" }}>
            <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}>
                <h2 style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#212121",
                    margin: "0 0 1rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #F0F0F0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}>
                    <HistoryOutlined style={{ color: "#1976D2" }} />
                    Recently Viewed
                </h2>

                {loading ? (
                    <div style={{ display: "flex", gap: "0.75rem", overflow: "hidden" }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} style={{
                                flex: "0 0 160px",
                                height: 200,
                                borderRadius: 10,
                                background: "linear-gradient(90deg,#F5F5F5 25%,#EEEEEE 50%,#F5F5F5 75%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.2s infinite",
                            }} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: "flex",
                        gap: "0.75rem",
                        overflowX: "auto",
                        paddingBottom: "0.5rem",
                        scrollbarWidth: "thin",
                    }}>
                        {items.map(({ productId: p }) => {
                            if (!p || !p._id) return null;
                            const finalPrice = Math.round(
                                p.maxPrice - (p.discount / 100) * p.maxPrice
                            );
                            return (
                                <div
                                    key={p._id}
                                    style={{
                                        flex: "0 0 160px",
                                        background: "#FAFAFA",
                                        borderRadius: 10,
                                        border: "1px solid #F0F0F0",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        transition: "box-shadow 0.2s, transform 0.2s",
                                        position: "relative",
                                    }}
                                    onClick={() => navigate("/detail", { state: { id: p._id } })}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.1)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {/* Wishlist heart */}
                                    <div style={{ position: "absolute", top: 5, right: 5, zIndex: 2 }}>
                                        <WishlistButton
                                            productId={p._id}
                                            onLoginRequired={onLoginRequired}
                                            size={13}
                                        />
                                    </div>

                                    {/* Image */}
                                    <div style={{
                                        height: 110,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "0.5rem",
                                        background: "#fff",
                                    }}>
                                        <img
                                            src={p.image?.[0]}
                                            alt={p.title}
                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: "0.5rem 0.6rem" }}>
                                        <p style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            color: "#212121",
                                            margin: "0 0 0.2rem",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            lineHeight: 1.3,
                                        }}>
                                            {p.title}
                                        </p>
                                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#212121" }}>
                                            ₹{finalPrice.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
