import React, { useState, useContext } from "react";
import CbgImage from "../../assets/images/form-bg.jpg";
import { AuthContext } from "../../context/AuthContext";
import { useCampaigns } from "../../context/CampaignContext";
import { useNavigate } from "react-router-dom";
const CreateCampaignForm = () => {
    const { authTokens } = useContext(AuthContext);
    const { createCampaign } = useCampaigns();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        campaign_title: '',
        description: '',
        goal_amount: '',
        deadline: '',
        category: '',
        images: null,
        citizenship_id: null,
        status: 'pending', // Default status
    });


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,  // Ensuring single-file selection
        }));

        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
    };


    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files.length > 1 ? Array.from(files) : files[0], // Convert FileList to Array
        }));
    };


    const validateStep = () => {
        let newErrors = {};
        if (step === 1) {
            if (!formData.first_name) newErrors.first_name = "First Name is required";
            if (!formData.last_name) newErrors.last_name = "Last Name is required";
            if (!formData.campaign_title) newErrors.campaign_title = "Campaign Title is required";
            if (!formData.category) newErrors.category = "Category is required";
        } else if (step === 2) {
            if (!formData.description) newErrors.description = "Description is required";
            if (!formData.goal_amount) newErrors.goal_amount = "Goal Amount is required";
            if (!formData.deadline) newErrors.deadline = "Deadline is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authTokens) {
            alert("You must be logged in to create a campaign.");
            return;
        }

        if (!validateStep()) return;

        setIsSubmitting(true);
        setErrors({});

        const goalAmount = parseFloat(formData.goal_amount);
        if (isNaN(goalAmount)) {
            setErrors({ goal_amount: "A valid number is required." });
            setIsSubmitting(false);
            return;
        }

        const deadlineDate = new Date(formData.deadline);
        if (isNaN(deadlineDate.getTime())) {
            setErrors({ deadline: "Date format must be YYYY-MM-DD." });
            setIsSubmitting(false);
            return;
        }
        const formattedDeadline = deadlineDate.toISOString().split("T")[0];

        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                if (key === "goal_amount") {
                    formDataToSend.append(key, goalAmount);
                } else if (key === "deadline") {
                    formDataToSend.append(key, formattedDeadline);
                } else if (key === "images" || key === "citizenship_id") {
                    if (Array.isArray(formData[key])) {
                        formData[key].forEach((file) => formDataToSend.append(`${key}[]`, file)); // Append multiple files
                    } else {
                        formDataToSend.append(key, formData[key]); // Append single file
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });

        console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries()));

        try {
            const result = await createCampaign(formDataToSend);
            if (result.status === 201) {
                alert("Campaign created successfully!");
                setFormData({
                    first_name: '',
                    last_name: '',
                    campaign_title: '',
                    description: '',
                    goal_amount: '',
                    deadline: '',
                    category: '',
                    images: null,
                    citizenship_id: null,
                    status: 'pending',
                });
                setStep(1);
                navigate("/");
            } else if (result.errorData) {
                setErrors(result.errorData);
            } else {
                alert("Something went wrong!");
            }
        } catch (error) {
            alert("Network error. Please try again.");
            console.error("Error details:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="flex flex-col md:flex-row w-full max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Image Section - 30% width */}
                    <div className="w-full md:w-3/10 relative">
                        <img
                            src={CbgImage}
                            alt="Campaign-form Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Form Section - 70% width */}
                    <div className="w-full md:w-7/10 p-6 md:p-8 lg:p-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1C9FDD] mb-8">
                            Create a New Campaign
                        </h2>
                        {/* Progress Indicator */}
                        <div className="flex justify-between mb-8 gap-2">
                            {['Step 1', 'Step 2', 'Step 3'].map((label, index) => (
                                <div
                                    key={index}
                                    className={`w-1/3 text-center font-semibold text-sm md:text-base py-2 ${step === index + 1
                                        ? 'bg-[#1C9FDD] text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        } rounded-lg transition-all duration-300`}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">First Name</label>
                                        <input name="first_name" type="text" value={formData.first_name} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.first_name ? 'border-red-500' : ''}`} />
                                        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                                        <input name="last_name" type="text" value={formData.last_name} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.last_name ? 'border-red-500' : ''}`} />
                                        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Campaign Title</label>
                                        <input name="campaign_title" type="text" value={formData.campaign_title} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.campaign_title ? 'border-red-500' : ''}`} />
                                        {errors.campaign_title && <p className="text-red-500 text-sm mt-1">{errors.campaign_title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.category ? 'border-red-500' : ''}`}>
                                            <option value="">Select a category</option>
                                            <option value="medical">Medical</option>
                                            <option value="education">Education</option>
                                            <option value="community">Community</option>
                                        </select>
                                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                    </div>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                                        <textarea name="description" rows="4" value={formData.description} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.description ? 'border-red-500' : ''}`}></textarea>
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Goal Amount (Rupees)</label>
                                        <input name="goal_amount" type="number" value={formData.goal_amount} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.goal_amount ? 'border-red-500' : ''}`} />
                                        {errors.goal_amount && <p className="text-red-500 text-sm mt-1">{errors.goal_amount}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Deadline</label>
                                        <input name="deadline" type="date" value={formData.deadline} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.deadline ? 'border-red-500' : ''}`} />
                                        {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                                    </div>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Upload Images</label>
                                        <input name="images" type="file" multiple onChange={handleFileChange}
                                            className="w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD]" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Upload Citizenship ID</label>
                                        <input name="citizenship_id" type="file" onChange={handleFileChange}
                                            className="w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD]" />
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between mt-10">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-all duration-300"
                                    >
                                        Back
                                    </button>
                                )}
                                {step < 3 && (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-[#1C9FDD] text-white py-2 px-6 rounded-lg hover:bg-[#0f7fb8] transition-all duration-300"
                                    >
                                        Next
                                    </button>
                                )}
                                {step === 3 && (
                                    <button
                                        type="submit"
                                        className="bg-[#23c667] text-white py-2 px-6 rounded-lg hover:bg-[#1ba656] transition-all duration-300"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}                                       
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateCampaignForm;