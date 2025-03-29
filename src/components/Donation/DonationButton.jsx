import React, { useState, useContext } from 'react';
import { useDonations } from '../../context/DonationContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DonationButton = ({ campaignId, className = "", onDonationSuccess }) => {
    const [customAmount, setCustomAmount] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [showPopupHelp, setShowPopupHelp] = useState(false);
    const { initiateDonation, loading } = useDonations();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDonate = async (e) => {
        e.preventDefault();
        
        if (!user) {
            navigate('/login?redirect=donate');
            return;
        }

        const amount = parseFloat(customAmount);
        if (!amount || isNaN(amount) || amount < 1) {
            setError('Please enter a valid amount (minimum Rs. 1)');
            return;
        }

        try {
            setError(null);
            const response = await initiateDonation(campaignId, amount.toFixed(2), message);
            
            if (response?.popup_blocked) {
                setShowPopupHelp(true);
            } else if (response?.success) {
                // Call the refresh function after successful donation
                if (onDonationSuccess) {
                    onDonationSuccess();
                }
            }
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again later.');
            console.error('Donation error:', err);
        }
    };

    const handleManualRedirect = () => {
        window.location.href = error.payment_url;
    };

    return (
        <div className={`donation-widget ${className}`}>
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
        </div>
    );
};

export default DonationButton;