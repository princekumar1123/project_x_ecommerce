import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { notification, Spin } from "antd";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { createPaymentOrderAsync, verifyPaymentAsync } from "../store/cartSlice";
import { AddressCard, AddressForm } from "./AddressManager";
import axiosInstance from "../api/axiosInstance";
import useRazorpay from "../hooks/useRazorpay";
import PageHeader from "../components/PageHeader";
import "./Checkout.css";

const STEPS = ["Delivery Address", "Order Summary", "Payment"];

export default function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, loading: cartLoading } = useSelector((s) => s.cart);
    const { userName } = useSelector((s) => s.auth);
    const { openPayment } = useRazorpay();
    const [api, ctx] = notification.useNotification();

    const [step, setStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [savingAddr, setSavingAddr] = useState(false);
    const [addrLoading, setAddrLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const cartProducts = items
        .filter((item) => item.productId && typeof item.productId === "object")
        .map((item) => ({ ...item.productId, cartQuantity: item.quantity }));

    const totalMRP = cartProducts.reduce((s, p) => s + p.maxPrice * p.cartQuantity, 0);
    const totalDiscount = cartProducts.reduce((s, p) => s + Math.round((p.discount / 100) * p.maxPrice * p.cartQuantity), 0);
    const finalAmount = totalMRP - totalDiscount;

    useEffect(() => {
        if (cartProducts.length === 0 && !cartLoading) {
            navigate("/cart");
        }
    }, [cartProducts.length, cartLoading]);

    useEffect(() => {
        axiosInstance.get("/user/addresses")
            .then((res) => {
                const addrs = res.data.addresses || [];
                setAddresses(addrs);
                const def = addrs.find((a) => a.isDefault) || addrs[0];
                if (def) setSelectedAddressId(def._id);
                if (addrs.length === 0) setShowAddForm(true);
            })
            .catch(console.error)
            .finally(() => setAddrLoading(false));
    }, []);

    const handleSaveAddress = async (form) => {
        setSavingAddr(true);
        try {
            const res = await axiosInstance.post("/user/addresses", form);
            const addrs = res.data.addresses || [];
            setAddresses(addrs);
            const newest = addrs[addrs.length - 1];
            setSelectedAddressId(newest._id);
            setShowAddForm(false);
            api.open({ type: "success", message: "Address saved", duration: 2 });
        } catch (err) {
            const msg = err.response?.data?.error?.message || err.response?.data?.errors?.[0]?.msg || "Failed to save address.";
            api.open({ type: "error", message: msg, duration: 3 });
        } finally { setSavingAddr(false); }
    };

    const handleProceedToSummary = () => {
        if (!selectedAddressId) {
            api.open({ type: "warning", message: "Please select a delivery address", duration: 2 });
            return;
        }
        setStep(1);
        window.scrollTo(0, 0);
    };

    const handlePay = async () => {
        setPaymentLoading(true);
        try {
            const keyRes = await axiosInstance.get("/payment/razorpay-key");
            const orderData = await dispatch(createPaymentOrderAsync()).unwrap();

            openPayment({
                key: keyRes.data.key,
                orderId: orderData.orderId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Prince Shopify",
                description: `Order of ${cartProducts.length} item(s)`,
                prefill: { name: userName || "" },
                onSuccess: async (paymentResponse) => {
                    try {
                        await dispatch(verifyPaymentAsync({
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                            addressId: selectedAddressId,
                        })).unwrap();
                        api.open({ type: "success", message: "Payment successful! Order placed.", duration: 2 });
                        setTimeout(() => navigate("/order-confirmation"), 800);
                    } catch (err) {
                        api.open({ type: "error", message: "Order placement failed", description: err || "Contact support.", duration: 5 });
                    } finally { setPaymentLoading(false); }
                },
                onFailure: (reason) => {
                    setPaymentLoading(false);
                    if (reason !== "Payment cancelled by user.") {
                        api.open({ type: "error", message: "Payment failed", description: reason, duration: 4 });
                    }
                },
            });
        } catch (err) {
            setPaymentLoading(false);
            api.open({ type: "error", message: "Could not initiate payment", description: err || "Please try again.", duration: 4 });
        }
    };

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    return (
        <div className="checkout-page">
            {ctx}
            <PageHeader title="Checkout" backTo="/cart" backLabel="Back to Cart" />

            {/* Step indicator */}
            <div className="checkout-steps">
                {STEPS.map((label, i) => (
                    <div key={i} className={`checkout-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
                        <div className="checkout-step-circle">
                            {i < step ? <CheckOutlined /> : i + 1}
                        </div>
                        <span className="checkout-step-label">{label}</span>
                        {i < STEPS.length - 1 && <div className="checkout-step-line" />}
                    </div>
                ))}
            </div>

            <div className="checkout-body">
                {/* ── STEP 0: Address ── */}
                {step === 0 && (
                    <div className="checkout-main">
                        <div className="checkout-section">
                            <h2 className="checkout-section-title">Select Delivery Address</h2>

                            {addrLoading ? (
                                <div style={{ textAlign: "center", padding: "2rem" }}><Spin /></div>
                            ) : (
                                <>
                                    <div className="addr-list">
                                        {addresses.map((addr) => (
                                            <AddressCard
                                                key={addr._id}
                                                address={addr}
                                                selectable
                                                selected={selectedAddressId === addr._id}
                                                onSelect={() => { setSelectedAddressId(addr._id); setShowAddForm(false); }}
                                            />
                                        ))}
                                    </div>

                                    {!showAddForm ? (
                                        <button className="checkout-add-addr-btn" onClick={() => setShowAddForm(true)}>
                                            <PlusOutlined /> Add New Address
                                        </button>
                                    ) : (
                                        <div className="addr-form-card" style={{ marginTop: "1rem" }}>
                                            <h4>Add New Address</h4>
                                            <AddressForm
                                                onSave={handleSaveAddress}
                                                onCancel={() => setShowAddForm(false)}
                                                saving={savingAddr}
                                            />
                                        </div>
                                    )}

                                    <button
                                        className="checkout-proceed-btn"
                                        onClick={handleProceedToSummary}
                                        disabled={!selectedAddressId}
                                    >
                                        Deliver to this address →
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ── STEP 1: Order Summary ── */}
                {step === 1 && (
                    <div className="checkout-main">
                        <div className="checkout-section">
                            <h2 className="checkout-section-title">Order Summary</h2>

                            {/* Delivery address summary */}
                            {selectedAddress && (
                                <div className="checkout-addr-summary">
                                    <div className="checkout-addr-summary-label">Delivering to</div>
                                    <div className="checkout-addr-summary-name">{selectedAddress.fullName}</div>
                                    <div className="checkout-addr-summary-detail">
                                        {selectedAddress.addressLine1}{selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                                    </div>
                                    <div className="checkout-addr-summary-mobile">📞 {selectedAddress.mobile}</div>
                                    <button className="checkout-change-addr" onClick={() => setStep(0)}>Change</button>
                                </div>
                            )}

                            {/* Items */}
                            <div className="checkout-items">
                                {cartProducts.map((p) => {
                                    const price = Math.round(p.maxPrice - (p.discount / 100) * p.maxPrice);
                                    return (
                                        <div key={p._id} className="checkout-item">
                                            <img src={p.image?.[0]} alt={p.title} className="checkout-item-img" />
                                            <div className="checkout-item-info">
                                                <p className="checkout-item-title">{p.title}</p>
                                                <p className="checkout-item-seller">Seller: {p.sellerName}</p>
                                                <p className="checkout-item-qty">Qty: {p.cartQuantity}</p>
                                            </div>
                                            <div className="checkout-item-price">₹{(price * p.cartQuantity).toLocaleString("en-IN")}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button className="checkout-proceed-btn" onClick={() => { setStep(2); window.scrollTo(0, 0); }}>
                                Continue to Payment →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: Payment ── */}
                {step === 2 && (
                    <div className="checkout-main">
                        <div className="checkout-section">
                            <h2 className="checkout-section-title">Payment</h2>

                            {selectedAddress && (
                                <div className="checkout-addr-summary">
                                    <div className="checkout-addr-summary-label">Delivering to</div>
                                    <div className="checkout-addr-summary-name">{selectedAddress.fullName}</div>
                                    <div className="checkout-addr-summary-detail">
                                        {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                                    </div>
                                    <button className="checkout-change-addr" onClick={() => setStep(0)}>Change</button>
                                </div>
                            )}

                            <div className="checkout-payment-info">
                                <div className="checkout-payment-icon">🔒</div>
                                <div>
                                    <p className="checkout-payment-title">Secure Payment via Razorpay</p>
                                    <p className="checkout-payment-sub">Pay with UPI, Cards, Net Banking, Wallets</p>
                                </div>
                            </div>

                            <button
                                className="checkout-pay-btn"
                                onClick={handlePay}
                                disabled={paymentLoading}
                            >
                                {paymentLoading ? "Opening Payment..." : `Pay ₹${finalAmount.toLocaleString("en-IN")}`}
                            </button>
                            <button className="checkout-back-btn" onClick={() => setStep(1)}>← Back to Summary</button>
                        </div>
                    </div>
                )}

                {/* Price summary sidebar */}
                <div className="checkout-sidebar">
                    <div className="checkout-price-card">
                        <p className="checkout-price-title">Price Details</p>
                        <div className="checkout-price-row"><span>Price ({cartProducts.length} items)</span><span>₹{totalMRP.toLocaleString("en-IN")}</span></div>
                        <div className="checkout-price-row discount"><span>Discount</span><span>− ₹{totalDiscount.toLocaleString("en-IN")}</span></div>
                        <div className="checkout-price-row delivery"><span>Delivery</span><span>FREE</span></div>
                        <hr className="checkout-price-divider" />
                        <div className="checkout-price-row total"><strong>Total Amount</strong><strong>₹{finalAmount.toLocaleString("en-IN")}</strong></div>
                        {totalDiscount > 0 && (
                            <div className="checkout-savings">🎉 You save ₹{totalDiscount.toLocaleString("en-IN")}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
