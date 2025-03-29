import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/api/";

const useAxios = () => {
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

    // Create basic axios instance without auth headers
    const axiosInstance = axios.create({ baseURL });

    // If authTokens exist, add authorization and interceptors
    if (authTokens) {
        // Set initial auth header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;

        // Add request interceptor for token refresh
        axiosInstance.interceptors.request.use(async (req) => {
            try {
                const user = jwtDecode(authTokens.access);
                const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

                if (!isExpired) return req;

                const response = await axios.post(`${baseURL}token/refresh/`, {
                    refresh: authTokens.refresh,
                });

                localStorage.setItem("authTokens", JSON.stringify(response.data));
                setAuthTokens(response.data);
                setUser(jwtDecode(response.data.access));

                req.headers.Authorization = `Bearer ${response.data.access}`;
                return req;
            } catch (error) {
                console.error("Token refresh failed:", error);
                // Remove invalid token
                localStorage.removeItem("authTokens");
                setAuthTokens(null);
                setUser(null);
                return req; // Continue with the original request
            }
        });
    }

    return axiosInstance;
};

export default useAxios;