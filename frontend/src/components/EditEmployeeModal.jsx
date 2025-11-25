import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_EMPLOYEE } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';
import { acquireScrollLock } from '../utils/scrollLock';

const EditEmployeeModal = ({ isOpen, employee, onClose, onSuccess }) => {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    department: '',
    position: '',
    phone: '',
    salary: '',
    joinDate: '',
    status: 'active',
    skills: ''
  });

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        age: employee.age ?? '',
        department: employee.department || '',
        position: employee.position || '',
        phone: employee.phone || '',
        salary: employee.salary ?? '',
        joinDate: employee.joinDate ? employee.joinDate.slice(0, 10) : '',
        status: employee.status || 'active',
        skills: Array.isArray(employee.skills) ? employee.skills.join(', ') : ''
      });
    }
  }, [employee]);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const release = acquireScrollLock();
    return () => release();
  }, [isOpen]);

  const [updateEmployee, { loading, error }] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: ['GetEmployeesPaginated', 'GetEmployee']
  });

  if (!isOpen || !isAdmin()) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employee?.id) return;

    const input = {
      name: form.name.trim() || undefined,
      email: form.email.trim() || undefined,
      age: form.age !== '' ? Number(form.age) : undefined,
      department: form.department.trim() || undefined,
      position: form.position.trim() || undefined,
      phone: form.phone.trim() || undefined,
      salary: form.salary !== '' ? Number(form.salary) : undefined,
      joinDate: form.joinDate ? new Date(form.joinDate).toISOString() : undefined,
      status: form.status || undefined,
      skills: form.skills
        ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined
    };

    await updateEmployee({ variables: { id: employee.id, input } });
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Edit Employee</h2>
          <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all">✕</button>
        </div>

        {error && (
          <div className="px-4 sm:px-6 pt-4 text-red-400">⚠️ {error.message}</div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
            <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
            <input name="position" placeholder="Position" value={form.position} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
            <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
            <input name="joinDate" type="date" placeholder="Join Date" value={form.joinDate} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="relative">
              <select name="status" value={form.status} onChange={handleChange} className="w-full pr-10 px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white appearance-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} className="px-4 py-2.5 bg-gray-900/50 border border-white/10 rounded-xl text-white" />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl w-full sm:w-auto">Cancel</button>
            <button disabled={loading} type="submit" className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold rounded-xl disabled:opacity-60 w-full sm:w-auto">
              {loading ? 'Saving...' : 'Update Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
