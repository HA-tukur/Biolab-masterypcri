import { useState, useEffect } from 'react';
import { GraduationCap, Lock, CheckCircle, Users, Copy, Trash2, Plus, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface Profile {
  instructor_verified: boolean;
  classes_quota: number;
}

interface InstructorRequest {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Class {
  id: string;
  class_name: string;
  class_code: string;
  created_at: string;
  student_count: number;
}

export function InstructorPortalTab() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [request, setRequest] = useState<InstructorRequest | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [profileRes, requestRes, classesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('instructor_verified, classes_quota')
          .eq('id', user.id)
          .single(),
        supabase
          .from('instructor_requests')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('classes')
          .select('*')
          .eq('instructor_email', user.email)
          .order('created_at', { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (requestRes.data) setRequest(requestRes.data);
      if (classesRes.data) {
        const classesWithCounts = await Promise.all(
          classesRes.data.map(async (cls) => {
            const { count } = await supabase
              .from('class_enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('class_id', cls.id);
            return {
              ...cls,
              student_count: count || 0,
            };
          })
        );
        setClasses(classesWithCounts);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('instructor_requests')
        .insert({
          user_id: user.id,
          message: requestMessage.trim() || null,
        });

      if (error) throw error;

      await loadData();
      setRequestMessage('');
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!profile?.instructor_verified) {
    const hasPendingRequest = request?.status === 'pending';

    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="max-w-xl w-full bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-50 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Instructor Portal</h2>
            <p className="text-gray-600">Unlock Class Management Features</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Create up to 2 free classes</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Manage up to 100 students</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Track student progress & analytics</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Generate shareable class codes</p>
            </div>
          </div>

          {!hasPendingRequest ? (
            <>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Tell us about your teaching role (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none mb-4 resize-none"
                rows={3}
              />
              <button
                onClick={handleRequestAccess}
                disabled={submitting}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
              >
                {submitting ? 'Submitting...' : 'Request Instructor Access'}
              </button>
            </>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Request Pending</strong> - We'll email you soon
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 text-center mt-4">
            Free for verified instructors. We'll review your request within 24-48 hours.
          </p>
        </div>
      </div>
    );
  }

  const canCreateClass = classes.length < profile.classes_quota;
  const quotaReached = classes.length >= profile.classes_quota;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Portal</h1>
          <p className="text-gray-600">
            Classes: {classes.length}/{profile.classes_quota} used
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/instructor/setup'}
          disabled={!canCreateClass}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Class
        </button>
      </div>

      {quotaReached && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Quota reached.</strong> Need more classes?{' '}
            <a href="mailto:info@biosimlab.app" className="underline">
              Contact us for pricing
            </a>
          </p>
        </div>
      )}

      {classes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't created any classes yet</p>
          <button
            onClick={() => window.location.href = '/instructor/setup'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Class
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {cls.class_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <button
                      onClick={() => handleCopyCode(cls.class_code)}
                      className="flex items-center gap-2 hover:text-cyan-600 transition-colors"
                    >
                      {cls.class_code}
                      <Copy className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {cls.student_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(cls.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
