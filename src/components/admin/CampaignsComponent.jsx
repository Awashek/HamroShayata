import React, { useState, useEffect } from "react";

const CampaignsComponent = ({ campaigns: allCampaigns, loading }) => {
    const [selectedCitizenship, setSelectedCitizenship] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("citizenship"); // "citizenship" or "campaign"
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [campaignsPerPage] = useState(10);
    const [processing, setProcessing] = useState({});

    // Filter states
    const [statusFilter, setStatusFilter] = useState("all");
    const [userFilter, setUserFilter] = useState("");
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const [deadlineFilter, setDeadlineFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // Default sort by newest

    // Get unique users for filter dropdown
    const uniqueUsers = [...new Set(allCampaigns.map(campaign => campaign.user))];

    // Sort and filter campaigns
    useEffect(() => {
        let result = [...allCampaigns];

        // Sort campaigns
        if (sortOrder === "newest") {
            result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortOrder === "oldest") {
            result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        // Apply search query filter
        if (searchQuery.trim() !== "") {
            result = result.filter(campaign =>
                campaign.campaign_title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(campaign => campaign.status === statusFilter);
        }

        // Apply user filter
        if (userFilter) {
            result = result.filter(campaign => campaign.user === userFilter);
        }

        // Apply date range filter
        if (startDateFilter) {
            result = result.filter(campaign =>
                new Date(campaign.created_at || campaign.deadline) >= new Date(startDateFilter)
            );
        }

        if (endDateFilter) {
            result = result.filter(campaign =>
                new Date(campaign.created_at || campaign.deadline) <= new Date(endDateFilter)
            );
        }

        // Apply deadline filter
        if (deadlineFilter) {
            const deadlineDate = new Date(deadlineFilter);
            result = result.filter(campaign => {
                const campaignDeadline = new Date(campaign.deadline);
                return (
                    campaignDeadline.getFullYear() === deadlineDate.getFullYear() &&
                    campaignDeadline.getMonth() === deadlineDate.getMonth() &&
                    campaignDeadline.getDate() === deadlineDate.getDate()
                );
            });
        }

        setFilteredCampaigns(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [allCampaigns, statusFilter, userFilter, startDateFilter, endDateFilter, deadlineFilter, searchQuery, sortOrder]);

    // Pagination logic
    const indexOfLastCampaign = currentPage * campaignsPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
    const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
    const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Format dates in DD-MM-YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    // Format date and time for created_at
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const handleApprove = async (id) => {
        try {
            setProcessing(prev => ({ ...prev, [id]: 'approving' }));

            const authTokens = JSON.parse(localStorage.getItem("authTokens"));
            if (!authTokens?.access) {
                alert("You must be logged in to approve a campaign.");
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${id}/approve/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Campaign approved! Creator has been notified via email.");
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(`Failed to approve: ${errorData.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while approving.");
        } finally {
            setProcessing(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleReject = async (id) => {
        try {
            setProcessing(prev => ({ ...prev, [id]: 'rejecting' }));

            const authTokens = JSON.parse(localStorage.getItem("authTokens"));
            if (!authTokens?.access) {
                alert("You must be logged in to reject a campaign.");
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${id}/reject/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Campaign rejected! Creator has been notified via email.");
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(`Failed to reject: ${errorData.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while rejecting.");
        } finally {
            setProcessing(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleViewImage = (type, imageUrl) => {
        if (type === "citizenship") {
            setSelectedCitizenship(imageUrl);
            setSelectedImage(null);
        } else {
            setSelectedImage(imageUrl);
            setSelectedCitizenship(null);
        }
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCitizenship(null);
        setSelectedImage(null);
    };

    const resetFilters = () => {
        setStatusFilter("all");
        setUserFilter("");
        setStartDateFilter("");
        setEndDateFilter("");
        setDeadlineFilter("");
        setSearchQuery("");
        setSortOrder("newest");
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading campaigns...</div>;
    }

    // Filter for stats
    const pendingCampaigns = allCampaigns.filter(campaign => campaign.status === "pending");
    const approvedCampaigns = allCampaigns.filter(campaign => campaign.status === "approved");
    const rejectedCampaigns = allCampaigns.filter(campaign => campaign.status === "rejected");

    return (
        <div className="space-y-6">
            {/* Modal for viewing images */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {modalType === "citizenship" ? "Citizenship ID Verification" : "Campaign Image"}
                            </h3>
                        </div>
                        <div className="p-4">
                            {modalType === "citizenship" && selectedCitizenship ? (
                                <img
                                    src={selectedCitizenship}
                                    alt="Citizenship ID"
                                    className="w-full h-auto rounded border border-gray-200"
                                />
                            ) : modalType === "campaign" && selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt="Campaign Image"
                                    className="w-full h-auto rounded border border-gray-200"
                                />
                            ) : (
                                <p className="text-gray-500">No image available</p>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[250px]">
                    <h3 className="text-lg font-medium text-gray-900">Total Campaigns</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{allCampaigns.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[250px]">
                    <h3 className="text-lg font-medium text-gray-900">Pending Approval</h3>
                    <p className="text-3xl font-bold text-yellow-500 mt-2">{pendingCampaigns.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[250px]">
                    <h3 className="text-lg font-medium text-gray-900">Approved</h3>
                    <p className="text-3xl font-bold text-green-500 mt-2">{approvedCampaigns.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[250px]">
                    <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
                    <p className="text-3xl font-bold text-red-500 mt-2">{rejectedCampaigns.length}</p>
                </div>
            </div>

            {/* Search bar and sort options */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search by Campaign Title</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search campaigns..."
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-10 py-2 border-gray-300 rounded-md"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Filters section */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                        <select
                            value={userFilter}
                            onChange={(e) => setUserFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Users</option>
                            {uniqueUsers.map((user, index) => (
                                <option key={index} value={user}>{user}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDateFilter}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="date"
                            value={deadlineFilter}
                            onChange={(e) => setDeadlineFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Campaign Management</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Showing {indexOfFirstCampaign + 1} to {Math.min(indexOfLastCampaign, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Campaign Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Citizenship ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Goal Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deadline
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {campaign.campaign_title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {campaign.user}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {campaign.images ? (
                                            <button
                                                onClick={() => handleViewImage("campaign", campaign.images)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                            >
                                                View Image
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">No image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {campaign.citizenship_id ? (
                                            <button
                                                onClick={() => handleViewImage("citizenship", campaign.citizenship_id)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                            >
                                                View ID
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">No ID</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Rs {campaign.goal_amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(campaign.deadline)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateTime(campaign.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${campaign.status === "approved" ? "bg-green-100 text-green-800" :
                                                campaign.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2 items-center">
                                            {campaign.status === "pending" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(campaign.id)}
                                                        disabled={processing[campaign.id] === 'approving'}
                                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition duration-200"
                                                        title="Approve"
                                                    >
                                                        {processing[campaign.id] === 'approving' ? 
                                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg> : 
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        }
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(campaign.id)}
                                                        disabled={processing[campaign.id] === 'rejecting'}
                                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-200"
                                                        title="Reject"
                                                    >
                                                        {processing[campaign.id] === 'rejecting' ? 
                                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg> : 
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        }
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">No actions available</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {currentCampaigns.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No campaigns found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredCampaigns.length > campaignsPerPage && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstCampaign + 1}</span> to{" "}
                                    <span className="font-medium">{Math.min(indexOfLastCampaign, filteredCampaigns.length)}</span> of{" "}
                                    <span className="font-medium">{filteredCampaigns.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Generate page numbers - limit to show at most 5 page numbers */}
                                    {[...Array(totalPages).keys()].slice(
                                        Math.max(0, Math.min(currentPage - 3, totalPages - 5)),
                                        Math.min(totalPages, Math.max(5, currentPage + 2))
                                    ).map(number => (
                                        <button
                                            key={number + 1}
                                            onClick={() => paginate(number + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number + 1
                                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                        >
                                            {number + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignsComponent;