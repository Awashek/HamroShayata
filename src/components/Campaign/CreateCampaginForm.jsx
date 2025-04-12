import React, { useState, useContext } from "react";
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
    const [showReview, setShowReview] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
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
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value.trim(),
        }));

        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files[0],
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
            else if (isNaN(parseFloat(formData.goal_amount))) {
                newErrors.goal_amount = "A valid number is required.";
            }
            if (!formData.deadline) newErrors.deadline = "Deadline is required";
            else {
                const deadlineDate = new Date(formData.deadline);
                if (isNaN(deadlineDate.getTime())) {
                    newErrors.deadline = "Date has wrong format. Use YYYY-MM-DD.";
                }
            }
        } else if (step === 3) {
            if (formData.images && !(formData.images instanceof File)) {
                newErrors.images = "Invalid file format.";
            }
            if (formData.citizenship_id && !(formData.citizenship_id instanceof File)) {
                newErrors.citizenship_id = "Invalid file format.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm = () => {
        let newErrors = {};
        const requiredFields = ["first_name", "last_name", "campaign_title", "description", "goal_amount", "deadline", "category"];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = "This field is required.";
            }
        });

        if (formData.goal_amount && isNaN(parseFloat(formData.goal_amount))) {
            newErrors.goal_amount = "A valid number is required.";
        }

        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            if (isNaN(deadlineDate.getTime())) {
                newErrors.deadline = "Date has wrong format. Use YYYY-MM-DD.";
            }
        }

        if (formData.images && !(formData.images instanceof File)) {
            newErrors.images = "Invalid file format.";
        }

        if (formData.citizenship_id && !(formData.citizenship_id instanceof File)) {
            newErrors.citizenship_id = "Invalid file format.";
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

    const openReviewModal = () => {
        if (validateStep() && validateForm()) {
            setShowReview(true);
        }
    };

    const closeReviewModal = () => {
        setShowReview(false);
    };

    const closeSuccessModal = () => {
        setShowSuccess(false);
        navigate("/");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        if (!authTokens) {
            alert("You must be logged in to create a campaign.");
            return;
        }

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== '') {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await createCampaign(formDataToSend);
            if (response.success) {
                setSuccessMessage("Campaign created successfully! It is now pending admin approval.");
                setShowSuccess(true); // Add this line
                setShowReview(false); // Close the review modal

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
            } else {
                setErrors(response.errorData || { general: "Something went wrong with the submission. Please try again." });
            }
        } catch (error) {
            console.error("Error creating campaign:", error);
            setErrors({ general: error.message || "Network error. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date for display in review modal
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get file names for display
    const getFileName = (file) => {
        if (!file) return 'No file selected';
        return file.name;
    };

    // Review Modal Component
    const ReviewModal = () => {
        if (!showReview) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-90vh overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#1C9FDD] mb-6">Review Your Campaign</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Personal Information</h3>
                                    <p><span className="text-gray-500">Name:</span> {formData.first_name} {formData.last_name}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Campaign Details</h3>
                                    <p><span className="text-gray-500">Title:</span> {formData.campaign_title}</p>
                                    <p><span className="text-gray-500">Category:</span> {formData.category}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700">Description</h3>
                                <p className="text-gray-600">{formData.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Financial Details</h3>
                                    <p><span className="text-gray-500">Goal Amount:</span> ₹{formData.goal_amount}</p>
                                    <p><span className="text-gray-500">Deadline:</span> {formatDate(formData.deadline)}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Documents</h3>
                                    <p><span className="text-gray-500">Images:</span> {getFileName(formData.images)}</p>
                                    <p><span className="text-gray-500">Citizenship ID:</span> {formData.citizenship_id ? getFileName(formData.citizenship_id) : 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <button
                                onClick={closeReviewModal}
                                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-400 transition-all duration-300"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-[#1C9FDD] text-white py-2 px-6 rounded-lg hover:bg-[#0f7fb8] transition-all duration-300"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Success Modal Component
    const SuccessModal = () => {
        if (!showSuccess) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-lg w-full text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Campaign Created Successfully!</h2>
                    <p className="text-gray-600 mb-6">Your campaign has been submitted and is pending approval. You will receive an update once it's reviewed.</p>
                    <button
                        onClick={closeSuccessModal}
                        className="bg-[#1C9FDD] text-white py-3 px-8 rounded-lg hover:bg-[#0f7fb8] transition-all duration-300 w-full md:w-auto"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="w-full p-6 md:p-8 lg:p-12">
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

                        {/* General errors display */}
                        {errors.general && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                <p>{errors.general}</p>
                            </div>
                        )}

                        <form onSubmit={(e) => { e.preventDefault(); openReviewModal(); }} className="space-y-6">
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
                                            <option value="environment">Environment</option>
                                            <option value="animal">Animal</option>
                                            <option value="business">Business</option>
                                            <option value="community">Community</option>
                                            <option value="emergency">Emergency</option>
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
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.description ? 'border-red-500' : ''}`}
                                            placeholder="Tell your story and explain why you're raising funds..."></textarea>
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Goal Amount (Rupees)</label>
                                        <input name="goal_amount" type="number" value={formData.goal_amount} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.goal_amount ? 'border-red-500' : ''}`}
                                            placeholder="0.00" />
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
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <input name="images" type="file" onChange={handleFileChange}
                                                className="hidden" id="images-upload" />
                                            <label htmlFor="images-upload" className="cursor-pointer">
                                                <div className="text-[#1C9FDD] mb-2">
                                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                                <p className="text-gray-700 font-medium">Click to upload your campaign image</p>
                                                <p className="text-gray-500 text-sm mt-1">Showcase your campaign with an image</p>
                                            </label>
                                            {formData.images && (
                                                <div className="mt-4 text-sm text-gray-600">
                                                    Selected: {formData.images.name}
                                                </div>
                                            )}
                                            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Upload Citizenship ID</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <input name="citizenship_id" type="file" onChange={handleFileChange}
                                                className="hidden" id="id-upload" />
                                            <label htmlFor="id-upload" className="cursor-pointer">
                                                <div className="text-[#1C9FDD] mb-2">
                                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                    </svg>
                                                </div>
                                                <p className="text-gray-700 font-medium">Click to upload your ID</p>
                                                <p className="text-gray-500 text-sm mt-1">This is required for verification purposes</p>
                                            </label>
                                            {formData.citizenship_id && (
                                                <div className="mt-4 text-sm text-gray-600">
                                                    Selected: {formData.citizenship_id.name}
                                                </div>
                                            )}
                                            {errors.citizenship_id && <p className="text-red-500 text-sm mt-1">{errors.citizenship_id}</p>}
                                        </div>
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
                                        className="bg-[#1C9FDD] text-white py-2 px-6 rounded-lg hover:bg-[#0f7fb8] transition-all duration-300 ml-auto"
                                    >
                                        Next
                                    </button>
                                )}
                                {step === 3 && (
                                    <button
                                        type="submit"
                                        className="bg-[#1C9FDD] text-white py-2 px-6 rounded-lg hover:bg-[#0f7fb8] transition-all duration-300 ml-auto"
                                    >
                                        Review Campaign
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ReviewModal />
            <SuccessModal />
        </>
    );
};

export default CreateCampaignForm;