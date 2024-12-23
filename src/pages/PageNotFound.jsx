import React from 'react';
import { useNavigate } from 'react-router-dom';
import pageNotFound from '../Styles/PageNotFound.css'; // Make sure to add the accompanying CSS

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <p className="not-found-message">Oops! The page you are looking for doesn't exist.</p>
                <button className="go-home-button" onClick={() => navigate('/')}>
                    Go to Homepage
                </button>
            </div>
            <div className="not-found-image">
                <img src="pagenotfound.jpg" alt="404 illustration" />
            </div>
        </div>
    );
};

export default PageNotFound;
