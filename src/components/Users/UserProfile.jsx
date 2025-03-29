import React, { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import { jwtDecode } from "jwt-decode";
import SubscriptionStatus from "../Subscription/SubscriptionStatus";

const UserProfile = () => {
    const [res, setRes] = useState("");
    const [userData, setUserData] = useState(null);
    const [rewardPoints, setRewardPoints] = useState(0); // Initialize reward points
    const [userCampaigns, setUserCampaigns] = useState([]); // State for user campaigns
    const api = useAxios();
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

        // Debugging: Log decoded token
        console.log("Decoded Token:", decode);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user profile
                const profileResponse = await api.get("/profile/");
                setUserData(profileResponse.data);
                setRewardPoints(profileResponse.data.reward_points); // Update reward points dynamically

                // Fetch campaigns created by the user
                const campaignsResponse = await api.get("/campaigns/");
                console.log("Fetched campaigns:", campaignsResponse.data); // Debugging

                // Filter campaigns by user_id and sort by latest
                const filteredCampaigns = campaignsResponse.data
                    .filter((campaign) => campaign.user === username) // Filter campaigns by username
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by latest
                    .slice(0, 3); // Get top 3 campaigns

                console.log("Filtered campaigns:", filteredCampaigns); // Debugging
                setUserCampaigns(filteredCampaigns);
            } catch (error) {
                console.error("Error fetching data:", error);
                setRes("Error fetching data");
            }
        };
        fetchData();
    }, [username]); // Add username as a dependency

    // Function to get the first letter of the username
    const getInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : "";
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-8">
            {/* User Info */}
            <div className="flex items-center space-x-6 mb-10">
                {image ? (
                    <img
                        src={image}
                        alt="Profile"
                        className="w-20 h-20 rounded-full shadow-lg"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center bg-[#1C9FDD] text-white text-3xl font-bold">
                        {getInitial(username)}
                    </div>
                )}
                <div>
                    <h2 className="text-3xl font-bold text-[#1C9FDD] mb-2">{username}</h2>
                    <p className="text-gray-600 text-sm">{email}</p>
                </div>
            </div>

            {/* Personal Details */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Personal Details</h3>
                <p className="text-gray-700 text-lg">
                    <span className="font-medium">Location:</span> New York, USA
                </p>
                <p className="text-gray-700 text-lg">
                    <span className="font-medium">Member Since:</span> January 2022
                </p>
            </div>

            {/* Donation History */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Donation History</h3>
                <ul className="text-gray-700 space-y-3">
                    <li className="flex justify-between">
                        <span className="font-medium">Save the Whales:</span>
                        <span className="text-green-500">$100</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Medical Aid for John:</span>
                        <span className="text-green-500">$50</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Charity for Homeless:</span>
                        <span className="text-green-500">$75</span>
                    </li>
                </ul>
            </div>

            {/* Rewards Points */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Rewards Points</h3>
                <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-[#1C9FDD] rounded-full"
                        style={{ width: `${(rewardPoints / 5000) * 100}%` }}  // Adjust dynamically
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