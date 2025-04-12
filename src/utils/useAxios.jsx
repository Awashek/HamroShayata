import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/api/";

const useAxios = () => {
    const { authTokens, setUser, setAuthTokens, logoutUser } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        }
    });

    // Add request interceptor
    axiosInstance.interceptors.request.use(
        async (config) => {
            if (!authTokens?.access) {
                return config;
            }

            // Decode token and check expiration
            const user = jwtDecode(authTokens.access);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

            // If token is still valid, add to headers
            if (!isExpired) {
                config.headers.Authorization = `Bearer ${authTokens.access}`;
                return config;
            }

            // Token expired, try to refresh
            try {
                const response = await axios.post(`${baseURL}token/refresh/`, {
                    refresh: authTokens.refresh,
                });

                // Update tokens in state and storage
                const newTokens = {
                    access: response.data.access,
                    refresh: authTokens.refresh // Keep the same refresh token
                };

                localStorage.setItem("authTokens", JSON.stringify(newTokens));
                setAuthTokens(newTokens);
                setUser(jwtDecode(newTokens.access));

                // Update the request headers
                config.headers.Authorization = `Bearer ${newTokens.access}`;
                return config;
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                logoutUser();
                throw new Error("Session expired. Please log in again.");
            }
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor for error handling
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 403) {
                // Handle 403 Forbidden (admin access required)
                console.error("Admin access required");
                logoutUser();
                throw new Error("You don't have permission to access this resource");
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;