import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCampaigns } from "../../context/CampaignContext";
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

    useEffect(() => {
        fetchCampaignDetail();

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
            publicKey: "7f53480d2f9b4854b55138a9466c4c44",// Replace with your Khalti public key
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

    if (loading) return <div>Loading campaign details...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!campaign) return <div>Campaign not found.</div>;

    const raisedAmount = campaign.raised || 0;
    const goalAmount = campaign.goal || 1; // Avoid division by zero
    const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
            <img
                src={campaign.images}
                alt={campaign.campaign_title}
                className="w-full h-64 object-cover rounded-lg"
            />

            <h1 className="text-3xl font-bold text-gray-900 mt-4">{campaign.campaign_title}</h1>
            <p className="text-gray-600 text-lg mt-2">{campaign.description}</p>

            <div className="mt-4">
                <div className="relative h-3 bg-gray-200 rounded-full">
                    <div
                        className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-800 font-semibold">${raisedAmount.toLocaleString()} raised</span>
                    <span className="text-green-600 font-semibold">{progressPercentage.toFixed(0)}% funded</span>
                </div>
            </div>

            {/* Donation Form - Only if Logged In */}
            {user ? (
                <div className="mt-6">
                    <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="Enter donation amount"
                        className="border p-2 rounded-md w-full"
                    />
                    <button
                        onClick={handleDonate}
                        className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                    >
                        Donate Now
                    </button>
                </div>
            ) : (
                <div className="mt-6 text-center">
                    <p className="text-gray-500">Want to donate? <span className="text-blue-500 cursor-pointer underline" onClick={() => navigate('/login')}>Log in</span> first.</p>
                </div>
            )}

            {/* Display payment status message */}
            {paymentStatus === "success" && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                    Payment successful! Thank you for your donation.
                </div>
            )}
            {paymentStatus === "failed" && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                    Payment failed. Please try again.
                </div>
            )}
        </div>
    );
};

export default CampaignDetailTest;