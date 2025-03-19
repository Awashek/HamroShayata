import React, { useState, useContext } from 'react';
import { useCampaigns } from '../../context/CampaignContext';
import { AuthContext } from '../../context/AuthContext';
import useAxios from '../../utils/useAxios'; // import useAxios

const Form = () => {
    const { createCampaign } = useCampaigns();
    const { authTokens, setUser } = useContext(AuthContext);
    //const api = useAxios(); // get axios instance from useAxios hook

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
        status: 'pending',
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authTokens) {
            alert("You must be logged in to create a campaign.");
            return;
        }

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                formDataToSend.append(key, formData[key]);
            }
        });

        console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries()));

        try {
            const result = await createCampaign(formDataToSend);
            if (result.status === 201) {
                alert("Campaign created successfully! It is now pending admin approval.");
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

                // Fetch updated user profile to get the latest reward points
                //const profileResponse = await api.get("/profile/"); // Now using api instance
                //setUser(profileResponse.data); // Change this line
                //setRewardPoints(profileResponse.data.reward_points);
            } else {
                setErrors(result.errorData || { general: "Something went wrong!" });
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
            {Object.keys(errors).map((key) => (
                <p key={key} className="text-red-500 text-sm">{errors[key]}</p>
            ))}

            <input type="text" name="first_name" value={formData.first_name} placeholder="First Name" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="last_name" value={formData.last_name} placeholder="Last Name" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="campaign_title" value={formData.campaign_title} placeholder="Campaign Title" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input type="number" name="goal_amount" value={formData.goal_amount} placeholder="Goal Amount" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="category" value={formData.category} placeholder="Category" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input type="file" name="images" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
            <input type="file" name="citizenship_id" onChange={handleChange} className="w-full p-2 mb-2 border rounded" />

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                {isSubmitting ? "Submitting..." : "Create Campaign"}
            </button>
        </form>
    );
};

export default Form;
