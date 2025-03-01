import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";  // Importing useNavigate
import AuthContext from "../../context/Authcontext";

const LogIn = () => {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();  // Initializing navigate function

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
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (email.length === 0) {
            setError("Email is required");
            return;
        }

        if (password.length === 0) {
            setError("Password is required");
            return;
        }

        // Call loginUser to perform the login action
        const loginSuccess = await loginUser(email, password);

        // If login is successful, navigate to home page (root route '/')
        if (loginSuccess) {
            navigate("/");  // Navigates to the home page, which is the root '/'
        } else {
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-4 text-center text-[#1C9FDD]">
                Login to HamroSahayata
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-[#1C9FDD] text-white py-2 rounded-full hover:bg-[#1577A5]"
                >
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LogIn;
