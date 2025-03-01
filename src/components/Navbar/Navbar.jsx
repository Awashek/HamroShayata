import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import LogIn from '../LogIn/LogIn';
import SignUp from '../SignUp/SignUp'; // Import SignUp component

const Navbar = () => {
    const [showSlider, setShowSlider] = useState(false);
    const [activeTab, setActiveTab] = useState("login");
    const [leftButtonText, setLeftButtonText] = useState("Sign Up");
    const [leftSideText, setLeftSideText] = useState("Let's create an account");

    const navigate = useNavigate();

    const handleLoginClick = () => {
        setShowSlider(true);
    };

    const handleClose = () => {
        setShowSlider(false);
    };

    const handleLeftButtonClick = () => {
        if (activeTab === "login") {
            setActiveTab("signup");
            setLeftButtonText("Log In");
            setLeftSideText("Let's get you logged in.");
        } else {
            setActiveTab("login");
            setLeftButtonText("Sign Up");
            setLeftSideText("Let's create an account");
        }
    };

    const handleStartCampaignClick = () => {
        navigate('/createcampaign');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-[#1C9FDD] shadow-md z-50 px-4 py-4 sm:px-6 lg:px-12 flex items-center justify-between h-[80px]">
            <div>
                <img src={logo} alt="Logo" className="h-10 md:h-16 lg:h-20" />
            </div>
            <div className="space-x-2 md:space-x-4 hidden md:flex">
                {/* Log In Button */}
                <button
                    className="text-white font-semibold px-3 py-1 border border-white rounded-lg transition-all duration-300 hover:text-[#1C9FDD] hover:bg-white hover:shadow-lg md:px-5 md:py-2"
                    onClick={handleLoginClick}
                >
                    Log In
                </button>

                {/* Start Campaign Button (hidden on mobile) */}
                <button
                    className="bg-white text-[#1C9FDD] font-semibold px-4 py-1.5 rounded-lg shadow-md transition-all duration-300 hover:bg-[#1583BB] hover:text-white hover:shadow-lg md:px-6 md:py-2 hidden sm:block"
                    onClick={handleStartCampaignClick}
                >
                    Start Campaign
                </button>
            </div>

            {/* Mobile View - Hamburger Menu */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={handleLoginClick}
                    className="text-white font-semibold px-3 py-1 border border-white rounded-lg"
                >
                    Log In
                </button>
            </div>

            {showSlider && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="w-full max-w-4xl h-auto bg-white shadow-lg rounded-lg flex overflow-hidden relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                            onClick={handleClose}
                        >
                            ✖
                        </button>

                        {/* Left Side */}
                        <div className="w-full sm:w-1/2 bg-[#1C9FDD] flex flex-col justify-center items-center text-white p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                {activeTab === "login" ? "New Here?" : "Already have an account!"}
                            </h2>
                            <p className="text-base text-center mb-6">
                                {leftSideText}
                            </p>
                            <button
                                className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-blue-500 transition"
                                onClick={handleLeftButtonClick}
                            >
                                {leftButtonText}
                            </button>
                        </div>

                        {/* Right Side */}
                        <div className="w-full sm:w-1/2 flex flex-col justify-center items-center p-6">
                            {activeTab === "login" ? <LogIn /> : <SignUp />}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
