import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Calendar } from 'lucide-react';

interface DemoRequest {
  id: string;
  institution_name: string;
  country: string;
  state: string | null;
  contact_name: string;
  contact_email: string;
  contact_number: string | null;
  role_position: string | null;
  created_at: string;
}

export function DemoRequestsAdmin() {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const isAdmin = session.user.app_metadata?.role === 'admin';
      if (!isAdmin) {
        setError('Access denied. Admin role required.');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(`Database error: ${fetchError.message}`);
      }

      setRequests(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching demo requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load demo requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">Demo Requests</h1>
            <p className="text-sm text-slate-600 mt-1">
              {requests.length} total request{requests.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading requests...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">No demo requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-slate-200 rounded-lg p-5 hover:border-emerald-300 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg mb-3">
                          {request.institution_name}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-500">Location:</span>{' '}
                            <span className="text-slate-900">
                              {request.state ? `${request.state}, ${request.country}` : request.country}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Contact:</span>{' '}
                            <span className="text-slate-900">{request.contact_name}</span>
                          </div>
                          {request.role_position && (
                            <div>
                              <span className="text-slate-500">Role:</span>{' '}
                              <span className="text-slate-900">{request.role_position}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-500">Email:</span>{' '}
                            <a
                              href={`mailto:${request.contact_email}`}
                              className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                              {request.contact_email}
                            </a>
                          </div>
                          {request.contact_number && (
                            <div>
                              <span className="text-slate-500">Phone:</span>{' '}
                              <a
                                href={`tel:${request.contact_number}`}
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                              >
                                {request.contact_number}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-slate-500 mt-4">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(request.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
