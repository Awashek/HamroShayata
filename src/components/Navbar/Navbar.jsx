import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import LogIn from '../LogIn/LogIn';
import SignUp from '../SignUp/SignUp';
import ForgotPasswordModal from '../LogIn/ForgotPasswordModal';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logoutUser, showSlider , setShowSlider } = useContext(AuthContext);
    const token = localStorage.getItem('authTokens');
    const navigate = useNavigate();

    let userData = null;
    if (token) {
        try {
            userData = jwtDecode(token);
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    // const [showSlider, setShowSlider] = useState(false);
    const [activeTab, setActiveTab] = useState("login");
    const [leftButtonText, setLeftButtonText] = useState("Sign Up");
    const [leftSideText, setLeftSideText] = useState("Let's create an account");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    const handleLoginClick = () => {
        setShowSlider(true);
        setActiveTab("login");
        setLeftButtonText("Sign Up");
        setLeftSideText("Let's create an account");
    };

    const handleClose = () => {
        setShowSlider(false);
        setShowForgotPasswordModal(false);
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

    const handleRegistrationSuccess = () => {
        setActiveTab("login");
    };

    const handleLoginSuccess = () => {
        handleClose();
        navigate("/");
    };

    const handleStartCampaign = () => {
        if (userData) {
            navigate("/createcampaign");
        } else {
            setShowErrorModal(true);
        }
    };

    const handleForgotPasswordClick = () => {
        setShowSlider(false);
        setShowForgotPasswordModal(true);
    };

    const handleBackToLogin = () => {
        setShowForgotPasswordModal(false);
        setShowSlider(true);
    };

    const getFirstLetter = () => {
        if (userData && userData.username) {
            return userData.username.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-[#1C9FDD] shadow-md z-50 px-4 py-4 sm:px-6 lg:px-12 flex items-center justify-between h-[80px]">
            <div>
                <Link to="/">
                    <img src={logo} alt="Logo" className="h-10 md:h-16 lg:h-20" />
                </Link>
            </div>

            <div className="space-x-2 md:space-x-4 hidden md:flex items-center">
                {!userData ? (
                    <Link
                        className="text-white font-semibold px-3 py-1 border border-white rounded-lg hover:bg-white hover:text-[#1C9FDD]"
                        onClick={handleLoginClick}
                    >
                        Log In
                    </Link>
                ) : (
                    <div className="relative">
                        <div
                            className="h-10 w-10 rounded-full cursor-pointer border-2 border-white hover:border-gray-300 flex items-center justify-center bg-white text-[#1C9FDD] font-bold text-lg"
                            onClick={() => setShowDropdown(prev => !prev)}
                        >
                            {getFirstLetter()}
                        </div>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                <Link to="/userprofile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    Profile
                                </Link>
                                <button onClick={logoutUser} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <button 
                    className="bg-white text-[#1C9FDD] font-semibold px-4 py-1.5 rounded-lg shadow-md hover:bg-[#1583BB] hover:text-white" 
                    onClick={handleStartCampaign}
                >
                    Start Campaign
                </button>
            </div>

            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <h2 className="text-lg font-bold text-red-600">Access Denied</h2>
                        <p className="text-gray-700 mt-2">You need to log in to create a campaign.</p>
                        <button 
                            className="mt-4 px-4 py-2 bg-[#1C9FDD] text-white rounded-lg hover:bg-[#1583BB]" 
                            onClick={() => { setShowErrorModal(false); setShowSlider(true); }}
                        >
                            Log In
                        </button>
                    </div>
                </div>
            )}

            {showSlider && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="w-full max-w-4xl h-auto bg-white shadow-lg rounded-lg flex overflow-hidden relative">
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl" onClick={handleClose}>✖</button>
                        <div className="w-full sm:w-1/2 bg-[#1C9FDD] flex flex-col justify-center items-center text-white p-6">
                            <h2 className="text-2xl font-bold mb-4">{activeTab === "login" ? "New Here?" : "Already have an account!"}</h2>
                            <p className="text-base text-center mb-6">{leftSideText}</p>
                            <button 
                                className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-blue-500" 
                                onClick={handleLeftButtonClick}
                            >
                                {leftButtonText}
                            </button>
                        </div>
                        <div className="w-full sm:w-1/2 flex flex-col justify-center items-center p-6">
                            {activeTab === "login" ? (
                                <LogIn 
                                    onLoginSuccess={handleLoginSuccess} 
                                    onForgotPassword={handleForgotPasswordClick}
                                />
                            ) : (
                                <SignUp onRegistrationSuccess={handleRegistrationSuccess} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showForgotPasswordModal && (
                <ForgotPasswordModal 
                    onClose={handleClose} 
                    switchToLogin={handleBackToLogin}
                />
            )}
        </nav>
    );
};

export default Navbar;