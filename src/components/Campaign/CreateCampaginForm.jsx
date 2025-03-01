import React, { useState } from "react";
import CbgImage from "../../assets/images/form-bg.jpg";

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
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const files = e.target.files; // This returns a FileList object
        setFormData((prevData) => ({
            ...prevData,
            [name]: files.length > 0 ? files : null, // Store file(s) if available
        }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep()) {
            setIsSubmitting(true);

            const formDataToSend = new FormData();

            // Append each field from formData
            for (const key in formData) {
                if (formData[key] !== null && formData[key] !== "") {
                    // If the field is a file input (either images or citizenshipId)
                    if (key === "images" || key === "citizenshipId") {
                        // Check if it's a FileList (for images and citizenshipId fields)
                        if (formData[key] instanceof FileList) {
                            // For file inputs, ensure we handle multiple files
                            Array.from(formData[key]).forEach((file) => {
                                formDataToSend.append(key, file);
                            });
                        } else {
                            // If it's a single file (non-FileList), append directly
                            formDataToSend.append(key, formData[key]);
                        }
                    } else {
                        // For non-file fields, simply append the value
                        formDataToSend.append(key, formData[key]);
                    }
                }
            }

            // Log the FormData to check its contents
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/campaigns/", {
                    method: "POST",
                    body: formDataToSend,
                });

                if (response.ok) {
                    alert("Form submitted successfully!");
                    setFormData({
                        firstName: "",
                        lastName: "",
                        campaignTitle: "",
                        description: "",
                        goalAmount: "",
                        deadline: "",
                        category: "",
                        images: '',
                        citizenshipId: '',
                    });
                    setStep(1);
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || "Something went wrong!"}`);
                }
            } catch (error) {
                alert("Network error. Please try again.");
                console.error("Error details:", error);
            } finally {
                setIsSubmitting(false);
            }
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
                                        <input name="firstName" type="text" value={formData.firstName} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.firstName ? 'border-red-500' : ''}`} />
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                                        <input name="lastName" type="text" value={formData.lastName} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.lastName ? 'border-red-500' : ''}`} />
                                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Campaign Title</label>
                                        <input name="campaignTitle" type="text" value={formData.campaignTitle} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.campaignTitle ? 'border-red-500' : ''}`} />
                                        {errors.campaignTitle && <p className="text-red-500 text-sm mt-1">{errors.campaignTitle}</p>}
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
                                        <input name="goalAmount" type="number" value={formData.goalAmount} onChange={handleChange}
                                            className={`w-full border rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#1C9FDD] ${errors.goalAmount ? 'border-red-500' : ''}`} />
                                        {errors.goalAmount && <p className="text-red-500 text-sm mt-1">{errors.goalAmount}</p>}
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
                                        <input name="citizenshipId" type="file" onChange={handleFileChange}
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