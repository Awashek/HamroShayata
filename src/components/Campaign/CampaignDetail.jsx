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
        { name: "Alice", comment: "This is such a great cause! Happy to contribute." },
        { name: "Bob", comment: "Keep up the good work! I'm rooting for you." },
    ];
    const { campaignId } = useParams();
    const [fetchedCampaign, setFetchedCampaign] = useState(null);

    useEffect(() => {
        // Find the specific campaign using the ID
        const selectedCampaign = data.find((item) => item.id === parseInt(campaignId));
        if (selectedCampaign) {
            setFetchedCampaign(selectedCampaign);
        } else {
            console.log("Campaign not found.");
        }
    }, [campaignId]);

    if (!fetchedCampaign) {
        return <h1 className="text-center text-2xl font-semibold text-gray-700">Loading...</h1>;
    }

    // Calculate the progress percentage
    const progress = (fetchedCampaign.raised / fetchedCampaign.goal) * 100;

    // Determine the progress bar color
    const progressBarColor = progress >= 100 ? "bg-red-500" : "bg-green-500";


    // Social share URLs
    const shareUrl = encodeURIComponent(window.location.href); // Dynamically fetch the current URL

    
  
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
                <p className="text-gray-500 text-sm mb-4">
                    {fetchedCampaign.donors} Donors
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Raised: ${fetchedCampaign.raised}</span>
                        <span className="font-semibold text-gray-700">Goal: ${fetchedCampaign.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            className={`h-4 rounded-full ${progressBarColor}`}
                        ></div>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                        {Math.round(progress)}% of goal reached
                    </div>
                </div>

                {/* Donate Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg mt-4 hover:bg-blue-500 transition duration-300">
                    Donate Now
                </button>

                {/* Comment Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Comments</h3>
                    {staticComments.map((comment, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-gray-800 font-semibold">{comment.name}</p>
                            <p className="text-gray-600">{comment.comment}</p>
                        </div>
                    ))}
                </div>
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

                {/* Share Buttons */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">Share this Campaign</h3>
                    <div className="flex gap-4 justify-center">
                        {/* Facebook */}
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <i className="fa-brands fa-facebook text-3xl"></i>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/?text=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800"
                        >
                            <i class="fa-brands fa-whatsapp text-3xl"></i>
                        </a>

                        {/* X (Twitter) */}
                        <a
                            href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-700"
                        >
                            <i class="fa-brands fa-x-twitter text-3xl"></i>
                        </a>

                        {/* Instagram - Instagram doesn't support direct sharing via URL, so we link to the app */}
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800"
                        >
                            <i class="fa-brands fa-instagram text-3xl"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignDetail;
