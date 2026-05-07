import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { fetchCart, removeFromCartAsync, updateCartItemAsync } from "../store/cartSlice";
import PageHeader from "../components/PageHeader";
import { toastSuccess, toastError } from "../utils/swal";
import "../Styles/AddToCart.css";

const AddToCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, loading } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemove = async (productId) => {
        try {
            await dispatch(removeFromCartAsync(productId)).unwrap();
            toastSuccess("Item removed from cart");
        } catch (err) {
            toastError(err || "Failed to remove item");
        }
    };

    const handleQuantityChange = async (productId, newQty) => {
        if (newQty < 1) return;
        try {
            await dispatch(updateCartItemAsync({ productId, quantity: newQty })).unwrap();
        } catch (err) {
            toastError(err || "Failed to update quantity");
        }
    };

    const cartProducts = items
        .filter((item) => item.productId && typeof item.productId === "object")
        .map((item) => ({
            ...item.productId,
            cartQuantity: item.quantity,
        }));

    const totalMRP = cartProducts.reduce((sum, p) => sum + (p.maxPrice || 0) * p.cartQuantity, 0);
    const totalDiscount = cartProducts.reduce(
        (sum, p) => sum + Math.round((p.discount / 100) * p.maxPrice * p.cartQuantity), 0
    );
    const finalAmount = totalMRP - totalDiscount;

    if (loading && items.length === 0) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="cart-page">

            {/* Left — items */}
            <div className="cart-items-panel">
                <PageHeader
                    title="My Cart"
                    backLabel="Continue Shopping"
                    backTo="/"
                    subtitle={cartProducts.length > 0 ? `${cartProducts.length} ${cartProducts.length === 1 ? "item" : "items"} in your cart` : undefined}
                />

                {cartProducts.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">
                            <ShoppingCartOutlined />
                        </div>
                        <h3>Your cart is empty</h3>
                        <p>Add items to your cart to see them here</p>
                        <button
                            className="btn-place-order"
                            style={{ width: "auto", padding: "0.75rem 2rem" }}
                            onClick={() => navigate("/")}
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    cartProducts.map((product) => {
                        const discountedPrice = Math.round(product.maxPrice - (product.discount / 100) * product.maxPrice);
                        const itemTotal = discountedPrice * product.cartQuantity;
                        const itemSaving = Math.round((product.discount / 100) * product.maxPrice * product.cartQuantity);

                        return (
                            <div className="cart-item" key={product._id}>
                                <img
                                    src={product.image?.[0]}
                                    alt={product.title}
                                    className="cart-item-image"
                                    onClick={() => navigate("/detail", { state: { id: product._id } })}
                                />

                                <div className="cart-item-body">
                                    <h4
                                        className="cart-item-title"
                                        onClick={() => navigate("/detail", { state: { id: product._id } })}
                                    >
                                        {product.title}
                                    </h4>
                                    <p className="cart-item-seller">Seller: {product.sellerName}</p>
                                    <p className="cart-item-price">₹{discountedPrice}</p>

                                    {product.offers?.slice(0, 2).map((offer, i) => (
                                        <span key={i} className="cart-item-offer-tag">☆ {offer}</span>
                                    ))}

                                    {/* Quantity */}
                                    <div className="qty-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(product._id, product.cartQuantity - 1)}
                                            disabled={product.cartQuantity <= 1 || loading}
                                        >
                                            <MinusOutlined style={{ fontSize: "0.75rem" }} />
                                        </button>
                                        <span className="qty-value">{product.cartQuantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(product._id, product.cartQuantity + 1)}
                                            disabled={loading}
                                        >
                                            <PlusOutlined style={{ fontSize: "0.75rem" }} />
                                        </button>
                                    </div>

                                    <div className="cart-item-actions">
                                        <button
                                            className="btn-remove"
                                            onClick={() => handleRemove(product._id)}
                                            disabled={loading}
                                        >
                                            <DeleteOutlined /> Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item-right">
                                    <div className="cart-item-total">₹{itemTotal}</div>
                                    <div className="cart-item-mrp">₹{product.maxPrice * product.cartQuantity}</div>
                                    {itemSaving > 0 && (
                                        <div className="cart-item-saving">-₹{itemSaving}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Right — price summary */}
            {cartProducts.length > 0 && (
                <div className="price-summary">
                    <div className="price-summary-card">
                        <p className="price-summary-title">Price Details</p>

                        <div className="price-row">
                            <span>Price ({cartProducts.length} items)</span>
                            <span>₹{totalMRP}</span>
                        </div>
                        <div className="price-row discount">
                            <span>Discount</span>
                            <span>− ₹{totalDiscount}</span>
                        </div>
                        <div className="price-row delivery">
                            <span>Delivery Charges</span>
                            <span>FREE</span>
                        </div>

                        <hr className="price-divider" />

                        <div className="price-row total">
                            <span>Total Amount</span>
                            <span>₹{finalAmount}</span>
                        </div>

                        {totalDiscount > 0 && (
                            <div className="savings-badge">
                                🎉 You save ₹{totalDiscount} on this order!
                            </div>
                        )}

                        <button
                            className="btn-place-order"
                            onClick={() => navigate("/checkout")}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "PROCEED TO CHECKOUT"}
                        </button>
                        <button
                            className="btn-continue-shopping"
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddToCart;
