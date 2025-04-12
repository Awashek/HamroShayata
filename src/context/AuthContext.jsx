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
  const navigate = useNavigate();

  useEffect(() => {
    if (authTokens) {
      const decodedUser = jwtDecode(authTokens.access);
      const currentTime = Date.now() / 1000;

      if (decodedUser.exp < currentTime) {
        logoutUser();
      } else {
        setUser(decodedUser);

        // Redirect to dashboard if the user is an admin
        if (decodedUser.is_admin) {
          navigate("/dashboard");
        }
      }
    }
    setLoading(false);
  }, [authTokens, navigate]);

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

        // Redirect to dashboard if the user is an admin
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
      console.error("Login error:", error);
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

      if (response.status === 201) {
        return { status: 201 };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      return { status: 500, errorData: error.message };
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
      return {
        success: response.ok,
        message: response.ok
          ? "Password reset link sent to your email"
          : data.detail || "Failed to send reset email",
      };
    } catch (error) {
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
      return {
        success: response.ok,
        message: response.ok
          ? "Password has been reset successfully"
          : data.detail || "Failed to reset password",
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
  };

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
    getAccessToken: () => authTokens?.access
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
