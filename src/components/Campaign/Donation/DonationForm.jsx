import { useState } from "react";

const DonationForm = ({ campaign, onDonate }) => {
    const [amount, setAmount] = useState("");
    const [feedback, setFeedback] = useState("");
    const [fullName, setFullName] = useState(""); // Add state for full name
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the donation data to the parent component
        onDonate(fullName, amount, feedback);

        // Clear the form fields and close the modal
        setAmount("");
        setFeedback("");
        setFullName(""); // Reset full name after submit
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* Campaign Details Page */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
                Donate Now
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white shadow-lg rounded-lg p-6 w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Donate to {campaign.title}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} // Handle input change
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                                required
                            />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                                required
                            />
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Leave a message (optional)"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            >
                                Donate Now
                            </button>
                        </form>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 text-blue-500 hover:text-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationForm;
