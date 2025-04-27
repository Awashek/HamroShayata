import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import useAxios from "../../../utils/useAxios";

const CampaignShare = ({ campaignId }) => {
    const { user, setShowSlider } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const [isSharing, setIsSharing] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(null);
    const [shareError, setShareError] = useState(null);

    const handleShare = async (platform) => {
        if (!user) {
            setShareError("You need to login to share this campaign");
            
            setTimeout(() => {
                if (setShowSlider) {
                    setShowSlider(true);
                } else {
                    navigate('/login');
                }
            }, 1500); 
            
            return;
        }
        
        setIsSharing(true);
        setShareError(null);
        setShareSuccess(null);
    
        try {
            const response = await axiosInstance.post(
                `/campaigns/${campaignId}/share/`,
                { platform }
            );
    
            if (response.data) {
                setShareSuccess({
                    platform,
                    message: response.data.detail
                });
    
                openShareDialog(platform);
    
                setTimeout(() => {
                    setShareSuccess(null);
                }, 5000);
            }
        } catch (error) {
            console.error("Sharing error:", error);
            setShareError(error.response?.data?.detail || "Failed to share campaign");
        } finally {
            setIsSharing(false);
        }
    };

    const openShareDialog = (platform) => {
        const currentUrl = window.location.href;
        const title = document.title;

        switch (platform) {
            case 'facebook':
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
                    '_blank',
                    'width=600,height=400'
                );
                break;
            case 'twitter':
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
                    '_blank',
                    'width=600,height=400'
                );
                break;
            case 'linkedin':
                window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
                    '_blank',
                    'width=600,height=400'
                );
                break;
            default:
                break;
        }
    };

    const copyCampaignUrl = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                setShareSuccess({
                    message: "Campaign URL copied to clipboard!"
                });
                setTimeout(() => setShareSuccess(null), 3000);
            })
            .catch(err => {
                console.error("Failed to copy:", err);
                setShareError("Failed to copy URL");
            });
    };

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Campaign</h2>
            <p className="text-gray-600 mb-4">
                Help spread the word!
            </p>

            {shareSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
                    {shareSuccess.message}
                </div>
            )}
            {shareError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
                    {shareError}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleShare('facebook')}
                    disabled={isSharing}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center disabled:opacity-50"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    {isSharing ? 'Sharing...' : 'Facebook'}
                </button>

                <button
                    onClick={() => handleShare('twitter')}
                    disabled={isSharing}
                    className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center justify-center disabled:opacity-50"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                    {isSharing ? 'Sharing...' : 'Twitter'}
                </button>

                <button
                    onClick={() => handleShare('linkedin')}
                    disabled={isSharing}
                    className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-all font-medium flex items-center justify-center disabled:opacity-50"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    {isSharing ? 'Sharing...' : 'LinkedIn'}
                </button>
            </div>

            <div className="mt-4 relative">
                <input
                    type="text"
                    value={window.location.href}
                    className="border border-gray-200 p-2 rounded-lg w-full pr-16 bg-gray-50"
                    readOnly
                />
                <button
                    onClick={copyCampaignUrl}
                    className="absolute right-1 top-1 bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 transition-all text-sm"
                >
                    Copy
                </button>
            </div>
        </div>
    );
};

export default CampaignShare;