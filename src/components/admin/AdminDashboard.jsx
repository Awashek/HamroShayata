import React, { useState } from "react";
import {
    HomeIcon,
    ArchiveBoxIcon,
    UserIcon,
    BanknotesIcon,
    CogIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulated login state
    const [campaigns, setCampaigns] = useState([
        { id: 1, name: "Medical Fund for ABC", goal: 10000, donated: 5000, status: "Active" },
        { id: 2, name: "Education for XYZ", goal: 15000, donated: 8000, status: "In Progress" },
    ]);
    const [donations, setDonations] = useState([
        { id: 1, donor: "John Doe", amount: 100, campaign: "Medical Fund for ABC", date: "2024-12-01" },
        { id: 2, donor: "Jane Smith", amount: 200, campaign: "Education for XYZ", date: "2024-12-02" },
    ]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleDeleteCampaign = (id) => {
        setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
    };

    const handleDeleteDonation = (id) => {
        setDonations(donations.filter((donation) => donation.id !== id));
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        alert("Logged out successfully!");
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                    <button
                        onClick={() => setIsLoggedIn(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-blue-600 text-white p-6 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:transform-none`}
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">HamroSahayata Admin</h2>
                    <button onClick={toggleSidebar} className="lg:hidden">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <ul>
                    <li className="mb-6 flex items-center">
                        <HomeIcon className="w-5 h-5 mr-4 text-white" />
                        <button className="text-lg hover:text-blue-300">Dashboard</button>
                    </li>
                    <li className="mb-6 flex items-center">
                        <ArchiveBoxIcon className="w-5 h-5 mr-4 text-white" />
                        <button className="text-lg hover:text-blue-300">Campaigns</button>
                    </li>
                    <li className="mb-6 flex items-center">
                        <UserIcon className="w-5 h-5 mr-4 text-white" />
                        <button className="text-lg hover:text-blue-300">Users</button>
                    </li>
                    <li className="mb-6 flex items-center">
                        <BanknotesIcon className="w-5 h-5 mr-4 text-white" />
                        <button className="text-lg hover:text-blue-300">Donations</button>
                    </li>
                    <li className="mb-6 flex items-center">
                        <CogIcon className="w-5 h-5 mr-4 text-white" />
                        <button className="text-lg hover:text-blue-300">Settings</button>
                    </li>
                    <li className="mb-6 flex items-center">
                        <button
                            onClick={handleLogout}
                            className="text-lg hover:text-blue-300 flex items-center"
                        >
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {/* Mobile Header */}
                <div className="lg:hidden flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <button onClick={toggleSidebar}>
                        <Bars3Icon className="w-6 h-6 text-gray-800" />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-xl font-semibold text-gray-700">Total Campaigns</h2>
                        <p className="text-3xl text-blue-600">{campaigns.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-xl font-semibold text-gray-700">Total Donations</h2>
                        <p className="text-3xl text-green-600">
                            ${donations.reduce((sum, donation) => sum + donation.amount, 0)}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-xl font-semibold text-gray-700">Active Users</h2>
                        <p className="text-3xl text-yellow-600">350</p>
                    </div>
                </div>

                {/* Campaigns Table */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Latest Campaigns</h2>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Campaign</th>
                                <th className="py-3 px-4 text-left">Goal</th>
                                <th className="py-3 px-4 text-left">Donated</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((campaign) => (
                                <tr key={campaign.id}>
                                    <td className="py-4 px-4">{campaign.name}</td>
                                    <td className="py-4 px-4">${campaign.goal}</td>
                                    <td className="py-4 px-4">${campaign.donated}</td>
                                    <td className="py-4 px-4 text-green-600">{campaign.status}</td>
                                    <td className="py-4 px-4">
                                        <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                                        <button
                                            onClick={() => handleDeleteCampaign(campaign.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Donations */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Donations</h2>
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Donor</th>
                                <th className="py-3 px-4 text-left">Amount</th>
                                <th className="py-3 px-4 text-left">Campaign</th>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation.id}>
                                    <td className="py-4 px-4">{donation.donor}</td>
                                    <td className="py-4 px-4">${donation.amount}</td>
                                    <td className="py-4 px-4">{donation.campaign}</td>
                                    <td className="py-4 px-4">{donation.date}</td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => handleDeleteDonation(donation.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;