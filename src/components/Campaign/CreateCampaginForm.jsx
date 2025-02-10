import React, { useState } from "react";
import Footer from "../Footer/Footer";
const CreateCampaignForm = () => {
    const [step, setStep] = useState(1);
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
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const files = Array.from(e.target.files);
        setFormData({ ...formData, [name]: files });
    };

    const validateStep = () => {
        let newErrors = {};
        if (step === 1) {
            if (!formData.firstName) newErrors.firstName = "First Name is required";
            if (!formData.lastName) newErrors.lastName = "Last Name is required";
            if (!formData.campaignTitle) newErrors.campaignTitle = "Campaign Title is required";
            if (!formData.category) newErrors.category = "Category is required";
        } else if (step === 2) {
            if (!formData.description) newErrors.description = "Description is required";
            if (!formData.goalAmount) newErrors.goalAmount = "Goal Amount is required";
            if (!formData.deadline) newErrors.deadline = "Deadline is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            if (step < 3) {
                setStep(step + 1);
            }
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (validateStep()) {
            setIsSubmitting(true);
            console.log("Form Submitted:", formData);
            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                alert("Form submitted successfully!");
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
            <div className="bg-white shadow-lg rounded-lg px-6 md:px-12 py-10 w-full max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1C9FDD] mb-8">
                    Create a New Campaign
                </h2>

                {/* Progress Indicator */}
                <div className="flex justify-between mb-6 gap-2">
                    {['Step 1', 'Step 2', 'Step 3'].map((label, index) => (
                        <div key={index} className={`w-1/3 text-center font-semibold text-sm md:text-lg py-2 ${step === index + 1 ? 'bg-[#1C9FDD] text-white' : 'bg-gray-200 text-gray-700'} rounded-lg transition-all duration-300`}>
                            {label}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">First Name</label>
                                <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.firstName ? 'border-red-500' : ''}`} />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                                <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.lastName ? 'border-red-500' : ''}`} />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Campaign Title</label>
                                <input name="campaignTitle" type="text" value={formData.campaignTitle} onChange={handleChange} className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.campaignTitle ? 'border-red-500' : ''}`} />
                                {errors.campaignTitle && <p className="text-red-500 text-sm mt-1">{errors.campaignTitle}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.category ? 'border-red-500' : ''}`}>
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
                        <div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Description</label>
                                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.description ? 'border-red-500' : ''}`}></textarea>
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700 font-medium mb-2">Goal Amount (Rupees)</label>
                                <input name="goalAmount" type="number" value={formData.goalAmount} onChange={handleChange} className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.goalAmount ? 'border-red-500' : ''}`} />
                                {errors.goalAmount && <p className="text-red-500 text-sm mt-1">{errors.goalAmount}</p>}
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700 font-medium mb-2">Deadline</label>
                                <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.deadline ? 'border-red-500' : ''}`} />
                                {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Upload Images</label>
                                <input name="images" type="file" multiple onChange={handleFileChange} className="w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD]" />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700 font-medium mb-2">Upload Citizenship ID</label>
                                <input name="citizenshipId" type="file" onChange={handleFileChange} className="w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD]" />
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
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}  // Keeps it as a button for navigation
                                className="bg-[#1C9FDD] text-white py-2 px-6 rounded-lg hover:bg-[#0f7fb8] transition-all duration-300"
                            >
                                Next
                            </button>
                        ) : (
                            <></>
                        )}
                        {step === 3 ? (
                            <>
                                <button
                                    type="submit"
                                    // Ke
                                    className="bg-[#23c667] text-white py-2 px-6 rounded-lg hover:bg-[#0f7fb8] transition-all duration-300"
                                >
                                    {isSubmitting ? 'Submitting' : 'Submit'}
                                </button>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </form>
            </div>
        </div>
        
    );
};

export default CreateCampaignForm;
