import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAuth } from './context/AuthContext';
import { useToast } from './components/ToastProvider';
import HamburgerMenu from './components/HamburgerMenu';
import HorizontalNav from './components/HorizontalNav';
import GridView from './components/GridView';
import TileView from './components/TileView';
import DetailView from './components/DetailView';
import LoginForm from './components/LoginForm';
import { DELETE_EMPLOYEE, TOGGLE_FLAG } from './graphql/mutations';
import ConfirmModal from './components/ConfirmModal';
import AddEmployeeModal from './components/AddEmployeeModal';
import EditEmployeeModal from './components/EditEmployeeModal';

function App() {
    const { isAuthenticated, loading, isAdmin } = useAuth();
    const toast = useToast();
    const [viewMode, setViewMode] = useState('grid');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [editEmployeeData, setEditEmployeeData] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
    const [confirmState, setConfirmState] = useState({ open: false, employee: null, loading: false });

    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
        refetchQueries: ['GetEmployeesPaginated'],
        onCompleted: () => {
            toast.success('Employee deleted successfully');
        }
    });

    const [toggleFlag] = useMutation(TOGGLE_FLAG, {
        refetchQueries: ['GetEmployeesPaginated', 'GetEmployee']
    });

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    const handleEmployeeClick = (employee) => {
        setSelectedEmployeeId(employee.id);
    };

    const handleEdit = (employee) => {
        setEditEmployeeData(employee);
        setIsEditOpen(true);
    };

    const handleDelete = (employee) => {
        setConfirmState({ open: true, employee, loading: false });
    };

    const confirmDelete = async () => {
        const emp = confirmState.employee;
        if (!emp) return;
        try {
            setConfirmState((prev) => ({ ...prev, loading: true }));
            await deleteEmployee({ variables: { id: emp.id } });
        } finally {
            setConfirmState({ open: false, employee: null, loading: false });
        }
    };

    const handleFlag = (employee) => {
        toggleFlag({ variables: { id: employee.id } });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const handleSortChange = (field) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <HamburgerMenu onAddEmployee={() => setIsAddOpen(true)} />
                <HorizontalNav onAddEmployee={() => setIsAddOpen(true)} />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                                Employee Directory
                            </h1>
                            <p className="text-gray-400">Manage and view all employee information</p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
                            <div className="flex items-center flex-wrap gap-2 glass p-1 rounded-2xl w-fit mx-auto sm:mx-0 sm:w-auto">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-200 ${viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-xl">📊</span>
                                    <span>Grid</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('tile')}
                                    className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-200 ${viewMode === 'tile'
                                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-xl">🎴</span>
                                    <span>Tiles</span>
                                </button>
                            </div>

                            {isAdmin() && (
                                <button
                                    onClick={() => setIsAddOpen(true)}
                                    className="px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                                >
                                    ➕ Add Employee
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Filters */}
                    <div className="glass-strong rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                                <div className="relative">
                                    <select
                                        onChange={(e) => handleFilterChange('department', e.target.value)}
                                        className="w-full pr-10 px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
                                    >
                                        <option value="">All Departments</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Sales">Sales</option>
                                        <option value="HR">HR</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Operations">Operations</option>
                                        <option value="Design">Design</option>
                                        <option value="Product">Product</option>
                                    </select>
                                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                <div className="relative">
                                    <select
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="w-full pr-10 px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
                                    >
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="on-leave">On Leave</option>
                                    </select>
                                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, position..."
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                                <div className="relative">
                                    <select
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="w-full pr-10 px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none"
                                    >
                                        <option value="createdAt">Recently Added</option>
                                        <option value="name">Name</option>
                                        <option value="salary">Salary</option>
                                        <option value="joinDate">Join Date</option>
                                        <option value="age">Age</option>
                                    </select>
                                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="min-h-screen">
                        <div className={viewMode === 'grid' ? 'block' : 'hidden'}>
                            <GridView
                                onEmployeeClick={handleEmployeeClick}
                                filters={filters}
                                sort={sort}
                            />
                        </div>
                        <div className={viewMode === 'tile' ? 'block' : 'hidden'}>
                            <TileView
                                onEmployeeClick={handleEmployeeClick}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onFlag={handleFlag}
                                filters={filters}
                                sort={sort}
                            />
                        </div>
                    </div>
                </main>

                {selectedEmployeeId && (
                    <DetailView
                        employeeId={selectedEmployeeId}
                        onEdit={(emp) => {
                            setEditEmployeeData(emp);
                            setIsEditOpen(true);
                        }}
                        onClose={() => setSelectedEmployeeId(null)}
                    />
                )}

                {/* Modals */}
                <AddEmployeeModal
                    isOpen={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    onSuccess={() => toast.success('Employee added successfully')}
                />
                <EditEmployeeModal
                    isOpen={isEditOpen}
                    employee={editEmployeeData}
                    onClose={() => setIsEditOpen(false)}
                    onSuccess={() => toast.success('Employee updated successfully')}
                />

                {/* Confirm Delete Modal */}
                <ConfirmModal
                    isOpen={confirmState.open}
                    title="Delete Employee"
                    message={confirmState.employee ? `Are you sure you want to delete ${confirmState.employee.name}?` : ''}
                    confirmText="Delete"
                    cancelText="Cancel"
                    loading={confirmState.loading}
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmState({ open: false, employee: null, loading: false })}
                />
            </div>
        </div>
    );
}

export default App;
