import React, { useEffect, useState } from 'react';
import useAxios from '../../utils/useAxios';
import dayjs from 'dayjs';

const DonationsComponent = () => {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [donationsPerPage, setDonationsPerPage] = useState(10);
    const axiosInstance = useAxios();

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        let isMounted = true;

        const fetchAllDonations = async () => {
            try {
                const response = await axiosInstance.get('donations/');
                if (isMounted) {
                    const formattedData = response.data.map(donation => ({
                        id: donation.id,
                        donor_name: donation.user || 'Anonymous',
                        campaign_title: donation.campaign?.campaign_title || 'Campaign Deleted',
                        campaign_category: donation.campaign?.category || 'Unknown Category',
                        amount: parseFloat(donation.amount).toFixed(),
                        status: donation.status || 'Pending',
                        date: dayjs(donation.created_at).format('MMM D, YYYY h:mm A'),
                        transaction_id: donation.transaction_id || 'No Transaction ID',
                        message: donation.message || 'No Message',
                        created_at: donation.created_at,
                    }));
                    setDonations(formattedData);
                    setFilteredDonations(formattedData);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load donations data');
                    console.error('Dashboard fetch error:', err);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAllDonations();

        return () => {
            isMounted = false;
        };
    }, []);

    // Apply filters whenever filter states change
    useEffect(() => {
        let results = donations;

        // Enhanced search across donor name and campaign title
        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            results = results.filter(donation =>
                donation.donor_name.toLowerCase().includes(lowercasedSearch) ||
                donation.campaign_title.toLowerCase().includes(lowercasedSearch)
            );
        }

        // Date range filter
        if (dateRange.startDate && dateRange.endDate) {
            results = results.filter(donation => {
                const donationDate = dayjs(donation.created_at);
                return donationDate.isAfter(dayjs(dateRange.startDate)) &&
                    donationDate.isBefore(dayjs(dateRange.endDate).add(1, 'day'));
            });
        }

        setFilteredDonations(results);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, dateRange, donations]);

    // Pagination logic
    const indexOfLastDonation = currentPage * donationsPerPage;
    const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
    const currentDonations = filteredDonations.slice(indexOfFirstDonation, indexOfLastDonation);

    const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);
    const pageNumbers = [];

    // Generate array of page numbers to display
    const getPageNumbers = () => {
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // If total pages are less than max to show, display all
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if at edges
            if (currentPage <= 2) {
                endPage = maxPagesToShow - 1;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - (maxPagesToShow - 1);
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pageNumbers.push('...');
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }

            // Always show last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== '...') {
            setCurrentPage(pageNumber);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDateRange({ startDate: '', endDate: '' });
    };

    // Calculate statistics
    const totalDonations = filteredDonations.length;
    const totalAmount = filteredDonations.reduce((acc, donation) => acc + parseFloat(donation.amount), 0);

    // Calculate amount donated in the last 7 days
    const last7DaysDonations = filteredDonations.filter(donation =>
        dayjs().diff(dayjs(donation.created_at), 'day') <= 7
    );
    const last7DaysAmount = last7DaysDonations.reduce((acc, donation) => acc + parseFloat(donation.amount), 0);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-300 shadow">
                <h2 className="text-lg font-semibold mb-2">Error</h2>
                <p>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">

            {/* Redesigned Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border-l">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Donations</h3>
                    <p className="text-3xl font-bold text-blue-600">{totalDonations}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l ">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Amount</h3>
                    <p className="text-3xl font-bold text-green-600">RS {totalAmount.toFixed()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l ">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Last 7 Days</h3>
                    <p className="text-3xl font-bold text-purple-600">RS {last7DaysAmount.toFixed()}</p>
                </div>
            </div>

            {/* Simplified Filters */}
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

            {/* Results Summary */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                    {filteredDonations.length === donations.length
                        ? 'All Donations'
                        : `Showing ${filteredDonations.length} of ${donations.length} donations`}
                </h2>
                <p className="text-gray-600">
                    Page {currentPage} of {totalPages || 1}
                </p>
            </div>

            {/* Donations Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Donor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Campaign
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Message
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentDonations.length > 0 ? (
                            currentDonations.map((donation) => (
                                <tr key={donation.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{donation.donor_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{donation.campaign_title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-green-600">RS {donation.amount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{donation.campaign_category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    donation.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                            {donation.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{donation.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{donation.transaction_id}</div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">
                                        <div className="text-sm text-gray-500" title={donation.message}>
                                            {donation.message}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                    No donations found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enhanced Pagination Controls */}
            {totalPages > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstDonation + 1}</span> to{" "}
                        <span className="font-medium">
                            {Math.min(indexOfLastDonation, filteredDonations.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredDonations.length}</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                }`}
                        >
                            First
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                }`}
                        >
                            Prev
                        </button>

                        {getPageNumbers().map((number, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(number)}
                                className={`px-3 py-1 rounded-md ${number === currentPage
                                        ? "bg-blue-600 text-white"
                                        : number === "..."
                                            ? "bg-white text-gray-700 cursor-default"
                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                    }`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                }`}
                        >
                            Next
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                }`}
                        >
                            Last
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationsComponent;