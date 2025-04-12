import React, { useState, useEffect } from "react";
import CampaignList from "./CampaignList";
import LatestCampaigns from "./LatestCampaigns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const AllCampaigns = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const categories = [
        { value: "all", label: "All" },
        { value: "education", label: "Education" },
        { value: "health", label: "Health" },
        { value: "environment", label: "Environment" },
        { value: "animals", label: "Animals" },
    ];

    // Update current page when category or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    // This function will be called by the CampaignList to update total pages
    const handlePaginationUpdate = (total) => {
        setTotalPages(total);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
                {/* Sidebar for Latest Campaigns */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Latest Campaigns</h2>
                        <LatestCampaigns />
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-3/4">
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h1 className="text-3xl font-bold text-center my-4 text-gray-900">Discover Campaigns</h1>

                        {/* Search Bar */}
                        <div className="relative max-w-md mx-auto mb-8">
                            <div className={`flex items-center border-2 rounded-full px-4 py-2 transition-all duration-300 ${isSearchFocused ? "border-[#1C9FDD] shadow-md" : "border-gray-300"
                                }`}>
                                <Search size={20} className={`mr-2 ${isSearchFocused ? "text-[#1C9FDD]" : "text-gray-400"}`} />
                                <input
                                    type="text"
                                    placeholder="Search by title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="w-full focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex justify-center gap-3 mb-8 flex-wrap">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => setSelectedCategory(category.value)}
                                    className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-in-out
                    ${selectedCategory === category.value
                                            ? "bg-[#1C9FDD] text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Campaign List with Filtered Campaigns - 9 per page */}
                    <CampaignList
                        filterCategory={selectedCategory}
                        searchQuery={searchQuery}
                        currentPage={currentPage}
                        itemsPerPage={9}  // Set to 9 campaigns per page
                        onPaginationUpdate={handlePaginationUpdate}
                    />

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center mt-8 mb-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center w-10 h-10 rounded-full mr-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex space-x-1">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show first, last, current, and adjacent pages
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${currentPage === pageNumber
                                                    ? "bg-[#1C9FDD] text-white"
                                                    : "bg-white border border-gray-200 hover:bg-gray-100"
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                                ) {
                                    return <span key={pageNumber} className="flex items-center px-1">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center w-10 h-10 rounded-full ml-2 disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* <div className="text-center text-gray-500 text-sm mb-8">
                        Page {currentPage} of {totalPages}
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default AllCampaigns;