import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEES_PAGINATED } from '../graphql/queries';

const GridView = ({ onEmployeeClick, filters, sort }) => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data, loading, error } = useQuery(GET_EMPLOYEES_PAGINATED, {
        variables: { page, limit, filter: filters, sort }
    });

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 glass rounded-xl animate-pulse"></div>
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
            <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Age</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Salary</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Join Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Skills</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {employees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    onClick={() => onEmployeeClick(employee)}
                                    className="hover:bg-white/5 cursor-pointer transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap max-w-[220px]">
                                        <div className="flex items-center space-x-2 min-w-0">
                                            {employee.flagged && <span className="text-lg">🚩</span>}
                                            <span className="text-white font-medium truncate">{employee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm hidden md:table-cell">{employee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 hidden lg:table-cell">{employee.age}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                            {employee.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">{employee.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm hidden xl:table-cell">{employee.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-400 font-semibold hidden md:table-cell">{formatCurrency(employee.salary)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm hidden md:table-cell">{formatDate(employee.joinDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${employee.status === 'active'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : employee.status === 'inactive'
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            }`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 hidden xl:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {employee.skills.slice(0, 2).map((skill, idx) => (
                                                <span key={idx} className="px-2 py-1 rounded-lg text-xs bg-secondary-500/20 text-secondary-400 border border-secondary-500/30">
                                                    {skill}
                                                </span>
                                            ))}
                                            {employee.skills.length > 2 && (
                                                <span className="px-2 py-1 rounded-lg text-xs bg-gray-700 text-gray-400">
                                                    +{employee.skills.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

export default GridView;
