import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";

const CampaignShare = ({ campaignId }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const [isSharing, setIsSharing] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(null);
    const [shareError, setShareError] = useState(null);

    const handleShare = async (platform) => {
        if (!user) {
            alert("You need to login to earn reward points for sharing!");
            navigate("/login");
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
                    message: response.data.detail,
                    points: response.data.total_points
                });

                // Open the actual share dialog after recording the share
                openShareDialog(platform);

                // Show success message for 5 seconds
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
            case 'instagram':
                // Instagram doesn't have direct web sharing, so we'll prompt user to share manually
                setShareSuccess({
                    message: "Please share the campaign URL in your Instagram post or story!",
                });
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
                    message: "Campaign URL copied to clipboard!",
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
                Help spread the word {user && "and earn 50 reward points per share!"}
            </p>

            {/* Success/Error messages */}
            {shareSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
                    {shareSuccess.message}
                    {shareSuccess.points !== undefined && (
                        <span className="block mt-1 font-bold">
                            You now have {shareSuccess.points} reward points!
                        </span>
                    )}
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
                    {isSharing ? 'Sharing...' : ''}
                </button>

                <button
                    onClick={() => handleShare('instagram')}
                    disabled={isSharing}
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center disabled:opacity-50"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    {isSharing ? 'Sharing...' : 'Instagram'}
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