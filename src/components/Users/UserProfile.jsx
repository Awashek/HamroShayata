import React, { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import { jwtDecode } from "jwt-decode";
import SubscriptionStatus from "../Subscription/SubscriptionStatus";
import { useDonations } from "../../context/DonationContext";

const UserProfile = () => {
    const { getUserDonations } = useDonations();
    const [userData, setUserData] = useState(null);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [userDonations, setUserDonations] = useState([]);
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [loading, setLoading] = useState({
        profile: true,
        donations: true,
        campaigns: true
    });

    const axiosInstance = useAxios();
    const token = localStorage.getItem("authTokens");

    let user_id, full_name, username, image, bio, email;
    if (token) {
        const decode = jwtDecode(token);
        user_id = decode.user_id;
        full_name = decode.full_name;
        username = decode.username;
        image = decode.image;
        bio = decode.bio;
        email = decode.email;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user profile
                const profileResponse = await axiosInstance.get("/profile/");
                setUserData(profileResponse.data);
                setRewardPoints(profileResponse.data.reward_points);
                setLoading(prev => ({ ...prev, profile: false }));

                // Fetch user donations using the context function
                setLoading(prev => ({ ...prev, donations: true }));
                const donationsData = await getUserDonations();

                // Process donations - sort by recent and take top 3
                const recentDonations = donationsData
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 3);
                setUserDonations(recentDonations);
                setLoading(prev => ({ ...prev, donations: false }));

                // Fetch user campaigns
                setLoading(prev => ({ ...prev, campaigns: true }));
                const campaignsResponse = await axiosInstance.get("/campaigns/");

                // Filter campaigns by user_id and sort by latest
                const filteredCampaigns = campaignsResponse.data
                    .filter((campaign) => campaign.user === username)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 3);
                setUserCampaigns(filteredCampaigns);
                setLoading(prev => ({ ...prev, campaigns: false }));
            } catch (error) {
                console.error("Error fetching data:", error);
                // Reset loading states in case of error
                setLoading({
                    profile: false,
                    donations: false,
                    campaigns: false
                });
            }
        };

        fetchData();
    }, [username]);

    const getInitial = (name) => {
        return name ? name.split(' ')[0].charAt(0).toUpperCase() : "";
    };

    const formatCurrency = (amount) => {
        return `Rs. ${new Intl.NumberFormat('en-IN').format(amount)}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-white">
                <div className="flex items-center space-x-6">
                    {/* Profile avatar with name initial */}
                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-500 border-4 border-white">
                        {getInitial(full_name || username)}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-1">{full_name || username}</h2>
                        <p className="text-blue-100">{email}</p>
                        {userData?.date_joined && (
                            <p className="text-sm text-blue-100 mt-1">
                                Member since {formatDate(userData.date_joined)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="bg-white shadow-xl p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left column */}
                    <div>
                        {/* Bio */}
                        <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-semibold text-blue-600 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                About Me
                            </h3>
                            <p className="text-gray-700">
                                {bio || "No bio available. Tell us about yourself!"}
                            </p>
                        </div>

                        {/* Rewards Points */}
                        <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-semibold text-blue-600 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                                </svg>
                                Rewards Points
                            </h3>
                            <div className="mb-2">
                                <span className="text-2xl font-bold text-blue-600">{rewardPoints}</span>
                                <span className="text-gray-500 ml-1">of 5000 points</span>
                            </div>
                            <div className="relative h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((rewardPoints / 5000) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                {5000 - rewardPoints > 0 
                                    ? `Earn ${5000 - rewardPoints} more points to reach the next level!` 
                                    : "Congratulations! You've reached the maximum points!"}
                            </p>
                        </div>

                        {/* Subscription Status */}
                        <SubscriptionStatus refetchSubscription={null} />
                    </div>

                    {/* Right column */}
                    <div>
                        {/* Recent Donations */}
                        <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                                Recent Donations
                            </h3>
                            {loading.donations ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : userDonations.length > 0 ? (
                                <ul className="space-y-3">
                                    {userDonations.map((donation) => {
                                        const campaignName = donation.campaign?.campaign_title ||
                                            donation.campaign?.title ||
                                            donation.campaign_name ||
                                            'Unknown Campaign';
                                        return (
                                            <li key={donation.id} className="p-3 bg-white rounded-lg shadow-sm flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-800 truncate max-w-xs">
                                                        {campaignName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(donation.created_at)}
                                                    </p>
                                                </div>
                                                <span className="text-green-600 font-semibold">
                                                    {formatCurrency(donation.amount)}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                    <p>No donations yet.</p>
                                    <p className="text-sm">Make your first contribution today!</p>
                                </div>
                            )}
                        </div>

                        {/* Your Campaigns */}
                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                </svg>
                                Your Campaigns
                            </h3>
                            {loading.campaigns ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : userCampaigns.length > 0 ? (
                                <ul className="space-y-3">
                                    {userCampaigns.map((campaign) => (
                                        <li key={campaign.id} className="p-3 bg-white rounded-lg shadow-sm">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium text-gray-800 truncate max-w-xs">
                                                    {campaign.campaign_title}
                                                </h4>
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {campaign.status || "Active"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                                <span>Created: {formatDate(campaign.created_at)}</span>
                                                {campaign.target_amount && (
                                                    <span>Goal: {formatCurrency(campaign.target_amount)}</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                    </svg>
                                    <p>No campaigns created yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;