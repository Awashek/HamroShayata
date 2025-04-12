import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const UsersComponent = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAccessToken, setUserCount } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = getAccessToken();
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await fetch("http://127.0.0.1:8000/api/users/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();
                setUsers(data);
                setUserCount(data.length); // Set the user count in context
            } catch (err) {
                setError(err.message);
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [getAccessToken]);

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const token = getAccessToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            const newStatus = currentStatus === "active" ? "suspended" : "active";
            
            const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/status/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Failed to update user status");
            }

            setUsers(users.map(user => 
                user.id === userId ? { ...user, status: newStatus } : user
            ));
        } catch (err) {
            setError(err.message);
            console.error("Error updating user status:", err);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading users...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[250px]">
                    <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{users.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[250px]">
                    <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
                    <p className="text-3xl font-bold text-green-500 mt-2">
                        {users.filter(user => user.status === "active").length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow flex-1 min-w-[250px]">
                    <h3 className="text-lg font-medium text-gray-900">Admins</h3>
                    <p className="text-3xl font-bold text-purple-500 mt-2">
                        {users.filter(user => user.is_admin).length}
                    </p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">User Management</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.date_joined).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_admin ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                                            {user.is_admin ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {!user.is_admin && (
                                            <button
                                                onClick={() => toggleUserStatus(user.id, user.status)}
                                                className={`px-3 py-1 rounded transition duration-200 ${user.status === "active"
                                                    ? "bg-red-500 text-white hover:bg-red-600"
                                                    : "bg-green-500 text-white hover:bg-green-600"
                                                    }`}
                                            >
                                                {user.status === "active" ? "Suspend" : "Activate"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersComponent;