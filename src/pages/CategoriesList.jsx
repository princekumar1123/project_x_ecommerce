import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import axios from "axios";

function CategoriesList() {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { state } = useLocation();
    const { category } = state;

    console.log("state", category);

    const headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        axios
            .get("https://prince-shoppify-server.onrender.com/ecommerce/getproducts", {
                headers,
            })
            .then((response) => {
                setAllData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const cards = allData.filter((e) => e.category === category);
    const navigate = useNavigate();

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2%", fontFamily: "cursive" }}>
                <h1>{category}</h1>
            </div>
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                        fontSize: "1.5rem",
                        color: "#555",
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : (
                <div
                    style={{
                        width: "100vw",
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        padding: "0.6%",
                    }}
                >
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            style={{
                                padding: "10px",
                                display: "flex",
                                justifyContent: "center",
                            }}
                            onClick={() => {
                                navigate("/detail", { state: { id: card._id } });
                            }}
                        >
                            <Card
                                title={card.title}
                                description={card.description}
                                image={card.image[0]}
                                rating={card.rating}
                                reviews={card.review.length}
                                price={Math.round(
                                    card.maxPrice - (card.discount / 100) * card.maxPrice
                                )}
                                originalPrice={card.maxPrice}
                                discount={card.discount}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default CategoriesList;