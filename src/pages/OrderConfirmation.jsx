import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircleFilled } from "@ant-design/icons";

function OrderConfirmation() {
    const navigate = useNavigate();
    const lastOrder = useSelector((state) => state.cart.lastOrder);

    return (
        <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", textAlign: "center", border: "1px solid #e0e0e0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CheckCircleFilled style={{ fontSize: "4rem", color: "#52c41a", marginBottom: "1rem" }} />
            <h1 style={{ color: "#333" }}>Order Confirmed!</h1>
            <p style={{ color: "#666", fontSize: "1.1rem" }}>
                Thank you for your purchase. Your order has been placed successfully.
            </p>

            {lastOrder && (
                <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "1rem", margin: "1.5rem 0", textAlign: "left" }}>
                    <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#888" }}>
                        Order ID: <strong>{lastOrder._id}</strong>
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#888" }}>
                        Items: <strong>{lastOrder.items?.length}</strong>
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "1rem", fontWeight: "bold" }}>
                        Total: ₹{lastOrder.totalAmount}
                    </p>
                </div>
            )}

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
                <button
                    onClick={() => navigate("/orders")}
                    style={{ padding: "0.6rem 1.5rem", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
                >
                    View Orders
                </button>
                <button
                    onClick={() => navigate("/")}
                    style={{ padding: "0.6rem 1.5rem", backgroundColor: "#fff", color: "#2196F3", border: "1px solid #2196F3", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}

export default OrderConfirmation;
