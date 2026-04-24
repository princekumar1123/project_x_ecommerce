import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import axiosInstance from "../api/axiosInstance";
import "../Styles/Credential.css";

const Credential = ({ handleClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();
    const [activeTab, setActiveTab] = useState("login");
    const [loading, setLoading] = useState(false);

    const [signupData, setSignupData] = useState({
        name: "", email: "", mobile: "", password: "", gender: "",
    });

    const [loginData, setLoginData] = useState({
        email: "", password: "",
    });

    const openNotification = (type, message, description) => {
        api.open({ type, message, description, duration: 3 });
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await axiosInstance.post("/user/register", signupData);
            if (result.status === 201) {
                openNotification("success", "Registered Successfully!", "You can now log in with your credentials.");
                setActiveTab("login");
                setSignupData({ name: "", email: "", mobile: "", password: "", gender: "" });
            }
        } catch (error) {
            const msg = error.response?.data?.error?.message || error.response?.data?.errors?.[0]?.msg || "Registration failed. Please try again.";
            openNotification("error", "Registration Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await axiosInstance.post("/user/login", loginData);
            if (result.data.status) {
                dispatch(loginSuccess({
                    token: result.data.token,
                    id: result.data.id,
                    name: result.data.name,
                    role: result.data.role,
                }));
                openNotification("success", "Welcome back!", `Logged in as ${result.data.name}`);
                setLoginData({ email: "", password: "" });
                if (handleClose) handleClose();
                setTimeout(() => navigate("/"), 600);
            } else {
                openNotification("error", "Login Failed", "Invalid email or password.");
            }
        } catch (error) {
            const msg = error.response?.data?.error?.message || error.response?.data?.errors?.[0]?.msg || "Login failed. Please try again.";
            openNotification("error", "Login Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            {/* Brand panel */}
            <div className="auth-brand-panel">
                <img src="e-logo.png" alt="Ecom Shopify" />
                <h2>Ecom Shopify</h2>
                <p>Your one-stop shop for everything you need</p>
            </div>

            {/* Form panel */}
            <div className="auth-form-panel">
                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
                        onClick={() => setActiveTab("signup")}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Login form */}
                {activeTab === "login" && (
                    <div className="auth-form-body">
                        <h3>Welcome back</h3>
                        <form onSubmit={handleLogin}>
                            <div className="auth-field">
                                <label>Email</label>
                                <input
                                    className="auth-input"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    required
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                />
                            </div>
                            <div className="auth-field">
                                <label>Password</label>
                                <input
                                    className="auth-input"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                />
                            </div>
                            <button className="auth-submit-btn" type="submit" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        <div className="auth-switch">
                            Don't have an account?{" "}
                            <button onClick={() => setActiveTab("signup")}>Sign up</button>
                        </div>
                    </div>
                )}

                {/* Signup form */}
                {activeTab === "signup" && (
                    <div className="auth-form-body">
                        <h3>Create account</h3>
                        <form onSubmit={handleSignUp}>
                            <div className="auth-field">
                                <label>Full Name</label>
                                <input
                                    className="auth-input"
                                    type="text"
                                    name="name"
                                    placeholder="Your full name"
                                    required
                                    value={signupData.name}
                                    onChange={handleSignupChange}
                                />
                            </div>
                            <div className="auth-field">
                                <label>Email</label>
                                <input
                                    className="auth-input"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    required
                                    value={signupData.email}
                                    onChange={handleSignupChange}
                                />
                            </div>
                            <div className="auth-field">
                                <label>Mobile (10 digits)</label>
                                <input
                                    className="auth-input"
                                    type="tel"
                                    name="mobile"
                                    placeholder="9876543210"
                                    required
                                    pattern="\d{10}"
                                    value={signupData.mobile}
                                    onChange={handleSignupChange}
                                />
                            </div>
                            <div className="auth-field">
                                <label>Gender</label>
                                <select
                                    className="auth-select"
                                    name="gender"
                                    value={signupData.gender}
                                    onChange={handleSignupChange}
                                    required
                                >
                                    <option value="" disabled>Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="auth-field">
                                <label>Password</label>
                                <input
                                    className="auth-input"
                                    type="password"
                                    name="password"
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength="6"
                                    value={signupData.password}
                                    onChange={handleSignupChange}
                                />
                            </div>
                            <button className="auth-submit-btn" type="submit" disabled={loading}>
                                {loading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>
                        <div className="auth-switch">
                            Already have an account?{" "}
                            <button onClick={() => setActiveTab("login")}>Login</button>
                        </div>
                    </div>
                )}
            </div>
            {contextHolder}
        </div>
    );
};

export default Credential;
