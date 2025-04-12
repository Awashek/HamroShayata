import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DonationButton from "../Donation/DonationButton";
import useAxios from "../../utils/useAxios";
import CampaignDonors from "./CampaginDonors";
import CampaignShare from "./CampaignShare";
const CampaignDetailTest = () => {
    const { id } = useParams();
    const { user, authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [showAllComments, setShowAllComments] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState({});
    const [donors, setDonors] = useState([]);
    const [shareStats, setShareStats] = useState({
        total_shares: 0,
        platform_counts: []
    })

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
                ...response.data  // Now using all data from the response directly
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

    const handleCommentSubmit = async () => {
        if (!user) {
            alert("You must be logged in to comment.");
            navigate("/login");
            return;
        }

        if (!newComment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/comments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`
                },
                body: JSON.stringify({
                    campaign: parseInt(id),
                    text: newComment
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error(errorData.detail || "Failed to post comment");
            }

            const data = await response.json();
            setComments([...comments, data]);
            setNewComment("");
            fetchComments(); // Refresh comments to get nested structure
        } catch (error) {
            console.error("Full error:", error);
            alert("Error: " + error.message);
        }
    };

    const handleReplySubmit = async (parentId) => {
        if (!user) {
            alert("You must be logged in to reply.");
            navigate("/login");
            return;
        }

        if (!replyText.trim()) {
            alert("Reply cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/comments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`
                },
                body: JSON.stringify({
                    campaign: parseInt(id),
                    parent: parentId,
                    text: replyText
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error(errorData.detail || "Failed to post reply");
            }

            const data = await response.json();
            setReplyText("");
            setReplyingTo(null);
            fetchComments(); // Refresh comments to get nested structure
        } catch (error) {
            console.error("Full error:", error);
            alert("Error: " + error.message);
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const renderComments = (comments, depth = 0) => {
        return comments.map((comment) => (
            <div
                key={comment.id}
                className={`mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all ${depth > 0 ? 'ml-8' : ''}`}
                style={{ marginLeft: `${depth * 2}rem` }}
            >
                <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {comment.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 font-semibold">{comment.user}</span>
                    <span className="ml-2 text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                    </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>

                <div className="flex mt-2 space-x-4">
                    {user && (
                        <button
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Reply
                        </button>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <button
                            onClick={() => toggleReplies(comment.id)}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                        >
                            {expandedReplies[comment.id] ? (
                                <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                    </svg>
                                    Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                    Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                </>
                            )}
                        </button>
                    )}
                </div>

                {replyingTo === comment.id && (
                    <div className="mt-3">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows="2"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleReplySubmit(comment.id)}
                                className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Post Reply
                            </button>
                            <button
                                onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                }}
                                className="bg-gray-200 text-gray-700 py-1 px-4 rounded-lg hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && expandedReplies[comment.id] && (
                    <div className="mt-3">
                        {renderComments(comment.replies, depth + 1)}
                    </div>
                )}
            </div>
        ));
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

    // Display only top 3 comments if showAllComments is false
    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6">
                <img
                    src={campaign.images}
                    alt={campaign.campaign_title}
                    className="w-full h-80 object-cover rounded-xl shadow-md"
                />

                <h1 className="text-3xl font-bold text-gray-900 mt-6">{campaign.campaign_title}</h1>
                <p className="text-gray-600 text-lg mt-3 leading-relaxed">{campaign.description}</p>

                <div className="mt-6">
                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-3 text-sm">
                        <span className="text-gray-800 font-bold text-lg">Rs {raisedAmount.toLocaleString()} raised</span>
                        <span className="text-green-600 font-bold text-lg">{progressPercentage.toFixed(0)}% funded</span>
                    </div>

                    <DonationButton
                        campaignId={id}
                        onDonationSuccess={refreshCampaign}
                    />
                </div>

                {/* Comment Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                        </svg>
                        Comments ({comments.length})
                    </h2>

                    {displayedComments.length > 0 ? (
                        <>
                            {renderComments(displayedComments)}

                            {comments.length > 3 && (
                                <button
                                    onClick={() => setShowAllComments(!showAllComments)}
                                    className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all flex items-center justify-center"
                                >
                                    {showAllComments ? (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                            </svg>
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                            Show All Comments ({comments.length - 3} more)
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                        </div>
                    )}

                    {user ? (
                        <div className="mt-6">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="border border-gray-200 p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows="3"
                            />
                            <button
                                onClick={handleCommentSubmit}
                                className="mt-3 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                                Post Comment
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 text-center p-4 bg-gray-50 rounded-xl">
                            <p className="text-gray-600">Want to comment? <span className="text-blue-600 cursor-pointer font-bold underline" onClick={() => navigate('/login')}>Log in</span> first.</p>
                        </div>
                    )}
                </div>
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

export default CampaignDetailTest;