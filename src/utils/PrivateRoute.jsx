import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/" />;
  }

  if (adminOnly && !user.is_admin) {
    // If the route is admin-only and the user is not an admin, redirect to a forbidden page or home
    return <Navigate to="/" />;
  }

  // If the user is authenticated (and an admin if required), render the nested routes
  return <Outlet />;
};

export default PrivateRoute;