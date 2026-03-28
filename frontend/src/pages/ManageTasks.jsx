import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Plus, Trash2, Settings, List, Info, Check, PlusCircle } from 'lucide-react';

const ManageTasks = () => {
    const [taskTypes, setTaskTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchTaskTypes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('tasks/types/');
            setTaskTypes(res.data.results || res.data);
        } catch (err) {
            console.error("Failed to fetch task types", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTaskTypes();
    }, [fetchTaskTypes]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('tasks/types/', newTask);
            setNewTask({ name: '', description: '' });
            fetchTaskTypes();
        } catch (err) {
            alert("Failed to create task type. Name must be unique.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the task type "${name}"? This might affect existing logs.`)) {
            try {
                await api.delete(`tasks/types/${id}/`);
                fetchTaskTypes();
            } catch (err) {
                alert("Failed to delete task type.");
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Settings className="mr-3 text-primary-600" /> System Configuration
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Configure global task types and operational parameters for the system.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Creation Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <PlusCircle className="mr-2 text-primary-600" size={20} /> New Category
                        </h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition bg-gray-50 focus:bg-white"
                                    placeholder="e.g. Field Inspection"
                                    value={newTask.name}
                                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition bg-gray-50 focus:bg-white"
                                    rows="3"
                                    placeholder="Brief description of this task category..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-100 disabled:opacity-50"
                            >
                                {submitting ? 'Registering...' : 'Add Configuration'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List of Types */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center px-2">
                        <List className="mr-2 text-primary-600" size={20} /> Active Configurations
                    </h3>
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : taskTypes.length === 0 ? (
                        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 py-12 text-center">
                            <Info className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-gray-500">No task types defined yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {taskTypes.map((type) => (
                                <div key={type.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary-200 hover:shadow-md transition group flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center">
                                            <span className="font-bold text-gray-900">{type.name}</span>
                                            <span className="ml-3 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] uppercase font-black rounded-md tracking-tighter">Verified</span>
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed">{type.description || 'No detailed description provided for this category.'}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(type.id, type.name)}
                                        className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mt-6">
                        <div className="flex">
                            <Info className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-blue-900">Administrative Guidance</h4>
                                <p className="text-xs text-blue-800 mt-1 opacity-80 leading-relaxed">
                                    Changes to task configurations are global and retroactive. Ensure that removal of categories does not conflict with existing reporting requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageTasks;
