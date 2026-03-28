import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, X, Check, Search, UserPlus, Users, ChevronLeft, ChevronRight, Mail, Shield, User as UserIcon } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, current: 1 });
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        email: '',
        full_name: '',
        role: '',
        password: '',
        is_active: true
    });

    const fetchUsers = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`accounts/users/?page=${page}&search=${search}`);
            // Handle both paginated and non-paginated responses
            if (res.data.results) {
                setUsers(res.data.results);
                setPagination({
                    count: res.data.count,
                    next: res.data.next,
                    previous: res.data.previous,
                    current: page
                });
            } else {
                setUsers(res.data);
                setPagination({ count: res.data.length, next: null, previous: null, current: 1 });
            }
        } catch (err) {
            setError("Failed to load users. Please check your connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            const res = await api.get('accounts/roles/');
            setRoles(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to load roles", err);
        }
    }, []);

    useEffect(() => {
        fetchUsers(1, searchTerm);
        fetchRoles();
    }, [fetchUsers, fetchRoles, searchTerm]);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setForm({
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                password: '',
                is_active: user.is_active
            });
        } else {
            setEditingUser(null);
            setForm({
                email: '',
                full_name: '',
                role: roles[0]?.id || '',
                password: '',
                is_active: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };
            if (editingUser && !payload.password) delete payload.password;

            if (editingUser) {
                await api.patch(`accounts/users/${editingUser.id}/`, payload);
            } else {
                await api.post('accounts/users/', payload);
            }
            setShowModal(false);
            fetchUsers(pagination.current, searchTerm);
        } catch (err) {
            const msg = err.response?.data?.email?.[0] || err.response?.data?.detail || "Error saving user";
            alert(msg);
        }
    };

    const handleDelete = async (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
            try {
                await api.delete(`accounts/users/${user.id}/`);
                fetchUsers(pagination.current, searchTerm);
            } catch (err) {
                alert("Failed to delete user.");
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage system access, roles, and user profiles across the organization.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm font-medium"
                >
                    <UserPlus size={18} className="mr-2" /> Add New User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find user by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                        <p className="text-gray-500 font-medium">Synchronizing user data...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center">
                        <p className="text-red-500 font-medium">{error}</p>
                        <button onClick={() => fetchUsers()} className="mt-4 text-primary-600 hover:underline">Retry</button>
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-20 text-center">
                        <Users size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No users found matching your search.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role & Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition duration-150">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                        {user.full_name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{user.full_name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                                            <Mail size={12} className="mr-1" /> {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm border ${
                                                        user.role_details?.name === 'Admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                        user.role_details?.name === 'Officer' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    }`}>
                                                        {user.role_details?.name}
                                                    </span>
                                                    <span className={`flex items-center text-xs font-medium ${user.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${user.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button onClick={() => handleOpenModal(user)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(user)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-bold">{(pagination.current - 1) * 10 + 1}</span> to <span className="font-bold">{Math.min(pagination.current * 10, pagination.count)}</span> of <span className="font-bold">{pagination.count}</span> users
                            </p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => fetchUsers(pagination.current - 1, searchTerm)}
                                    disabled={!pagination.previous}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => fetchUsers(pagination.current + 1, searchTerm)}
                                    disabled={!pagination.next}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                {editingUser ? <Shield className="mr-2 text-primary-600" /> : <UserPlus className="mr-2 text-primary-600" />}
                                {editingUser ? 'Modify User Profile' : 'Provision New Account'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Full Identity Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
                                            value={form.full_name}
                                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                            placeholder="Enter full legal name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Official Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="username@org.gov"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">System Role</label>
                                        <select
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white transition"
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        >
                                            <option value="" disabled>Select Role</option>
                                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Security PIN / Password</label>
                                        <input
                                            type="password"
                                            required={!editingUser}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            placeholder={editingUser ? "••••••••" : "Create password"}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <input
                                        type="checkbox"
                                        id="active_status"
                                        className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                        checked={form.is_active}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    />
                                    <label htmlFor="active_status" className="ml-3 text-sm font-medium text-gray-700">Account Active and Permitted for Access</label>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition"
                                >
                                    {editingUser ? <span className="flex items-center"><Check size={18} className="mr-2" /> Commit Profile Updates</span> : 'Create Global Access'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
