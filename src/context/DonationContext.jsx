import React, { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../utils/useAxios";

const DonationContext = createContext();

export const useDonations = () => {
    const context = useContext(DonationContext);
    if (!context) {
        throw new Error('useDonations must be used within a DonationProvider');
    }
    return context;
};

export const DonationProvider = ({ children }) => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const updateCampaignAmount = useCallback((campaignId, amount) => {
        setCampaigns(prevCampaigns =>
            prevCampaigns.map(campaign =>
                campaign.id === campaignId
                    ? {
                        ...campaign,
                        current_amount: (parseFloat(campaign.current_amount || 0) + parseFloat(amount)).toFixed(2)
                    }
                    : campaign
            )
        );
    }, []);

    const fetchDonations = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("donations/");
            setDonations(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching donations:", error);
            setError(error.response?.data?.detail || "Failed to load donations");
        } finally {
            setLoading(false);
        }
    }, [axiosInstance]);

    const initiateDonation = async (campaignId, amount, message = '') => {
        try {
            setLoading(true);
            setError(null);
            setPaymentStatus('initiating');

            // Validate amount
            if (isNaN(amount) || amount < 1) {
                throw new Error('Amount must be at least Rs. 1');
            }

            const response = await axiosInstance.post("donations/initiate/", {
                campaign_id: campaignId,
                amount: Math.round(amount * 100), // Convert to paisa
                message
            });

            if (!response.data.payment_url) {
                throw new Error('No payment URL received from server');
            }

            // First try to open in new tab
            let paymentWindow = window.open(
                response.data.payment_url,
                '_blank'
            );

            // If blocked, show instructions
            if (!paymentWindow || paymentWindow.closed || typeof paymentWindow.closed === 'undefined') {
                // Fallback 1: Try to open with window features
                paymentWindow = window.open(
                    response.data.payment_url,
                    'khalti_payment',
                    'width=500,height=700,scrollbars=yes'
                );

                // If still blocked, show user-friendly message
                if (!paymentWindow || paymentWindow.closed) {
                    setError('Please enable popups for this site to complete your payment');
                    setPaymentStatus('popup_blocked');
                    return {
                        ...response.data,
                        popup_blocked: true,
                        payment_url: response.data.payment_url
                    };
                }
            }

            setPaymentStatus('pending');
            return response.data;

        } catch (error) {
            console.error("Donation initiation error:", error);
            const errorMessage = error.response?.data?.detail ||
                error.message ||
                'Payment initiation failed';
            setError(errorMessage);
            setPaymentStatus('failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyDonation = async (pidx) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.post(
                "donations/verify/",
                { pidx }
            );

            setPaymentStatus(response.data.status);
            
            // Update the campaign amount locally
            if (response.data.status === 'Completed' && response.data.campaign && response.data.amount) {
                updateCampaignAmount(response.data.campaign, response.data.amount);
            }

            await fetchDonations(); // Refresh donations list

            if (response.data.status === 'Completed') {
                navigate(`/campaigns/${response.data.campaign}?donation_success=true`);
            }

            return response.data;

        } catch (error) {
            console.error("Error verifying donation:", error);
            setError(error.response?.data || error.message);
            setPaymentStatus('verification_failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getCampaignDonations = async (campaignId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `donations/campaign/${campaignId}/`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching campaign donations:", error);
            setError(error.response?.data?.detail || "Failed to load campaign donations");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUserDonations = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                "donations/history/"
            );
            setDonations(response.data);
            setError(null);
            return response.data;
        } catch (error) {
            console.error("Error fetching user donations:", error);
            setError(error.response?.data?.detail || "Failed to load your donations");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <DonationContext.Provider
            value={{
                donations,
                loading,
                error,
                paymentStatus,
                initiateDonation,
                verifyDonation,
                fetchDonations,
                getCampaignDonations,
                getUserDonations
            }}
        >
            {children}
        </DonationContext.Provider>
    );
};