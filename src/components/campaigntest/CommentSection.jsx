import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const CommentSection = ({ campaignId, comments, fetchComments }) => {
    const { user, authTokens, setShowSlider } = useContext(AuthContext);
    const navigate = useNavigate();

    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [showAllComments, setShowAllComments] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState({});

    const handleCommentSubmit = async () => {
        if (!user) {
            if (setShowSlider) {
                setShowSlider(true);
                alert("Please log in to comment."); // Optional: You can remove this if you prefer
            } else {
                navigate("/login");
            }
            return;
        }

        if (!newComment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/comments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`
                },
                body: JSON.stringify({
                    campaign: parseInt(campaignId),
                    text: newComment
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error(errorData.detail || "Failed to post comment");
            }

            setNewComment("");
            fetchComments(); // Refresh comments to get nested structure
        } catch (error) {
            console.error("Full error:", error);
            alert("Error: " + error.message);
        }
    };

    const handleReplySubmit = async (parentId) => {
        if (!user) {
            if (setShowSlider) {
                setShowSlider(true);
            } else {
                navigate("/login");
            }
            return;
        }

        if (!replyText.trim()) {
            alert("Reply cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/comments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`
                },
                body: JSON.stringify({
                    campaign: parseInt(campaignId),
                    parent: parentId,
                    text: replyText
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error(errorData.detail || "Failed to post reply");
            }

            setReplyText("");
            setReplyingTo(null);
            fetchComments(); // Refresh comments to get nested structure
        } catch (error) {
            console.error("Full error:", error);
            alert("Error: " + error.message);
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const renderComments = (comments, depth = 0) => {
        return comments.map((comment) => (
            <div
                key={comment.id}
                className={`mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all ${depth > 0 ? 'ml-8' : ''}`}
                style={{ marginLeft: `${depth * 2}rem` }}
            >
                <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {comment.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-2 font-semibold">{comment.user}</span>
                    <span className="ml-2 text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                    </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>

                <div className="flex mt-2 space-x-4">
                    {user && (
                        <button
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Reply
                        </button>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <button
                            onClick={() => toggleReplies(comment.id)}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                        >
                            {expandedReplies[comment.id] ? (
                                <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                    </svg>
                                    Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                    Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                </>
                            )}
                        </button>
                    )}
                </div>

                {replyingTo === comment.id && (
                    <div className="mt-3">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows="2"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleReplySubmit(comment.id)}
                                className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Post Reply
                            </button>
                            <button
                                onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                }}
                                className="bg-gray-200 text-gray-700 py-1 px-4 rounded-lg hover:bg-gray-300 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && expandedReplies[comment.id] && (
                    <div className="mt-3">
                        {renderComments(comment.replies, depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    // Display only top 3 comments if showAllComments is false
    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                Comments ({comments.length})
            </h2>

            {displayedComments.length > 0 ? (
                <>
                    {renderComments(displayedComments)}

                    {comments.length > 3 && (
                        <button
                            onClick={() => setShowAllComments(!showAllComments)}
                            className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all flex items-center justify-center"
                        >
                            {showAllComments ? (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                                    </svg>
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                    Show All Comments ({comments.length - 3} more)
                                </>
                            )}
                        </button>
                    )}
                </>
            ) : (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                </div>
            )}

            {user ? (
                <div className="mt-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="border border-gray-200 p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows="3"
                    />
                    <button
                        onClick={handleCommentSubmit}
                        className="mt-3 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        Post Comment
                    </button>
                </div>
            ) : (
                <div className="mt-6 text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600">
                        Want to comment? 
                        <span 
                            className="text-blue-600 cursor-pointer font-bold underline ml-1" 
                            onClick={() => setShowSlider ? setShowSlider(true) : navigate('/login')}
                        >
                            Log in
                        </span> first.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CommentSection;