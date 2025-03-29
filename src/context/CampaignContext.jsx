import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import axios from 'axios';

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
            
            // Ensure campaigns have current_amount with proper fallbacks
            const campaignsWithAmounts = response.data.map(campaign => ({
                ...campaign,
                current_amount: parseFloat(campaign.current_amount || 0),
                goal_amount: parseFloat(campaign.goal_amount || campaign.goal || 1)
            }));

            setCampaigns(campaignsWithAmounts);
        } catch (err) {
            console.error("Error fetching campaigns:", err);
            setError(err.response?.data?.detail || err.message || "Failed to load campaigns");
            setCampaigns([]); // Reset campaigns on error
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
            return response.data;
        } catch (err) {
            console.error("Error creating campaign:", err);
            throw err.response?.data || err;
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
                getCampaignById
            }}
        >
            {children}
        </CampaignContext.Provider>
    );
};