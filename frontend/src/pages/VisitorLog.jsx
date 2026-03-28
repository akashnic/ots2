import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, Search, Plus, Calendar, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const VisitorLog = () => {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        visitor_name: '',
        department: '',
        query: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [deptRes, logRes] = await Promise.all([
                api.get('visitors/departments/'),
                api.get('visitors/logs/')
            ]);
            setDepartments(deptRes.data.results || deptRes.data);
            setLogs(logRes.data.results || logRes.data);
        } catch (err) {
            console.error("Failed to load visitor data", err);
            setStatus({ type: 'error', message: 'Failed to load data. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await api.post('visitors/logs/', formData);
            setLogs([res.data, ...logs]);
            setFormData({ visitor_name: '', department: '', query: '' });
            setStatus({ type: 'success', message: 'Visitor log entry created successfully!' });
            
            // Auto hide success message
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (err) {
            console.error("Failed to create visitor log", err);
            setStatus({ type: 'error', message: 'Failed to create log entry. Please check the inputs.' });
        } finally {
            setSubmitting(false);
        }
    };

    const filteredLogs = logs.filter(log => 
        log.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.department_details?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.query.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-100">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-primary-100 p-2 rounded-lg">
                            <Plus className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Log New Visit</h2>
                            <p className="text-sm text-gray-500">Record visitor details and their queries.</p>
                        </div>
                    </div>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-md flex items-center shadow-sm ${
                            status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                            {status.type === 'success' ? (
                                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                            )}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Visitor Name</label>
                            <input
                                type="text"
                                name="visitor_name"
                                required
                                value={formData.visitor_name}
                                onChange={handleChange}
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <select
                                name="department"
                                required
                                value={formData.department}
                                onChange={handleChange}
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                            >
                                <option value="" disabled>Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Query / Issue</label>
                            <textarea
                                name="query"
                                rows={2}
                                required
                                value={formData.query}
                                onChange={handleChange}
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                                placeholder="Describe the purpose of visit or issue shared..."
                            />
                        </div>

                        <div className="sm:col-span-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all font-semibold"
                            >
                                {submitting ? 'Saving...' : 'Log Entry'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-100">
                <div className="px-4 py-5 sm:p-6 text-gray-900">
                    <div className="sm:flex sm:items-center sm:justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Recent Visits</h2>
                                <p className="text-sm text-gray-500">History of entries logged into the system.</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <div className="relative rounded-md shadow-sm max-w-xs">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    placeholder="Search logs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query / Issue</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logged By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">{log.visitor_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                {log.department_details?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">{log.query}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{log.logged_by_details?.full_name}</div>
                                            <div className="text-xs text-gray-500">{log.logged_by_details?.role_details?.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            <div className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                                {new Date(log.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                                {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">
                                            No visitor logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitorLog;
