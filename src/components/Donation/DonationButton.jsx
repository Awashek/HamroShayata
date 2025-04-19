import React, { useState, useContext, useEffect } from 'react';
import { useDonations } from '../../context/DonationContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCampaigns } from '../../context/CampaignContext';

const DonationButton = ({ campaignId, className = "", onDonationSuccess, isCampaignFulfilled }) => {
    const [customAmount, setCustomAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [showPopupHelp, setShowPopupHelp] = useState(false);
    const { initiateDonation, verifyDonation, loading, checkPendingDonations } = useDonations();
    const { user, authTokens, setShowSlider } = useContext(AuthContext);
    const { updateCampaignAmount } = useCampaigns();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [successMessage, setSuccessMessage] = useState('');
    const [rewardPointsEarned, setRewardPointsEarned] = useState(0);

    useEffect(() => {
        const checkDonation = async () => {
            const result = await checkPendingDonations();
            if (result && result.success && result.isCompleted) {
                setSuccessMessage(result.message);
                if (result.rewardPoints) {
                    setRewardPointsEarned(result.rewardPoints);
                }
                if (onDonationSuccess) {
                    onDonationSuccess();
                }
                if (result.data?.campaign && result.data?.amount) {
                    updateCampaignAmount(result.data.campaign, result.data.amount);
                }
            }
        };
        
        checkDonation();
    }, [location, checkPendingDonations, onDonationSuccess, updateCampaignAmount]);

    const handleDonate = async (e) => {
        e.preventDefault();
        
        if (isCampaignFulfilled) {
            setError('This campaign has already been fully funded. Thank you for your interest!');
            return;
        }
        
        if (!user) {
            if (setShowSlider) {
                setShowSlider(true);
                return;
            } else {
                navigate('/login');
                return;
            }
        }
    
        const amount = parseFloat(customAmount);
        if (!amount || isNaN(amount) || amount < 1) {
            setError('Please enter a valid amount (minimum Rs. 1)');
            return;
        }
    
        try {
            setError(null);
            setSuccessMessage('');
            const response = await initiateDonation(campaignId, amount.toFixed(2), message);
            
            if (response?.popup_blocked) {
                setShowPopupHelp(true);
            } else if (response?.success) {
                setSuccessMessage('Payment initiated successfully! Check your email for confirmation.');
            }
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again later.');
            console.error('Donation error:', err);
        }
    };

    const handleManualRedirect = () => {
        const paymentUrl = localStorage.getItem('payment_url');
        if (paymentUrl) {
            window.open(paymentUrl, '_blank');
        } else if (error && error.payment_url) {
            window.open(error.payment_url, '_blank');
        }
    };

    return (
        <div className={`donation-widget ${className}`}>
            {successMessage && (
                <div className="mb-3 p-2 bg-green-100 border border-green-300 text-green-700 rounded">
                    <p>{successMessage}</p>
                    {rewardPointsEarned > 0 && (
                        <p className="mt-2 font-medium">
                            🎉 You earned {rewardPointsEarned} reward points for this donation!
                        </p>
                    )}
                </div>
            )}
            
            {isCampaignFulfilled ? (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 font-medium">
                        🎉 This campaign has been fully funded! Thank you for your support.
                    </p>
                    <p className="text-sm mt-2">
                        Explore other campaigns that need your help.
                    </p>
                </div>
            ) : user ? (
                <form onSubmit={handleDonate}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (NPR)
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            placeholder="100"
                            min="1"
                            step="1"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setError(null);
                            }}
                            required
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Message (Optional)
                        </label>
                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Add a message with your donation"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="2"
                        />
                    </div>
                    
                    {error && (
                        <div className="mb-3 text-red-500 text-sm">
                            {error}
                            {showPopupHelp && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="font-medium">Popups are blocked</p>
                                    <p className="text-sm">
                                        Your browser is blocking the payment window. Please:
                                    </p>
                                    <ul className="list-disc pl-5 text-sm mt-1">
                                        <li>Allow popups for this site in your browser settings</li>
                                        <li>Or click below to open the payment page manually</li>
                                    </ul>
                                    <button
                                        type="button"
                                        onClick={handleManualRedirect}
                                        className="mt-2 text-sm text-blue-600 hover:underline"
                                    >
                                        Open payment page
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Donate with Khalti'}
                    </button>
                </form>
            ) : (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">
                        Want to donate? 
                        <span 
                            className="text-blue-600 cursor-pointer font-bold underline ml-1" 
                            onClick={() => setShowSlider ? setShowSlider(true) : navigate('/login')}
                        >
                            Log in
                        </span> first.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DonationButton;