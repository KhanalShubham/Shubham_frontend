import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Interface to define the structure of the decoded token
interface DecodedToken {
    roles?: string[]; // Optional array of roles
    // You can add other token properties here
}

const Login: React.FC = () => {
    // State hooks for storing email and password entered by the user
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Hook to navigate between pages
    const navigate = useNavigate();
    
    // Destructure the handleSubmit function from react-hook-form
    const { handleSubmit } = useForm<FormData>();

    // Function to handle login submission
    const handleLogin = async () => {
        try {
            // Sending a POST request to the backend for authentication
            const response = await fetch('http://localhost:8082/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password, // Passing user credentials in the request body
                }),
            });

            // Check if the response from the server is successful
            if (response.ok) {
                // Parse the response to extract the token and userId
                const { token, userId } = await response.json();
                
                // Store the token and userId in the browser's localStorage
                localStorage.setItem('token', token);
                localStorage.setItem("userId", userId);

                // Decode the JWT token to extract roles and other data
                const decodedToken: DecodedToken = parseJwt(token);
                console.log('Decoded Token:', decodedToken);

                // Check if the user has an 'admin' role
                if (decodedToken.roles && decodedToken.roles.includes('admin')) {
                    // Navigate to the admin dashboard if the user is an admin
                    navigate(`/admin/products`);
                } else {
                    // Navigate to the regular user dashboard otherwise
                    navigate(`/dashboard`);
                }

                // Show a success message on successful login
                toast.success('Login successful!');
            } else {
                // Handle unsuccessful login (e.g., incorrect credentials)
                console.error('Login failed');
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            // Handle any errors that occur during the login process
            console.error('Error during login:', error);
            toast.error('An error occurred during login.');
        }
    };

    // Function to decode JWT token without using external libraries
    const parseJwt = (token: string) => {
        // Decode the base64 payload of the token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
                .join('')
        );

        // Return the parsed token as a JSON object
        return JSON.parse(jsonPayload) as DecodedToken;
    };

    return (
        <div className="login-container">
            <div className="login-form">
                {/* Header section with logo and title */}
                <div className="login-header">
                    <div className="login-logo">
                        <img
                            src="images/Logo.png"
                            alt="loginlogo"
                        />
                    </div>
                    <div className="login-text">
                        <h1>Login</h1>
                    </div>
                </div>

                {/* Login form submission */}
                <form onSubmit={handleSubmit(handleLogin)}>
                    <div className="login-body">
                        {/* Email input field */}
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password input field */}
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {/* Footer section containing options for forgot password, remember me, etc. */}
                    <div className="login-footer">
                        <div className="login-forgot">
                            <label>
                                <input type="checkbox" name="remember_me" /> Remember me
                            </label>
                            <a href="#">Forgot password?</a>
                        </div>
                        {/* Login button */}
                        <div className="login-btn">
                            <button type="submit">Login</button>
                        </div>
                        {/* Link to registration page for new users */}
                        <div className="login-link">
                            <label>Don't have an account?</label> 
                            <Link to="/register">Register</Link>
                        </div>
                    </div>
                </form>
            </div>
            {/* Container for toast notifications */}
            <ToastContainer />
        </div>
    );
};

export default Login;