import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
const SubscriptionContext = createContext();

export const useSubscriptions = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        fetchSubscriptions();
    }, [authTokens]);

    const fetchSubscriptions = async () => {
        try {
            const headers = authTokens
                ? { Authorization: `Bearer ${authTokens.access}` }
                : {};

            const response = await fetch("http://127.0.0.1:8000/api/subscriptions/", {
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch subscriptions");
            const data = await response.json();
            setSubscriptions(data);
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    const createSubscription = async (subscriptionData) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/subscriptions/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authTokens?.access}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(subscriptionData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || JSON.stringify(data));
            }

            setSubscriptions((prev) => [...prev, data]);
            return { status: response.status, data };
        } catch (error) {
            console.error("Error creating subscription:", error);
            return { status: 500, errorData: error.message };
        }
    };

    return (
        <SubscriptionContext.Provider
            value={{ subscriptions, loading, createSubscription }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};