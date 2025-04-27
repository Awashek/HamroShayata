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

    // Filter approved campaigns and sort by creation date (newest first)
    const approvedCampaigns = campaigns
        .filter((campaign) => campaign.status === "approved")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Newest first

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

    if (loading) return (
        <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-lg font-semibold text-gray-700">Loading campaigns...</div>
        </div>
    );

    if (!loading && paginatedCampaigns.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">No campaigns found</h3>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                    {searchQuery || filterCategory !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "There are currently no active campaigns. Check back later!"}
                </p>
                {searchQuery || filterCategory !== "all" ? (
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Reset Filters
                    </button>
                ) : null}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!isHomePage && (
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {filterCategory === "all" ? "All Campaigns" : `${filterCategory} Campaigns`}
                    </h2>
                    <p className="text-gray-600">
                        Showing {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedCampaigns.map((campaign) => {
                    const raisedAmount = parseFloat(campaign.current_amount || 0);
                    const goalAmount = parseFloat(campaign.goal_amount || campaign.goal || 1);
                    const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);
                    const daysLeft = campaign.end_date
                        ? Math.max(0, Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
                        : null;

                    return (
                        <Link
                            key={campaign.id}
                            to={`/campaigns/${campaign.id}`}
                            className="block bg-white rounded-xl shadow-md overflow-hidden 
                                    transition-all duration-300 ease-in-out transform 
                                    hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Image Section */}
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={campaign.images || "/default-campaign.jpg"}
                                    alt={campaign.campaign_title}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/default-campaign.jpg";
                                    }}
                                />
                                <div className="absolute top-3 left-3 bg-white text-gray-800 text-xs uppercase font-bold px-3 py-1 rounded-full shadow">
                                    {campaign.category}
                                </div>
                                {daysLeft !== null && (
                                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold px-3 py-1 rounded-full shadow">
                                        {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h2 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
                                        {campaign.campaign_title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {campaign.description}
                                    </p>
                                </div>

                                {/* Creator Info */}
                                {campaign.creator && (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            {campaign.creator_avatar ? (
                                                <img src={campaign.creator_avatar} alt={campaign.creator} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs">
                                                    {campaign.creator.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-700">{campaign.creator}</span>
                                    </div>
                                )}

                                {/* Progress Section */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-800">
                                            Raised: Rs {raisedAmount.toLocaleString(undefined, {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </span>
                                        <span className={`font-semibold ${progressPercentage >= 100 ? 'text-green-600' : 'text-blue-600'
                                            }`}>
                                            {progressPercentage.toFixed(0)}%
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${progressPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        Goal: Rs {goalAmount.toLocaleString(undefined, {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                    className={`w-full mt-4 py-2 px-4 rounded-lg font-medium text-white transition-colors ${progressPercentage >= 100
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                >
                                    {progressPercentage >= 100 ? 'Successfully Funded' : 'Support Now'}
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Show More Button (only on homepage) */}
            {isHomePage && approvedCampaigns.length > 6 && (
                <div className="flex justify-center mt-12">
                    <a
                        href="/all-campaigns"
                        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg
                            shadow-sm hover:bg-blue-600 hover:shadow-md transition-all duration-200
                            border-2 border-blue-400 flex items-center"
                    >
                        <span>View All Campaigns</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
};

export default CampaignList;