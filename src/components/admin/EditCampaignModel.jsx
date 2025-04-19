import React, { useState, useEffect } from "react";

const EditCampaignModal = ({ campaign, isOpen, onClose, onUpdate, loading }) => {
    const [formData, setFormData] = useState({
        campaign_title: "",
        description: "",
        goal_amount: "",
        deadline: "",
        status: "",
        images: null,
        citizenship_id: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [previewCitizenship, setPreviewCitizenship] = useState(null);

    useEffect(() => {
        if (campaign) {
            setFormData({
                campaign_title: campaign.campaign_title || "",
                description: campaign.description || "",
                goal_amount: campaign.goal_amount || "",
                deadline: campaign.deadline ? campaign.deadline.split('T')[0] : "",
                status: campaign.status || "pending",
                images: null,
                citizenship_id: null
            });
            setPreviewImage(campaign.images || null);
            setPreviewCitizenship(campaign.citizenship_id || null);
        }
    }, [campaign]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));

            // Create preview for images
            const reader = new FileReader();
            reader.onload = (event) => {
                if (name === "images") {
                    setPreviewImage(event.target.result);
                } else if (name === "citizenship_id") {
                    setPreviewCitizenship(event.target.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Edit Campaign</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                            <input
                                type="text"
                                name="campaign_title"
                                value={formData.campaign_title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount (Rs)</label>
                            <input
                                type="number"
                                name="goal_amount"
                                value={formData.goal_amount}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Image</label>
                            <input
                                type="file"
                                name="images"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {previewImage && (
                                <div className="mt-2">
                                    <img src={previewImage} alt="Campaign Preview" className="h-32 object-contain border rounded" />
                                    <p className="text-xs text-gray-500 mt-1">Current Image</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship ID</label>
                            <input
                                type="file"
                                name="citizenship_id"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {previewCitizenship && (
                                <div className="mt-2">
                                    <img src={previewCitizenship} alt="Citizenship Preview" className="h-32 object-contain border rounded" />
                                    <p className="text-xs text-gray-500 mt-1">Current Citizenship ID</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : "Update Campaign"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaignModal;