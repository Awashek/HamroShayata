import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const SignUp = ({ onRegistrationSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const { registerUser } = useContext(AuthContext);
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 8; 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUsernameError("");
    setEmailError("");
  
    // Frontend validation
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
      onRegistrationSuccess();
    } else {
      // Handle backend validation errors
      const { errorData } = response;
      
      if (errorData.username) {
        setUsernameError(errorData.username.join(' '));
      }
      
      if (errorData.email) {
        setEmailError(errorData.email.join(' '));
      }
      
      if (errorData.password) {
        setError(errorData.password.join(' '));
      }
      
      if (errorData.detail) {
        setError(errorData.detail);
      }
      
      // Fallback for unexpected error formats
      if (!errorData.username && !errorData.email && !errorData.password && !errorData.detail) {
        setError("Registration failed. Please check your inputs.");
      }
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
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(""); // Clear error when typing
            }}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD] ${
              usernameError ? "border-red-500" : ""
            }`}
            required
          />
          {usernameError && (
            <p className="text-red-500 text-sm mt-1">{usernameError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(""); // Clear error when typing
            }}
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1C9FDD] ${
              emailError ? "border-red-500" : ""
            }`}
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
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
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#1C9FDD] text-white py-2 rounded-md hover:bg-[#1688b8] transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;