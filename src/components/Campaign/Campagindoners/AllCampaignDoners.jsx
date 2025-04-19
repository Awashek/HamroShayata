import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '../../../utils/useAxios';

const AllCampaignDonors = () => {
    const { id: campaignId } = useParams();
    const navigate = useNavigate();
    const [donors, setDonors] = useState([]);
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllDonations, setShowAllDonations] = useState(false);
    const axiosInstance = useAxios();

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch campaign details
            const campaignResponse = await axiosInstance.get(`campaigns/${campaignId}/`);
            setCampaign(campaignResponse.data);
            
            // Fetch only completed donations
            const donorsResponse = await axiosInstance.get(
                `donations/campaign-donors/?campaign_id=${campaignId}&status=Completed`
            );
            setDonors(donorsResponse.data);
            
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setDonors([]);
            setCampaign(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (campaignId) {
            fetchData();
        }
    }, [campaignId]);

    // Sort donors by donation amount (descending) and get top 3
    const sortedDonors = [...donors].sort((a, b) => b.total_amount - a.total_amount);
    const displayedDonors = showAllDonations ? sortedDonors : sortedDonors.slice(0, 3);
    
    // Calculate total donation amount
    const totalDonationAmount = donors.reduce((sum, donor) => sum + (donor.total_amount || 0), 0);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Campaign Supporters</h2>
                    {campaign && (
                        <p className="text-gray-600 mt-1 text-lg font-medium">{campaign.campaign_title}</p>
                    )}
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 md:mt-0 px-5 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Campaign
                </button>
            </div>

            {/* Stats Section */}
            {!loading && !error && donors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-5 rounded-xl shadow-sm">
                        <p className="text-sm text-blue-600 font-medium">Total Supporters</p>
                        <p className="text-3xl font-bold text-blue-800">{donors.length}</p>
                    </div>
                    <div className="bg-green-50 p-5 rounded-xl shadow-sm">
                        <p className="text-sm text-green-600 font-medium">Total Donations</p>
                        <p className="text-3xl font-bold text-green-800">Rs. {totalDonationAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-5 rounded-xl shadow-sm">
                        <p className="text-sm text-purple-600 font-medium">Average Donation</p>
                        <p className="text-3xl font-bold text-purple-800">
                            Rs. {donors.length ? Math.round(totalDonationAmount / donors.length).toLocaleString() : 0}
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                    <p className="text-gray-500">Loading supporter data...</p>
                </div>
            ) : error ? (
                <div className="text-red-500 p-6 bg-red-50 rounded-lg border border-red-100 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">{error}</p>
                </div>
            ) : (
                <>
                    {donors.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No supporters yet</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Be the first to support "{campaign?.campaign_title}"! Every contribution makes a difference.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {!showAllDonations && (
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Supporters</h3>
                            )}
                            
                            {/* Top 3 Donors with Badges */}
                            {!showAllDonations && displayedDonors.slice(0, 3).map((donor, index) => {
                                // Badge colors for top 3
                                const badgeColors = [
                                    "bg-yellow-400 text-yellow-800", // Gold
                                    "bg-gray-300 text-gray-800",    // Silver
                                    "bg-amber-600 text-amber-100"   // Bronze
                                ];
                                
                                return (
                                    <div key={donor.id || index} className="flex items-center p-5 border border-gray-200 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                                                {donor.user__username?.charAt(0)?.toUpperCase() || 'A'}
                                            </div>
                                            <div className={`absolute -top-2 -right-2 ${badgeColors[index]} text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white`}>
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="ml-6 flex-1">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-lg">
                                                    {donor.user__first_name || donor.user__username || 'Anonymous'}
                                                </h3>
                                                <span className="font-bold text-blue-600 text-lg">
                                                    Rs. {donor.total_amount?.toLocaleString() || '0'}
                                                </span>
                                            </div>
                                            <p className="text-gray-500">
                                                {donor.last_donation && `Last donated on ${new Date(donor.last_donation).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* All Other Donors */}
                            {showAllDonations && (
                                <>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">All Supporters</h3>
                                    {displayedDonors.map((donor, index) => (
                                        <div key={donor.id || index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                                                {donor.user__username?.charAt(0)?.toUpperCase() || 'A'}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-medium">
                                                        {donor.user__first_name || donor.user__username || 'Anonymous'}
                                                    </h3>
                                                    <span className="font-bold text-blue-600">
                                                        Rs. {donor.total_amount?.toLocaleString() || '0'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {donor.last_donation && `Last donated on ${new Date(donor.last_donation).toLocaleDateString()}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Toggle Button */}
                            {donors.length > 3 && (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={() => setShowAllDonations(!showAllDonations)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                                    >
                                        {showAllDonations ? 'Show Top Supporters' : `View All Supporters (${donors.length})`}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllCampaignDonors;