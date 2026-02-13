import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface InstructorRequest {
  id: string;
  user_id: string;
  email: string;
  status: string;
  department: string;
  course_taught: string;
  student_count: string;
  university_email: string | null;
  reason: string;
  created_at: string;
  requested_at: string;
}

export function InstructorRequestsAdmin() {
  const [requests, setRequests] = useState<InstructorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log('InstructorRequestsAdmin component rendered');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('=== FETCHING INSTRUCTOR REQUESTS ===');

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No session found');
        throw new Error('Not authenticated');
      }

      console.log('Session user:', session.user.email);
      console.log('Session user ID:', session.user.id);
      console.log('Session app_metadata:', session.user.app_metadata);

      // Check if user has admin role
      const isAdmin = session.user.app_metadata?.role === 'admin';
      console.log('User is admin:', isAdmin);

      if (!isAdmin) {
        console.error('User does not have admin role');
        setError('Access denied. Admin role required.');
        setLoading(false);
        return;
      }

      // Direct query to instructor_requests table
      console.log('Querying instructor_requests table...');
      const { data: directRequests, error: directError } = await supabase
        .from('instructor_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (directError) {
        console.error('Supabase query error:', directError);
        throw new Error(`Database error: ${directError.message} (Code: ${directError.code})`);
      }

      console.log('Direct query successful! Requests found:', directRequests?.length || 0);
      console.log('Raw requests data:', directRequests);

      // Get emails from profiles table for each request
      const requestsWithEmails = await Promise.all(
        (directRequests || []).map(async (request) => {
          console.log(`Fetching profile for user_id: ${request.user_id}`);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', request.user_id)
            .maybeSingle();

          if (profileError) {
            console.error(`Error fetching profile for ${request.user_id}:`, profileError);
          }

          const email = profileData?.email || request.university_email || 'Unknown';
          console.log(`User ${request.user_id} email: ${email}`);

          return {
            ...request,
            email,
          };
        })
      );

      console.log('Requests with emails:', requestsWithEmails);
      setRequests(requestsWithEmails);
      setError(null);
    } catch (err) {
      console.error('=== ERROR FETCHING REQUESTS ===');
      console.error('Error object:', err);
      console.error('Error message:', err instanceof Error ? err.message : 'Unknown error');

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch requests';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      setProcessing(requestId);
      setError(null);

      const functionName = action === 'approve'
        ? 'approve_instructor_request'
        : 'reject_instructor_request';

      const { data, error } = await supabase.rpc(functionName, {
        request_id: requestId,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      await fetchRequests();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process request';
      setError(errorMessage);
      console.error('Error processing request:', err);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Instructor Requests Admin Page</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Requests</h1>
            <p className="mt-2 text-gray-600">Review and approve instructor access requests</p>
          </div>
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold mb-2">Error: {error}</p>
            {error.includes('Access denied') && (
              <div className="text-red-700 text-sm space-y-2 mt-3">
                <p className="font-medium">To gain admin access:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Go to your Supabase Dashboard</li>
                  <li>Navigate to Authentication → Users</li>
                  <li>Find your user and click to edit</li>
                  <li>In the "User Metadata" section, add to app_metadata: <code className="bg-red-100 px-1 rounded">{`{"role": "admin"}`}</code></li>
                  <li>Save and refresh this page</li>
                </ol>
              </div>
            )}
            {!error.includes('Access denied') && (
              <div className="text-red-700 text-sm mt-2">
                <p className="font-medium mb-1">Check the browser console for detailed error information.</p>
              </div>
            )}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No pending requests</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.email}</div>
                        {request.university_email && request.university_email !== request.email && (
                          <div className="text-xs text-gray-500">{request.university_email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">{request.course_taught}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.student_count}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md">{request.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(request.requested_at || request.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDecision(request.id, 'approve')}
                            disabled={processing === request.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(request.id, 'reject')}
                            disabled={processing === request.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Admin Actions</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Approve: Grants instructor role and dashboard access</li>
            <li>• Reject: Denies request without notifying user</li>
            <li>• All decisions are logged with admin ID and timestamp</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
