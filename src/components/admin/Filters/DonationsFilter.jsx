import React from 'react';

const DonationsFilter = ({ 
    searchTerm, 
    setSearchTerm, 
    dateRange, 
    setDateRange, 
    donationsPerPage, 
    setDonationsPerPage,
    clearFilters 
}) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search by Donor or Campaign</label>
                    <input
                        type="text"
                        placeholder="Search donor or campaign"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rows Per Page</label>
                    <select
                        value={donationsPerPage}
                        onChange={(e) => setDonationsPerPage(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={clearFilters}
                        className="w-full p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonationsFilter;