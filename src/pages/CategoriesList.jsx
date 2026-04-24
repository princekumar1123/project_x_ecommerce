import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import axiosInstance from "../api/axiosInstance";
import PageHeader from "../components/PageHeader";

function CategoriesList() {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Can come from nav state (category click) or search query param
    const category = state?.category || "";
    const searchQuery = searchParams.get("search") || "";

    const pageTitle = searchQuery
        ? `Search: "${searchQuery}"`
        : category || "All Products";

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);

        const params = new URLSearchParams({ limit: 100 });
        if (category) params.set("category", category);
        if (searchQuery) params.set("search", searchQuery);

        axiosInstance
            .get(`/ecommerce/getproducts?${params.toString()}`)
            .then((response) => {
                const products = response.data.products || response.data;
                setAllData(products);
            })
            .catch((error) => console.error("Error fetching data:", error))
            .finally(() => setLoading(false));
    }, [category, searchQuery]);

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem" }}>
            <PageHeader
                title={pageTitle}
                subtitle={!loading ? `${allData.length} product${allData.length !== 1 ? "s" : ""} found` : undefined}
                backTo="/"
                backLabel="Back to Home"
            />

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <Spin size="large" />
                </div>
            ) : allData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "#888", fontSize: "1.1rem" }}>
                    No products found.
                </div>
            ) : (
                <div style={{ width: "100vw", display: "flex", justifyContent: "center", flexWrap: "wrap", padding: "0.6%" }}>
                    {allData.map((card, index) => (
                        <div
                            key={index}
                            style={{ padding: "10px", display: "flex", justifyContent: "center", cursor: "pointer" }}
                            onClick={() => navigate("/detail", { state: { id: card._id } })}
                        >
                            <Card
                                title={card.title}
                                description={card.description}
                                image={card.image[0]}
                                rating={card.rating}
                                reviews={card.review.length}
                                price={Math.round(card.maxPrice - (card.discount / 100) * card.maxPrice)}
                                originalPrice={card.maxPrice}
                                discount={card.discount}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoriesList;
