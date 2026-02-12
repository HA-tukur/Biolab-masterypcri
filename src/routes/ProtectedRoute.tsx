import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowGuestTrial?: boolean;
}

export function ProtectedRoute({ children, allowGuestTrial = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (allowGuestTrial && location.pathname === '/lab') {
      const guestTrial = localStorage.getItem('guestTrial');
      if (guestTrial === 'dna-extraction') {
        return <>{children}</>;
      }
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
