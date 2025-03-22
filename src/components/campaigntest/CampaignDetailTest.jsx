import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const CampaignDetailTest = () => {
    const { id } = useParams(); // Get campaign ID from URL
    const { authTokens, user } = useContext(AuthContext); // Check user authentication
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");
    const [paymentStatus, setPaymentStatus] = useState(null); // Track payment status
    const [comments, setComments] = useState([]); // State for comments
    const [newComment, setNewComment] = useState(""); // State for new comment input

    useEffect(() => {
        fetchCampaignDetail();
        fetchComments(); // Fetch comments when the component mounts

        // Check for payment status in the URL
        const queryParams = new URLSearchParams(window.location.search);
        const status = queryParams.get("payment_status");

        if (status === "success") {
            setPaymentStatus("success");
            alert("Thank you for your donation!");
            fetchCampaignDetail(); // Refresh campaign data
        } else if (status === "failed") {
            setPaymentStatus("failed");
            alert("Payment failed. Please try again.");
        }

        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }, [id]);

    const fetchCampaignDetail = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${id}/`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch campaign details");

            const data = await response.json();
            setCampaign(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/comments/?campaign=${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Comments response status:", response.status); // Debugging line

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const data = await response.json();
            console.log("Comments data:", data); // Debugging line
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error); // Debugging line
            setError(error.message);
        }
    };


    const verifyPayment = async (payload) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/verify-payment/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authTokens?.access}`,
                },
                body: JSON.stringify({
                    token: payload.token, // Khalti payment token
                    amount: payload.amount, // Amount in paisa
                    donor: user.id, // Donor ID
                    campaign: id, // Campaign ID
                }),
            });

            if (!response.ok) throw new Error("Failed to verify payment");

            const data = await response.json();

            if (data.success) {
                alert("Payment successful! Thank you for your donation.");
                fetchCampaignDetail(); // Refresh campaign data
            } else {
                throw new Error(data.message || "Payment verification failed");
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const handleDonate = async () => {
        if (!user) {
            localStorage.setItem("redirectAfterLogin", window.location.href);
            alert("You must be logged in to donate.");
            navigate("/login");
            return;
        }

        if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }

        // Initialize Khalti Checkout
        const config = {
            publicKey: "7f53480d2f9b4854b55138a9466c4c44", // Replace with your Khalti public key
            productIdentity: `campaign_${id}_donation`, // Unique identifier for the donation
            productName: `Donation for ${campaign.campaign_title}`, // Campaign title
            productUrl: window.location.href, // Current page URL
            eventHandler: {
                onSuccess(payload) {
                    // Handle successful payment
                    console.log("Payment successful:", payload);

                    // Send payload to your backend for verification
                    verifyPayment(payload);
                },
                onError(error) {
                    // Handle payment error
                    console.log("Payment failed:", error);
                    alert("Payment failed. Please try again.");
                },
                onClose() {
                    // Handle modal close
                    console.log("Payment modal closed.");
                },
            },
        };
        console.log("Public Key:", config.publicKey); // Debugging line
        const checkout = new window.KhaltiCheckout(config);

        // Open Khalti payment modal
        checkout.show({ amount: donationAmount * 100 }); // Amount in paisa
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
                    Authorization: `Bearer ${authTokens?.access}`,
                },
                body: JSON.stringify({
                    campaign: id,  // Ensure this is being sent
                    text: newComment,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to post comment");
            }

            const data = await response.json();
            setComments([...comments, data]);  // Add new comment to state
            setNewComment("");  // Clear input field
        } catch (error) {
            alert("Error: " + error.message);
        }
    };


    if (loading) return <div>Loading campaign details...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!campaign) return <div>Campaign not found.</div>;

    const raisedAmount = campaign.raised || 0;
    const goalAmount = campaign.goal || 1; // Avoid division by zero
    const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);

    return (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Campaign Content - 2/3 width */}
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
                        <span className="text-gray-800 font-bold text-lg">${raisedAmount.toLocaleString()} raised</span>
                        <span className="text-green-600 font-bold text-lg">{progressPercentage.toFixed(0)}% funded</span>
                    </div>
                </div>

                {/* Donation Form - Only if Logged In */}
                {user ? (
                    <div className="mt-8 bg-blue-50 p-6 rounded-xl shadow-sm text-center">
                        <h3 className="text-2xl font-bold text-blue-800 mb-6">Support Us</h3>
                        {/* <div className="flex flex-wrap justify-center gap-3 mb-6">
                            <button className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-all shadow-sm">$10</button>
                            <button className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-all shadow-sm">$25</button>
                            <button className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-all shadow-sm">$50</button>
                            <button className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-all shadow-sm">$100</button>
                        </div> */}
                        <div className="mt-4">
                            <input
                                type="number"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                placeholder="Or enter a custom amount"
                                className="border border-blue-200 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                            />
                            <button
                                onClick={handleDonate}
                                className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all font-bold text-lg shadow-md"
                            >
                                Donate Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 bg-blue-50 p-6 rounded-xl text-center">
                        <p className="text-gray-700 text-lg">Want to donate? <span className="text-blue-600 cursor-pointer font-bold underline" onClick={() => navigate('/login')}>Log in</span> first.</p>
                    </div>
                )}

                {/* Display payment status message */}
                {paymentStatus === "success" && (
                    <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-xl border border-green-200 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Payment successful! Thank you for your donation.
                    </div>
                )}
                {paymentStatus === "failed" && (
                    <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Payment failed. Please try again.
                    </div>
                )}

                {/* Comment Section */}
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                        </svg>
                        Comments
                    </h2>
                    {comments.map((comment) => (
                        <div key={comment.id} className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    {comment.user.charAt(0).toUpperCase()}
                                </div>
                                <span className="ml-2 font-semibold">{comment.user}</span>
                                <span className="ml-2 text-sm text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-700">{comment.text}</p>
                        </div>
                    ))}

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
    {/* Campaign Creator Profile */}
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
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Top Donors</h2>
                    <ul className="space-y-4">
                        <li className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                    S
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium">Sarah Johnson</p>
                                    <p className="text-gray-500 text-sm">2 days ago</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600">$250</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    M
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium">Michael Chen</p>
                                    <p className="text-gray-500 text-sm">5 days ago</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600">$150</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                    A
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium">Ashley Wilson</p>
                                    <p className="text-gray-500 text-sm">1 week ago</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600">$100</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                                    T
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium">Thomas Brown</p>
                                    <p className="text-gray-500 text-sm">2 weeks ago</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600">$75</span>
                        </li>
                    </ul>
                    <button className="mt-4 w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm">
                        View All Donors
                    </button>
                </div>

                {/* Social Media Sharing */}
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Campaign</h2>
                    <p className="text-gray-600 mb-4">Help spread the word about this campaign!</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                        <button className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-all font-medium flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.028 10.028 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                            Twitter
                        </button>
                        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all font-medium flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                        </button>
                        <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.33 16.5c-.22.33-.67.5-1.11.5H7.33c-.44 0-.89-.17-1.11-.5-.22-.33-.22-.83 0-1.17L11.89 7.5c.22-.33.67-.5 1.11-.5s.89.17 1.11.5l4.44 7.83c.22.34.22.84 0 1.17z" />
                            </svg>
                            Email
                        </button>
                    </div>
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            value={window.location.href}
                            className="border border-gray-200 p-2 rounded-lg w-full pr-16 bg-gray-50"
                            readOnly
                        />
                        <button className="absolute right-1 top-1 bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 transition-all text-sm">
                            Copy
                        </button>
                    </div>
                </div>

                {/* Campaign Stats */}
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Campaign Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl text-center">
                            <p className="text-blue-800 font-bold text-2xl">{campaign.days_left || 15}</p>
                            <p className="text-gray-600 text-sm">Days Left</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl text-center">
                            <p className="text-green-800 font-bold text-2xl">{campaign.donors || 43}</p>
                            <p className="text-gray-600 text-sm">Donors</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl text-center">
                            <p className="text-purple-800 font-bold text-2xl">{campaign.shares || 127}</p>
                            <p className="text-gray-600 text-sm">Shares</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl text-center">
                            <p className="text-yellow-800 font-bold text-2xl">{campaign.views || 1450}</p>
                            <p className="text-gray-600 text-sm">Views</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetailTest;