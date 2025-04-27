import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useCampaigns } from "../../context/CampaignContext";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "../../context/AuthContext";
import { Clock, User, ExternalLink } from "lucide-react";

const LatestCampaigns = () => {
    const { authtoken, user } = useContext(AuthContext);
    const { campaigns, loading } = useCampaigns();

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Sort campaigns by creation date (newest first)
    const sortedCampaigns = [...campaigns].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Get the top 5 latest campaigns
    const latestCampaigns = sortedCampaigns.slice(0, 5);

    if (latestCampaigns.length === 0) {
        return (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No campaigns available yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {latestCampaigns.map((campaign) => {
                // Format the time difference (e.g., "1 hour ago", "2 days ago")
                const timeAgo = formatDistanceToNow(new Date(campaign.created_at), {
                    addSuffix: true,
                });

                return (
                    <Link
                        key={campaign.id}
                        to={`/campaigns/${campaign.id}`}
                        className="block p-4 bg-white rounded-lg border border-gray-100 hover:border-[#1C9FDD] hover:shadow-md transition-all duration-300 ease-in-out relative group"
                    >
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={16} className="text-[#1C9FDD]" />
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2 pr-6 line-clamp-2">
                            {campaign.campaign_title}
                        </h3>

                        <div className="flex items-center text-sm text-gray-500 space-x-3">
                            <div className="flex items-center">
                                <User size={14} className="mr-1" />
                                <span className="truncate max-w-[100px]">{campaign.user}</span>
                            </div>

                            <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                <span>{timeAgo}</span>
                            </div>
                        </div>

                        {/* Campaign Category if available */}
                        {campaign.category && (
                            <div className="mt-2">
                                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                    {campaign.category}
                                </span>
                            </div>
                        )}
                    </Link>
                );
            })}

        </div>
    );
};

export default LatestCampaigns;