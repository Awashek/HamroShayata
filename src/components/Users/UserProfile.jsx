import React from "react";

const UserProfile = () => {
    return (
        <div className="max-w-lg mx-auto bg-white shadow-xl rounded-2xl p-8">
            {/* User Info */}
            <div className="flex items-center space-x-6 mb-10">
                
                    <img src="https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000" alt="" 
                    
                    className="w-20 h-20 rounded-full shadow-lg"/>
                
                <div>
                    <h2 className="text-3xl font-bold text-[#1C9FDD] mb-2">John Doe</h2>
                    <p className="text-gray-600 text-sm">john.doe@example.com</p>
                </div>
            </div>

            {/* Personal Details */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Personal Details</h3>
                <p className="text-gray-700 text-lg">
                    <span className="font-medium ">Location:</span> New York, USA
                </p>
                <p className="text-gray-700 text-lg">
                    <span className="font-medium">Member Since:</span> January 2022
                </p>
            </div>

            {/* Donation History */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Donation History</h3>
                <ul className="text-gray-700 space-y-3">
                    <li className="flex justify-between">
                        <span className="font-medium">Save the Whales:</span>
                        <span className="text-green-500">$100</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Medical Aid for John:</span>
                        <span className="text-green-500">$50</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Charity for Homeless:</span>
                        <span className="text-green-500">$75</span>
                    </li>
                </ul>
            </div>

            {/* Rewards Points */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Rewards Points</h3>
                <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-[#1C9FDD] rounded-full"
                        style={{ width: "50%" }} // Adjust dynamically
                    ></div>
                </div>
                <p className="mt-3 text-sm text-gray-700 font-semibold">2500 Points</p>
            </div>

            {/* Campaigns Created */}
            <div>
                <h3 className="text-xl font-semibold text-[#1C9FDD] mb-4">Campaigns Created</h3>
                <ul className="text-gray-700 space-y-3">
                    <li className="flex justify-between">
                        <span className="font-medium">Save the Whales</span>
                        <span className="text-gray-500 text-sm">3 Days Left</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-medium">Help Local School</span>
                        <span className="text-gray-500 text-sm">5 Days Left</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserProfile;
