import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, Clock, AlertCircle } from 'lucide-react';

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

const OfficerDashboard = () => {
    const { user } = useAuth();
    const [teamReport, setTeamReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('reports/team-report/');
                setTeamReport(res.data);
            } catch (err) {
                console.error("Failed to load team report", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Officer Dashboard - {teamReport?.month}</h1>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DashboardWidget
                    title="Pending Assigned Tasks"
                    value="Coming Soon"
                    icon={AlertCircle}
                    colorClass="text-gray-400"
                />
                <DashboardWidget
                    title="In-Progress Assigned Tasks"
                    value="Coming Soon"
                    icon={Clock}
                    colorClass="text-gray-400"
                />
                <DashboardWidget
                    title="Total Team Members"
                    value={teamReport?.team_statistics?.length || 0}
                    icon={Users}
                    colorClass="text-blue-500"
                />
            </div>

            <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Employee Statistics</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours Logged</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teamReport?.team_statistics?.map((stat) => (
                                <tr key={stat.employee_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {stat.employee_name}
                                        <span className="block text-xs text-gray-500">{stat.email}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {stat.total_hours_this_month} hrs
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OfficerDashboard;
