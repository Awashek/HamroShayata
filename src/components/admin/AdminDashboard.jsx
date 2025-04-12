import React, { useState, useContext, useEffect } from "react";
import { useCampaigns } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import CampaignsComponent from "./CampaignsComponent";
import UsersComponent from "./UsersComponent";
import DonationsComponent from "./DonationsComponent";
import DashboardOverview from "./DashboardOverview";
import useAxios from "../../utils/useAxios";

const AdminDashboard = () => {
    const { campaigns, loading: campaignsLoading } = useCampaigns();
    const { user } = useContext(AuthContext);
    const [activeComponent, setActiveComponent] = useState("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [donations, setDonations] = useState([]);
    const [donationsLoading, setDonationsLoading] = useState(true);
    const axiosInstance = useAxios();

    // Fetch donations data for dashboard overview
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setDonationsLoading(true);
                const response = await axiosInstance.get('/donations/all-donations/');
                setDonations(response.data);
            } catch (err) {
                console.error("Error fetching donations:", err);
            } finally {
                setDonationsLoading(false);
            }
        };
        
        fetchDonations();
    }, []);

    // Ensure only admins can access this dashboard
    useEffect(() => {
        if (!user || !user.is_admin) {
            window.location.href = "/"; // Redirect non-admin users
        }
    }, [user]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case "campaigns":
                return <CampaignsComponent campaigns={campaigns} loading={campaignsLoading} />;
            case "users":
                return <UsersComponent />;
            case "donations":
                return <DonationsComponent />;
            default:
                return (
                    <DashboardOverview 
                        campaigns={campaigns} 
                        donations={donations} 
                        campaignsLoading={campaignsLoading}
                        donationsLoading={donationsLoading}
                    />
                );
        }
    };

    if (campaignsLoading && activeComponent === "dashboard") {
        return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile menu button */}
            <div className="md:hidden fixed top-0 left-0 z-20 p-4">
                <button
                    onClick={toggleMobileMenu}
                    className="text-gray-600 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Sidebar for desktop */}
            <div className="hidden md:block md:w-64 bg-white shadow-lg">
                <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
            </div>

            {/* Mobile sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50 md:hidden">
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                        <div className="flex justify-end p-4">
                            <button
                                onClick={toggleMobileMenu}
                                className="text-gray-600 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <Sidebar activeComponent={activeComponent} setActiveComponent={(comp) => {
                            setActiveComponent(comp);
                            setIsMobileMenuOpen(false);
                        }} />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            {activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">
                                Welcome, {user?.username || "Admin"}
                            </span>
                        </div>
                    </div>
                </header>
                
                <main className="max-w-7xl mx-auto py-6 sm:px-6 md:px-8">
                    {renderActiveComponent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;