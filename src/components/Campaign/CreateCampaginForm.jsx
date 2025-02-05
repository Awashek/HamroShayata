import React, { useState } from "react";

const CreateCampaignForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        campaignTitle: "",
        description: "",
        goalAmount: "",
        deadline: "",
        category: "",
        images: null,
        citizenshipId: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const files = Array.from(e.target.files); // Convert FileList to array
        setFormData({ ...formData, [name]: files });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Display the collected data in the console
        const submittedData = {
            ...formData,
            images: formData.images ? formData.images.map((file) => file.name) : null,
            citizenshipId: formData.citizenshipId ? formData.citizenshipId[0]?.name : null,
        };

        console.log("Form Submitted:", submittedData);
        alert("Form submitted successfully!");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
            <div className="bg-white shadow-lg rounded-lg px-12 py-10 w-full max-w-4xl">
                <h2 className="text-4xl font-bold text-center text-[#1C9FDD] mb-8">
                    Create a New Campaign
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Creator First Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
                                Creator First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Enter first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            />
                        </div>

                        {/* Creator Last Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
                                Creator Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            />
                        </div>

                        {/* Campaign Title */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="campaignTitle">
                                Campaign Title
                            </label>
                            <input
                                id="campaignTitle"
                                name="campaignTitle"
                                type="text"
                                placeholder="Enter campaign title"
                                value={formData.campaignTitle}
                                onChange={handleChange}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            />
                        </div>

                        {/* Goal Amount */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="goalAmount">
                                Goal Amount ($)
                            </label>
                            <input
                                id="goalAmount"
                                name="goalAmount"
                                type="number"
                                placeholder="Enter goal amount"
                                value={formData.goalAmount}
                                onChange={handleChange}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="deadline">
                                Deadline
                            </label>
                            <input
                                id="deadline"
                                name="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                <option value="medical">Medical</option>
                                <option value="education">Education</option>
                                <option value="community">Community</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe your campaign"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        {/* Upload Images */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="images">
                                Upload Images
                            </label>
                            <input
                                id="images"
                                name="images"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            />
                        </div>

                        {/* Upload Citizenship ID */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="citizenshipId">
                                Upload Citizenship ID
                            </label>
                            <input
                                id="citizenshipId"
                                name="citizenshipId"
                                type="file"
                                onChange={handleFileChange}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-center mt-10">
                        <button
                            type="submit"
                            className="bg-[#1C9FDD] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#0f7fb8] focus:outline-none focus:ring-4 focus:ring-[#1C9FDD]/50 transition-all"
                        >
                            Create Campaign
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignForm;
