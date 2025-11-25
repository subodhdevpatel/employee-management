import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_EMPLOYEE } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { acquireScrollLock } from '../utils/scrollLock';

const DetailView = ({ employeeId, onClose, onEdit }) => {
    const { isAdmin } = useAuth();
    const { data, loading, error } = useQuery(GET_EMPLOYEE, {
        variables: { id: employeeId },
        skip: !employeeId
    });

    if (!employeeId) return null;

    // Lock background scroll while modal is open
    useEffect(() => {
        const release = acquireScrollLock();
        return () => release();
    }, []);

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
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="glass-strong rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {loading && (
                    <div className="flex flex-col items-center justify-center p-12 space-y-4">
                        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400">Loading employee details...</p>
                    </div>
                )}

                {error && (
                    <div className="p-12 text-center">
                        <span className="text-red-400 text-lg">⚠️ Error loading details: {error.message}</span>
                    </div>
                )}

                {data?.employee && (
                    <>
                        {/* Header */}
                        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border-b border-white/10 rounded-t-[20px] rounded-b-none">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                            >
                                ✕
                            </button>

                            <div className="flex items-start space-x-6">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                                    {data.employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {data.employee.flagged && <span className="text-3xl">🚩</span>}
                                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">{data.employee.name}</h2>
                                    </div>
                                    <p className="text-sm sm:text-lg text-gray-400 mb-3">{data.employee.position}</p>
                                    <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${data.employee.status === 'active'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : data.employee.status === 'inactive'
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                        {data.employee.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-20rem)] sm:max-h-[calc(100vh-25rem)]">
                            {/* Contact Information */}
                            <section>
                                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                                    <span>📞</span>
                                    <span>Contact Information</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="glass rounded-xl p-4">
                                        <span className="text-xs sm:text-sm text-gray-400 block mb-1">Email</span>
                                        <span className="text-sm sm:text-base text-white font-medium">{data.employee.email}</span>
                                    </div>
                                    <div className="glass rounded-xl p-4">
                                        <span className="text-xs sm:text-sm text-gray-400 block mb-1">Phone</span>
                                        <span className="text-sm sm:text-base text-white font-medium">{data.employee.phone}</span>
                                    </div>
                                    <div className="glass rounded-xl p-4">
                                        <span className="text-xs sm:text-sm text-gray-400 block mb-1">Age</span>
                                        <span className="text-sm sm:text-base text-white font-medium">{data.employee.age} years</span>
                                    </div>
                                </div>
                            </section>

                            {/* Employment Details */}
                            <section>
                                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                                    <span>💼</span>
                                    <span>Employment Details</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="glass rounded-xl p-4">
                                        <span className="text-xs sm:text-sm text-gray-400 block mb-2">Department</span>
                                        <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30 inline-block">
                                            {data.employee.department}
                                        </span>
                                    </div>
                                    <div className="glass rounded-xl p-4">
                                        <span className="text-xs sm:text-sm text-gray-400 block mb-1">Salary</span>
                                        <span className="text-green-400 font-bold text-base sm:text-lg">{formatCurrency(data.employee.salary)}</span>
                                    </div>
                                    <div className="glass rounded-xl p-4">
                                        <span className="text-xs sm:text-sm text-gray-400 block mb-1">Join Date</span>
                                        <span className="text-sm sm:text-base text-white font-medium">{formatDate(data.employee.joinDate)}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Address */}
                            {data.employee.address && (
                                <section>
                                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                                        <span>🏠</span>
                                        <span>Address</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="glass rounded-xl p-4">
                                            <span className="text-xs sm:text-sm text-gray-400 block mb-1">Street</span>
                                            <span className="text-sm sm:text-base text-white font-medium">{data.employee.address.street}</span>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <span className="text-xs sm:text-sm text-gray-400 block mb-1">City</span>
                                            <span className="text-sm sm:text-base text-white font-medium">{data.employee.address.city}</span>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <span className="text-xs sm:text-sm text-gray-400 block mb-1">State</span>
                                            <span className="text-sm sm:text-base text-white font-medium">{data.employee.address.state}</span>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <span className="text-xs sm:text-sm text-gray-400 block mb-1">ZIP Code</span>
                                            <span className="text-sm sm:text-base text-white font-medium">{data.employee.address.zipCode}</span>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <span className="text-xs sm:text-sm text-gray-400 block mb-1">Country</span>
                                            <span className="text-sm sm:text-base text-white font-medium">{data.employee.address.country}</span>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Emergency Contact */}
                            {data.employee.emergencyContact && (
                                <section>
                                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                                        <span>🚨</span>
                                        <span>Emergency Contact</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="glass rounded-xl p-4">
                                            <span className="text-xs sm:text-sm text-gray-400 block mb-1">Name</span>
                                            <span className="text-sm sm:text-base text-white font-medium">{data.employee.emergencyContact.name}</span>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <span className="text-xs sm:text-sm text-gray-400 block mb-1">Relationship</span>
                                            <span className="text-sm sm:text-base text-white font-medium">{data.employee.emergencyContact.relationship}</span>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <span className="text-xs sm:text-sm text-gray-400 block mb-1">Phone</span>
                                            <span className="text-sm sm:text-base text-white font-medium">{data.employee.emergencyContact.phone}</span>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Skills */}
                            <section>
                                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                                    <span>⭐</span>
                                    <span>Skills</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.employee.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-secondary-500/20 text-secondary-400 border border-secondary-500/30 font-medium text-xs sm:text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Notes */}
                            {data.employee.notes && (
                                <section>
                                    <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
                                        <span>📝</span>
                                        <span>Notes</span>
                                    </h3>
                                    <div className="glass rounded-xl p-4">
                                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{data.employee.notes}</p>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/5 flex items-center justify-between">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium sm:font-semibold rounded-xl text-sm sm:text-base transition-all"
                            >
                                ← Back to List
                            </button>
                            {isAdmin() && typeof onEdit === 'function' && (
                                <button
                                    onClick={() => onEdit(data.employee)}
                                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-medium sm:font-semibold rounded-xl shadow-md sm:shadow-lg transition-all duration-200"
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DetailView;
