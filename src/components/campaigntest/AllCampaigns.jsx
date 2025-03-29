import React, { useState } from "react";
import CampaignList from "./CampaignList";
import LatestCampaigns from "./LatestCampaigns"; // Import the LatestCampaigns component

const AllCampaigns = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { value: "all", label: "All" },
        { value: "education", label: "Education" },
        { value: "health", label: "Health" },
        { value: "environment", label: "Environment" },
        { value: "animals", label: "Animals" },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
            {/* Sidebar for Latest Campaigns */}
            <div className="w-full lg:w-1/4">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Latest Campaigns</h2>
                <LatestCampaigns />
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4">
                <h1 className="text-3xl font-bold text-center my-8">All Campaigns</h1>

                {/* Search Bar */}
                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#1C9FDD] transition-all duration-300"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex justify-center gap-4 mb-8 flex-wrap">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => setSelectedCategory(category.value)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out 
                                        ${selectedCategory === category.value
                                    ? "bg-[#1C9FDD] text-white border-2 border-[#1C9FDD]"
                                    : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Campaign List with Filtered Campaigns */}
                <CampaignList filterCategory={selectedCategory} searchQuery={searchQuery} />
            </div>
        </div>
    );
};

export default AllCampaigns;