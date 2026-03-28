import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';

const LoggedTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalHours: 0, count: 0 });

    const fetchLoggedTasks = async (date) => {
        setLoading(true);
        try {
            const res = await api.get('tasks/logs/', {
                params: { date: date }
            });
            const data = res.data?.results || res.data || [];
            setTasks(Array.isArray(data) ? data : []);
            
            // Calculate stats
            const total = (Array.isArray(data) ? data : []).reduce((acc, task) => {
                const hours = parseFloat(task?.time_spent_hours);
                return acc + (isNaN(hours) ? 0 : hours);
            }, 0);
            setStats({ totalHours: total.toFixed(2), count: Array.isArray(data) ? data.length : 0 });
        } catch (err) {
            console.error("Failed to fetch logged tasks", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoggedTasks(selectedDate);
    }, [selectedDate]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const shiftDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <ClipboardList className="text-primary-600" />
                        My Logged Tasks
                    </h1>
                    <p className="text-gray-500 text-sm">View and manage your daily work logs.</p>
                </div>

                <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <button 
                        onClick={() => shiftDate(-1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                    </div>
                    <button 
                        onClick={() => shiftDate(1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronRight size={20} className="text-gray-600" />
                    </button>
                    <button 
                        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 px-2"
                    >
                        Today
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <Clock className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Hours This Day</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalHours} hrs</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                        <ClipboardList className="text-green-600" size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tasks Logged</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.count} entries</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Task Log Detail</h3>
                    <span className="text-xs text-gray-400">Date: {new Date(selectedDate).toDateString()}</span>
                </div>
                
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                        <p className="mt-2 text-gray-500">Loading your logs...</p>
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logged At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                                                {task.task_type_details?.name || task.task_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900 line-clamp-2">{task.description}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600 font-medium">
                                                <Clock size={14} className="mr-1.5 text-gray-400" />
                                                {task.time_spent_hours} hrs
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="bg-gray-50 inline-block p-4 rounded-full mb-4">
                            <ClipboardList className="text-gray-300" size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">No tasks logged for this day.</p>
                        <p className="text-gray-400 text-sm mt-1">Try selecting another date or log a new task.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoggedTasks;
