import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LogIn = ({ onLoginSuccess }) => {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (email.length === 0) {
            setError("Email is required");
            return;
        }

        if (password.length === 0) {
            setError("Password is required");
            return;
        }

        const loginSuccess = await loginUser(email, password);

        if (loginSuccess) {
            onLoginSuccess(); // Call the function to close the modal or perform other actions
        } else {
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-semibold text-[#1C9FDD] text-center mb-4">Welcome Back</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <div className="text-red-500">{error}</div>}

                <button
                    type="submit"
                    className="w-full bg-[#1C9FDD] text-white py-2 rounded-md"
                >
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LogIn;