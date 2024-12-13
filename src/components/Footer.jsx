// import { Col, Row } from "antd";
// import Link from "antd/es/typography/Link";
// import { AiOutlineShop } from "react-icons/ai";
// import { PiShootingStarBold } from "react-icons/pi";
// import { TbHelp } from "react-icons/tb";
// import { PiFacebookLogo } from "react-icons/pi";
// import { FaXTwitter } from "react-icons/fa6";
// import { TbBrandYoutube } from "react-icons/tb";
import '../Styles/Footer.css';

// const Footer = () => {
//     return (
//         <div className="footer">
//             <Row className="footerInfo" gutter={[16, 16]}>
//                 <Col xs={24} md={15} className="leftFooterContent">
//                     <Row gutter={[16, 16]}>
//                         <Col xs={24} sm={12} md={6}>
//                             <p className="footerTitle">ABOUT</p>
//                             <Link className="footerContent">Contact Us</Link>
//                             <Link className="footerContent">About Us</Link>
//                             <Link className="footerContent">Careers</Link>
//                             <Link className="footerContent">Flipkart Stories</Link>
//                             <Link className="footerContent">Press</Link>
//                             <Link className="footerContent">Corporate Information</Link>
//                         </Col>
//                         <Col xs={24} sm={12} md={6}>
//                             <p className="footerTitle">GROUP COMPANIES</p>
//                             <Link className="footerContent">Myntra</Link>
//                             <Link className="footerContent">Cleartrip</Link>
//                             <Link className="footerContent">Shopsy</Link>
//                         </Col>
//                         <Col xs={24} sm={12} md={6}>
//                             <p className="footerTitle">HELP</p>
//                             <Link className="footerContent">Payments</Link>
//                             <Link className="footerContent">Shipping</Link>
//                             <Link className="footerContent">Cancellation & Returns</Link>
//                             <Link className="footerContent">FAQ</Link>
//                         </Col>
//                         <Col xs={24} sm={12} md={6}>
//                             <p className="footerTitle">CONSUMER POLICY</p>
//                             <Link className="footerContent">Cancellation & Returns</Link>
//                             <Link className="footerContent">Terms Of Use</Link>
//                             <Link className="footerContent">Security</Link>
//                             <Link className="footerContent">Privacy</Link>
//                             <Link className="footerContent">Sitemap</Link>
//                             <Link className="footerContent">Grievance Redressal</Link>
//                             <Link className="footerContent">EPR Compliance</Link>
//                         </Col>
//                     </Row>
//                 </Col>
//                 <Col xs={24} md={9}>
//                     <Row gutter={[16, 16]}>
//                         <Col xs={24} sm={12}>
//                             <p className="footerTitle">Mail Us:</p>
//                             <Link className="footerContent">Flipkart Internet Private Limited,</Link>
//                             <Link className="footerContent">Building Alyssa, Begonia &</Link>
//                             <Link className="footerContent">Clove Embassy Tech Village,</Link>
//                             <Link className="footerContent">Outer Ring Road, Devarabeesanahalli Village,</Link>
//                             <Link className="footerContent">Bengaluru, 560103,</Link>
//                             <Link className="footerContent">Karnataka, India</Link>
//                             <p className="footerTitle">Social:</p>
//                             <Link className="footerLogoContent"><PiFacebookLogo size={25} color="white" /></Link>
//                             <Link className="footerLogoContent"><FaXTwitter size={25} color="white" /></Link>
//                             <Link className="footerLogoContent"><TbBrandYoutube size={25} color="white" /></Link>
//                         </Col>
//                         <Col xs={24} sm={12}>
//                             <p className="footerTitle">Registered Office Address:</p>
//                             <Link className="footerContent">Flipkart Internet Private Limited,</Link>
//                             <Link className="footerContent">Building Alyssa, Begonia &</Link>
//                             <Link className="footerContent">Clove Embassy Tech Village,</Link>
//                             <Link className="footerContent">Outer Ring Road, Devarabeesanahalli Village,</Link>
//                             <Link className="footerContent">Bengaluru, 560103,</Link>
//                             <Link className="footerContent">Karnataka, India</Link>
//                             <Link className="footerContent">CIN : U51109KA2012PTC066107</Link>
//                             <Link className="footerContent">Telephone: <Link className="mobileNumbers">044-45614700</Link> / <Link className="mobileNumbers">044-67415800</Link></Link>
//                         </Col>
//                     </Row>
//                 </Col>
//             </Row>
//             <Row className="footerInfo" justify="space-evenly" gutter={[16, 16]}>
//                 <Col>
//                     <AiOutlineShop color="gold" size={15} className="footerIcon" /> <Link className="footerContent">Seller</Link>
//                 </Col>
//                 <Col>
//                     <PiShootingStarBold color="gold" size={15} className="footerIcon" /> <Link className="footerContent">Advertise</Link>
//                 </Col>
//                 <Col>
//                     <TbHelp color="gold" size={15} className="footerIcon" /> <Link className="footerContent">Help Center</Link>
//                 </Col>
//                 <Col>
//                     <p className="footerContent">&copy; 2024 localhost:3000</p>
//                 </Col>
//                 <Col>
//                     <Row gutter={[8, 8]}>
//                         <Col><img src="visa.png" alt="visa" width={33} height={19} /></Col>
//                         <Col><img src="masterCard.png" alt="MasterCard" width={33} height={19} /></Col>
//                         <Col><img src="rupay.png" alt="Rupay" width={33} height={19} /></Col>
//                         <Col><img src="americanExpress.png" alt="AmericanExpress" width={33} height={19} /></Col>
//                         <Col><img src="discover.png" alt="Discover" width={33} height={19} /></Col>
//                         <Col><img src="cashOnDelivery.png" alt="cashOnDelivery" width={33} height={19} /></Col>
//                         <Col><img src="emiOption.png" alt="emiOption" width={33} height={19} /></Col>
//                     </Row>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default Footer;


import React from "react";
// import "./Footer.css";

const Footer = () => {
    return (

<>
  <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <img src="e-logo.png" alt="Logo" className="footer-logo" />
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
                        <i className="fas fa-envelope"></i> info@x.com
                    </p>
                    <p>
                        <i className="fas fa-phone"></i> +91-63-57-5050-11
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
