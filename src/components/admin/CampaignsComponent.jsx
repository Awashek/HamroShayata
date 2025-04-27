import React, { useState, useEffect } from "react";
import CampaignsFilter from "../Admin/Filters/CampaignsFilters";
import { useCampaigns } from "../../context/CampaignContext";
import EditCampaignModal from "./EditCampaignModel";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
const CampaignsComponent = ({ campaigns: allCampaigns, loading }) => {
    const { updateCampaign, deleteCampaign } = useCampaigns(); // Use the context functions
    const [selectedCitizenship, setSelectedCitizenship] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("citizenship"); // "citizenship", "campaign", or "description"
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [campaignsPerPage] = useState(10);
    const [processing, setProcessing] = useState({});
    
    // New state for edit and delete functionality
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    // Sort and filter campaigns (unchanged from your original code)
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

    // Pagination logic (unchanged)
    const indexOfLastCampaign = currentPage * campaignsPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
    const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
    const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Format dates in DD-MM-YYYY (unchanged)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    // Format date and time for created_at (unchanged)
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    // Approve campaign handler (unchanged)
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

    // Reject campaign handler (unchanged)
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

    // Open edit modal
    const handleEdit = (campaign) => {
        setSelectedCampaign(campaign);
        setIsEditModalOpen(true);
    };

    // Open delete modal
    const handleDelete = (campaign) => {
        setSelectedCampaign(campaign);
        setIsDeleteModalOpen(true);
    };

    // Handle campaign update
    const handleUpdateCampaign = async (updatedData) => {
        if (!selectedCampaign) return;
        
        try {
            setEditLoading(true);
            // Convert form data for API
            const formData = new FormData();
            
            // Add all updated fields to formData
            Object.keys(updatedData).forEach(key => {
                // Special handling for file inputs
                if (key === 'images' || key === 'citizenship_id') {
                    if (updatedData[key] && updatedData[key] instanceof File) {
                        formData.append(key, updatedData[key]);
                    }
                } else {
                    formData.append(key, updatedData[key]);
                }
            });
            
            await updateCampaign(selectedCampaign.id, formData);
            alert("Campaign updated successfully!");
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating campaign:", error);
            alert(`Failed to update campaign: ${error.message || "Unknown error"}`);
        } finally {
            setEditLoading(false);
        }
    };

    // Handle campaign deletion
    const handleDeleteCampaign = async () => {
        if (!selectedCampaign) return;
        
        try {
            setDeleteLoading(true);
            await deleteCampaign(selectedCampaign.id);
            alert("Campaign deleted successfully!");
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting campaign:", error);
            alert(`Failed to delete campaign: ${error.message || "Unknown error"}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Modal handling (unchanged)
    const handleViewItem = (type, content) => {
        if (type === "citizenship") {
            setSelectedCitizenship(content);
            setSelectedImage(null);
            setSelectedDescription(null);
        } else if (type === "campaign") {
            setSelectedImage(content);
            setSelectedCitizenship(null);
            setSelectedDescription(null);
        } else if (type === "description") {
            setSelectedDescription(content);
            setSelectedCitizenship(null);
            setSelectedImage(null);
        }
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCitizenship(null);
        setSelectedImage(null);
        setSelectedDescription(null);
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
            {/* Modal for viewing images and description (unchanged) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {modalType === "citizenship" ? "Citizenship ID Verification" : 
                                 modalType === "campaign" ? "Campaign Image" : "Campaign Description"}
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
                            ) : modalType === "description" && selectedDescription ? (
                                <div className="prose max-w-none overflow-auto max-h-96 p-4 border border-gray-200 rounded">
                                    {selectedDescription}
                                </div>
                            ) : (
                                <p className="text-gray-500">No content available</p>
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

            {/* Edit Campaign Modal */}
            {isEditModalOpen && selectedCampaign && (
                <EditCampaignModal
                    campaign={selectedCampaign}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={handleUpdateCampaign}
                    loading={editLoading}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedCampaign && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteCampaign}
                    campaignTitle={selectedCampaign.campaign_title}
                    loading={deleteLoading}
                />
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

            {/* Use the CampaignsFilter component (unchanged) */}
            <CampaignsFilter 
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                userFilter={userFilter}
                setUserFilter={setUserFilter}
                startDateFilter={startDateFilter}
                setStartDateFilter={setStartDateFilter}
                endDateFilter={endDateFilter}
                setEndDateFilter={setEndDateFilter}
                deadlineFilter={deadlineFilter}
                setDeadlineFilter={setDeadlineFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                resetFilters={resetFilters}
                uniqueUsers={uniqueUsers}
            />

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
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Campaign Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
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
                                
                                
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {campaign.user}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {campaign.campaign_title}
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
                                                <>
                                                    {/* Edit button */}
                                                    <button
                                                        onClick={() => handleEdit(campaign)}
                                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition duration-200"
                                                        title="Edit Campaign"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    
                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => handleDelete(campaign)}
                                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition duration-200"
                                                        title="Delete Campaign"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${campaign.status === "approved" ? "bg-green-100 text-green-800" :
                                                campaign.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {campaign.images ? (
                                            <button
                                                onClick={() => handleViewItem("campaign", campaign.images)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                            >
                                                View Image
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">No image</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {campaign.description ? (
                                            <button
                                                onClick={() => handleViewItem("description", campaign.description)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                            >
                                                View Description
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">No description</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {campaign.citizenship_id ? (
                                            <button
                                                onClick={() => handleViewItem("citizenship", campaign.citizenship_id)}
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
                                    
                                  
                                </tr>
                            ))}
                            {currentCampaigns.length === 0 && (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
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