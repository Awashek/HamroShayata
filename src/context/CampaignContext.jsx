import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import axios from 'axios';
import { calculateDaysLeft } from "../utils/dateUtils";

const CampaignContext = createContext();

export const useCampaigns = () => {
    const context = useContext(CampaignContext);
    if (!context) {
        throw new Error('useCampaigns must be used within a CampaignProvider');
    }
    return context;
};

export const CampaignProvider = ({ children }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authTokens } = useContext(AuthContext);

    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const config = {
                headers: {}
            };

            if (authTokens?.access) {
                config.headers.Authorization = `Bearer ${authTokens.access}`;
            }

            const response = await axios.get("http://127.0.0.1:8000/api/campaigns/", config);

            const campaignsWithData = response.data.map(campaign => ({
                ...campaign,
                current_amount: parseFloat(campaign.current_amount || 0),
                goal_amount: parseFloat(campaign.goal_amount || campaign.goal || 1),
                days_left: calculateDaysLeft(campaign.deadline)
            }));

            setCampaigns(campaignsWithData);
        } catch (err) {
            console.error("Error fetching campaigns:", err);
            setError(err.response?.data?.detail || err.message || "Failed to load campaigns");
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    }, [authTokens]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const createCampaign = async (campaignData) => {
        try {
            setLoading(true);
            const response = await axios.post(
                "http://127.0.0.1:8000/api/campaigns/",
                campaignData,
                {
                    headers: {
                        Authorization: `Bearer ${authTokens?.access}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setCampaigns(prev => [...prev, response.data]);

            // Return the full response object instead of just response.data
            return {
                status: response.status,
                data: response.data,
                success: true
            };
        } catch (err) {
            console.error("Error creating campaign:", err);
            return {
                status: err.response?.status || 500,
                errorData: err.response?.data || { general: err.message || "Unknown error" },
                success: false
            };
        } finally {
            setLoading(false);
        }
    };

    const updateCampaign = async (id, updatedData) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/campaigns/${id}/`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${authTokens?.access}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setCampaigns(prev =>
                prev.map(campaign =>
                    campaign.id === id ? response.data : campaign
                )
            );
            return response.data;
        } catch (error) {
            console.error("Error updating campaign:", error);
            throw error.response?.data || error;
        }
    };

    const deleteCampaign = async (id) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/campaigns/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${authTokens?.access}`
                    }
                }
            );

            setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
        } catch (error) {
            console.error("Error deleting campaign:", error);
            throw error.response?.data || error;
        }
    };

    const getCampaignById = (id) => {
        return campaigns.find(campaign => campaign.id === id);
    };

    const updateCampaignAmount = useCallback((campaignId, amount) => {
        setCampaigns(prevCampaigns =>
            prevCampaigns.map(campaign =>
                campaign.id === campaignId
                    ? {
                        ...campaign,
                        current_amount: (parseFloat(campaign.current_amount || 0) + parseFloat(amount)).toFixed(2),
                        // Recalculate days_left if needed
                        days_left: calculateDaysLeft(campaign.deadline)
                    }
                    : campaign
            )
        );
    }, []);

    return (
        <CampaignContext.Provider
            value={{
                campaigns,
                loading,
                error,
                fetchCampaigns,
                createCampaign,
                updateCampaign,
                deleteCampaign,
                getCampaignById,
                updateCampaignAmount,
            }}
        >
            {children}
        </CampaignContext.Provider>
    );
};