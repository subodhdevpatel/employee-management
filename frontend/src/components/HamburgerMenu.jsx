import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import cn from 'classnames';

const HamburgerMenu = ({ onAddEmployee }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const { isAdmin } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleSubmenu = (menu) => {
        setOpenSubmenu(openSubmenu === menu ? null : menu);
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
        <>
            <button
                onClick={toggleMenu}
                className={cn("fixed top-5 left-5 z-[60] w-12 h-12 glass-strong rounded-xl flex flex-col items-center justify-center space-y-1.5 hover:bg-white/20 transition-all duration-200 lg:hidden", {
                    'left-[250px]': isOpen
                })}
                aria-label="Menu"
            >
                <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden animate-fade-in"
                    onClick={toggleMenu}
                ></div>
            )}

            <nav className={`fixed top-0 left-0 bottom-0 w-80 glass-strong z-[56] transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-white/10 bg-gradient-to-r from-primary-600/20 to-secondary-600/20">
                        <h3 className="text-xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                            Menu
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {menuItems.map((item, index) => (
                            <div key={index} className="mb-2">
                                {item.submenu ? (
                                    <>
                                        <button
                                            onClick={() => toggleSubmenu(item.label)}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            <svg
                                                className={`w-5 h-5 transition-transform ${openSubmenu === item.label ? 'rotate-90' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                        <div className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openSubmenu === item.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
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
                                                                setIsOpen(false);
                                                                setOpenSubmenu(null);
                                                            }
                                                        }}
                                                        className="flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                                                    >
                                                        {subitem.icon && <span className="text-lg">{subitem.icon}</span>}
                                                        <span className="font-medium">{subitem.label}</span>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <a
                                        href={item.path}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default HamburgerMenu;
