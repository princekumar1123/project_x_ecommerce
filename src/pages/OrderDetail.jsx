import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Tag } from "antd";
import { CheckCircleFilled, CloseCircleOutlined } from "@ant-design/icons";
import axiosInstance from "../api/axiosInstance";
import PageHeader from "../components/PageHeader";
import { toastSuccess, toastError, confirmDanger } from "../utils/swal";
import "./OrderDetail.css";

const STATUS_STEPS = [
    { key: "confirmed", label: "Order Confirmed", icon: "✅" },
    { key: "packed", label: "Packed", icon: "📦" },
    { key: "shipped", label: "Shipped", icon: "🚚" },
    { key: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
    { key: "delivered", label: "Delivered", icon: "🏠" },
];

const STATUS_COLORS = {
    pending: "orange", confirmed: "blue", packed: "purple",
    shipped: "cyan", out_for_delivery: "geekblue",
    delivered: "green", cancelled: "red",
};

export default function OrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        axiosInstance.get(`/user/orders/${orderId}`)
            .then((res) => setOrder(res.data.order))
            .catch(() => toastError("Order not found"))
            .finally(() => setLoading(false));
    }, [orderId]);

    const handleCancel = async () => {
        const ok = await confirmDanger({
            title: "Cancel Order",
            text: "Are you sure you want to cancel this order? This action cannot be undone.",
            confirmText: "Yes, Cancel Order",
        });
        if (!ok) return;
        setCancelling(true);
        try {
            const res = await axiosInstance.patch(`/user/orders/${orderId}/cancel`);
            setOrder(res.data.order);
            toastSuccess("Order cancelled successfully");
        } catch (err) {
            const msg = err.response?.data?.error?.message || "Failed to cancel order.";
            toastError(msg);
        } finally { setCancelling(false); }
    };

    if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}><Spin size="large" /></div>;
    if (!order) return null;

    const isCancelled = order.status === "cancelled";
    const isDelivered = order.status === "delivered";
    const canCancel = !["delivered", "cancelled", "out_for_delivery"].includes(order.status);

    const currentStepIndex = isCancelled ? -1 : STATUS_STEPS.findIndex((s) => s.key === order.status);

    return (
        <div className="order-detail-page">
            <PageHeader title="Order Details" backTo="/orders" backLabel="My Orders" />

            {/* Order header */}
            <div className="od-header-card">
                <div className="od-header-row">
                    <div>
                        <div className="od-meta-label">Order ID</div>
                        <div className="od-meta-value mono">{order._id}</div>
                    </div>
                    <div>
                        <div className="od-meta-label">Placed On</div>
                        <div className="od-meta-value">{new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
                    </div>
                    <div>
                        <div className="od-meta-label">Total</div>
                        <div className="od-meta-value bold">₹{order.totalAmount.toLocaleString("en-IN")}</div>
                    </div>
                    {order.expectedDelivery && !isCancelled && !isDelivered && (
                        <div>
                            <div className="od-meta-label">Expected Delivery</div>
                            <div className="od-meta-value" style={{ color: "#2E7D32", fontWeight: 600 }}>
                                {new Date(order.expectedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </div>
                        </div>
                    )}
                    <Tag color={STATUS_COLORS[order.status] || "default"} style={{ textTransform: "uppercase", fontWeight: 700, fontSize: "0.75rem", alignSelf: "center" }}>
                        {order.status.replace(/_/g, " ")}
                    </Tag>
                </div>
            </div>

            <div className="od-body">
                <div className="od-main">
                    {/* Status timeline */}
                    {!isCancelled ? (
                        <div className="od-section">
                            <h3 className="od-section-title">Order Tracking</h3>
                            <div className="od-timeline">
                                {STATUS_STEPS.map((step, i) => {
                                    const isDone = i <= currentStepIndex;
                                    const isCurrent = i === currentStepIndex;
                                    const historyEntry = order.statusHistory?.find((h) => h.status === step.key);
                                    return (
                                        <div key={step.key} className={`od-timeline-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}>
                                            <div className="od-timeline-icon">
                                                {isDone ? <CheckCircleFilled /> : <span className="od-timeline-dot" />}
                                            </div>
                                            {i < STATUS_STEPS.length - 1 && <div className={`od-timeline-line ${isDone ? "done" : ""}`} />}
                                            <div className="od-timeline-content">
                                                <div className="od-timeline-label">{step.icon} {step.label}</div>
                                                {historyEntry && (
                                                    <div className="od-timeline-time">
                                                        {new Date(historyEntry.updatedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                        {historyEntry.message && <span className="od-timeline-msg"> — {historyEntry.message}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="od-cancelled-banner">
                            <CloseCircleOutlined style={{ fontSize: "1.5rem", color: "#C62828" }} />
                            <div>
                                <div style={{ fontWeight: 700, color: "#C62828" }}>Order Cancelled</div>
                                {order.statusHistory?.find((h) => h.status === "cancelled")?.message && (
                                    <div style={{ fontSize: "0.875rem", color: "#757575" }}>
                                        {order.statusHistory.find((h) => h.status === "cancelled").message}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div className="od-section">
                        <h3 className="od-section-title">Items Ordered</h3>
                        {order.items.map((item, i) => (
                            <div key={i} className="od-item">
                                {item.image && (
                                    <img src={item.image} alt={item.title} className="od-item-img"
                                        onClick={() => navigate("/detail", { state: { id: item.productId } })}
                                    />
                                )}
                                <div className="od-item-info">
                                    <p className="od-item-title" onClick={() => navigate("/detail", { state: { id: item.productId } })}>{item.title}</p>
                                    <p className="od-item-meta">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                                </div>
                                <div className="od-item-total">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                            </div>
                        ))}
                    </div>

                    {/* Delivery address */}
                    {order.deliveryAddress && (
                        <div className="od-section">
                            <h3 className="od-section-title">Delivery Address</h3>
                            <div className="od-address">
                                <p className="od-address-name">{order.deliveryAddress.fullName}</p>
                                <p>{order.deliveryAddress.addressLine1}{order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ""}</p>
                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}</p>
                                <p>📞 {order.deliveryAddress.mobile}</p>
                            </div>
                        </div>
                    )}

                    {/* Cancel button */}
                    {canCancel && (
                        <button className="od-cancel-btn" onClick={handleCancel} disabled={cancelling}>
                            {cancelling ? "Cancelling..." : "Cancel Order"}
                        </button>
                    )}
                </div>

                {/* Price summary */}
                <div className="od-sidebar">
                    <div className="od-price-card">
                        <p className="od-price-title">Payment Summary</p>
                        <div className="od-price-row"><span>Item Total</span><span>₹{order.totalAmount.toLocaleString("en-IN")}</span></div>
                        <div className="od-price-row delivery"><span>Delivery</span><span>FREE</span></div>
                        <hr className="od-price-divider" />
                        <div className="od-price-row total"><strong>Total Paid</strong><strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong></div>
                        {order.razorpayPaymentId && (
                            <div className="od-payment-id">
                                <span>Payment ID</span>
                                <span className="mono">{order.razorpayPaymentId}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
