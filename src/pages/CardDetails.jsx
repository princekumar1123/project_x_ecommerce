import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';


function CardDetails() {
    const [cardData, setCardData] = useState(null);
    const [mainImage, setMainImage] = useState(null);


    const { state } = useLocation();
    const { id } = state; 

    console.log("id",id);
    

    useEffect(() => {
        window.scrollTo(0,0)
        const headers = {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
        };

        // axios.get('http://192.168.1.120:9000/ecommerce/getproducts').then((response) => {
        // axios.get('https://d8a1-117-202-0-167.ngrok-free.app/ecommerce/getproducts', { headers }).then((response) => {
        axios.get(`https://prince-shoppify-server.onrender.com/ecommerce/getproductbyid/${id}`, { headers }).then((response) => {


            console.log("res", response.data);
            const fetchedData = response.data;
            setCardData(fetchedData);
            setMainImage(fetchedData.image[0]); // Set the main image after fetching
            window.scrollTo(0, 0)
        });
    }, []);

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    if (!cardData) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontSize: "1.5rem",
                    color: "#555",
                }}
            >
                
                <Spin size="large" />

            </div>
        );
    }

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
                animation: "fadeIn 1s ease-in-out",
            }}
        >
            <div
                style={{
                    flex: "1 1 300px",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "1rem",
                }}
            >
                <img
                    src={mainImage || "placeholder.jpg"} // Fallback to a placeholder
                    alt="Product"
                    className="mainImage"
                    style={{
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        marginBottom: "1rem",
                        width: "250px",
                        height: "250px",
                        objectFit: "cover",
                    }}
                />
                <div
                    className="multiImage"
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        justifyContent: "center",
                    }}
                >
                    {cardData.image.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                border: mainImage === img ? "2px solid #5385EA" : "1px solid #ccc",
                            }}
                            onClick={() => handleImageClick(img)}
                        />
                    ))}
                </div>
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
                    {cardData.title}
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
                        ₹{Math.round(cardData.maxPrice - cardData.maxPrice / cardData.discount)}
                    </span>
                    <span
                        style={{
                            textDecoration: "line-through",
                            color: "#888",
                        }}
                    >
                        ₹{cardData.maxPrice}
                    </span>
                    <span
                        style={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                        }}
                    >
                        {cardData.discount}% off
                    </span>
                </div>

                <p
                    style={{
                        fontSize: "1rem",
                        margin: "0",
                        color: "#555",
                    }}
                >
                    {cardData.description}
                </p>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        margin: "1rem 0",
                    }}
                >
                    {[...Array(5)].map((_, index) => (
                        <span
                            key={index}
                            style={{
                                color: index < cardData.rating ? "#ffb400" : "#ccc",
                                fontSize: "1.2rem",
                            }}
                        >
                            ★
                        </span>
                    ))}
                    <span style={{ fontSize: "1rem", color: "#555" }}>
                        ({cardData.rating})
                    </span>
                </div>

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
                        {cardData.offers.map((offer, index) => (
                            <li key={index}>{offer}</li>
                        ))}
                    </ul>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        margin: "1rem 0",
                    }}
                >
                    {cardData.colors.map((color, index) => (
                        <div
                            key={index}
                            style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: color,
                                border: "1px solid #ccc",
                            }}
                        ></div>
                    ))}
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
                    >
                        BUY NOW
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CardDetails;