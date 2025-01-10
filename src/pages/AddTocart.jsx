import React, { useEffect, useState } from "react";
import addToCart from '../Styles/AddToCart.css'
import axios from "axios";
import { useParams } from "react-router-dom";


const mockProducts = [
    {
        title: "OnePlus Nord 3 5G",
        quantity: 1,
        offers: ["Free delivery", "10% off on card payment"],
        description: "A powerful phone for your needs.",
        maxPrice: 33999,
        discount: 11009,
        image: ["https://via.placeholder.com/80"],
        rating: 4.5,
        review: ["Excellent product"],
        sellerName: "BrandAura",
        colors: ["Green", "Blue"],
        category: "Electronics",
    },
    {
        title: "Chemist at Play Gentle Exfoliating Face Scrub",
        quantity: 1,
        offers: ["40% off", "Free shipping"],
        description: "Exfoliating face scrub for smooth skin.",
        maxPrice: 349,
        discount: 140,
        image: ["https://via.placeholder.com/80"],
        rating: 4.2,
        review: ["Nice scrub"],
        sellerName: "OnestoLabs",
        colors: [],
        category: "Beauty",
    },
];
const x = mockProducts

const AddToCart = ({ products }) => {
    const params = useParams()
    const [data, setData] = useState([])
    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`https://prince-shoppify-server.onrender.com/ecommerce/getproductbyid/${params.id}`)
            setData(Array.isArray(response.data) ? response.data : [response.data]);
            console.log('data', response.data);


        }
        fetchData()
    }, [])

    products = x

    const calculatePriceDetails = (products) => {
        const totalOriginalPrice = products.reduce(
            (sum, product) => sum + product.maxPrice * product.quantity,
            0
        );
        const totalDiscount = products.reduce(
            (sum, product) => sum + product.discount * product.quantity,
            0
        );
        const finalAmount = totalOriginalPrice - totalDiscount;

        return { totalOriginalPrice, totalDiscount, finalAmount };
    };

    const { totalOriginalPrice, totalDiscount, finalAmount } = calculatePriceDetails(products);

    return (
        <div className="cart-container">
            <div className="cart-items">
                {data?.map((product) => (
                    <div className="cart-item" key={product.title}>
                        <img
                            src={product.image[0]}
                            alt={product.title}
                            className="cart-item-image"
                        />
                        <div className="cart-item-details">
                            <h4>{product.title}</h4>
                            <p className="seller">Seller: {product.sellerName}</p>
                            <p className="price">₹{product.maxPrice - product.discount}</p>
                            <p className="offers">
                                {product.offers.length > 0
                                    ? product.offers.map((offer, index) => (
                                        <span key={index} style={{ display: "block" }}>
                                           ☆ {offer}
                                        </span>
                                    ))
                                    : "No offers available"}
                            </p>
                            <button className="remove-btn">Remove</button>
                        </div>
                        <div className="cart-item-price-details">
                            <p>Quantity: {product.quantity}</p>
                            <p className="original-price">
                                <span>₹{product.maxPrice}</span>
                            </p>
                            <p className="discount">Discount: ₹{product.discount}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="price-details">
                <h3>Price Details</h3>
                <p>Total Price: ₹{totalOriginalPrice}</p>
                <p>Discount: ₹{totalDiscount}</p>
                <p className="final-amount">
                    <strong>Total Amount: ₹{finalAmount}</strong>
                </p>
                <button className="place-order-btn">Place Order</button>
            </div>
        </div>
    );
};

export default AddToCart;
