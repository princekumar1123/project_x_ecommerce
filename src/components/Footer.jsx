import { useNavigate } from 'react-router-dom';
import '../Styles/Footer.css';
import React from "react";
const Footer = () => {
    const navigate = useNavigate()
    return (
        <>
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <img src="e-logo.png"
                            alt="Logo"
                            className="footer-logo"
                            style={{ cursor: "pointer" }}
                            onClick={() => { navigate("/"); window.scrollTo(0, 0) }} />
                        <p>Join our community by using our services and grow your business.</p>
                        <button className="contact-button">Contact Us</button>
                        <div className="social-icons">
                            <i className="fab fa-linkedin"></i>
                            <i className="fab fa-twitter"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-facebook"></i>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h3>Get In Touch</h3>
                        <p>
                            <i className="fas fa-map-marker-alt"></i> 811, Gala Empire, Opp.
                            Durdarshan Tower, Thaltej, Ahmedabad-380054
                        </p>
                        <p>
                            <i className="fas fa-envelope"></i> princekumar.bc1197@gmail.com
                        </p>
                        <p>
                            <i className="fas fa-phone"></i> +91-8220016466
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>Overview</li>
                            <li>Career</li>
                            <li>Contact</li>
                            <li>Hire Now</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Company Services</h3>
                        <ul>
                            <li>Web Development</li>
                            <li>UI/UX Design</li>
                            <li>Mobile Development</li>
                            <li>ECommerce Web Development</li>
                            <li>CMS Development</li>
                            <li>Remote Hiring</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>
                        &copy; Copyright 2024 All Rights Reserved by{" "}
                        <b>X Technology Pvt Ltd</b>
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Footer;