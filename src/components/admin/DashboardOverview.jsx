import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";

const DashboardOverview = ({ campaigns = [] }) => {
    const { userCount } = useContext(AuthContext);

    const axiosInstance = useAxios();
    
    const [stats, setStats] = useState({
        totalAmount: 0,
        totalDonations: 0,
        loading: true
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch donation data
                const response = await axiosInstance.get('donations/');
                
                if (response.data) {
                    const donations = response.data.map(donation => ({
                        id: donation.id,
                        amount: parseFloat(donation.amount)
                    }));
                    
                    // Calculate total amount
                    const totalAmount = donations.reduce((acc, donation) => acc + donation.amount, 0);
                    
                    setStats({
                        totalAmount,
                        totalDonations: donations.length,
                        loading: false
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                } finally {
                    setStats(prev => ({ ...prev, loading: false }));
                }
            };
    
            fetchDashboardData();
        }, []);

    if (stats.loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6 transition duration-300 ease-in-out hover:shadow-lg">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-500">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900">{userCount}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 transition duration-300 ease-in-out hover:shadow-lg">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-500">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                            <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 transition duration-300 ease-in-out hover:shadow-lg">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Donations</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalDonations}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 transition duration-300 ease-in-out hover:shadow-lg">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Amount</p>
                            <p className="text-3xl font-bold text-gray-900">RS {stats.totalAmount.toFixed()}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Campaign Status */}
            {campaigns.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Pending Approval</h3>
                                <span className="text-yellow-500 font-bold text-lg">
                                    {campaigns.filter(c => c.status === "pending").length}
                                </span>
                            </div>
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-yellow-200">
                                <div style={{ 
                                    width: `${(campaigns.filter(c => c.status === "pending").length / campaigns.length) * 100}%` 
                                }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Approved</h3>
                                <span className="text-green-500 font-bold text-lg">
                                    {campaigns.filter(c => c.status === "approved").length}
                                </span>
                            </div>
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                                <div style={{ 
                                    width: `${(campaigns.filter(c => c.status === "approved").length / campaigns.length) * 100}%` 
                                }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Rejected</h3>
                                <span className="text-red-500 font-bold text-lg">
                                    {campaigns.filter(c => c.status === "rejected").length}
                                </span>
                            </div>
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                                <div style={{ 
                                    width: `${(campaigns.filter(c => c.status === "rejected").length / campaigns.length) * 100}%` 
                                }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Donation Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Donation Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Average Donation</h3>
                            <span className="text-blue-500 font-bold text-lg">
                                RS {stats.totalDonations > 0 ? (stats.totalAmount / stats.totalDonations).toFixed() : 0}
                            </span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                            <div style={{ width: '100%' }} 
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500">
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Donation Goal Progress</h3>
                            <span className="text-purple-500 font-bold text-lg">
                                {Math.min(100, ((stats.totalAmount / 1000000) * 100)).toFixed()}%
                            </span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                            <div style={{ 
                                width: `${Math.min(100, (stats.totalAmount / 1000000) * 100)}%` 
                            }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Total Number of Donations</h3>
                            <span className="text-green-500 font-bold text-lg">
                                {stats.totalDonations}
                            </span>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                            <div style={{ 
                                width: '100%' 
                            }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;