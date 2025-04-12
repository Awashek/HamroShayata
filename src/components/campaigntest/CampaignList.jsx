import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCampaigns } from "../../context/CampaignContext";

const CampaignList = ({ 
    isHomePage = false, 
    filterCategory = "all", 
    searchQuery = "", 
    currentPage = 1, 
    itemsPerPage = 9,
    onPaginationUpdate 
}) => {
    const { campaigns, loading } = useCampaigns();

    // Filter and paginate campaigns
    const approvedCampaigns = campaigns.filter((campaign) => campaign.status === "approved");

    // Filter by category
    const filteredByCategory = filterCategory === "all"
        ? approvedCampaigns
        : approvedCampaigns.filter((campaign) => campaign.category === filterCategory);

    // Filter by search query
    const filteredCampaigns = filteredByCategory.filter((campaign) =>
        campaign.campaign_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCampaigns = isHomePage 
        ? approvedCampaigns.slice(0, 6) 
        : filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

    // Update pagination in parent component
    useEffect(() => {
        if (!isHomePage && onPaginationUpdate) {
            onPaginationUpdate(totalPages);
        }
    }, [totalPages, isHomePage, onPaginationUpdate]);

    if (loading) return <div className="text-center text-lg font-semibold py-10">Loading campaigns...</div>;

    if (!loading && paginatedCampaigns.length === 0) {
        return (
            <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-gray-700">No campaigns found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {paginatedCampaigns.map((campaign) => {
                    const raisedAmount = parseFloat(campaign.current_amount || 0);
                    const goalAmount = parseFloat(campaign.goal_amount || campaign.goal || 1);
                    const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);

                    return (
                        <Link
                            key={campaign.id}
                            to={`/campaigns/${campaign.id}`}
                            className="block bg-white shadow-lg rounded-2xl overflow-hidden 
                                    transition-all duration-300 ease-in-out transform 
                                    hover:scale-[1.02] hover:shadow-xl hover:opacity-95"
                        >
                            {/* Image Section */}
                            <div className="relative">
                                <img
                                    src={campaign.images}
                                    alt={campaign.campaign_title}
                                    className="w-full h-52 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs uppercase font-semibold px-3 py-1 rounded-md shadow">
                                    {campaign.category}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 space-y-3">
                                <h2 className="font-bold text-xl text-gray-900">
                                    {campaign.campaign_title}
                                </h2>

                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {campaign.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="w-full">
                                    <div className="relative w-full h-2 bg-gray-200 rounded-full">
                                        <div
                                            className={`absolute top-0 left-0 h-full transition-all duration-700 ease-in-out ${progressPercentage >= 100 ? "bg-green-500" : "bg-blue-500"
                                                } rounded-full`}
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm font-medium">
                                        <span className="text-gray-800">
                                            Rs {raisedAmount.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })} raised
                                        </span>
                                        <span className="text-green-600">
                                            {progressPercentage.toFixed(0)}% funded
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Goal: Rs: {goalAmount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Show More Button (only on homepage) */}
            {isHomePage && approvedCampaigns.length > 6 && (
                <div className="flex justify-center mt-10">
                    <Link
                        to="/all-campaigns"
                        className="px-7 py-4 bg-white text-black font-semibold rounded-full shadow-md 
                                border-2 border-gray-300 hover:bg-gray-50 hover:shadow-lg 
                                transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        Show More
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CampaignList;