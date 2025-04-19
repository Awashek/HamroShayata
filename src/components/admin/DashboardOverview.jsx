import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useAxios from "../../utils/useAxios";
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const DashboardOverview = ({ campaigns = [] }) => {
    const { userCount, authLoading } = useContext(AuthContext);
    const axiosInstance = useAxios();

    const [stats, setStats] = useState({
        totalAmount: 0,
        totalDonations: 0,
        last7DaysAmount: 0,
        trendData: [],
        loading: true,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch donation data
                const response = await axiosInstance.get('donations/');

                if (response.data) {
                    const donations = response.data.map(donation => ({
                        id: donation.id,
                        amount: parseFloat(donation.amount),
                        date: donation.created_at ? new Date(donation.created_at) : new Date()
                    }));

                    // Calculate total amount
                    const totalAmount = donations.reduce((acc, donation) => acc + donation.amount, 0);

                    // Calculate last 7 days amount
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    
                    const last7DaysAmount = donations
                        .filter(donation => donation.date >= sevenDaysAgo)
                        .reduce((acc, donation) => acc + donation.amount, 0);

                    // Create donation history data for the line chart
                    // Group donations by month for the chart
                    const donationsByMonth = donations.reduce((acc, donation) => {
                        const month = donation.date.toLocaleString('default', { month: 'short' });
                        if (!acc[month]) {
                            acc[month] = 0;
                        }
                        acc[month] += donation.amount;
                        return acc;
                    }, {});

                    // Group campaigns by month for the trend chart
                    const campaignsByMonth = campaigns.reduce((acc, campaign) => {
                        const createdAt = campaign.created_at ? new Date(campaign.created_at) : new Date();
                        const month = createdAt.toLocaleString('default', { month: 'short' });
                        if (!acc[month]) {
                            acc[month] = 0;
                        }
                        acc[month] += 1;
                        return acc;
                    }, {});
                    
                    // Combine campaign and donation data for trend chart
                    const months = [...new Set([...Object.keys(donationsByMonth), ...Object.keys(campaignsByMonth)])];
                    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    
                    // Sort months chronologically
                    months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
                    
                    const trendData = months.map(month => ({
                        month,
                        donations: donationsByMonth[month] || 0,
                        campaigns: campaignsByMonth[month] || 0
                    }));

                    setStats({
                        totalAmount,
                        totalDonations: donations.length,
                        last7DaysAmount,
                        trendData,
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
    }, [campaigns]);

    // Show loading indicator when either dashboard stats or user count is loading
    if (stats.loading || authLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    // Prepare data for campaign status pie chart
    const campaignStatusData = [
        { name: 'Pending', value: campaigns.filter(c => c.status === "pending").length, color: '#FBBF24' },
        { name: 'Approved', value: campaigns.filter(c => c.status === "approved").length, color: '#34D399' },
        { name: 'Rejected', value: campaigns.filter(c => c.status === "rejected").length, color: '#F87171' }
    ];

    // Prepare data for donation statistics bar chart
    const donationStatsData = [
        { name: 'Average Donation', value: stats.totalDonations > 0 ? (stats.totalAmount / stats.totalDonations) : 0, color: '#3B82F6' },
        { name: 'Last 7 Days', value: stats.last7DaysAmount, color: '#8B5CF6' },
        { name: 'Total Donations', value: stats.totalAmount, color: '#EAB308' }
    ];

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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Amount</p>
                            <p className="text-3xl font-bold text-gray-900"> NRs {stats.totalAmount.toFixed()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign & Donation Trend Line Chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign & Donation Trends</h2>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="donations" 
                                name="Donations (NRs)" 
                                stroke="#3B82F6" 
                                activeDot={{ r: 8 }} 
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="campaigns" 
                                name="Campaigns" 
                                stroke="#10B981" 
                                activeDot={{ r: 8 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campaign Status Pie Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Status</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={campaignStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {campaignStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donation Statistics Bar Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Donation Statistics</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={donationStatsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value">
                                    {donationStatsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;