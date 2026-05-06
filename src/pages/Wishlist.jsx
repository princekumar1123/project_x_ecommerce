import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { HeartFilled, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { fetchWishlist, removeFromWishlistAsync } from "../store/wishlistSlice";
import { addToCartAsync } from "../store/cartSlice";
import PageHeader from "../components/PageHeader";
import "../Styles/Wishlist.css";

function SkeletonCards() {
    return Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="wl-skeleton-card">
            <div className="wl-skeleton" style={{ height: 180 }} />
            <div style={{ padding: "0.875rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div className="wl-skeleton" style={{ height: 12, width: "40%" }} />
                <div className="wl-skeleton" style={{ height: 14, width: "90%" }} />
                <div className="wl-skeleton" style={{ height: 14, width: "70%" }} />
                <div className="wl-skeleton" style={{ height: 32, marginTop: "0.5rem" }} />
            </div>
        </div>
    ));
}

export default function Wishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, loading } = useSelector((s) => s.wishlist);
    const [api, ctx] = notification.useNotification();

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    const handleRemove = async (e, productId) => {
        e.stopPropagation();
        try {
            await dispatch(removeFromWishlistAsync(productId)).unwrap();
            api.open({ type: "success", message: "Removed from wishlist", duration: 2 });
        } catch {
            api.open({ type: "error", message: "Failed to remove", duration: 2 });
        }
    };

    const handleMoveToCart = async (e, productId) => {
        e.stopPropagation();
        try {
            await dispatch(addToCartAsync({ productId, quantity: 1 })).unwrap();
            await dispatch(removeFromWishlistAsync(productId)).unwrap();
            api.open({ type: "success", message: "Moved to cart!", duration: 2 });
        } catch {
            api.open({ type: "error", message: "Failed to move to cart", duration: 2 });
        }
    };

    return (
        <div className="wishlist-page">
            {ctx}
            <PageHeader title="My Wishlist" backLabel="Continue Shopping" />

            <div className="wishlist-header">
                <h2 className="wishlist-title">
                    <HeartFilled style={{ color: "#E53935", marginRight: "0.5rem" }} />
                    Wishlist
                </h2>
                {!loading && (
                    <span className="wishlist-count">
                        {items.length} item{items.length !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="wishlist-grid">
                    <SkeletonCards />
                </div>
            ) : items.length === 0 ? (
                <div className="wishlist-empty">
                    <div className="wishlist-empty-icon">
                        <HeartFilled />
                    </div>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love and come back to them anytime.</p>
                    <button className="wishlist-empty-btn" onClick={() => navigate("/")}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {items.map((product) => {
                        const finalPrice = Math.round(
                            product.maxPrice - (product.discount / 100) * product.maxPrice
                        );
                        return (
                            <div
                                key={product._id}
                                className="wl-card"
                                onClick={() => navigate("/detail", { state: { id: product._id } })}
                            >
                                <div className="wl-img-wrap">
                                    <img
                                        src={product.image?.[0]}
                                        alt={product.title}
                                        className="wl-img"
                                    />
                                    <button
                                        className="wl-remove-btn"
                                        title="Remove from wishlist"
                                        onClick={(e) => handleRemove(e, product._id)}
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </div>
                                <div className="wl-body">
                                    {product.category && (
                                        <span className="wl-category">{product.category}</span>
                                    )}
                                    <p className="wl-title">{product.title}</p>
                                    <div className="wl-price-row">
                                        <span className="wl-price">
                                            ₹{finalPrice.toLocaleString("en-IN")}
                                        </span>
                                        <span className="wl-mrp">
                                            ₹{product.maxPrice.toLocaleString("en-IN")}
                                        </span>
                                        <span className="wl-discount">{product.discount}% off</span>
                                    </div>
                                    <div className="wl-actions">
                                        <button
                                            className="wl-cart-btn"
                                            onClick={(e) => handleMoveToCart(e, product._id)}
                                        >
                                            <ShoppingCartOutlined /> Move to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
