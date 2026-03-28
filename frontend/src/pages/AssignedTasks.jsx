import { Layout } from 'lucide-react';

const AssignedTasks = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] bg-white shadow rounded-lg p-12 text-center">
            <div className="bg-primary-50 p-6 rounded-full mb-6">
                <Layout className="h-16 w-16 text-primary-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
                Assigned Tasks Module
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl">
                We're currently refining this module to provide you with a better task management experience. 
                This feature will be available in the next version.
            </p>
            <div className="mt-10">
                <span className="inline-flex items-center px-6 py-3 rounded-full text-base font-semibold bg-primary-100 text-primary-800 animate-pulse">
                    Coming Soon
                </span>
            </div>
        </div>
    );
};

export default AssignedTasks;
