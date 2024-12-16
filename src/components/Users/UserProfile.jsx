import React from 'react';

const UserProfile = () => {
    // Static data for now
    const userData = {
        full_name: "John Doe",
        phone_number: "123-456-7890",
        address: "123 Street, Kathmandu, Nepal",
        role: "Donor",
        profile_picture: "https://via.placeholder.com/150", // Example placeholder image
        campaigns_created: [
            { id: 1, title: "Medical Fund for Children" },
            { id: 2, title: "School Supplies for Rural Areas" }
        ],
        donations: [
            { id: 1, amount: 500, campaign: { title: "Medical Fund for Children" } },
            { id: 2, amount: 1000, campaign: { title: "School Supplies for Rural Areas" } }
        ]
    };

    const totalDonations = userData.donations.reduce((total, donation) => total + donation.amount, 0);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            {/* Profile Overview */}
            <div className="text-center mb-8">
                {userData.profile_picture && (
                    <img 
                        src={userData.profile_picture} 
                        alt="Profile" 
                        className="rounded-full w-32 h-32 mx-auto mb-4"
                    />
                )}
                <h2 className="text-2xl font-bold text-gray-800">{userData.full_name}</h2>
                <p className="text-lg text-gray-600">{userData.role}</p>
            </div>

            {/* Personal Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                <p className="mt-2"><strong>Phone:</strong> {userData.phone_number || 'Not provided'}</p>
                <p><strong>Address:</strong> {userData.address || 'Not provided'}</p>
            </div>

            {/* Engagement Stats */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Your Engagement</h3>
                <p className="mt-4 text-lg text-gray-700"><strong>Total Donations Made:</strong> NPR {totalDonations}</p>
                <p className="mt-2 text-lg text-gray-700"><strong>Campaigns Supported:</strong> {userData.campaigns_created.length}</p>
            </div>

            {/* Campaigns Created */}
            <div className="bg-white p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Your Campaigns</h3>
                <ul className="mt-4">
                    {userData.campaigns_created.length === 0 ? (
                        <li className="text-gray-600">No campaigns created yet.</li>
                    ) : (
                        userData.campaigns_created.map((campaign) => (
                            <li key={campaign.id} className="mt-2">
                                <a href={`/campaign/${campaign.id}`} className="text-blue-600 hover:underline">
                                    {campaign.title}
                                </a>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Donations History */}
            <div className="bg-white p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Your Donations</h3>
                <ul className="mt-4">
                    {userData.donations.length === 0 ? (
                        <li className="text-gray-600">No donations made yet.</li>
                    ) : (
                        userData.donations.map((donation) => (
                            <li key={donation.id} className="mt-2">
                                <p><strong>{donation.amount}</strong> donated to <strong>{donation.campaign.title}</strong></p>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Edit Profile and Create Campaign Actions */}
            <div className="text-center mt-6">
                <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                    Edit Profile
                </button>
                <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition ml-4">
                    Create New Campaign
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
