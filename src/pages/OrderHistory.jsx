import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Empty, Tag, Modal, notification } from "antd";
import { StarOutlined, EditOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";
import PageHeader from "../components/PageHeader";
import ReviewSection from "../components/ReviewSection";

const statusColors = {
    pending: "orange",
    confirmed: "blue",
    shipped: "cyan",
    delivered: "green",
    cancelled: "red",
};

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewModal, setReviewModal] = useState({ open: false, productId: null, productTitle: "" });
    const navigate = useNavigate();
    const [api, ctx] = notification.useNotification();

    useEffect(() => {
        window.scrollTo(0, 0);
        axiosInstance
            .get("/user/orders")
            .then((res) => setOrders(res.data.orders || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "900px", margin: "1.5rem auto", padding: "0 1rem 3rem" }}>
            {ctx}
            <PageHeader
                title="My Orders"
                subtitle="Track and manage your orders"
                backTo="/"
                backLabel="Back to Home"
            />

            {/* Review modal */}
            <Modal
                open={reviewModal.open}
                onCancel={() => setReviewModal({ open: false, productId: null, productTitle: "" })}
                footer={null}
                title={`Review: ${reviewModal.productTitle}`}
                width={560}
            >
                {reviewModal.productId && (
                    <ReviewSection
                        productId={reviewModal.productId}
                        productRating={0}
                        reviewCount={0}
                    />
                )}
            </Modal>

            {orders.length === 0 ? (
                <Empty description="No orders yet" style={{ padding: "3rem" }}>
                    <button
                        onClick={() => navigate("/")}
                        style={{ padding: "0.6rem 1.5rem", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
                    >
                        Start Shopping
                    </button>
                </Empty>
            ) : (
                orders.map((order) => (
                    <div
                        key={order._id}
                        style={{ background: "#fff", border: "1px solid #EEEEEE", borderRadius: "12px", marginBottom: "1.25rem", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
                    >
                        {/* Order header */}
                        <div style={{ backgroundColor: "#FAFAFA", padding: "0.875rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: "1px solid #F0F0F0" }}>
                            <div>
                                <div style={{ fontSize: "0.72rem", color: "#BDBDBD", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Order ID</div>
                                <div
                                    style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1976D2", fontFamily: "monospace", cursor: "pointer" }}
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                >
                                    {order._id}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.72rem", color: "#BDBDBD", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Placed On</div>
                                <div style={{ fontSize: "0.875rem", color: "#424242" }}>
                                    {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.72rem", color: "#BDBDBD", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total</div>
                                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#212121" }}>₹{order.totalAmount.toLocaleString("en-IN")}</div>
                            </div>
                            {order.razorpayPaymentId && (
                                <div>
                                    <div style={{ fontSize: "0.72rem", color: "#BDBDBD", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Payment ID</div>
                                    <div style={{ fontSize: "0.72rem", color: "#757575", fontFamily: "monospace" }}>{order.razorpayPaymentId}</div>
                                </div>
                            )}
                            <Tag color={statusColors[order.status] || "default"} style={{ textTransform: "uppercase", fontWeight: 700, fontSize: "0.72rem" }}>
                                {order.status.replace(/_/g, " ")}
                            </Tag>
                            <button
                                onClick={() => navigate(`/orders/${order._id}`)}
                                style={{ padding: "0.3rem 0.75rem", background: "transparent", border: "1.5px solid #1976D2", borderRadius: "6px", color: "#1976D2", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                            >
                                View Details
                            </button>
                        </div>

                        {/* Order items */}
                        <div style={{ padding: "0.75rem 1.25rem" }}>
                            {order.items.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.875rem",
                                        padding: "0.75rem 0",
                                        borderBottom: i < order.items.length - 1 ? "1px solid #F5F5F5" : "none",
                                    }}
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{ width: "64px", height: "64px", objectFit: "contain", borderRadius: "8px", border: "1px solid #F0F0F0", background: "#FAFAFA", cursor: "pointer", flexShrink: 0 }}
                                            onClick={() => navigate("/detail", { state: { id: item.productId } })}
                                        />
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p
                                            style={{ margin: "0 0 0.2rem", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", color: "#212121" }}
                                            onClick={() => navigate("/detail", { state: { id: item.productId } })}
                                        >
                                            {item.title}
                                        </p>
                                        <p style={{ margin: 0, color: "#9E9E9E", fontSize: "0.8rem" }}>
                                            Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                                        {/* Review button — only for confirmed/delivered orders */}
                                        {["confirmed", "delivered"].includes(order.status) && (
                                            <button
                                                onClick={() => setReviewModal({ open: true, productId: item.productId, productTitle: item.title })}
                                                style={{
                                                    marginTop: "0.4rem",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.25rem",
                                                    padding: "0.25rem 0.65rem",
                                                    background: "#FFF8E1",
                                                    border: "1px solid #FFE082",
                                                    borderRadius: "6px",
                                                    color: "#F57F17",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    transition: "all 0.15s",
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = "#FFE082"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = "#FFF8E1"; }}
                                            >
                                                <StarOutlined /> Rate & Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default OrderHistory;
