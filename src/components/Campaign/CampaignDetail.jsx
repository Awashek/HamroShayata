import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import data from "../../database/data";

const CampaignDetail = () => {
    const { campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [donationAmount, setDonationAmount] = useState(0);
    const [donationType, setDonationType] = useState("General Donation");
    const [fullName, setFullName] = useState("");
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const selectedCampaign = data.find((item) => item.id === Number(campaignId));
        if (selectedCampaign) {
            setCampaign(selectedCampaign);
        }
    }, [campaignId]);

    const handleDonate = () => {
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (donationAmount <= 0) {
            alert("Donation amount must be greater than zero.");
            return;
        }
        setComments([
            ...comments,
            { name: fullName || "Anonymous", comment: `Donated for ${donationType}`, donationAmount }
        ]);
        setShowModal(false);
        setDonationAmount(0);
        setFullName("");
        setDonationType("General Donation");
    };

    if (!campaign) {
        return <h2>Loading...</h2>;
    }

    // Calculate the progress percentage
    const progress = (campaign.raised / campaign.goal) * 100;

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6">
            {/* Left side: Campaign details */}
            <div className="lg:w-2/3 bg-white shadow-xl rounded-lg p-6 border border-gray-200">
                <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-96 object-cover rounded-lg mb-4 shadow-md"
                />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{campaign.title}</h2>
                <p className="text-gray-600 text-lg mb-6">{campaign.description}</p>
                <p className="text-gray-500 text-sm mb-4">{campaign.donors} Donors</p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Raised: ${campaign.raised}</span>
                        <span className="font-semibold text-gray-700">Goal: ${campaign.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            className="h-4 rounded-full bg-green-500"
                        ></div>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                        {Math.round(progress)}% of goal reached
                    </div>
                </div>

                {/* Open Modal Button */}
                <button
                    onClick={handleDonate}
                    className="bg-blue-600 text-white p-2 rounded-md mb-4"
                >
                    Add Comment & Donate Now
                </button>

                {/* Comment Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Recent Donations</h3>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.map((c, index) => (
                                <li key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <p className="text-gray-800 font-semibold">{c.name}</p>
                                    <p className="text-gray-600">{c.comment}</p>
                                    <p className="text-green-600 font-semibold">Donation: ${c.donationAmount}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No donations yet. Be the first to donate!</p>
                    )}
                </div>
            </div>

            {/* Right side: Creator Profile */}
            <div className="lg:w-1/3 space-y-8">
                {/* Creator Profile Box */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">About the Creator</h3>
                    <div className="flex items-center space-x-4">
                        <img
                            src="https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000"
                            alt="Luffy San"
                            className="w-20 h-20 rounded-full shadow-lg"
                        />
                        <div>
                            <p className="text-gray-800 font-semibold text-lg">Luffy San</p>
                            <p className="text-gray-600 text-sm mt-2">Web Developer and Tech Enthusiast. Passionate about creating impactful digital experiences.</p>
                        </div>
                    </div>
                </div>

                {/* Recent Donors List */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">Recent Donors</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-slate-600 font-semibold">John Doe</p>
                            <p className="text-green-600">$50</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-slate-600 font-semibold">Jane Smith</p>
                            <p className="text-green-600">$20</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-slate-600 font-semibold">Michael Lee</p>
                            <p className="text-green-600">$30</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation & Comment Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Make a Donation to {campaign.title}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Full Name (Optional)"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            />
                            <input
                                type="number"
                                placeholder="Donation Amount ($)"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(Number(e.target.value))}
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            />
                            <input
                                type="text"
                                placeholder="Donation Type (e.g., Food, Medical, etc.)"
                                value={donationType}
                                onChange={(e) => setDonationType(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            >
                                Donate Now
                            </button>
                        </form>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 text-blue-500 hover:text-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignDetail;
