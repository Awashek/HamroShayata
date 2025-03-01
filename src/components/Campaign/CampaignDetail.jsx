import { useParams } from "react-router-dom";
import data from "../../database/data.json";
import { useEffect, useState } from "react";

const CampaignDetail = () => {
    const creator = {
        profileImage: "https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000",
        name: "Luffy San",
        bio: "Web Developer and Tech Enthusiast. Passionate about creating impactful digital experiences."
    };

    const recentDonors = [
        { name: "John Doe", amount: 50 },
        { name: "Jane Smith", amount: 20 },
        { name: "Michael Lee", amount: 30 },
    ];

    const staticComments = [
        { name: "Alice", comment: "This is such a great cause! Happy to contribute.", donationAmount: 50 },
        { name: "Bob", comment: "Keep up the good work! I'm rooting for you.", donationAmount: 20 },
    ];

    const { campaignId } = useParams();
    const [fetchedCampaign, setFetchedCampaign] = useState(null);
    const [comments, setComments] = useState(staticComments); // For storing the new comments
    const [isModalOpen, setIsModalOpen] = useState(false); // For opening/closing modal
    const [amount, setAmount] = useState(""); // For storing donation amount
    const [fullName, setFullName] = useState(""); // For storing full name
    const [donationType, setDonationType] = useState(""); // For storing full name

    useEffect(() => {
        const selectedCampaign = data.find((item) => item.id === parseInt(campaignId));
        if (selectedCampaign) {
            setFetchedCampaign(selectedCampaign);
        } else {
            console.log("Campaign not found.");
        }
    }, [campaignId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Add the comment and donation data to the comments list
        setComments([
            ...comments,
            { name: fullName, donationAmount: amount, donationType: donationType }  // Include donation amount in the comment object
        ]);
    
        // Prepare the donation data to be sent to the backend
        const donationData = {
            donor: fullName,  // Replace with the actual user ID (could be fetched from state or context)
            campaign: campaignId,  // This comes from useParams (the current campaign ID from the URL)
            amount: amount,
            donation_type: donationType
        };
    
        try {
            // Post the donation data to your backend API (replace with your actual endpoint)
            const response = await fetch('http://127.0.0.1:8000/api/donations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData),
            });
    
            if (response.ok) {
                console.log('Donation successfully posted');
                // Optionally, you can update the raised amount or show a success message
            } else {
                console.error('Failed to post donation');
            }
        } catch (error) {
            console.error('Error posting donation:', error);
        }
    
        // Clear the form fields and close the modal
        setAmount("");
        setFullName(""); // Reset full name after submit
        setIsModalOpen(false);
    };
    
    

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    if (!fetchedCampaign) {
        return <h1 className="text-center text-2xl font-semibold text-gray-700">Loading...</h1>;
    }

    // Calculate the progress percentage
    const progress = (fetchedCampaign.raised / fetchedCampaign.goal) * 100;

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6">
            {/* Left side: Campaign details */}
            <div className="lg:w-2/3 bg-white shadow-xl rounded-lg p-6  border border-gray-200">
                <img
                    src={fetchedCampaign.image}
                    alt={fetchedCampaign.title}
                    className="w-full h-96 object-cover rounded-lg mb-4 shadow-md"
                />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{fetchedCampaign.title}</h2>
                <p className="text-gray-600 text-lg mb-6">{fetchedCampaign.description}</p>
                <p className="text-gray-500 text-sm mb-4">{fetchedCampaign.donors} Donors</p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Raised: ${fetchedCampaign.raised}</span>
                        <span className="font-semibold text-gray-700">Goal: ${fetchedCampaign.goal}</span>
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
                    onClick={handleModalOpen}
                    className="bg-blue-600 text-white p-2 rounded-md mb-4"
                >
                    Add Comment & Donate Now
                </button>

                {/* Comment Section */}
                {<div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Comments</h3>
                    {comments.map((comment, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-gray-800 font-semibold">{comment.name}</p>
                            <p className="text-gray-600">{comment.comment}</p>
                            <p className="text-green-600 font-semibold">Donation: ${comment.donationAmount}</p> {/* Display donation amount */}
                        </div>
                    ))}
                </div>}
            </div>

            {/* Right side: Creator Profile */}
            <div className="lg:w-1/3 space-y-8">
                {/* Creator Profile Box */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">About the Creator</h3>
                    <div className="flex items-center space-x-4">
                        <img
                            src={creator.profileImage}
                            alt={creator.name}
                            className="w-20 h-20 rounded-full shadow-lg"
                        />
                        <div>
                            <p className="text-gray-800 font-semibold text-lg">{creator.name}</p>
                            <p className="text-gray-600 text-sm mt-2">{creator.bio}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Donors List */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 ">
                    <h3 className="text-xl font-semibold mb-4">Recent Donors</h3>
                    <div className="space-y-4">
                        {recentDonors.map((donor, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <p className="text-slate-600 font-semibold">{donor.name}</p>
                                <p className="text-green-600">${donor.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Donation & Comment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Donate to {fetchedCampaign.title}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} // Handle input change
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                                required
                            />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                                required
                            />
                            <textarea
                            type="text"
                            value={donationType}
                            onChange={(e) => setDonationType(e.target.value)}
                                placeholder="Donation Type"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            >
                                Donate Now
                            </button>
                        </form>
                        <button
                            onClick={handleModalClose}
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
