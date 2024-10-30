import React from 'react';
import bgImage from '../../assets/images/background.jpg'; // Adjust the path if needed
import logo from '../../assets/images/logo.png'; // Adjust the path to your logo image

export default function Hero() {
    return (
        <div
            className="h-screen bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
        {/* Header Section */}
            <div className="flex items-center justify-between absolute top-0 left-0 right-0 px-4 py-2 md:px-6">
                <div>
                    <img src={logo} alt="Logo" 
                    className="h-10 md:h-16 lg:h-20" /> 
                </div>
                <div className="space-x-2 md:space-x-4">
                    <button className="text-white px-2 py-1 rounded hover:text-blue-400 md:px-4 md:py-2">
                        Sign Up
                    </button>
                    <button className="bg-blue-600 text-white font-semibold px-3 py-1 rounded-md hover:bg-blue-700 md:px-4 md:py-2">
                        Start Fundraising
                    </button>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center text-center h-full bg-black bg-opacity-60 px-4">
                <h1 className="text-white text-2xl md:text-4xl lg:text-5xl mb-4">
                    Together, We Build a Better Tomorrow
                </h1>
                <p className="text-white text-base md:text-lg lg:text-xl w-full max-w-2xl mb-6 px-2">
                "At HamroSahayata, we believe in community power. Every donation, big or small, helps someone get closer to their dreams.
                Whether it's a medical need, education, or a community project, your support makes a difference. Join us in empowering local 
                causes and creating positive change."
                </p>
                <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 md:px-8 md:py-3">
                    Begin Your Journey!
                </button>
            </div>
        </div>
    );
}
