import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Modal, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "../store/cartSlice";
import Credential from "./credential";
import axiosInstance from "../api/axiosInstance";
import PageHeader from "../components/PageHeader";
import ReviewSection from "../components/ReviewSection";
import "../Styles/CardDetail.css";

function CardDetails() {
    const [cardData, setCardData] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const { state } = useLocation();
    const { id } = state;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((s) => s.auth);
    const [api, contextHolder] = notification.useNotification();

    const fetchProduct = () => {
        axiosInstance
            .get(`/ecommerce/getproductbyid/${id}`)
            .then((res) => {
                setCardData(res.data);
                setMainImage((prev) => prev || res.data.image[0]);
            })
            .catch(() => {
                api.open({ type: "error", message: "Failed to load product", duration: 3 });
            });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) { setOpen(true); return; }
        setAddingToCart(true);
        try {
            await dispatch(addToCartAsync({ productId: cardData._id, quantity: 1 })).unwrap();
            api.open({ type: "success", message: "Added to cart!", duration: 2 });
            setTimeout(() => navigate("/cart"), 800);
        } catch (err) {
            api.open({ type: "error", message: err || "Failed to add to cart", duration: 3 });
        } finally {
            setAddingToCart(false);
        }
    };

    if (!cardData) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    const finalPrice = Math.round(cardData.maxPrice - (cardData.discount / 100) * cardData.maxPrice);
    const saving = cardData.maxPrice - finalPrice;

    return (
        <div className="detail-page">
            {contextHolder}
            <Modal footer={null} open={open} onCancel={() => setOpen(false)} width={560}>
                <Credential handleClose={() => setOpen(false)} />
            </Modal>

            <PageHeader title="Product Details" backLabel="Back to Shopping" />

            <div className="detail-card">
                {/* ── Image section ── */}
                <div className="detail-image-section">
                    <img src={mainImage} alt={cardData.title} className="detail-main-image" />
                    <div className="detail-thumbnails">
                        {cardData.image.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`View ${i + 1}`}
                                className={`detail-thumb ${mainImage === img ? "active" : ""}`}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Info section ── */}
                <div className="detail-info-section">
                    {cardData.category && (
                        <span className="detail-category-badge">{cardData.category}</span>
                    )}

                    {cardData.brand && (
                        <p className="detail-brand">by <strong>{cardData.brand}</strong></p>
                    )}

                    <h1 className="detail-title">{cardData.title}</h1>

                    {/* Rating — now live from reviews */}
                    <div className="detail-rating-row">
                        <div className="detail-stars">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`detail-star ${i < Math.round(cardData.rating) ? "filled" : ""}`}>★</span>
                            ))}
                        </div>
                        <span className="detail-rating-value">{cardData.rating > 0 ? cardData.rating.toFixed(1) : "No ratings"}</span>
                        <a
                            href="#reviews-section"
                            className="detail-review-count"
                            style={{ color: "#1976D2", textDecoration: "none", cursor: "pointer" }}
                        >
                            ({cardData.reviewCount || 0} review{cardData.reviewCount !== 1 ? "s" : ""})
                        </a>
                    </div>

                    {/* Price */}
                    <div className="detail-price-block">
                        <span className="detail-final-price">₹{finalPrice.toLocaleString("en-IN")}</span>
                        <span className="detail-mrp">₹{cardData.maxPrice.toLocaleString("en-IN")}</span>
                        <span className="detail-discount-badge">{cardData.discount}% OFF</span>
                        <span className="detail-saving-text">You save ₹{saving.toLocaleString("en-IN")} on this product</span>
                    </div>

                    {/* Stock status */}
                    {cardData.stockStatus && (
                        <p className={`detail-stock-status ${cardData.stockStatus}`}>
                            {cardData.stockStatus === "in_stock" && "✓ In Stock"}
                            {cardData.stockStatus === "limited" && "⚠ Only a few left in stock"}
                            {cardData.stockStatus === "out_of_stock" && "✗ Out of Stock"}
                        </p>
                    )}

                    {/* Description */}
                    <p className="detail-description">{cardData.description}</p>

                    {/* Key Highlights */}
                    {cardData.highlights?.length > 0 && (
                        <div>
                            <p className="detail-offers-title">Key Features</p>
                            <ul className="detail-highlights-list">
                                {cardData.highlights.map((h, i) => (
                                    <li key={i} className="detail-highlight-item">{h}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Offers */}
                    {cardData.offers?.length > 0 && (
                        <div>
                            <p className="detail-offers-title">Available Offers</p>
                            <ul className="detail-offers-list">
                                {cardData.offers.map((offer, i) => (
                                    <li key={i} className="detail-offer-item">{offer}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Colors */}
                    {cardData.colors?.length > 0 && (
                        <div>
                            <p className="detail-colors-title">Color Options</p>
                            <div className="detail-colors-row">
                                {cardData.colors.map((color, i) => (
                                    <div key={i} className="detail-color-dot" style={{ backgroundColor: color }} title={color} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seller */}
                    <p className="detail-seller">Sold by: <strong>{cardData.sellerName}</strong></p>

                    {/* Delivery & Returns */}
                    <div className="detail-meta-row">
                        {cardData.deliveryInfo && (
                            <div className="detail-meta-item">
                                <span className="detail-meta-icon">🚚</span>
                                <span>{cardData.deliveryInfo}</span>
                            </div>
                        )}
                        {cardData.returnPolicy && (
                            <div className="detail-meta-item">
                                <span className="detail-meta-icon">↩</span>
                                <span>{cardData.returnPolicy}</span>
                            </div>
                        )}
                        {cardData.warranty && (
                            <div className="detail-meta-item">
                                <span className="detail-meta-icon">🛡</span>
                                <span>{cardData.warranty}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="detail-actions">
                        <button
                            className="btn-add-to-cart"
                            onClick={handleAddToCart}
                            disabled={addingToCart || cardData.stockStatus === "out_of_stock"}
                        >
                            {addingToCart ? "Adding..." : "🛒 ADD TO CART"}
                        </button>
                        <button
                            className="btn-buy-now"
                            onClick={handleAddToCart}
                            disabled={addingToCart || cardData.stockStatus === "out_of_stock"}
                        >
                            ⚡ BUY NOW
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Product Information Table ── */}
            {(cardData.inTheBox || cardData.weight || cardData.dimensions || cardData.countryOfOrigin || cardData.brand) && (
                <div className="detail-info-table-card">
                    <h2 className="detail-section-heading">Product Information</h2>
                    <table className="detail-info-table">
                        <tbody>
                            {cardData.brand && <tr><td>Brand</td><td>{cardData.brand}</td></tr>}
                            {cardData.countryOfOrigin && <tr><td>Country of Origin</td><td>{cardData.countryOfOrigin}</td></tr>}
                            {cardData.weight && <tr><td>Item Weight</td><td>{cardData.weight}</td></tr>}
                            {cardData.dimensions && <tr><td>Dimensions</td><td>{cardData.dimensions}</td></tr>}
                            {cardData.inTheBox && <tr><td>In The Box</td><td>{cardData.inTheBox}</td></tr>}
                            {cardData.sellerName && <tr><td>Sold By</td><td>{cardData.sellerName}</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Reviews ── */}
            <ReviewSection
                productId={cardData._id}
                productRating={cardData.rating}
                reviewCount={cardData.reviewCount || 0}
                onReviewChange={fetchProduct}
            />
        </div>
    );
}

export default CardDetails;
