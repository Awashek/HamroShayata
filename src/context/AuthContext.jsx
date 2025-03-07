import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Create context
export const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
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
      }
    }
    setLoading(false);
  }, [authTokens]);

  async function loginUser(email, password) {
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

        navigate("/");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

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
        return { status: response.status, errorData };
      }
    } catch (error) {
      console.error("Registration failed:", error);
      return { status: 500 };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
  };

  const createCampaign = async (campaignData) => {
    if (!authTokens) {
      console.log("User is not authenticated");
      return { status: 401, message: "Not authenticated" };
    }
    
    try {
      // Check if campaignData is FormData
      if (campaignData instanceof FormData) {
        // If it's FormData, use it directly without setting Content-Type
        const response = await fetch("http://127.0.0.1:8000/api/campaigns/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
            // Don't set Content-Type header when sending FormData
          },
          body: campaignData,
        });
        
        if (response.ok) {
          const createdCampaign = await response.json();
          console.log("Campaign created successfully:", createdCampaign);
          return { status: response.status, data: createdCampaign };
        } else {
          const errorData = await response.json();
          console.log("Error creating campaign:", errorData);
          return { status: response.status, errorData };
        }
      } else {
        // If it's a regular object, send as JSON
        const response = await fetch("http://127.0.0.1:8000/api/campaigns/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(campaignData),
        });
        
        if (response.ok) {
          const createdCampaign = await response.json();
          console.log("Campaign created successfully:", createdCampaign);
          return { status: response.status, data: createdCampaign };
        } else {
          const errorData = await response.json();
          console.log("Error creating campaign:", errorData);
          return { status: response.status, errorData };
        }
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      return { status: 500, message: error.message };
    }
  };

  const contextData = {
    authTokens,
    setAuthTokens,
    user,
    setUser,
    loginUser,
    registerUser,
    logoutUser,
    createCampaign, 
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
