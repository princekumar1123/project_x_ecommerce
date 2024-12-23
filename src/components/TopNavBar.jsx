// // import React from 'react';
// // import { LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
// // import { useNavigate } from 'react-router-dom';

// // import topNavBar from '../Styles/TopNavBar.css'
// // import { useState } from 'react';
// // const TopNavBar = () => {
// //     const navigate = useNavigate()

// //     let userName = ""

// //     useState(() => {
// //         userName = JSON.parse(localStorage.getItem("name")).toUpperCase()
// //     }, [])

// //     return (
// //         <div>
// //             <div
// //                 style={{
// //                     width: "100vw",
// //                     height: "70px",
// //                     backgroundColor: "#FFFFFF",
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "space-between",
// //                     padding: "0 20px 0 20px"
// //                 }}>
// //                 <div style={{ display: "flex", alignItems: "center" }}>
// //                     <img src="e-logo.png" alt="Logo" className='icon' style={{ marginRight: "10px", cursor: "pointer" }} onClick={() => navigate("/")} />
// //                     <span className='titleText' style={{ fontWeight: "bold", fontFamily: "cursive" }}>Prince Metal Mart</span>
// //                 </div>
// //                 <div >
// //                     <span>Welcome</span> <span style={{marginRight:"10px"}}>{userName}</span>
// //                     <LogoutOutlined style={{ cursor: "pointer", fontSize: "26px", marginRight: "10px", fontWeight: "bold" }} onClick={() => { localStorage.removeItem('token'); navigate("/credential"); localStorage.removeItem("id") }} />
// //                     <PlusCircleOutlined className='addIcon' style={{ cursor: "pointer", fontWeight: "bold", marginRight: "15px" }} onClick={() => { navigate("/newproduct"); window.scrollTo(0, 0) }} />
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default TopNavBar;

// import React, { useState, useEffect } from 'react';
// import { LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import '../Styles/TopNavBar.css'; // Ensure this file contains responsive styles.

// const TopNavBar = () => {
//     const navigate = useNavigate();
//     const [userName, setUserName] = useState("");

//     useEffect(() => {
//         const storedName = localStorage.getItem("name");
//         if (storedName) {
//             setUserName(JSON.parse(storedName).toUpperCase());
//         }
//     }, []);

//     return (
//         <div className="top-nav-bar">
//             <div className="nav-container">
//                 {/* Logo and title */}
//                 <div className="nav-left" onClick={() => navigate("/")}>
//                     <img src="e-logo.png" alt="Logo" className="icon" />
//                     <span className="title-text">Prince Metal Mart</span>
//                 </div>

//                 {/* User controls */}
//                 <div className="nav-right">
//                     <span>Welcome</span> 
//                     <span className="user-name">{userName}</span>
//                     <LogoutOutlined 
//                         className="nav-icon logout-icon" 
//                         onClick={() => {
//                             localStorage.removeItem('token');
//                             localStorage.removeItem('id');
//                             navigate("/credential");
//                         }} 
//                     />
//                     <PlusCircleOutlined 
//                         className="nav-icon add-icon" 
//                         onClick={() => {
//                             navigate("/newproduct");
//                             window.scrollTo(0, 0);
//                         }} 
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TopNavBar;


// import React, { useState, useEffect } from 'react';
// import { LogoutOutlined, PlusCircleOutlined, MenuOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import '../Styles/TopNavBar.css'; // Updated CSS for mobile responsiveness.

// const TopNavBar = () => {
//     const navigate = useNavigate();
//     const [userName, setUserName] = useState("");
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     useEffect(() => {
//         const storedName = localStorage.getItem("name");
//         if (storedName) {
//             setUserName(JSON.parse(storedName).toUpperCase());
//         }
//     }, []);

//     return (
//         <div className="top-nav-bar">
//             <div className="nav-container">
//                 {/* Logo and title */}
//                 <div className="nav-left" onClick={() => navigate("/")}>
//                     <img src="e-logo.png" alt="Logo" className="icon" />
//                     <span className="title-text">Prince Metal Mart</span>
//                 </div>

//                 {/* User controls for desktop */}
//                 <div className="nav-right desktop-only">
//                     <span>Welcome</span> 
//                     <span className="user-name">{userName}</span>
//                     <LogoutOutlined 
//                         className="nav-icon logout-icon" 
//                         onClick={() => {
//                             localStorage.removeItem('token');
//                             localStorage.removeItem('id');
//                             navigate("/credential");
//                         }} 
//                     />
//                     <PlusCircleOutlined 
//                         className="nav-icon add-icon" 
//                         onClick={() => {
//                             navigate("/newproduct");
//                             window.scrollTo(0, 0);
//                         }} 
//                     />
//                 </div>

//                 {/* Hamburger menu for mobile */}
//                 <MenuOutlined 
//                     className="nav-icon mobile-only hamburger-icon" 
//                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
//                 />
//             </div>

//             {/* Mobile menu */}
//             {isMobileMenuOpen && (
//                 <div className="mobile-menu">
//                     <div className="menu-item" onClick={() => navigate("/newproduct")}>
//                         <PlusCircleOutlined className="menu-icon" />
//                         <span>Add Product</span>
//                     </div>
//                     <div className="menu-item" onClick={() => {
//                         localStorage.removeItem('token');
//                         localStorage.removeItem('id');
//                         navigate("/credential");
//                     }}>
//                         <LogoutOutlined className="menu-icon" />
//                         <span>Logout</span>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TopNavBar;
import React, { useState, useEffect } from 'react';
import { LogoutOutlined, PlusCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../Styles/TopNavBar.css'; // Updated CSS for mobile responsiveness and color animations.

const TopNavBar = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        if (storedName) {
            setUserName(JSON.parse(storedName).toUpperCase());
        }
    }, []);

    return (
        <div className="top-nav-bar">
            <div className="nav-container">
                {/* Logo and title */}
                <div className="nav-left" onClick={() => navigate("/")}>
                    <img src="e-logo.png" alt="Logo" className="icon" />
                    <span className="title-text">Prince Metal Mart</span>
                </div>

                {/* User controls for desktop */}
                <div className="nav-right desktop-only">
                    <span style={{marginRight:"10px"}}>Welcome</span> 
                    <span className="user-name">{userName}</span>
                    <LogoutOutlined 
                        className="nav-icon logout-icon" 
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('id');
                            localStorage.removeItem('name');

                            navigate("/credential");
                        }} 
                    />
                    <PlusCircleOutlined 
                        className="nav-icon add-icon" 
                        onClick={() => {
                            navigate("/newproduct");
                            window.scrollTo(0, 0);
                        }} 
                    />
                </div>

                {/* Hamburger menu for mobile */}
                <MenuOutlined 
                    className="nav-icon mobile-only hamburger-icon" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                />
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <div className="menu-item" onClick={() => navigate("/newproduct")}>
                        <PlusCircleOutlined className="menu-icon" />
                        <span>Add Product</span>
                    </div>
                    <div className="menu-item" onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('id');
                        navigate("/credential");
                    }}>
                        <LogoutOutlined className="menu-icon" />
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopNavBar;
