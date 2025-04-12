import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxios from '../../utils/useAxios';

const CampaignDonors = ({ donors, setDonors }) => {
    const { id: campaignId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosInstance = useAxios();

    const fetchDonors = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `donations/campaign-donors/?campaign_id=${campaignId}`
            );
            setDonors(response.data); // This updates the state in parent
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setDonors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (campaignId) {
            fetchDonors();
        }
    }, [campaignId]);

    // Sort donors by amount (descending) and display top 3
    const sortedDonors = [...donors].sort((a, b) => b.total_amount - a.total_amount);
    const topDonors = sortedDonors.slice(0, 3);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Top Doners</h2>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>
            ) : (
                <>
                    

                    {donors.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No donors yet. Be the first to support this campaign!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topDonors.map((donor, index) => (
                                <div key={donor.id || index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                            {donor.user__username?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium">
                                                {donor.user__first_name || donor.user__username || 'Anonymous'}
                                            </h3>
                                            <span className="font-bold">Rs. {donor.total_amount.toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Last donated on {new Date(donor.last_donation).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            
                                <div className="text-center mt-4">
                                    <button
                                        onClick={() => navigate(`/campaigns/${campaignId}/donors`)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                                    >
                                        View All Donors 
                                    </button>
                                </div>
                            
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CampaignDonors;