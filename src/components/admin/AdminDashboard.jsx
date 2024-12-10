import React from "react";
import { HomeIcon, ArchiveBoxIcon, UserIcon, BanknotesIcon, CogIcon } from '@heroicons/react/24/solid';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-8">HamroSahayata Admin</h2>
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
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">Total Campaigns</h2>
                        <p className="text-3xl text-blue-600">120</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">Total Donations</h2>
                        <p className="text-3xl text-green-600">$15,000</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">Active Users</h2>
                        <p className="text-3xl text-yellow-600">350</p>
                    </div>
                </div>

                {/* Campaigns Table */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Latest Campaigns</h2>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
                            <tr>
                                <td className="py-4 px-4">Medical Fund for ABC</td>
                                <td className="py-4 px-4">$10,000</td>
                                <td className="py-4 px-4">$5,000</td>
                                <td className="py-4 px-4 text-green-600">Active</td>
                                <td className="py-4 px-4">
                                    <button className="text-blue-500 hover:text-blue-700">View</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4">Education for XYZ</td>
                                <td className="py-4 px-4">$15,000</td>
                                <td className="py-4 px-4">$8,000</td>
                                <td className="py-4 px-4 text-yellow-600">In Progress</td>
                                <td className="py-4 px-4">
                                    <button className="text-blue-500 hover:text-blue-700">View</button>
                                </td>
                            </tr>
                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>

                {/* Recent Donations */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Donations</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Donor</th>
                                <th className="py-3 px-4 text-left">Amount</th>
                                <th className="py-3 px-4 text-left">Campaign</th>
                                <th className="py-3 px-4 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-4 px-4">John Doe</td>
                                <td className="py-4 px-4">$100</td>
                                <td className="py-4 px-4">Medical Fund for ABC</td>
                                <td className="py-4 px-4">2024-12-01</td>
                            </tr>
                            <tr>
                                <td className="py-4 px-4">Jane Smith</td>
                                <td className="py-4 px-4">$200</td>
                                <td className="py-4 px-4">Education for XYZ</td>
                                <td className="py-4 px-4">2024-12-02</td>
                            </tr>
                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
