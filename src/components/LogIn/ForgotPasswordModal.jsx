import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ForgotPasswordModal = ({ onClose, switchToLogin }) => {
    const { forgotPassword } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        const { success, message } = await forgotPassword(email);

        if (success) {
            setMessage(message);
        } else {
            setError(message);
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-[#1C9FDD]">Forgot Password</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                {message ? (
                    <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
                        {message}
                        <div className="mt-4">
                            <button
                                onClick={switchToLogin}
                                className="text-[#1C9FDD] hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="mb-4 text-gray-600">
                            Enter your email to receive a password reset link.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                                    required
                                />
                            </div>
                            {error && <div className="mb-4 text-red-500">{error}</div>}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#1C9FDD] text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <button
                                onClick={switchToLogin}
                                className="text-[#1C9FDD] hover:underline"
                            >
                                Remember your password? Login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;