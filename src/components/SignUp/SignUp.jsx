import React, { useState, useContext } from "react";
import AuthContext from "../../context/Authcontext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation for empty fields
    if (!username || !email || !password || !password2) {
      setError("Please fill all fields");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    // If validation passes, try to register the user
    const response = await registerUser(username, email, password, password2);

    if (response.status === 201) {
      setIsSuccessModalOpen(true); // Show success modal
    } else {
      setError("Registration failed, please try again.");
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <h2 className="text-2xl font-semibold text-[#1C9FDD] text-center mb-4">Create a New Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            name="password2"
            placeholder="Re-enter your password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#1C9FDD] text-white py-2 rounded-full hover:bg-[#1577A5]"
        >
          Sign Up
        </button>
      </form>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-[#1C9FDD] mb-4">Success!</h2>
            <p className="text-gray-700 mb-4">Your account has been created successfully.</p>
            <button
              onClick={closeSuccessModal}
              className="w-full bg-[#1C9FDD] text-white py-2 rounded-full hover:bg-[#1577A5]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
