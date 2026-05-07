import { Divider, Spin } from "antd";
import ResponsiveCarousel from "./MultiCarousel";
import SingleCarousel from "./Carousel";
import RecentlyViewed from "./RecentlyViewed";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function DashboardMainContent() {
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
            .get("/ecommerce/getproducts?limit=100")
            .then((response) => {
                // API now returns { products: [...], total, page, totalPages }
                const products = response.data.products || response.data;
                setAllData(products);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const categories = [...new Set(allData.map((item) => item.category))];

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <SingleCarousel />
            </div>

            {allData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "#888", fontSize: "1.2rem" }}>
                    No products available yet.
                </div>
            ) : (
                categories.map((category, index) => (
                    <div key={index}>
                        <h1
                            style={{
                                textAlign: "center",
                                margin: "20px 0",
                                fontFamily: "cursive",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/category", { state: { category } })}
                        >
                            {category}
                        </h1>
                        <ResponsiveCarousel
                            data={allData.filter((item) => item.category === category)}
                            dir={false}
                        />
                        <div style={{ margin: "0 auto", width: "80%", marginTop: "4%" }}>
                            <Divider style={{ borderColor: "#1A3757" }}>
                                exclusive {category}
                            </Divider>
                        </div>
                    </div>
                ))
            )}

            {/* Recently Viewed — shown at the bottom after all categories */}
            <RecentlyViewed />
        </>
    );
}

export default DashboardMainContent;
