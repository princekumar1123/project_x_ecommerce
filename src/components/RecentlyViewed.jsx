import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HistoryOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";
import WishlistButton from "./WishlistButton";
import "../Styles/RecentlyViewed.css";

function SkeletonCards() {
    return Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rv-skeleton-card">
            <div className="rv-skeleton" style={{ height: 120 }} />
            <div style={{ padding: "0.6rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div className="rv-skeleton" style={{ height: 10, width: "40%" }} />
                <div className="rv-skeleton" style={{ height: 12, width: "90%" }} />
                <div className="rv-skeleton" style={{ height: 12, width: "65%" }} />
                <div className="rv-skeleton" style={{ height: 14, width: "50%", marginTop: "0.25rem" }} />
            </div>
        </div>
    ));
}

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

    // Don't render anything if not logged in or no history yet
    if (!isAuthenticated || (!loading && items.length === 0)) return null;

    return (
        <section className="rv-section">
            <div className="rv-header">
                <h2 className="rv-title">
                    <HistoryOutlined className="rv-title-icon" />
                    Recently Viewed
                    {!loading && items.length > 0 && (
                        <span className="rv-count">({items.length})</span>
                    )}
                </h2>
            </div>

            <div className="rv-track">
                {loading ? (
                    <SkeletonCards />
                ) : (
                    items.map(({ productId: p }) => {
                        if (!p?._id) return null;
                        const finalPrice = Math.round(
                            p.maxPrice - (p.discount / 100) * p.maxPrice
                        );
                        return (
                            <div
                                key={p._id}
                                className="rv-card"
                                onClick={() => navigate("/detail", { state: { id: p._id } })}
                            >
                                {/* Wishlist heart */}
                                <div className="rv-heart">
                                    <WishlistButton
                                        productId={p._id}
                                        onLoginRequired={onLoginRequired}
                                        size={13}
                                    />
                                </div>

                                {/* Image */}
                                <div className="rv-img-wrap">
                                    <img
                                        src={p.image?.[0]}
                                        alt={p.title}
                                        className="rv-img"
                                    />
                                </div>

                                {/* Info */}
                                <div className="rv-body">
                                    {p.category && (
                                        <span className="rv-category">{p.category}</span>
                                    )}
                                    <p className="rv-name">{p.title}</p>
                                    <div className="rv-price-row">
                                        <span className="rv-price">
                                            ₹{finalPrice.toLocaleString("en-IN")}
                                        </span>
                                        {p.maxPrice !== finalPrice && (
                                            <span className="rv-mrp">
                                                ₹{p.maxPrice.toLocaleString("en-IN")}
                                            </span>
                                        )}
                                        {p.discount > 0 && (
                                            <span className="rv-discount">{p.discount}% off</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}
