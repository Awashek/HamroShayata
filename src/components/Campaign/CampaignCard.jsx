import React from 'react';
import { Link } from 'react-router-dom';
import data from '../../database/data.json';

const CampaignCard = () => {
    return (
        <div className="flex justify-center p-6 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.map((campaign) => {
                    // Calculate progress percentage
                    const progressPercentage = Math.min((campaign.raised / campaign.goal) * 100, 100);
                    const progressBarColor = progressPercentage >= 100 ? 'bg-red-500' : 'bg-green-500';

                    return (
                        <Link
                            key={campaign.id}
                            to={`/campaigns/${campaign.id}`}
                            className="block bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 w-80"
                        >
                            {/* Image Section */}
                            <div className="relative">
                                <img
                                    src={campaign.image}
                                    alt={campaign.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs uppercase font-semibold px-2 py-1 rounded">
                                    {campaign.category}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5">
                                {/* Title */}
                                <h2 className="font-bold text-lg text-gray-900 mb-2">
                                    {campaign.title}
                                </h2>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4">
                                    {campaign.description}
                                </p>

                                {/* Donors */}
                                <p className="text-gray-500 text-sm mb-4">
                                    {campaign.donors} Donors
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="relative h-2 bg-gray-200 rounded-full">
                                        <div
                                            className={`absolute top-0 left-0 h-full ${progressBarColor} rounded-full`}
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm">
                                        <span className="text-gray-800 font-semibold">
                                            ${campaign.raised.toLocaleString()} raised
                                        </span>
                                        <span
                                            className={`${progressPercentage >= 100 ? 'text-red-600' : 'text-green-600'
                                                } font-semibold`}
                                        >
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

export default CampaignCard;
