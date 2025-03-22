import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SubscriptionStatus = ({ refetchSubscription }) => {
    const { authTokens } = useContext(AuthContext);
    const [subscriptionDetails, setSubscriptionDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscriptionDetails = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/subscription-details/', {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch subscription details');
            const data = await response.json();
            console.log('Subscription Details:', data); // Debugging
            setSubscriptionDetails(data);
        } catch (error) {
            console.error('Error fetching subscription details:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authTokens) {
            fetchSubscriptionDetails();
        }
    }, [authTokens, refetchSubscription]); // Add refetchSubscription as a dependency

    if (loading) return <p className="text-center">Loading subscription details...</p>;

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Subscription Status</h2>
            {error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : subscriptionDetails ? (
                <>
                    <p>
                        <strong>Plan:</strong> {subscriptionDetails.plan}
                    </p>
                    <p>
                        <strong>Campaigns Created:</strong> {subscriptionDetails.campaigns_created}
                    </p>
                    <p>
                        <strong>Campaign Limit:</strong> {subscriptionDetails.campaign_limit} (Initial: 2 + Subscription: {subscriptionDetails.campaign_limit - 2})
                    </p>
                    {subscriptionDetails.campaigns_created >= subscriptionDetails.campaign_limit ? (
                        <p className="text-red-500">
                            You have reached your campaign limit. Upgrade your plan to create more campaigns.
                        </p>
                    ) : (
                        <p className="text-green-500">
                            You can create {subscriptionDetails.campaign_limit - subscriptionDetails.campaigns_created} more campaigns.
                        </p>
                    )}
                </>
            ) : (
                <p>No subscription details found.</p>
            )}
        </div>
    );
};

export default SubscriptionStatus;