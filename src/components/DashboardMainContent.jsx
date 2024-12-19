import { Divider } from "antd";
import ResponsiveCarousel from "./MultiCarousel";
import SingleCarousel from "./Carousel";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardMainContent() {
    const [allData, setAllData] = useState([]);
    const navigate = useNavigate();

    const headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    };

    useEffect(() => {
        axios
            .get("https://prince-shoppify-server.onrender.com/ecommerce/getproducts", {
                headers,
            })
            .then((response) => {
                setAllData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const categories = [...new Set(allData.map((item) => item.category))];

    return (
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <SingleCarousel />
            </div>
            {categories.map((category, index) => (
                <div key={index}>
                    <h1
                        style={{ textAlign: "center", margin: "20px 0", fontFamily: "cursive", cursor: "pointer" }}
                        onClick={() => navigate("/category", { state: { category } })}
                    >
                        {category}
                    </h1>
                    {/* index % 2 === 0 */}
                    <ResponsiveCarousel data={allData.filter((item) => item.category === category)} dir={false} />
                    <div style={{ margin: "0 auto", width: "80%", marginTop: "4%" }}>
                        <Divider style={{ borderColor: "#1A3757" }}>exclusive {category}</Divider>
                    </div>
                </div>
            ))}
        </>
    );
}

export default DashboardMainContent;