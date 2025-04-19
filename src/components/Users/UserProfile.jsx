import React, { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import { jwtDecode } from "jwt-decode";
import SubscriptionStatus from "../Subscription/SubscriptionStatus";
import { useDonations } from "../../context/DonationContext";

const UserProfile = () => {
    const { getUserDonations } = useDonations();
    const [res, setRes] = useState("");
    const [userData, setUserData] = useState(null);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [userDonations, setUserDonations] = useState([]);
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [loading, setLoading] = useState({
        donations: false,
        campaigns: false
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
                    .filter((campaign) => campaign.user === username) // Filter campaigns by username
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest
                    .slice(0, 3); // Get top 3 campaigns
                setUserCampaigns(filteredCampaigns);
                setLoading(prev => ({ ...prev, campaigns: false }));
            } catch (error) {
                setRes("Error fetching data");
                // Reset loading states in case of error
                setLoading(prev => ({
                    ...prev,
                    donations: false,
                    campaigns: false
                }));
            }
        };

        fetchData();
    }, [username]);

    const getInitial = (name) => {
        // Get first character from the name (likely first name)
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
        <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-8">
            {/* User Info */}
            <div className="flex items-center space-x-6 mb-10">
                {/* Always show the initial, regardless of whether an image exists */}
                <div className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center bg-[#1C9FDD] text-white text-3xl font-bold">
                    {getInitial(full_name || username)}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-[#1C9FDD] mb-2">{username}</h2>
                    <p className="text-gray-600 text-sm">{email}</p>
                </div>
            </div>

            {/* Personal Details */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Personal Details</h3>
                <p className="text-gray-700 text-lg">
                    <span className="font-medium">Bio:</span> {bio || "No bio yet"}
                </p>
                <p className="text-gray-700 text-lg">
                    <span className="font-medium">Member Since:</span> {userData?.date_joined ? formatDate(userData.date_joined) : "N/A"}
                </p>
            </div>

            {/* Donation History */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Recent Donations</h3>
                {loading.donations ? (
                    <p>Loading donations...</p>
                ) : userDonations.length > 0 ? (
                    <ul className="text-gray-700 space-y-3">
                        {userDonations.map((donation) => {
                            const campaignName = donation.campaign?.campaign_title ||
                                donation.campaign?.title ||
                                donation.campaign_name ||
                                'Unknown Campaign';
                            return (
                                <li key={donation.id} className="flex justify-between">
                                    <span className="font-medium">
                                        {campaignName}
                                    </span>
                                    <span className="text-green-500">
                                        {formatCurrency(donation.amount)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-500">No donations yet.</p>
                )}
            </div>

            {/* Rewards Points */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Rewards Points</h3>
                <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-[#1C9FDD] rounded-full"
                        style={{ width: `${(rewardPoints / 5000) * 100}%` }}
                    ></div>
                </div>
                <p className="mt-3 text-sm text-gray-700 font-semibold">{rewardPoints} Points</p>
            </div>

            {/* Campaigns Created */}
            <div>
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Campaigns Created</h3>
                {userCampaigns.length > 0 ? (
                    <ul className="text-gray-700 space-y-3">
                        {userCampaigns.map((campaign) => (
                            <li key={campaign.id} className="flex justify-between items-center">
                                <span className="font-medium">{campaign.campaign_title}</span>
                                <span className="text-gray-500 text-sm">
                                    {new Date(campaign.created_at).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No campaigns created yet.</p>
                )}
            </div>
            <SubscriptionStatus />
        </div>
    );
};

export default UserProfile;