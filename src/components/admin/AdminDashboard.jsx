import React, { useContext, useEffect } from "react";
import { useCampaigns } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
    const { campaigns, loading } = useCampaigns();
    const { user } = useContext(AuthContext);

    // Ensure only admins can access this dashboard
    useEffect(() => {
        if (!user || !user.is_admin) {
            window.location.href = "/"; // Redirect non-admin users
        }
    }, [user]);

    const handleApprove = async (id) => {
        try {
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
                alert("Campaign approved successfully!");
                window.location.reload(); // Refresh the page to reflect changes
            } else {
                const errorData = await response.json();
                alert(`Failed to approve campaign: ${errorData.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error approving campaign:", error);
            alert("An error occurred while approving the campaign.");
        }
    };

    const handleReject = async (id) => {
        try {
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
                alert("Campaign rejected successfully!");
                window.location.reload(); // Refresh the page to reflect changes
            } else {
                const errorData = await response.json();
                alert(`Failed to reject campaign: ${errorData.detail || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error rejecting campaign:", error);
            alert("An error occurred while rejecting the campaign.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Goal Amount
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Deadline
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {campaigns.map((campaign) => (
                            <tr key={campaign.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {campaign.campaign_title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {campaign.user}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${campaign.goal_amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(campaign.deadline).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {campaign.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {campaign.status === "pending" && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleApprove(campaign.id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(campaign.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;