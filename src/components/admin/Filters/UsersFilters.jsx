import React from 'react';
import { Search, Calendar } from 'lucide-react';

const UsersFilter = ({
    filters,
    handleFilterChange,
    setFilters
}) => {
    return (
        <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
                    <div className="relative rounded-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="search"
                            placeholder="Username or email"
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={filters.search || ""}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-40">
                    <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        id="role-filter"
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border w-full"
                        value={filters.role || "all"}
                        onChange={(e) => handleFilterChange("role", e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>

                <div className="w-40">
                    <label htmlFor="subscription-filter" className="block text-sm font-medium text-gray-700 mb-1">Subscription</label>
                    <select
                        id="subscription-filter"
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border w-full"
                        value={filters.subscription || "all"}
                        onChange={(e) => handleFilterChange("subscription", e.target.value)}
                    >
                        <option value="all">All Subscriptions</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                        <option value="none">No Subscription</option>
                    </select>
                </div>

                <div className="w-40">
                    <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <div className="relative rounded-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="from-date"
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={filters.fromDate || ""}
                            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                        />
                    </div>
                </div>

                <div className="w-40">
                    <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <div className="relative rounded-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="to-date"
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            value={filters.toDate || ""}
                            onChange={(e) => handleFilterChange("toDate", e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <button
                        onClick={() => setFilters({ role: "all", search: "", subscription: "all", fromDate: "", toDate: "" })}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersFilter;