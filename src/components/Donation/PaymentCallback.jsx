import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDonations } from '../../context/DonationContext';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const { verifyDonation } = useDonations();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Verifying your payment...');
    const navigate = useNavigate();
    const [verificationAttempted, setVerificationAttempted] = useState(false);

    useEffect(() => {
        // Only attempt verification once
        if (verificationAttempted) {
            return;
        }
        
        const pidx = searchParams.get('pidx');
        const storedPidx = localStorage.getItem('donation_pidx');
        const finalPidx = pidx || storedPidx;
        
        if (!finalPidx) {
            setStatus('error');
            setMessage('No payment information found.');
            return;
        }
        
        const verifyPayment = async () => {
            setVerificationAttempted(true); // Mark verification as attempted
            
            try {
                const result = await verifyDonation(finalPidx);
                
                // Clear stored donation data
                localStorage.removeItem('donation_pidx');
                localStorage.removeItem('pending_donation_id');
                
                if (result.status === 'success') {
                    setStatus('success');
                    setMessage('Your donation was successful! Thank you for your contribution.');
                    
                    // Redirect to campaign page after 3 seconds
                    setTimeout(() => {
                        navigate(`/campaigns/${result.campaign}`);
                    }, 3000);
                } else if (result.status === 'pending') {
                    setStatus('pending');
                    setMessage('Your payment is still being processed. We will update you once it completes.');
                } else if (result.status === 'in_progress') {
                    setStatus('processing');
                    setMessage('Verification is in progress. Please wait...');
                } else {
                    setStatus('error');
                    setMessage(result.message || 'There was an error verifying your payment.');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setStatus('error');
                setMessage('There was an error verifying your payment. Please contact support.');
            }
        };
        
        verifyPayment();
    }, [searchParams, verifyDonation, navigate, verificationAttempted]);

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Payment {status === 'success' ? 'Successful' : 'Status'}</h1>
            
            <div className={`p-4 rounded-md mb-6 ${
                status === 'processing' ? 'bg-blue-50 text-blue-700' :
                status === 'success' ? 'bg-green-50 text-green-700' :
                status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
            }`}>
                <p>{message}</p>
            </div>
            
            {status === 'processing' && (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
                </div>
            )}
            
            {status === 'success' && (
                <p className="text-gray-600 text-center">
                    Redirecting you back to the campaign page...
                </p>
            )}
            
            {status === 'error' && (
                <div className="flex justify-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Return to Home
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentCallback;