import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isAdmin } from '../../utils/adminCheck';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isAdmin(user)) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin dashboard</h1>
          <p className="text-gray-600 mb-6">
            Signed in as <span className="font-medium text-gray-900">{user.email}</span>
          </p>
          <div className="space-y-3">
            <Link
              to="/admin/requests"
              className="inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
            >
              View Instructor Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
