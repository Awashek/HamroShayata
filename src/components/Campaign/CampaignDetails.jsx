import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DonationButton from "../Donation/DonationButton";
import useAxios from "../../utils/useAxios";
import CampaignDonors from '../Campaign/Campagindoners/CampaginDonors';
import CampaignShare from "../Campaign/Campaginshare/CampaignShare";
import CommentSection from "../campaigntest/CommentSection";

const CampaignDetails = () => {
    const { id } = useParams();
    const { user, authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [donors, setDonors] = useState([]);
    const [shareStats, setShareStats] = useState({
        total_shares: 0,
        platform_counts: []
    });

    const fetchShareStats = async () => {
        try {
            const response = await axiosInstance.get(`/campaigns/${id}/share_stats/`);
            setShareStats(response.data);
        } catch (error) {
            console.error('Error fetching share stats:', error);
        }
    };

    const calculateDaysLeft = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const timeDiff = end - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysLeft > 0 ? daysLeft : 0; // Returns 0 if deadline has passed
    };

    const refreshCampaign = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${id}/`);
            if (!response.ok) throw new Error("Failed to refresh campaign");
            const data = await response.json();
            setCampaign(data);
        } catch (error) {
            console.error("Refresh error:", error);
        }
    };

    const fetchCampaignDetail = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/campaigns/${id}/`);
            setCampaign({
                ...response.data
            });
        } catch (error) {
            setError(error.response?.data?.detail || error.message);
            console.error("Campaign fetch error:", {
                status: error.response?.status,
                data: error.response?.data
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
            };

            if (authTokens) {
                headers["Authorization"] = `Bearer ${authTokens.access}`;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/comments/?campaign=${id}`, {
                headers: headers,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setError(error.message);
        }
    };

    useEffect(() => {
        const updateDaysLeft = () => {
            // This will trigger a re-render with updated days left
            setCampaign(prev => ({ ...prev }));
        };

        // Update immediately when component mounts
        updateDaysLeft();

        // Then update every 24 hours
        const interval = setInterval(updateDaysLeft, 24 * 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchCampaignDetail();
        fetchComments();
        fetchShareStats();
    }, [id]);

    if (loading) return <div>Loading campaign details...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!campaign) return <div>Campaign not found.</div>;

    const raisedAmount = parseFloat(campaign.current_amount || 0);
    const goalAmount = parseFloat(campaign.goal_amount || 1);
    const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-5 sm:p-8">
                {/* Image section with improved aspect ratio */}
                <div className="overflow-hidden rounded-xl shadow-md">
                    <img
                        src={campaign.images}
                        alt={campaign.campaign_title}
                        className="w-full h-64 sm:h-80 object-cover"
                    />
                </div>

                {/* Title and description with better typography */}
                <div className="mt-6 space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                        {campaign.campaign_title}
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        {campaign.description}
                    </p>
                </div>

                {/* Progress bar section with enhanced styling */}
                <div className="mt-8 space-y-4">
                    <div className="space-y-2">
                        <span className="text-gray-800 font-semibold text-base sm:text-lg pl-2">
                            Rs {raisedAmount.toLocaleString()} raised
                        </span>
                        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <div>
                                <span className="text-gray-500 text-sm sm:text-base block sm:inline sm:ml-2">
                                    Rs {goalAmount.toLocaleString()} Goal
                                </span>
                            </div>
                            <span className="text-green-600 font-semibold text-base sm:text-lg">
                                {progressPercentage.toFixed(0)}% funded
                            </span>
                        </div>
                    </div>

                    {/* Donation button or login prompt based on user state */}
                    <div className="pt-2">
                        <DonationButton
                            campaignId={id}
                            isCampaignFulfilled={raisedAmount >= goalAmount}
                            onDonationSuccess={refreshCampaign}
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>

                {/* Use the CommentSection component */}
                <CommentSection
                    campaignId={id}
                    comments={comments}
                    fetchComments={fetchComments}
                />
            </div>

            {/* Right Sidebar - 1/3 width */}
            <div className="lg:col-span-1 space-y-6">
                {/* Campaign Creator Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Creator</h2>
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                                {campaign.user?.charAt(0).toUpperCase()} {/* Display the first letter of the username */}
                            </div>
                            <div className="ml-4">
                                <h3 className="font-bold text-lg">{campaign.user}</h3> {/* Display the username */}
                                <p className="text-gray-600">Campaign Organizer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Donors List */}
                <CampaignDonors donors={donors} setDonors={setDonors} />

                {/* Social Media Sharing */}
                <CampaignShare campaignId={id} onShareSuccess={fetchShareStats} />

                {/* Campaign Stats */}
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <p className="text-blue-800 font-bold text-2xl">
                                {campaign?.deadline ? calculateDaysLeft(campaign.deadline) : 'N/A'}
                            </p>
                            <p className="text-gray-600 text-sm">Days Left</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl text-center">
                            <p className="text-green-800 font-bold text-2xl">{donors.length || 0}</p>
                            <p className="text-gray-600 text-sm">Donors</p>
                        </div>
                        {/* Updated shares display */}
                        <div className="bg-purple-50 p-4 rounded-xl text-center">
                            <p className="text-purple-800 font-bold text-2xl">
                                {shareStats.total_shares || 0}
                            </p>
                            <p className="text-gray-600 text-sm">Shares</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;