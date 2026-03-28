import { useState, useEffect } from 'react';
import api from '../services/api';
import { Download, FileText, Clock, CheckCircle, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Reports = () => {
    const { user } = useAuth();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isOfficer = user?.role === 'Officer';

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const endpoint = isOfficer ? 'reports/team-report/' : 'reports/employee-summary/';
                const res = await api.get(endpoint);
                setReportData(res.data);
            } catch (err) {
                console.error("Failed to fetch reports", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [isOfficer]);

    const handleDownload = () => {
        alert("Downloading PDF Report...");
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!reportData) return (
        <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No report data available for this month.</p>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isOfficer ? `Monthly Team Report - ${reportData.month}` : `My Performance Report - ${reportData.month}`}
                </h1>
                <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <Download className="mr-2 h-4 w-4" /> Download Report
                </button>
            </div>

            {isOfficer ? (
                <>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Employee Breakdown</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Summary of total hours logged by each team member.</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {reportData.team_statistics?.length > 0 ? reportData.team_statistics.map((stat, idx) => (
                                    <div key={stat.employee_id} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                                        <dt className="text-sm font-medium text-gray-500">{stat.employee_name}</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between">
                                            <span>{stat.email}</span>
                                            <span className="font-semibold">{stat.total_hours_this_month} hrs</span>
                                        </dd>
                                    </div>
                                )) : (
                                    <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">No data available for this month.</div>
                                )}
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Task Overview</h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Pending Assignments</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {reportData.overall?.pending_assigned_tasks || 0}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">In Progress Assignments</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {reportData.overall?.in_progress_assigned_tasks || 0}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <List size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Self Logged Tasks</p>
                            <p className="text-2xl font-bold text-gray-900">{reportData.self_logged_tasks_count}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Self Logged Hours</p>
                            <p className="text-2xl font-bold text-gray-900">{reportData.self_logged_hours} hrs</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Assigned Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{reportData.assigned_tasks_completed}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Hours</p>
                            <p className="text-2xl font-bold text-gray-900 font-mono">{reportData.total_hours} hrs</p>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Goal Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div 
                                className="bg-primary-600 h-4 rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (reportData.total_hours / 160) * 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500">
                            You have completed <span className="font-bold text-gray-900">{reportData.total_hours}</span> out of standard <span className="font-bold text-gray-900">160</span> target hours this month.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
