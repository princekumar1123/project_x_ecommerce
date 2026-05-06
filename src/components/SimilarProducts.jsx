import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axiosInstance from "../api/axiosInstance";
import WishlistButton from "./WishlistButton";

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 5 },
    desktop:           { breakpoint: { max: 1200, min: 900  }, items: 4 },
    tablet:            { breakpoint: { max: 900,  min: 560  }, items: 3 },
    mobile:            { breakpoint: { max: 560,  min: 0    }, items: 2 },
};

function SimilarCard({ product, onLoginRequired }) {
    const navigate = useNavigate();
    const finalPrice = Math.round(
        product.maxPrice - (product.discount / 100) * product.maxPrice
    );

    return (
        <div
            style={{
                margin: "0 6px",
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
                position: "relative",
            }}
            onClick={() => navigate("/detail", { state: { id: product._id } })}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.13)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Wishlist heart */}
            <div style={{ position: "absolute", top: 6, right: 6, zIndex: 2 }}>
                <WishlistButton
                    productId={product._id}
                    onLoginRequired={onLoginRequired}
                    size={14}
                />
            </div>

            {/* Image */}
            <div style={{ background: "#FAFAFA", padding: "0.75rem", height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                    src={product.image?.[0]}
                    alt={product.title}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
            </div>

            {/* Info */}
            <div style={{ padding: "0.6rem 0.75rem" }}>
                <p style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#212121",
                    margin: "0 0 0.25rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.35,
                }}>
                    {product.title}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#212121" }}>
                        ₹{finalPrice.toLocaleString("en-IN")}
                    </span>
                    {product.discount > 0 && (
                        <span style={{ fontSize: "0.7rem", color: "#E53935", fontWeight: 700 }}>
                            {product.discount}% off
                        </span>
                    )}
                </div>
                {product.rating > 0 && (
                    <div style={{ fontSize: "0.72rem", color: "#FF9800", marginTop: "0.15rem" }}>
                        {"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}
                        <span style={{ color: "#9E9E9E", marginLeft: 3 }}>{product.rating.toFixed(1)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SimilarProducts({ productId, onLoginRequired }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;
        setLoading(true);
        axiosInstance
            .get(`/ecommerce/getproductbyid/${productId}/similar?limit=10`)
            .then((res) => setProducts(res.data.products || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [productId]);

    if (loading) {
        return (
            <div style={{ display: "flex", gap: "0.75rem", overflow: "hidden", padding: "0.5rem 0" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                        flex: "0 0 180px",
                        height: 220,
                        borderRadius: 10,
                        background: "linear-gradient(90deg,#F5F5F5 25%,#EEEEEE 50%,#F5F5F5 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.2s infinite",
                    }} />
                ))}
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div style={{ marginTop: "1.5rem" }}>
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
                }}>
                    Similar Products
                </h2>
                <Carousel
                    responsive={responsive}
                    infinite={products.length > 4}
                    autoPlay={false}
                    containerClass="carousel-container"
                    itemClass="carousel-item-padding-10-px"
                    customTransition="transform 300ms ease-in-out"
                    arrows
                >
                    {products.map((p) => (
                        <SimilarCard key={p._id} product={p} onLoginRequired={onLoginRequired} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}
