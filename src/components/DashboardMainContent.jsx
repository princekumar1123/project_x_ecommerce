import { Divider } from "antd"
import ResponsiveCarousel from "./MultiCarousel"
import SingleCarousel from "./Carousel"
import { useNavigate } from "react-router-dom"

function DashboardMainContent(dir) {
    const navigate = useNavigate()
    return (
        <>
            <div style={{ position: 'relative', width: '100%' }}>
                <SingleCarousel />
            </div>
            <div>
                <h1 style={{ textAlign: 'center', margin: '20px 0', cursor: "pointer", fontFamily: "cursive" }} onClick={() => navigate("/category")}>Electronic Appliances</h1>
                <ResponsiveCarousel dir={true} />
            </div>
            <div style={{ margin: '0 auto', width: '80%', marginTop: "4%" }}>
                <Divider style={{ borderColor: '#1A3757' }}>exclusive electronic appliances</Divider>
            </div>
            <div>
                <h1 style={{ textAlign: 'center', margin: '20px 0', fontFamily: "cursive" }}>Furniture</h1>
                <ResponsiveCarousel dir={false} />
            </div>
            <div style={{ margin: '0 auto', width: '80%', marginTop: "4%" }}>
                <Divider style={{ borderColor: '#1A3757' }}>exclusive furniture</Divider>
            </div>
            <div>
                <h1 style={{ textAlign: 'center', margin: '20px 0', fontFamily: "cursive" }}>Kitchen Jewellery</h1>
                <ResponsiveCarousel dir={true} />
            </div>
            <div style={{ margin: '0 auto', width: '80%', marginTop: "4%" }}>
                <Divider style={{ borderColor: '#1A3757' }}>exclusive kitchen jewellery</Divider>
            </div>
            <div>
                <h1 style={{ textAlign: 'center', margin: '20px 0', fontFamily: "cursive" }}>Plastic Items</h1>
                <ResponsiveCarousel dir={false} />
            </div>
        </>
    )
}

export default DashboardMainContent