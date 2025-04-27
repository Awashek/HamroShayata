import { toast } from 'react-toastify';
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userCount, setUserCount] = useState(0);
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSlider, setShowSlider] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (authTokens) {
      const decodedUser = jwtDecode(authTokens.access);
      const currentTime = Date.now() / 1000;

      if (decodedUser.exp < currentTime) {
        logoutUser();
      } else {
        setUser(decodedUser);

        // Only fetch users if admin
        if (decodedUser.is_admin) {
          fetchUsers();
          navigate("/dashboard");
        }
      }
    }
    setLoading(false);
  }, [authTokens, navigate]);

  const fetchUsers = async () => {
    if (!authTokens) {
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/", {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.status === 403) {
        // Handle forbidden case specifically
        console.error("Access denied - insufficient permissions");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      setUserCount(data.length);
    } catch (err) {
      console.error("Error fetching users:", err);
      // Consider showing a toast notification for the user
      toast.error("Could not load user data. You may not have sufficient permissions.");
    } finally {
      setAuthLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = jwtDecode(data.access);
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(userData);

        // Show success toast
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
        });

        if (userData.is_admin) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
        return true;
      } else {
        throw new Error(data.detail || "Login failed");
      }
    } catch (error) {
      // Show error toast
      toast.error(error.message || 'Login failed. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
      return false;
    }
  };

  const registerUser = async (username, email, password, password2) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password2,
        }),
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        toast.success('Registration successful! Please log in.', {
          position: "top-right",
          autoClose: 5000,
        });
        return { status: 201, data };
      } else {
        // Handle different error cases with specific messages
        if (response.status === 400) {
          if (data.username) {
            toast.error(`Username error: ${data.username[0]}`, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (data.email) {
            toast.error(`Email error: ${data.email[0]}`, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (data.password) {
            toast.error(`Password error: ${data.password[0]}`, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (data.password2) {
            toast.error(`Password confirmation error: ${data.password2[0]}`, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (data.non_field_errors) {
            toast.error(data.non_field_errors[0], {
              position: "top-right",
              autoClose: 5000,
            });
          } else {
            toast.error('Registration failed. Please check your details.', {
              position: "top-right",
              autoClose: 5000,
            });
          }
        } else {
          toast.error('Registration failed. Please try again.', {
            position: "top-right",
            autoClose: 5000,
          });
        }
        
        return { 
          status: response.status, 
          errorData: data 
        };
      }
    } catch (error) {
      toast.error('Network error. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
      return { 
        status: 500, 
        errorData: { detail: 'Network error. Please try again.' } 
      };
    }
  };


  const forgotPassword = async (email) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/password-reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset link sent to your email", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        throw new Error(data.detail || "Failed to send reset email");
      }

      return {
        success: response.ok,
        message: response.ok
          ? "Password reset link sent to your email"
          : data.detail || "Failed to send reset email",
      };
    } catch (error) {
      toast.error(error.message || "Network error. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  const resetPassword = async (token, newPassword, newPassword2) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/password-reset/confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
          new_password2: newPassword2
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password has been reset successfully", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        throw new Error(data.detail || "Failed to reset password");
      }

      return {
        success: response.ok,
        message: response.ok
          ? "Password has been reset successfully"
          : data.detail || "Failed to reset password",
      };
    } catch (error) {
      toast.error(error.message || "Network error. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setUserCount(0);
    localStorage.removeItem("authTokens");

    // Show info toast
    toast.info('You have been logged out.', {
      position: "top-right",
      autoClose: 3000,
    });

    navigate("/");
  };


  const getAccessToken = () => authTokens?.access;

  const contextData = {
    authTokens,
    setAuthTokens,
    user,
    setUser,
    loginUser,
    registerUser,
    logoutUser,
    userCount,
    setUserCount,
    forgotPassword,
    resetPassword,
    getAccessToken,
    authLoading,
    showSlider,
    setShowSlider
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};