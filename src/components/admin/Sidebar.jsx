import React from "react";

const Sidebar = ({ activeComponent, setActiveComponent }) => {
    const navItems = [
        { id: "dashboard", name: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { id: "campaigns", name: "Campaigns", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
        { id: "users", name: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
        { id: "donations", name: "Donations", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
    ];

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex items-center justify-center h-16 bg-indigo-600">
                <span className="text-white font-bold text-xl">Admin Portal</span>
            </div>
            <nav className="mt-6 flex-1">
                <div className="px-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveComponent(item.id)}
                            className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md w-full ${
                                activeComponent === item.id
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <svg
                                className={`mr-3 h-5 w-5 ${
                                    activeComponent === item.id
                                        ? "text-indigo-500"
                                        : "text-gray-400 group-hover:text-gray-500"
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={item.icon}
                                />
                            </svg>
                            {item.name}
                        </button>
                    ))}
                </div>
            </nav>

        </div>
    );
};

export default Sidebar;