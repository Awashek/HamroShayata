import React, { useState } from "react";

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    
        try {
            const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.email, // or any username logic
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                }),
            });
    
            if (!response.ok) throw new Error("Failed to register");
    
            const data = await response.json();
            console.log("Registration successful:", data);
            alert("Account created successfully!");
        } catch (error) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-[#1C9FDD] text-center mb-4">Create a New Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            required
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
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
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-[#1C9FDD] text-white py-2 rounded-full hover:bg-[#1577A5]"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignUp