import React from 'react';
import { LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import topNavBar from '../Styles/TopNavBar.css'
const TopNavBar = () => {
    const navigate = useNavigate()

    return (
        <div>
            <div
                style={{
                    width: "100vw",
                    height: "70px",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px 0 20px"
                }}>
                <div  style={{ display: "flex", alignItems: "center" }}>
                    <img src="e-logo.png" alt="Logo" className='icon' style={{ marginRight: "10px", cursor: "pointer" }} onClick={() => navigate("/")} />
                    <span className='titleText' style={{ fontWeight: "bold", fontFamily: "cursive" }}>Prince Shopping</span>
                </div>
                <div >
                    {/* <LogoutOutlined style={{ cursor: "pointer", fontSize: "20px", fontWeight: "bold" }} onClick={() => navigate("/newproduct")} /> */}
                    <PlusCircleOutlined className='addIcon' style={{ cursor: "pointer", fontWeight: "bold", marginRight: "15px" }} onClick={() => { navigate("/newproduct"); window.scrollTo(0, 0) }} />
                </div>
            </div>
        </div>
    );
};

export default TopNavBar;