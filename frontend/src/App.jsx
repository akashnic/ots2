import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import LogTask from './pages/LogTask';
import LoggedTasks from './pages/LoggedTasks';
import AssignedTasks from './pages/AssignedTasks';
import Reports from './pages/Reports';
import ManageUsers from './pages/ManageUsers';
import ManageTasks from './pages/ManageTasks';
import VisitorLog from './pages/VisitorLog';


const RootRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  // Redirect logic based on roles
  if (user.role === 'Admin') return <Navigate to="/admin/users" replace />;
  if (user.role === 'Officer') return <OfficerDashboard />;
  return <EmployeeDashboard />;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<RootRoute />} />

          {/* Employee and Officer Log Task */}
          <Route element={<ProtectedRoute allowedRoles={['Employee', 'Officer']} />}>
            <Route path="/tasks/log" element={<LogTask />} />
          </Route>

          {/* Employee and Officer */}
          <Route element={<ProtectedRoute allowedRoles={['Employee', 'Officer']} />}>
            <Route path="/tasks/history" element={<LoggedTasks />} />
            <Route path="/tasks/assigned" element={<AssignedTasks />} />
            <Route path="/tasks/assigned/:id" element={<div className="p-8">Task Details</div>} />
            <Route path="/visitors" element={<VisitorLog />} />
          </Route>

          {/* Employee and Officer - Reports */}
          <Route element={<ProtectedRoute allowedRoles={['Employee', 'Officer']} />}>
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
