import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { useCampaigns } from "../../context/campaignContext";

const CampaignList = () => {
    const { campaigns, loading } = useCampaigns();

    if (loading) return <div>Loading campaigns...</div>;

    return (
        <div className="flex justify-center p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {campaigns.map((campaign) => {
                    // Ensure values exist
                    const raisedAmount = campaign.raised || 0;
                    const goalAmount = campaign.goal || 1; // Avoid division by zero
                    const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);

                    // Use the first image if it's an array
                  //  const imageSrc = Array.isArray(campaign.images) ? campaign.images[0] : campaign.images;

                    return (
                        <Link
                            key={campaign.id}
                            to={`/campaigns/${campaign.id}`}
                            className="block bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-80"
                        >
                            {/* Image Section */}
                            <div className="relative">
                                <img
                                    src={campaign.images}
                                    alt={campaign.campaign_title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs uppercase font-semibold px-2 py-1 rounded">
                                    {campaign.category}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5">
                                <h2 className="font-bold text-lg text-gray-900 mb-2">
                                    {campaign.campaign_title}
                                </h2>

                                <p className="text-gray-600 text-sm mb-4">
                                    {campaign.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="relative h-2 bg-gray-200 rounded-full">
                                        <div
                                            className={`absolute top-0 left-0 h-full ${
                                                progressPercentage >= 100 ? "bg-green-500" : "bg-blue-500"
                                            } rounded-full`}
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm">
                                        <span className="text-gray-800 font-semibold">
                                            ${raisedAmount.toLocaleString()} raised
                                        </span>
                                        <span className="text-green-600 font-semibold">
                                            {progressPercentage.toFixed(0)}% funded
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default CampaignList;
