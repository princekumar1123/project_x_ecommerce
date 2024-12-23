import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import credential from '../Styles/Credential.css'


const Credential = () => {
    const navigate = useNavigate();

    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        gender: '',
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [isLoginVisible, setIsLoginVisible] = useState(false);

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({ ...prev, [name]: value }));
    };
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message, description) => {
        api.open({
            message,
            description,
            type: 'success',
            duration: 3,
        });
    };
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log('Signup Data:', signupData);
        try {
            const result = await axios.post('https://prince-shoppify-server.onrender.com/user/register', signupData);
            if (result.status === 200) {
                openNotification("Register Successfull", "You have successfully Registered..!");
                setIsLoginVisible(true);
                setSignupData({
                    name: '',
                    email: '',
                    mobile: '',
                    password: '',
                    gender: '',
                });
            }
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login Data:', loginData);
        try {
            const result = await axios.post('https://prince-shoppify-server.onrender.com/user/login', loginData);
            if (result.status === 200) {
                openNotification("Login Successfull", "You have successfully login..!");
                setIsLoginVisible(true);
                setLoginData({
                    email: '',
                    password: '',
                });

                localStorage.setItem("token", JSON.stringify(result.data.token))
                localStorage.setItem("id", JSON.stringify(result.data.id))
                localStorage.setItem("name", JSON.stringify(result.data.name))

                setTimeout(() => {
                    navigate('/')
                }, 1000);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="OverAll">
            <div className="main">
                <input
                    className="loginInput"
                    type="checkbox"
                    id="chk"
                    aria-hidden="true"
                    checked={isLoginVisible}
                    onChange={() => setIsLoginVisible(!isLoginVisible)}
                />
                <div className="signup">
                    <form onSubmit={handleSignUp}>
                        <label className="loginLabel" htmlFor="chk" aria-hidden="true">
                            Sign up
                        </label>
                        <input
                            className="loginInput"
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                            value={signupData.name}
                            onChange={handleSignupChange}
                        />
                        <select
                            className="loginInput"
                            name="gender"
                            value={signupData.gender}
                            onChange={handleSignupChange}
                            required
                        >
                            <option value="" disabled>
                                Select Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <input
                            className="loginInput"
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={signupData.email}
                            onChange={handleSignupChange}
                        />
                        <input
                            className="loginInput"
                            type="tel"
                            name="mobile"
                            placeholder="Mobile"
                            required
                            pattern="\d{10}"
                            value={signupData.mobile}
                            onChange={handleSignupChange}
                        />
                        <input
                            className="loginInput"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            minLength="6"
                            value={signupData.password}
                            onChange={handleSignupChange}
                        />
                        <button className="creBtn" type="submit">
                            Sign up
                        </button>
                    </form>
                </div>

                <div className="login">
                    <form onSubmit={handleLogin}>
                        <label className="loginLabel" htmlFor="chk" aria-hidden="true">
                            Login
                        </label>
                        <input
                            className="loginInput"
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={loginData.email}
                            onChange={handleLoginChange}
                        />
                        <input
                            className="loginInput"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={loginData.password}
                            onChange={handleLoginChange}
                        />
                        <button className="creBtn" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
            {contextHolder}
        </div>
    );
};

export default Credential;