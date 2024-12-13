import React from 'react';
import  { LogoutOutlined} from '@ant-design/icons';
const TopNavBar = () => {
    return (
        <div>
            <div style={{
                width: "98.9vw",
                height: "70px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px"
            }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src="e-logo.png" alt="Logo" style={{ width: "85px", marginRight: "10px" }} />
                    <span style={{ fontSize: "25px", fontWeight: "bold" }}>X Shopping</span>
                </div>
                <div >
                <LogoutOutlined style={{cursor:"pointer", fontSize:"20px",fontWeight:"bold"}} />
                    {/* <button className='btn btn-danger' style={{ width: '80px' }}>Logout</button> */}

                </div>
            </div>
        </div>
    );
};

export default TopNavBar;
