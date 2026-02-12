import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/adminCheck';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      console.log('=== ADMIN ROUTE CHECK ===');
      console.log('User loading complete');
      console.log('User:', user?.email);
      setChecking(false);
    }
  }, [loading, user]);

  if (checking || loading) {
    console.log('AdminRoute: Still loading/checking auth...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute: No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  const userIsAdmin = isAdmin(user);
  console.log('AdminRoute: Admin check result:', userIsAdmin);

  if (!userIsAdmin) {
    console.log('AdminRoute: User is not admin, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute: User is admin, rendering children');
  return <>{children}</>;
}
