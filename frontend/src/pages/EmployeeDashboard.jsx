import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Clock, CheckCircle, ListTodo } from 'lucide-react';

const DashboardWidget = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${colorClass}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-lg font-medium text-gray-900">{value}</dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
);

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch summary
                const sumRes = await api.get('reports/employee-summary/');
                setSummary(sumRes.data);

                // Fetch today's assigned tasks that are pending or in progress
                const taskRes = await api.get('assignments/tasks/', {
                    params: { status: 'PENDING' } // Just an example, maybe want both
                });
                setTasks(taskRes.data.results || taskRes.data);

            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name}</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DashboardWidget
                    title="Self Logged Hours"
                    value={`${summary?.self_logged_hours || 0} hrs`}
                    icon={Clock}
                    colorClass="text-blue-500"
                />
                <DashboardWidget
                    title="Assigned Task Hours"
                    value="Coming Soon"
                    icon={CheckCircle}
                    colorClass="text-gray-400"
                />
                <DashboardWidget
                    title="Completed Assignments"
                    value="Coming Soon"
                    icon={ListTodo}
                    colorClass="text-gray-400"
                />
            </div>

            <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Assigned Tasks</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <ListTodo className="h-10 w-10 text-gray-300 mb-2" />
                                            <p className="font-semibold text-gray-600">Assigned Tasks Module Coming Soon</p>
                                            <p className="text-xs text-gray-400 mt-1">This feature will be available in the next version.</p>
                                        </div>
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
