import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BunButton = ({ employee, onEdit, onDelete, onFlag }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const { isAdmin } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action) => {
        setIsOpen(false);
        action(employee);
    };

    if (!isAdmin()) {
        return null;
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 group"
            >
                <div className="flex flex-col space-y-1">
                    <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-white transition-colors"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-white transition-colors"></div>
                    <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-white transition-colors"></div>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-slide-down">
                    <div className="py-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAction(onEdit);
                            }}
                            className="w-full px-4 py-2.5 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-3"
                        >
                            <span className="text-lg">✏️</span>
                            <span className="font-medium">Edit</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAction(onFlag);
                            }}
                            className="w-full px-4 py-2.5 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center space-x-3"
                        >
                            <span className="text-lg">{employee.flagged ? '🏳️' : '🚩'}</span>
                            <span className="font-medium">{employee.flagged ? 'Unflag' : 'Flag'}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAction(onDelete);
                            }}
                            className="w-full px-4 py-2.5 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 flex items-center space-x-3"
                        >
                            <span className="text-lg">🗑️</span>
                            <span className="font-medium">Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BunButton;
