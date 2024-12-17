import React from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { Outlet } from "react-router-dom";

function DashBoard() {
    let x = new Date()
    console.log("my time",x)
    
    return (
        <>
        {{x}}
            <div style={{ position: "sticky", top: 0, zIndex: 1111, width: "100vw" }}>
                <TopNavBar />
            </div>
            <Outlet />
            <div>
                <Footer />
            </div>
        </>
    );
}
export default DashBoard;

