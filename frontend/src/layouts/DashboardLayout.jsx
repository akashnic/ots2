import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, ClipboardList, ListTodo, FileText, Settings, Clock, UserPlus } from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    const navigation = [
        { name: 'Dashboard', href: '/', icon: Home, roles: ['Admin', 'Officer', 'Employee'] },
        { name: 'Log Task', href: '/tasks/log', icon: ClipboardList, roles: ['Employee', 'Officer'] },
        { name: 'Logged Tasks', href: '/tasks/history', icon: Clock, roles: ['Employee', 'Officer'] },
        { name: 'Assigned Tasks', href: '/tasks/assigned', icon: ListTodo, roles: ['Employee', 'Officer'] },
        { name: 'Reports', href: '/reports', icon: FileText, roles: ['Employee', 'Officer'] },
        { name: 'Visitor Log', href: '/visitors', icon: UserPlus, roles: ['Employee', 'Officer'] },
        { name: 'Users', href: '/admin/users', icon: UserPlus, roles: ['Admin'] },
        { name: 'Task Config', href: '/admin/tasks', icon: Settings, roles: ['Admin'] },
    ];

    const allowedNav = navigation.filter(item => item.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col hidden md:flex">
                <div className="h-16 flex items-center justify-center border-b">
                    <h1 className="text-xl font-bold text-gray-800">OTLMS</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {allowedNav.map(item => (
                        <a key={item.name} href={item.href} className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </a>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-800">{user.full_name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{user.post || user.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-500 w-full p-2 rounded transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white shadow-sm flex items-center px-6 md:hidden">
                    <h1 className="text-xl font-bold text-gray-800">OTLMS</h1>
                    <button onClick={logout} className="ml-auto text-gray-600 hover:text-red-500">
                        <LogOut size={20} />
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
