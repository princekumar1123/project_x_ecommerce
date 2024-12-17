import React, { useState } from 'react';
import credential from '../Styles/Credential.css'

const Credential = () => {
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log('Signup Data:', signupData);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login Data:', loginData);
    };

    return (
        <div className="OverAll">
            <div className="main">
                <input className={"loginInput"} type="checkbox" id="chk" aria-hidden="true" />
                <div className="signup">
                    <form onSubmit={handleSignUp}>
                        <label className='loginLabel' htmlFor="chk" aria-hidden="true">
                            Sign up
                        </label>
                        <input className="loginInput"
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                            value={signupData.name}
                            onChange={handleSignupChange}
                        />
                        <input className="loginInput"
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={signupData.email}
                            onChange={handleSignupChange}
                        />
                        <input className="loginInput"
                            type="tel"
                            name="mobile"
                            placeholder="Mobile"
                            required
                            value={signupData.mobile}
                            onChange={handleSignupChange}
                        />
                        <input className="loginInput"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={signupData.password}
                            onChange={handleSignupChange}
                        />
                        <button className='creBtn' type="submit">Sign up</button>
                    </form>
                </div>

                <div className="login">
                    <form onSubmit={handleLogin}>
                        <label className='loginLabel' htmlFor="chk" aria-hidden="true">
                            Login
                        </label>
                        <input className="loginInput"
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={loginData.email}
                            onChange={handleLoginChange}
                        />
                        <input className="loginInput"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={loginData.password}
                            onChange={handleLoginChange}
                        />
                        <button className='creBtn' type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Credential;
