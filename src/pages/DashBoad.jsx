import React from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { Outlet } from "react-router-dom";

function DashBoard() {
    return (
        <>
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

