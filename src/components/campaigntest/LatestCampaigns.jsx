import React,{useContext}  from "react";
import { Link } from "react-router-dom";
import { useCampaigns } from "../../context/CampaignContext";
import { formatDistanceToNow } from "date-fns"; // For time formatting
import { AuthContext } from "../../context/AuthContext";

const LatestCampaigns = () => {
    const {authtoken, user} = useContext(AuthContext);
    const { campaigns, loading } = useCampaigns();

    if (loading) return <div className="text-center text-lg font-semibold py-10">Loading latest campaigns...</div>;

    // Sort campaigns by creation date (newest first)
    const sortedCampaigns = [...campaigns].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Get the top 5 latest campaigns
    const latestCampaigns = sortedCampaigns.slice(0, 5);

    return (
        <div className="space-y-4">
            {latestCampaigns.map((campaign) => {
                // Format the time difference (e.g., "1 hour ago", "2 days ago")
                const timeAgo = formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true });

                return (
                    <Link
                        key={campaign.id}
                        to={`/campaigns/${campaign.id}`}
                        className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out border border-gray-100"
                    >
                        <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            {/* <div className="flex-shrink-0">
                                <img
                                    src={campaign.creator?.avatar || "https://via.placeholder.com/40"} // Fallback avatar
                                    alt={campaign.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            </div> */}

                            {/* Campaign Details */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                    {campaign.campaign_title}
                                </h3>
                                <div className="text-sm text-gray-500">
                                    <span>By {campaign.user}</span>
                                    <span className="mx-1">·</span>
                                    <span>{timeAgo}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default LatestCampaigns;