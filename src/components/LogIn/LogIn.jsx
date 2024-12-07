import React from "react";

export default function LogIn() {
    return (
        <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
                Login to HamroSahayata
            </h2>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600"
                >
                    Log In
                </button>
            </form>
        </div>
    );
}
