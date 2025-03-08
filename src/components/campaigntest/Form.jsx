import React, { useState, useContext } from 'react';
import { useCampaigns } from '../../context/campaignContext';
import AuthContext from '../../context/Authcontext';

const Form = () => {
    const { createCampaign } = useCampaigns();
    const { authTokens } = useContext(AuthContext);

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
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value.trim(),
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        const requiredFields = ["first_name", "last_name", "campaign_title", "description", "goal_amount", "deadline", "category"];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = "This field is required.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!authTokens) {
            alert("You must be logged in to create a campaign.");
            return;
        }
    
        if (!validateForm()) return;
    
        setIsSubmitting(true);
        setErrors({});
    
        // Convert goal_amount to a number
        const goalAmount = parseFloat(formData.goal_amount);
        if (isNaN(goalAmount)) {
            setErrors({ goal_amount: "A valid number is required." });
            setIsSubmitting(false);
            return;
        }
    
        // Ensure deadline is in correct format
        const deadlineDate = new Date(formData.deadline);
        if (isNaN(deadlineDate.getTime())) {
            setErrors({ deadline: "Date has wrong format. Use one of these formats instead: YYYY-MM-DD." });
            setIsSubmitting(false);
            return;
        }
        const formattedDeadline = deadlineDate.toISOString().split("T")[0]; // Converts to YYYY-MM-DD format
    
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                if (key === "goal_amount") {
                    formDataToSend.append(key, goalAmount);
                } else if (key === "deadline") {
                    formDataToSend.append(key, formattedDeadline);
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
                });
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
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
            <input type="text" name="first_name" value={formData.first_name} placeholder="First Name" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}

            <input type="text" name="last_name" value={formData.last_name} placeholder="Last Name" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}

            <input type="text" name="campaign_title" value={formData.campaign_title} placeholder="Campaign Title" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            {errors.campaign_title && <p className="text-red-500 text-sm">{errors.campaign_title}</p>}

            <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

            <input type="number" name="goal_amount" value={formData.goal_amount} placeholder="Goal Amount" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            {errors.goal_amount && <p className="text-red-500 text-sm">{errors.goal_amount}</p>}

            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline}</p>}

            <input type="text" name="category" value={formData.category} placeholder="Category" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

            <input type="file" name="images" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input type="file" name="citizenship_id" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                {isSubmitting ? "Submitting..." : "Create Campaign"}
            </button>
        </form>
    );
};

export default Form;
