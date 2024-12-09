import React from 'react';

const CampaignCard = ({ title, category, goal, raised, donors, image, description }) => {
    const progressPercentage = Math.min((raised / goal) * 100, 100);

    // Determine progress bar color
    const progressBarColor = progressPercentage >= 100 ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-sm p-4">
            {/* Image Section */}
            <div>
                <img src={image || "https://via.placeholder.com/400x300"} alt={title} className="w-full h-48 object-cover" />
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Category */}
                <p className="text-green-600 font-medium text-xs uppercase mb-2">{category || "Category"}</p>

                {/* Title */}
                <h2 className="font-semibold text-lg text-gray-900">{title || "Campaign Title"}</h2>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-2">{description || "Short campaign description goes here. Keep it concise and impactful."}</p>

                {/* Donors */}
                <p className="text-gray-600 text-sm mt-2">{donors || 0} Donors</p>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                        <div
                            className={`absolute top-0 left-0 h-full ${progressBarColor} rounded-full`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-800 font-semibold">${raised.toLocaleString()} raised</span>
                        <span className={`${progressPercentage >= 100 ? 'text-red-600' : 'text-green-600'} font-semibold`}>
                            {progressPercentage.toFixed(0)}% funded
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
