import React from 'react';
import bgImage from '../assets/images/background.jpg'; // Adjust the path if needed
import logo from '../assets/images/logo1.jpeg'; // Adjust the path to your logo image

export default function Hero() {
    return (
        <div
            className="h-screen bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Header Section */}
            <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0">
                <div>
                    <img src={logo} alt="Logo" className="h-10 md:h-12" /> {/* Responsive logo size */}
                </div>
                <div className="space-x-2 md:space-x-4">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 md:px-4 md:py-2">
                        Sign In
                    </button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 md:px-4 md:py-2">
                        Start Fundraising
                    </button>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                <h1 className="text-white text-3xl md:text-4xl lg:text-5xl">Welcome to My App</h1>
            </div>
        </div>
    );
}
