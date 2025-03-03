import React, { useState, useContext } from "react";
import AuthContext from "../../context/Authcontext";

const SignUp = ({ onRegistrationSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const { registerUser } = useContext(AuthContext);
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 8; // Example of password validation
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !email || !password || !password2) {
      setError("Please fill all fields");
      return;
    }
  
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
  
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
  
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters");
      return;
    }
  
    const response = await registerUser(username, email, password, password2);
  
    if (response.status === 201) {
      setIsSuccessModalOpen(true);
      onRegistrationSuccess();  // Call the function passed from Navbar to toggle back to login
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
            placeholder="Confirm your password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD]"
            required
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#1C9FDD] text-white py-2 rounded-md"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
