import React from "react";
import "../Styles/Card.css";

function Card({ title, description, image, rating, reviews, price, originalPrice, discount }) {
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="card">
            <img src={image} alt={title} className="card-image" />
            <div className="card-content">
                <h5 className="card-title">{title}</h5>
                <p className="card-description">{(description.length>30) ? `${description.slice(0,30)}...`:description}</p>
                <div className="card-rating">
                    {renderStars()}
                    <span className="rating-value">{rating.toFixed(1)}</span>
                    <span className="reviews-count">({reviews})</span>
                </div>
                <div className="card-pricing">
                    <span className="price">₹{price}</span>
                    <span className="original-price">₹{originalPrice.toFixed(2)}</span>
                    <span className="discount">{discount}% off</span>
                </div>
                <div className="card-badge">Assured by Prince</div>
            </div>
        </div>
    );
}

export default Card;