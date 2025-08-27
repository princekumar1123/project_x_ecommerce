import React, { useState, useEffect } from 'react';
import { LogoutOutlined, PlusCircleOutlined, MenuOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, notification } from 'antd';
import '../Styles/TopNavBar.css';
import Credential from '../pages/credential';

const TopNavBar = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        const storedName = localStorage.getItem("name") | '-';
        if (storedName) {
            setUserName(JSON.parse(storedName).toUpperCase());
        }
    }, []);

    const showLoading = () => {
        setOpen(true);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const openNotification = (message, description) => {
        api.open({
            message,
            description,
            type: 'success',
            duration: 1,
        });
    };

    return (
        <div className="top-nav-bar">
            <Modal
                footer={null}
                open={open}
                onCancel={() => setOpen(false)}
            >
                <Credential handleClose={handleClose} />
            </Modal>
            <div className="nav-container">
                <div className="nav-left" onClick={() => navigate("/")}>
                    <img src="e-logo.png" alt="Logo" className="icon" />
                    <span className="title-text">Prince Shopify</span>
                </div>
                <div className="nav-right desktop-only">
                    <span style={{ marginRight: "10px" }}>Welcome</span>
                    <span className="user-name">{userName}</span>
                    {localStorage.getItem("token") ? (
                        <LogoutOutlined
                            className="nav-icon logout-icon"
                            onClick={() => {
                                localStorage.clear();
                                navigate("/");
                                openNotification("Successfully Logged out", "You have successfully logged out..!");
                            }}
                        />
                    ) : (
                        <LoginOutlined
                            className="nav-icon login-icon"
                            onClick={() => {
                                showLoading();
                                console.log("login clicked");
                            }}
                        />
                    )}

                    <PlusCircleOutlined
                        className="nav-icon add-icon"
                        onClick={() => {
                            navigate("/newproduct");
                            window.scrollTo(0, 0);
                        }}
                    />
                </div>
                <MenuOutlined
                    className="nav-icon mobile-only hamburger-icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
            </div>
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <div className="menu-item" onClick={() => {
                        navigate("/newproduct");
                        setIsMobileMenuOpen(!isMobileMenuOpen)
                    }}>
                        <PlusCircleOutlined className="menu-icon" />
                        <span>Add Product</span>
                    </div>
                    <div className="menu-item" onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('id');
                        localStorage.removeItem('name');
                        showLoading();
                        setIsMobileMenuOpen(!isMobileMenuOpen);
                    }}>
                        <LogoutOutlined className="menu-icon" />
                        <span>Logout</span>
                    </div>
                    <div className="menu-item"
                        onClick={() => {
                            showLoading();
                            setIsMobileMenuOpen(!isMobileMenuOpen);
                            console.log("login clicked");
                        }}
                    >
                        <LoginOutlined className="menu-icon" />
                        <span>Login</span>
                    </div>
                </div>
            )}
            {contextHolder}
        </div>
    );
};

export default TopNavBar;