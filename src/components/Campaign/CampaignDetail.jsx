function CampaignDetail({ campaign, creator, relatedCampaigns }) {
    // Calculate the progress percentage
    const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;

    // Determine the progress bar color based on the goal status
    const progressBarColor =
        progress >= 100 ? 'bg-red-500' : 'bg-green-500'; // Red when goal is reached, Green otherwise

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-6 bg-red-400 ">
            {/* Left side: Campaign details */}
            <div className="lg:w-2/3 bg-white shadow-xl rounded-lg p-6">
                <img
                    src={campaign.coverImage}
                    alt={campaign.title}
                    className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
                />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{campaign.title}</h2>
                <p className="text-gray-600 text-lg mb-6">{campaign.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Raised: ${campaign.raisedAmount}</span>
                        <span className="font-semibold text-gray-700">Goal: ${campaign.goalAmount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                        <div
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            className={`h-4 rounded-full ${progressBarColor}`}
                        ></div>
                    </div>
                    <div className="text-center text-sm text-gray-500">{Math.round(progress)}% of goal reached</div>
                </div>

                {/* Donate Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg mt-4 hover:bg-blue-500 transition duration-300">
                    Donate Now
                </button>

                {/* Comment Section */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Comments</h3>
                    <p className="text-gray-600">No comments yet.</p>
                </div>
            </div>

            {/* Right side: Creator profile and related campaigns */}
            <div className="lg:w-1/3 space-y-8">
                {/* Creator Profile */}
                <div className="bg-white shadow-xl rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">About the Creator</h3>
                    <div className="flex items-center">
                        <img
                            src={creator.profileImage}
                            alt={creator.name}
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <p className="text-gray-800 font-semibold">{creator.name}</p>
                            <p className="text-gray-600 text-sm">{creator.bio}</p>
                        </div>
                    </div>
                </div>

                {/* Related Campaigns */}
                <div className="bg-white shadow-xl rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Related Campaigns</h3>
                    {relatedCampaigns.map((related, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 mb-4 border-b pb-4 last:border-none"
                        >
                            <img
                                src={related.coverImage}
                                alt={related.title}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h4 className="text-gray-800 font-semibold">{related.title}</h4>
                                <p className="text-gray-600 text-sm">
                                    Raised: ${related.raisedAmount} of ${related.goalAmount}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CampaignDetail;
