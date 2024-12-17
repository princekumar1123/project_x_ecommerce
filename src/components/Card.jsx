import React from 'react';
import card from '../Styles/Card.css'

function Card({ title, description, image }) {
    return (
        <div className="card">
            <img src={image} alt={title} className="card-image" />
            <div className="card-content">
                <h5>{title}</h5>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default Card;