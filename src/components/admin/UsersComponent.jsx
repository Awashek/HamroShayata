import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChevronLeft, ChevronRight, Users, Shield, Award, RefreshCw } from "lucide-react";
import UsersFilter from "./Filters/UsersFilters";

const UsersComponent = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userSubscriptions, setUserSubscriptions] = useState({});
    const [filters, setFilters] = useState({
        role: "all",
        search: "",
        subscription: "all",
        fromDate: "",
        toDate: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const usersPerPage = 10;
    const { getAccessToken, setUserCount } = useContext(AuthContext);
    const { authTokens } = useContext(AuthContext);

    
    const fetchData = async () => {
        setLoading(true);
        try {
            const token = getAccessToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            // Fetch users
            const usersResponse = await fetch("http://127.0.0.1:8000/api/users/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!usersResponse.ok) {
                throw new Error("Failed to fetch users");
            }

            const usersData = await usersResponse.json();

            // Fetch subscriptions
            const subsResponse = await fetch("http://127.0.0.1:8000/api/subscriptions/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Map subscriptions to users
            const subsData = subsResponse.ok ? await subsResponse.json() : [];
            const subscriptionMap = {};
            subsData.forEach(sub => {
                // Assuming each subscription has a user_id or user field
                const userId = sub.user_id || sub.user;
                if (userId) {
                    subscriptionMap[userId] = sub;
                }
            });

            setUserSubscriptions(subscriptionMap);
            setUsers(usersData);
            setFilteredUsers(usersData);
            setUserCount(usersData.length);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, [getAccessToken, setUserCount, authTokens]);

    // Apply filters
    useEffect(() => {
        applyFilters();
    }, [filters, users]);

    const applyFilters = () => {
        let result = [...users];
    
        // Filter by role
        if (filters.role !== "all") {
            const isAdmin = filters.role === "admin";
            result = result.filter(user => user.is_admin === isAdmin);
        }
    
        // Filter by search term (username or email)
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(
                user =>
                    user.username.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by subscription type
        if (filters.subscription !== "all") {
            if (filters.subscription === "none") {
                // Filter users with no subscription
                result = result.filter(user => !userSubscriptions[user.id]);
            } else {
                // Filter users with specific subscription type
                result = result.filter(user => {
                    const userSub = userSubscriptions[user.id];
                    return userSub && userSub.subscription_type === filters.subscription;
                });
            }
        }
        
        // Filter by date range (assuming each user has a date_joined or created_at field)
        if (filters.fromDate) {
            const fromDate = new Date(filters.fromDate);
            result = result.filter(user => {
                const userDate = new Date(user.date_joined || user.created_at);
                return userDate >= fromDate;
            });
        }
        
        if (filters.toDate) {
            const toDate = new Date(filters.toDate);
            // Set time to end of day
            toDate.setHours(23, 59, 59, 999);
            result = result.filter(user => {
                const userDate = new Date(user.date_joined || user.created_at);
                return userDate <= toDate;
            });
        }
    
        setFilteredUsers(result);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // Get subscription type name based on the plan codes
    const getSubscriptionName = (subscriptionType) => {
        const planTypes = {
            'bronze': 'Bronze',
            'silver': 'Silver',
            'gold': 'Gold'
        };
        return planTypes[subscriptionType] || 'No Subscription';
    };

    // Helper function to get user's subscription
    const getUserSubscription = (userId) => {
        const userSub = userSubscriptions[userId];
        if (!userSub) return "No Subscription";
        return getSubscriptionName(userSub.subscription_type);
    };

    // Get subscription style based on plan type
    const getSubscriptionStyle = (subscriptionType) => {
        switch (subscriptionType) {
            case 'Bronze':
                return 'bg-amber-100 text-amber-800';
            case 'Silver':
                return 'bg-gray-200 text-gray-800';
            case 'Gold':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading && !refreshing) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <RefreshCw className="animate-spin h-10 w-10 mx-auto text-indigo-600 mb-4" />
                    <p className="text-lg text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (error && !refreshing) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
                    <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Users</h3>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                        <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                        <p className="text-2xl font-bold text-indigo-600">{users.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                        <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Regular Users</h3>
                        <p className="text-2xl font-bold text-green-600">
                            {users.filter(user => !user.is_admin).length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                        <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Admins</h3>
                        <p className="text-2xl font-bold text-purple-600">
                            {users.filter(user => user.is_admin).length}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-wrap items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
                            <p className="text-sm text-gray-600 mt-1">View and manage all user accounts</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Imported Filter Component */}
                <UsersFilter 
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    setFilters={setFilters}
                />

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subscription
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reward Points
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {refreshing ? (
                                // Loading state within table
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center">
                                        <RefreshCw className="animate-spin h-6 w-6 mx-auto text-indigo-600 mb-2" />
                                        <p className="text-gray-500">Refreshing user data...</p>
                                    </td>
                                </tr>
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map((user) => {
                                    const subscription = getUserSubscription(user.id);
                                    const subscriptionStyle = getSubscriptionStyle(subscription);
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.date_joined).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_admin ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                                                    {user.is_admin ? "Admin" : "User"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${subscriptionStyle}`}>
                                                    {subscription}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Award className="h-4 w-4 text-yellow-500 mr-1" />
                                                    <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                                                        {user.reward_points}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-gray-500 font-medium">No users match your filter criteria</p>
                                            <button
                                                onClick={() => setFilters({ role: "all", search: "" })}
                                                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                            <span className="font-medium">
                                {Math.min(indexOfLastUser, filteredUsers.length)}
                            </span>{" "}
                            of <span className="font-medium">{filteredUsers.length}</span> users
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium
                                    ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </button>
                            <div className="flex items-center">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // For simplicity, show up to 5 page buttons
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            className={`inline-flex items-center justify-center w-8 h-8 mx-1 rounded-md text-sm font-medium
                                                ${currentPage === pageNum
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium
                                    ${currentPage === totalPages || totalPages === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersComponent;