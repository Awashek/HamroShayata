import React, { useState } from "react";
import bgImage from "../../assets/images/background.jpg";
import logo from "../../assets/images/logo.png";
import LogIn from "../Login/Login";
import SignUp from "../Signup/Signup";

export default function Hero() {
    const [showSlider, setShowSlider] = useState(false); // State to toggle the slider
    const [activeTab, setActiveTab] = useState("login"); // Default to "Log In" tab
    const [leftButtonText, setLeftButtonText] = useState("Sign Up"); // Track button text on the left side
    const [leftSideText, setLeftSideText] = useState("Let's create an account");

    const handleLoginClick = () => {
        setShowSlider(true);
    };

    const handleClose = () => {
        setShowSlider(false); // Close the slider
    };

    const handleLeftButtonClick = () => {
        if (activeTab === "login") {
            setActiveTab("signup"); // Switch to "Sign Up" tab
            setLeftButtonText("Log In"); // Update button text
            setLeftSideText("Let's get you logged in."); // Update left side text
        } else {
            setActiveTab("login"); // Switch to "Log In" tab
            setLeftButtonText("Sign Up"); // Update button text
            setLeftSideText("Let's create an account"); // Update left side text
        }
    };

    return (
        <div
            className="h-screen bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Header Section */}
            <div className="flex items-center justify-between absolute top-0 left-0 right-0 px-4 py-2 md:px-6 lg:px-12">
                <div>
                    <img src={logo} alt="Logo" className="h-10 md:h-16 lg:h-20" />
                </div>
                <div className="space-x-2 md:space-x-4">
                    <button
                        className="text-white px-2 py-1 rounded hover:text-blue-400 md:px-4 md:py-2"
                        onClick={handleLoginClick}
                    >
                        Log In
                    </button>
                    <button className="bg-blue-600 text-white font-medium px-3 py-1 rounded-lg hover:bg-blue-700 md:px-4 md:py-2">
                        Start Campaign
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center text-center h-full bg-black bg-opacity-60 px-4">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4">
                    Together, We Build a Better Tomorrow
                </h1>
                <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl w-full max-w-2xl mb-6 px-2">
                    "At HamroSahayata, we believe in community power. Every donation, big
                    or small, helps someone get closer to their dreams. Whether it's a
                    medical need, education, or a community project, your support makes a
                    difference. Join us in empowering local causes and creating positive
                    change."
                </p>
                <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 md:px-8 md:py-3">
                    Begin Your Journey!
                </button>
            </div>

            {/* Log In/Sign Up Slider */}
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
                        <div className="w-full sm:w-1/2 bg-blue-500 flex flex-col justify-center items-center text-white p-6">
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
}
