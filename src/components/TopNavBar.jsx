import React from 'react';
import {  PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const TopNavBar = () => {
    const navigate = useNavigate()

    return (
        <div>
            <div style={{
                width: "100vw",
                height: "70px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px 0 20px"
            }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="e-logo.png" alt="Logo" style={{ width: "85px", marginRight: "10px", cursor: "pointer" }} onClick={() => navigate("/")} />
                    <span style={{ fontSize: "25px", fontWeight: "bold", fontFamily: "cursive" }}>X Shopping</span>
                </div>
                <div >
                    {/* <LogoutOutlined style={{ cursor: "pointer", fontSize: "20px", fontWeight: "bold" }} onClick={() => navigate("/newproduct")} /> */}
                    <PlusCircleOutlined style={{ cursor: "pointer", fontSize: "25px", fontWeight: "bold", marginRight:"15px" }} onClick={() => navigate("/newproduct")} />
                </div>
            </div>
        </div>
    );
};

export default TopNavBar;