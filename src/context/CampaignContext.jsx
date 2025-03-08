import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthContext from './Authcontext';

const CampaignContext = createContext();

export const useCampaigns = () => useContext(CampaignContext);

export const CampaignProvider = ({ children }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/campaigns/', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error("Failed to fetch campaigns");
            const data = await response.json();
            setCampaigns(data);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    const createCampaign = async (campaignData) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/campaigns/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authTokens?.access}`,
                },
                body: campaignData, // Send FormData directly here
            });
            const data = await response.json();

            if (!response.ok) {
                console.error("Server response error:", data);
                throw new Error(data.detail || JSON.stringify(data));
            }

            setCampaigns((prev) => [...prev, data]);
            return { status: response.status, data };
        } catch (error) {
            console.error("Error creating campaign:", error);
            return { status: 500, errorData: error.message };
        }
    };



    const updateCampaign = async (id, updatedData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Error updating campaign");
            setCampaigns((prev) => prev.map((campaign) => (campaign.id === id ? data : campaign)));
            return { status: response.status, data };
        } catch (error) {
            console.error("Error updating campaign:", error);
            return { status: 500, errorData: error.message };
        }
    };

    const deleteCampaign = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authTokens?.access}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error("Error deleting campaign");
            setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id));
            return { status: 204 };
        } catch (error) {
            console.error("Error deleting campaign:", error);
            return { status: 500, errorData: error.message };
        }
    };

    return (
        <CampaignContext.Provider value={{ campaigns, loading, createCampaign, updateCampaign, deleteCampaign }}>
            {children}
        </CampaignContext.Provider>
    );
};
