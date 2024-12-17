import React from "react";

function CardDetails() {
    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                color: "#333",
                maxWidth: "1200px",
                margin: "2rem auto",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexWrap: "wrap",
                padding: "1rem",
                backgroundColor: "#fff",
                minHeight: "400px",
                animation: "fadeIn 1s ease-in-out",
            }}
        >
            <div
                style={{
                    flex: "1 1 300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                }}
            >
                <img
                    src="https://picsum.photos/400/300?random=1"
                    alt="Product"
                    style={{
                        width: "100%",
                        maxWidth: "300px",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                    }
                />
            </div>

            <div
                style={{
                    flex: "1 1 400px",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <h1
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        margin: "0",
                        color: "#444",
                    }}
                >
                    Egate i9 Projector
                </h1>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        margin: "0.5rem 0",
                        flexWrap: "wrap",
                    }}
                >
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                        ₹5,990
                    </span>
                    <span
                        style={{
                            textDecoration: "line-through",
                            color: "#888",
                        }}
                    >
                        ₹9,990
                    </span>
                    <span
                        style={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                        }}
                    >
                        40% off
                    </span>
                </div>

                <p
                    style={{
                        fontSize: "1rem",
                        margin: "0",
                        color: "#555",
                    }}
                >
                    Android Smart Projector with 4D Keystone, 720p native
                    resolution, 1080p support, Netflix, Prime, Screen Mirroring,
                    WiFi 6, and BT.
                </p>

                <div style={{ margin: "1rem 0" }}>
                    <h3
                        style={{
                            fontSize: "1rem",
                            color: "#00796b",
                            margin: "0",
                        }}
                    >
                        Available Offers:
                    </h3>
                    <ul
                        style={{
                            fontSize: "0.9rem",
                            margin: "0.5rem 0 0 1rem",
                            color: "#444",
                        }}
                    >
                        <li>
                            5% Unlimited Cashback on Flipkart Axis Bank Credit
                            Card
                        </li>
                        <li>10% Off up to ₹750 on HDFC Credit Card EMI</li>
                        <li>Special Price: Get an extra 25% off</li>
                    </ul>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "1rem",
                    }}
                >
                    <button
                        style={{
                            flex: "1",
                            backgroundColor: "#ff9f00",
                            border: "none",
                            color: "white",
                            fontSize: "1rem",
                            padding: "0.7rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ffc107")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ff9f00")
                        }
                    >
                        ADD TO CART
                    </button>
                    <button
                        style={{
                            flex: "1",
                            backgroundColor: "#fb641b",
                            border: "none",
                            color: "white",
                            fontSize: "1rem",
                            padding: "0.7rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#ff5722")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fb641b")
                        }
                    >
                        BUY NOW
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CardDetails;