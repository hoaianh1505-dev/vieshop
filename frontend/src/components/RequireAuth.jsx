import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function RequireAuth({ adminOnly = false }) {
  const { auth } = useApp();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && auth.user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
