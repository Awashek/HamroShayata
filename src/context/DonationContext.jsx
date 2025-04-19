import React, { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { useCampaigns } from "./CampaignContext";

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
    const { updateCampaignAmount } = useCampaigns();
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const fetchDonations = useCallback(async () => {
        if (loading) return;

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
    }, [axiosInstance, loading]);

    const initiateDonation = async (campaignId, amountInRs, message = '') => {
        try {
            setLoading(true);
            setError(null);

            if (amountInRs < 10) {
                throw new Error("Minimum donation is Rs 10");
            }

            const response = await axiosInstance.post("donations/initiate/", {
                campaign_id: campaignId,
                amount: amountInRs,
                message
            });

            localStorage.setItem('donation_pidx', response.data.pidx);
            localStorage.setItem('pending_donation_id', response.data.donation_id);
            
            window.open(response.data.payment_url, "_blank");
            
            return {
                ...response.data,
                success: true
            };
        } catch (error) {
            setError(error.response?.data?.detail || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyDonation = async (pidx) => {
        if (!window._verifying) window._verifying = {};
        if (!window._retryCount) window._retryCount = {};
    
        // Prevent duplicate verifications
        if (window._verifying[pidx]) {
            console.log("Verification already in progress for this pidx, skipping duplicate request");
            return { status: "in_progress", message: "Verification in progress" };
        }
    
        window._verifying[pidx] = true;
        window._retryCount[pidx] = window._retryCount[pidx] || 0;
    
        const MAX_RETRIES = 3;
    
        try {
            setLoading(true);
            setError(null);
    
            if (window._retryCount[pidx] >= MAX_RETRIES) {
                console.error(`Max retries (${MAX_RETRIES}) reached for pidx: ${pidx}`);
                setError(`Verification failed after ${MAX_RETRIES} attempts. Please contact support.`);
                return { status: "error", message: "Max retries reached" };
            }
    
            window._retryCount[pidx]++;
            console.log(`Verifying donation (attempt ${window._retryCount[pidx]}): ${pidx}`);
    
            const response = await axiosInstance.post("donations/verify/", { pidx });
    
            setPaymentStatus(response.data.status);
    
            if (response.data.status === "success") {
                delete window._retryCount[pidx];
    
                if (response.data.campaign && response.data.amount) {
                    updateCampaignAmount(response.data.campaign, response.data.amount);
                }
    
                await fetchDonations();
                localStorage.removeItem('donation_pidx');
                localStorage.removeItem('pending_donation_id');
    
                return {
                    ...response.data,
                    isCompleted: true
                };
            }
    
            return {
                ...response.data,
                isCompleted: false
            };
    
        } catch (error) {
            console.error("Error verifying donation:", error);
            setError(error.response?.data?.detail || error.message);
            setPaymentStatus('verification_failed');
    
            throw error;
    
        } finally {
            setLoading(false);
            delete window._verifying[pidx];
        }
    };
    

    const checkPendingDonations = async () => {
        const pendingPidx = localStorage.getItem('donation_pidx');
        
        if (pendingPidx) {
            try {
                const result = await verifyDonation(pendingPidx);
                
                if (result.status === 'success') {
                    return {
                        success: true,
                        message: 'Your donation was completed successfully!',
                        data: result,
                        isCompleted: true // Add this flag
                    };
                }
            } catch (error) {
                console.error('Error checking pending donation:', error);
            }
        }
        
        return null;
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
            // Add status=Completed parameter to only fetch completed donations
            const response = await axiosInstance.get("donations/by_user/?status=Completed");
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
                checkPendingDonations,
            }}
        >
            {children}
        </DonationContext.Provider>
    );
};