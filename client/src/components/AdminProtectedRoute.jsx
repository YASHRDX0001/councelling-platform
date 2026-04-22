import { useAuth } from '../context/AuthContext';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import Loader from './Loader';

export default function AdminProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  // If not logged in or not admin, show the special login page
  if (!user || user.role !== 'admin') {
    return <AdminLogin />;
  }

  // If already logged in as admin, show the dashboard
  return <AdminDashboard />;
}
