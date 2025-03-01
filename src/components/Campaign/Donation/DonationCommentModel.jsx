import { useState } from "react";

const DonationCommentModal = ({ campaign, onDonateAndComment }) => {
    const [amount, setAmount] = useState("");
    const [feedback, setFeedback] = useState("");
    const [fullName, setFullName] = useState("");
    const [comment, setComment] = useState(""); // Add state for comment
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass both donation data and comment to the parent component
        onDonateAndComment(fullName, amount, feedback, comment);

        // Clear the form fields and close the modal
        setAmount("");
        setFeedback("");
        setFullName("");
        setComment(""); // Reset comment after submit
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* Donate Button */}
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
                        <h3 className="text-xl font-semibold mb-4">Donate and Leave a Comment for {campaign.title}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} // Handle full name input
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                                required
                            />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter donation amount"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                                required
                            />
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Leave a message (optional)"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            ></textarea>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)} // Handle comment input
                                placeholder="Leave a comment (optional)"
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

export default DonationCommentModal;
