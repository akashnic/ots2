import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, FileText, CheckCircle, Plus, Trash2 } from 'lucide-react';

const LogTask = () => {
    const { user } = useAuth();
    const [taskTypes, setTaskTypes] = useState([]);
    const [tasks, setTasks] = useState([
        {
            task_type: '',
            description: '',
            time_spent_hours: '',
            task_date: new Date().toISOString().split('T')[0]
        }
    ]);
    const [statusData, setStatusData] = useState({ loading: false, error: null, success: false });

    useEffect(() => {
        const fetchTaskTypes = async () => {
            try {
                const res = await api.get('tasks/types/');
                setTaskTypes(res.data.results || res.data);
            } catch (err) {
                console.error('Failed to load task types', err);
            }
        };
        fetchTaskTypes();
    }, []);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], [name]: value };
        setTasks(newTasks);
    };

    const addTask = () => {
        const lastTaskDate = tasks.length > 0 ? tasks[tasks.length - 1].task_date : new Date().toISOString().split('T')[0];
        setTasks([
            ...tasks,
            {
                task_type: '',
                description: '',
                time_spent_hours: '',
                task_date: lastTaskDate
            }
        ]);
    };

    const removeTask = (index) => {
        if (tasks.length > 1) {
            const newTasks = tasks.filter((_, i) => i !== index);
            setTasks(newTasks);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusData({ loading: true, error: null, success: false });

        try {
            // Check if all task types are selected
            if (tasks.some(t => !t.task_type)) {
                setStatusData({ loading: false, error: 'Please select a task type for all logs.', success: false });
                return;
            }

            // Submit all tasks
            await Promise.all(tasks.map(task => api.post('tasks/logs/', task)));
            
            setStatusData({ loading: false, error: null, success: true });

            // Reset but keep the date from the first task for convenience
            const lastDate = tasks[0].task_date;
            setTasks([
                {
                    task_type: '',
                    description: '',
                    time_spent_hours: '',
                    task_date: lastDate
                }
            ]);

            setTimeout(() => setStatusData(prev => ({ ...prev, success: false })), 3000);
        } catch (err) {
            console.error('Submit error:', err);
            setStatusData({ loading: false, error: 'Failed to log tasks. Please check the inputs.', success: false });
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Log Tasks</h1>
                    <p className="mt-1 text-sm text-gray-500">Record multiple work activities in one go.</p>
                </div>
                <button
                    onClick={addTask}
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Add Another Task
                </button>
            </div>

            {statusData.success && (
                <div className="mb-6 bg-green-50 p-4 rounded-md flex items-center shadow-sm">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <p className="text-sm font-medium text-green-800">All tasks logged successfully!</p>
                </div>
            )}

            {statusData.error && (
                <div className="mb-6 bg-red-50 p-4 rounded-md shadow-sm">
                    <p className="text-sm font-medium text-red-800">{statusData.error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {tasks.map((task, index) => (
                    <div key={index} className="bg-white shadow sm:rounded-lg overflow-hidden border border-gray-100 relative">
                        {tasks.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeTask(index)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                title="Remove Task"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                                <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 font-bold">
                                    {index + 1}
                                </span>
                                Task Details
                            </h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Task Type</label>
                                    <div className="mt-1">
                                        <select
                                            name="task_type"
                                            required
                                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border"
                                            value={task.task_type}
                                            onChange={(e) => handleChange(index, e)}
                                        >
                                            <option value="" disabled>Select a type...</option>
                                            {taskTypes.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Task Date</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="date"
                                            name="task_date"
                                            required
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                            value={task.task_date}
                                            onChange={(e) => handleChange(index, e)}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            required
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                            placeholder="What did you do?"
                                            value={task.description}
                                            onChange={(e) => handleChange(index, e)}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Time Spent (Hours)</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="time_spent_hours"
                                            step="0.25"
                                            min="0"
                                            required
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                            placeholder="e.g. 2.5"
                                            value={task.time_spent_hours}
                                            onChange={(e) => handleChange(index, e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center bg-gray-50 px-6 py-4 rounded-lg border border-dashed border-gray-300">
                    <button
                        onClick={addTask}
                        type="button"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                    >
                        <Plus className="mr-1 h-5 w-5" />
                        Add Another
                    </button>
                    <button
                        type="submit"
                        disabled={statusData.loading}
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        {statusData.loading ? 'Saving Tasks...' : `Save ${tasks.length} ${tasks.length === 1 ? 'Task' : 'Tasks'}`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogTask;
