import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const HorizontalNav = ({ onAddEmployee }) => {
    const { user, logout, isAdmin } = useAuth();
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const closeTimerRef = useRef(null);

    const clearCloseTimer = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    const handleMouseEnter = (label) => {
        clearCloseTimer();
        if (label) setOpenSubmenu(label);
    };

    const handleMouseLeave = () => {
        clearCloseTimer();
        closeTimerRef.current = setTimeout(() => {
            setOpenSubmenu(null);
        }, 150); // small delay prevents flicker when moving to submenu
    };

    const menuItems = [
        { label: 'Dashboard', path: '/', icon: '📊' },
        { label: 'Employees', path: '/employees', icon: '👥' },
        ...(isAdmin() ? [
            {
                label: 'Management',
                icon: '⚙️',
                submenu: [
                    { label: 'Add Employee', path: '/add-employee', icon: '➕' },
                    { label: 'Reports', path: '/reports', icon: '📈' },
                    { label: 'Settings', path: '/settings', icon: '🔧' }
                ]
            }
        ] : []),
        {
            label: 'Resources',
            icon: '📚',
            submenu: [
                { label: 'Documentation', path: '/docs', icon: '📖' },
                { label: 'Help Center', path: '/help', icon: '❓' },
                { label: 'API Reference', path: '/api', icon: '🔌' }
            ]
        }
    ];

    return (
        <nav className="sticky top-0 z-50 glass-strong shadow-2xl shadow-primary-500/10 mb-8">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-secondary-600/10 to-primary-600/10 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20 pl-16 lg:pl-0">
                    {/* Logo Section - Creative Design */}
                    <div className="flex items-center space-x-3 sm:space-x-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative bg-gradient-to-br from-primary-600 to-secondary-600 p-2 sm:p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform">
                                <span className="text-2xl sm:text-3xl">🏢</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent">
                                EmployeeHub
                            </h1>
                            <p className="text-[10px] sm:text-xs text-gray-400">Workforce Management</p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className="relative group"
                                onMouseEnter={() => item.submenu && handleMouseEnter(item.label)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <a
                                    href={item.path || '#'}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                                >
                                    <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                    {item.submenu && item.submenu.length > 0 && (
                                        <svg
                                            className={`w-4 h-4 transition-transform ${openSubmenu === item.label ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </a>

                                {/* Submenu Dropdown */}
                                {item.submenu && item.submenu.length > 0 && openSubmenu === item.label && (
                                    <div
                                        className="absolute top-full left-0 mt-2 w-56 glass-strong rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-slide-down"
                                        onMouseEnter={() => handleMouseEnter(item.label)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20 pointer-events-none" />
                                        <div className="relative py-2">
                                            {item.submenu.map((subitem, subindex) => {
                                                const isAdd = subitem.label === 'Add Employee';
                                                return (
                                                    <a
                                                        key={subindex}
                                                        href={subitem.path}
                                                        onClick={(e) => {
                                                            if (isAdd && isAdmin() && typeof onAddEmployee === 'function') {
                                                                e.preventDefault();
                                                                onAddEmployee();
                                                                setOpenSubmenu(null);
                                                            }
                                                        }}
                                                        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                                                    >
                                                        <span className="text-lg group-hover:scale-110 transition-transform">{subitem.icon}</span>
                                                        <span className="font-medium">{subitem.label}</span>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-3 glass px-4 py-2 rounded-2xl">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full blur-md opacity-75" />
                                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">{user?.username}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAdmin()
                                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-medium rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-200 transform hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default HorizontalNav;
