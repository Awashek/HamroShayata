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
        <div>
            <div className="flex items-center justify-between absolute top-0 left-0 right-0 px-4 py-2 md:px-6 lg:px-12">
                <div>
                    <img src={logo} alt="Logo" className="h-10 md:h-16 lg:h-20" />
                </div>
                <div className="space-x-2 md:space-x-4">
                    <button
                        className="text-white px-2 py-1 rounded hover:text-[#1C9FDD] md:px-4 md:py-2"
                        onClick={handleLoginClick}
                    >
                        Log In
                    </button>
                    <button
                        className="bg-[#1C9FDD] text-white font-medium px-3 py-1 rounded-lg hover:bg-[#1577A5] md:px-4 md:py-2"
                        onClick={handleStartCampaignClick}
                    >
                        Start Campaign
                    </button>
                </div>
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
        </div>
    );
};

export default Navbar;
