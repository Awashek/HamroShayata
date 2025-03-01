
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Updated import
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens")) // Updated usage
      : null
  );

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log(data);

    if (response.status === 200) {
      console.log("Login successful");
      setAuthTokens(data);
      setUser(jwtDecode(data.access)); // Updated usage
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      console.log(response.status);
      console.log("server issues");
      alert("Something went wrong: " + response.status);
    }
  };

  const registerUser = async (username, email, password, password2) => {
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
      console.log("Registration successful");
      navigate("/");
    } else {
      console.log(response.status);
      console.log("server issues");
      alert("Something went wrong: " + response.status);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  const contextData = {
    authTokens,
    setAuthTokens,
    user,
    setUser,
    loginUser,
    registerUser,
    logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      const decodedUser = jwtDecode(authTokens.access); // Updated usage
      const currentTime = Date.now() / 1000;

      if (decodedUser.exp < currentTime) {
        logoutUser();
      } else {
        setUser(decodedUser);
      }
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};