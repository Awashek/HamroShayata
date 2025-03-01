import React, { useState } from 'react';

const CommentModal = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [donationAmount, setDonationAmount] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && comment && donationAmount) {
            onSubmit({ name, comment, amount: donationAmount });
            onClose();  // Close the modal after submission
        } else {
            alert("Please fill all fields.");
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h3 className="text-xl font-semibold mb-4">Add Comment</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                        />
                        <textarea
                            placeholder="Your Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                        />
                        <input
                            type="number"
                            placeholder="Donation Amount"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                        />
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white p-2 rounded-md"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-2 rounded-md"
                            >
                                Donate
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default CommentModal;  // This line makes it the default export
