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
    const [campaigns, setCampaigns] = useState([]);
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
        if (loading) return; // Skip if already loading

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
    }, [axiosInstance, loading]); // Add loading to dependencies

    const initiateDonation = async (campaignId, amountInRs, message = '') => {
        try {
            setLoading(true);
            setError(null);
    
            // Validate Rs amount (e.g., minimum Rs 10)
            if (amountInRs < 10) {
                throw new Error("Minimum donation is Rs 10");
            }
    
            const response = await axiosInstance.post("donations/initiate/", {
                campaign_id: campaignId,
                amount: amountInRs,  // Send Rs amount (backend converts to paisa)
                message
            });
    
            // Open Khalti payment window
            window.open(response.data.payment_url, "_blank");
            
            return response.data;
        } catch (error) {
            setError(error.response?.data?.detail || error.message);
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
                "donations/"
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
                getUserDonations,
            }}
        >
            {children}
        </DonationContext.Provider>
    );
};