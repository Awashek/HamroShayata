import React, { useState, useContext } from "react";
import { useSubscriptions } from "../../context/SubscriptionContext";
import { AuthContext } from "../../context/AuthContext";

const SubscriptionPlans = () => {
    const { createSubscription } = useSubscriptions();
    const { authTokens } = useContext(AuthContext);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Define subscription plans dynamically
    const subscriptionPlans = [
        { type: "bronze", name: "Bronze", campaigns: 5 },
        { type: "silver", name: "Silver", campaigns: 10 },
        { type: "gold", name: "Gold", campaigns: 15 },
    ];

    const handleSubscribe = async () => {
        if (!authTokens) {
            alert("You must be logged in to subscribe.");
            return;
        }

        if (!selectedPlan) {
            setError("Please select a subscription plan.");
            return;
        }

        // Calculate end_date (e.g., 1 month from now)
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1); // Add 1 month

        const subscriptionData = {
            subscription_type: selectedPlan,
            end_date: endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        };

        setLoading(true);
        setError("");

        try {
            const result = await createSubscription(subscriptionData);
            if (result.status === 201) {
                alert("Subscription created successfully!");
                // Optionally, redirect or refresh the page
                window.location.reload(); // Refresh to reflect the new subscription
            } else {
                setError(result.errorData || "Failed to create subscription.");
            }
        } catch (error) {
            console.error("Error creating subscription:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Choose a Subscription Plan</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
                {subscriptionPlans.map((plan) => (
                    <label key={plan.type} className="block">
                        <input
                            type="radio"
                            name="subscription"
                            value={plan.type}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="mr-2"
                        />
                        <span>
                            {plan.name} ({plan.campaigns} campaigns)
                        </span>
                    </label>
                ))}
            </div>
            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4 disabled:bg-gray-400"
            >
                {loading ? "Subscribing..." : "Subscribe"}
            </button>
        </div>
    );
};

export default SubscriptionPlans;