import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SubscriptionStatus = ({ refetchSubscription }) => {
    const { authTokens } = useContext(AuthContext);
    const [subscriptionDetails, setSubscriptionDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscriptionDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8000/api/subscription-details/', {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
            
            if (!response.ok) throw new Error('Failed to fetch subscription details');
            
            const data = await response.json();
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
    }, [authTokens, refetchSubscription]);

    const getPlanStyles = (plan) => {
        switch (plan?.toLowerCase()) {
            case 'premium':
                return {
                    bgColor: 'bg-gradient-to-r from-purple-600 to-indigo-600',
                    textColor: 'text-purple-600',
                    borderColor: 'border-purple-300',
                    iconColor: 'text-purple-500',
                };
            case 'pro':
                return {
                    bgColor: 'bg-gradient-to-r from-yellow-500 to-amber-500',
                    textColor: 'text-amber-600',
                    borderColor: 'border-amber-300',
                    iconColor: 'text-amber-500',
                };
            default:
                return {
                    bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
                    textColor: 'text-blue-600',
                    borderColor: 'border-blue-300',
                    iconColor: 'text-blue-500',
                };
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm animate-pulse">
                <div className="h-7 bg-gray-300 rounded-md w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-5 bg-gray-300 rounded-md w-2/3"></div>
                    <div className="h-5 bg-gray-300 rounded-md w-3/4"></div>
                    <div className="h-5 bg-gray-300 rounded-md w-1/2"></div>
                </div>
            </div>
        );
    }

    const planStyle = getPlanStyles(subscriptionDetails?.plan);

    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-600 mb-3 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                    />
                </svg>
                Subscription Status
            </h3>

            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-medium">Error loading subscription details</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchSubscriptionDetails}
                        className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : subscriptionDetails ? (
                <div>
                    {/* Subscription Plan */}
                    <div className={`${planStyle.bgColor} text-white p-4 rounded-lg mb-4`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-xs uppercase tracking-wide font-medium opacity-80">
                                    Current Plan
                                </h4>
                                <p className="font-bold text-2xl">{subscriptionDetails.plan || "Free"}</p>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-8 h-8 opacity-80"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Campaign Usage */}
                    <div className="bg-white border rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Approved Campaign Usage</h4>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {subscriptionDetails.campaigns_created} / {subscriptionDetails.campaign_limit}
                            </span>
                        </div>
                        <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                            <div
                                className={`absolute top-0 left-0 h-full ${planStyle.bgColor} rounded-full transition-all duration-500`}
                                style={{
                                    width: `${(subscriptionDetails.campaigns_created / subscriptionDetails.campaign_limit) * 100}%`,
                                }}
                            ></div>
                        </div>
                        {subscriptionDetails.campaigns_created >= subscriptionDetails.campaign_limit ? (
                            <p className="text-red-600 text-sm flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 mr-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                    />
                                </svg>
                                Approved campaign limit reached. Consider upgrading your plan.
                            </p>
                        ) : (
                            <p className="text-green-600 text-sm flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 mr-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0Z"
                                    />
                                </svg>
                                You can create {subscriptionDetails.campaign_limit - subscriptionDetails.campaigns_created} more approved campaigns
                            </p>
                        )}
                    </div>

                    {/* Plan Details */}
                    <div className="bg-white border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Plan Details</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className={`w-5 h-5 mr-2 ${planStyle.iconColor} flex-shrink-0 mt-0.5`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                                    />
                                </svg>
                                <div>
                                    <p className="text-gray-700">
                                        Base campaigns: <span className="font-medium">2</span>
                                    </p>
                                    <p className="text-xs text-gray-500">Free with every account</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className={`w-5 h-5 mr-2 ${planStyle.iconColor} flex-shrink-0 mt-0.5`}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div>
                                    <p className="text-gray-700">
                                        Subscription campaigns:{' '}
                                        <span className="font-medium">{subscriptionDetails.campaign_limit - 2}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Added with your {subscriptionDetails.plan || "current"} plan
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
                    <p className="font-medium">No subscription details found</p>
                    <p className="text-sm mt-1">
                        Get started with a subscription plan to create more campaigns and unlock additional features.
                    </p>
                    <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                        View Subscription Plans
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubscriptionStatus;