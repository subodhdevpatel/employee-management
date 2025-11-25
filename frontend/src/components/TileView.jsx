import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEES_PAGINATED } from '../graphql/queries';
import BunButton from './BunButton';

const TileView = ({ onEmployeeClick, onEdit, onDelete, onFlag, filters, sort }) => {
    const [page, setPage] = useState(1);
    const limit = 12;

    const { data, loading, error } = useQuery(GET_EMPLOYEES_PAGINATED, {
        variables: { page, limit, filter: filters, sort }
    });

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 glass rounded-2xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-strong rounded-2xl p-6 text-center">
                <span className="text-red-400 text-lg">⚠️ Error loading employees: {error.message}</span>
            </div>
        );
    }

    const { employees, pageInfo } = data.employeesPaginated;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                    <div
                        key={employee.id}
                        className="glass-strong rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer relative group"
                        onClick={() => onEmployeeClick(employee)}
                    >
                        {employee.flagged && (
                            <div className="absolute top-4 right-4 text-2xl">🚩</div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {employee.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{employee.name}</h3>
                                    <p className="text-sm text-gray-400">{employee.position}</p>
                                </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <BunButton
                                    employee={employee}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onFlag={onFlag}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <span>📧</span>
                                <span>{employee.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <span>📱</span>
                                <span>{employee.phone}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span>🏢</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                        {employee.department}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${employee.status === 'active'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : employee.status === 'inactive'
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    }`}>
                                    {employee.status}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">Salary</span>
                                <span className="text-green-400 font-bold text-lg">{formatCurrency(employee.salary)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Joined</span>
                                <span className="text-gray-300 text-sm">{formatDate(employee.joinDate)}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {employee.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 rounded-lg text-xs bg-secondary-500/20 text-secondary-400 border border-secondary-500/30">
                                    {skill}
                                </span>
                            ))}
                            {employee.skills.length > 3 && (
                                <span className="px-2 py-1 rounded-lg text-xs bg-gray-700 text-gray-400">
                                    +{employee.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between glass-strong rounded-2xl p-3 sm:p-4">
                <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={!pageInfo.hasPreviousPage}
                    className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed text-white text-sm sm:text-base font-medium rounded-xl transition-all duration-200"
                >
                    <span>{'<<'}</span>
                    <span className="hidden sm:inline">Previous</span>
                </button>
                <span className="text-gray-300 font-medium text-sm sm:text-base">
                    Page {pageInfo.currentPage} of {pageInfo.totalPages}
                </span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!pageInfo.hasNextPage}
                    className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-600 disabled:cursor-not-allowed text-white text-sm sm:text-base font-medium rounded-xl transition-all duration-200"
                >
                    <span className="hidden sm:inline">Next</span>
                    <span>{'>>'}</span>
                </button>
            </div>
        </div>
    );
};

export default TileView;
