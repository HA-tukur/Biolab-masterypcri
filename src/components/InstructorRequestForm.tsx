import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SharedNavigation } from './SharedNavigation';

interface Profile {
  full_name: string;
  email: string;
  university: string;
  instructor_verified: boolean;
}

interface InstructorRequest {
  status: 'pending' | 'approved' | 'rejected';
}

export function InstructorRequestForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [existingRequest, setExistingRequest] = useState<InstructorRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    university: '',
    department: '',
    courseTaught: '',
    studentCount: '',
    universityEmail: '',
    reason: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const [profileRes, requestRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name, email, university, instructor_verified')
          .eq('id', user.id)
          .single(),
        supabase
          .from('instructor_requests')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setFormData(prev => ({
          ...prev,
          university: profileRes.data.university || '',
        }));

        if (profileRes.data.instructor_verified) {
          navigate('/dashboard');
        }
      }

      if (requestRes.data) {
        setExistingRequest(requestRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.university.trim()) {
      newErrors.university = 'University/Institution is required';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!formData.courseTaught.trim()) {
      newErrors.courseTaught = 'Course/Module is required';
    }
    if (!formData.studentCount) {
      newErrors.studentCount = 'Please select estimated number of students';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Please tell us why you need instructor access';
    } else if (formData.reason.length > 500) {
      newErrors.reason = 'Reason must be 500 characters or less';
    }
    if (formData.universityEmail && !formData.universityEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.universityEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      const { error } = await supabase
        .from('instructor_requests')
        .insert({
          user_id: user?.id,
          department: formData.department.trim(),
          course_taught: formData.courseTaught.trim(),
          student_count: formData.studentCount,
          university_email: formData.universityEmail.trim() || null,
          reason: formData.reason.trim(),
          status: 'pending',
        });

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting request:', error);
      if (error.code === '23505') {
        setError('You have already submitted an instructor access request.');
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <SharedNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <SharedNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Request Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              We'll review your request and email you within 24-48 hours.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  if (existingRequest?.status === 'pending') {
    return (
      <>
        <SharedNavigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Request Already Submitted
            </h1>
            <p className="text-gray-600 mb-6">
              Your instructor access request is currently being reviewed. We'll email you within 24-48 hours.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SharedNavigation />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 rounded-full">
                  <GraduationCap className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Request Instructor Access</h1>
                  <p className="text-sm text-gray-600">
                    Get free access to create classes and track student progress
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={profile?.full_name || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University/Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none ${
                    errors.university ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.university && (
                  <p className="text-sm text-red-600 mt-1">{errors.university}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Biochemistry, Molecular Biology"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none ${
                      errors.department ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.department && (
                    <p className="text-sm text-red-600 mt-1">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course/Module You Teach <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Molecular Biology Lab"
                    value={formData.courseTaught}
                    onChange={(e) => setFormData({ ...formData, courseTaught: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none ${
                      errors.courseTaught ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.courseTaught && (
                    <p className="text-sm text-red-600 mt-1">{errors.courseTaught}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Number of Students <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none ${
                    errors.studentCount ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select student count</option>
                  <option value="Less than 30">Less than 30</option>
                  <option value="30-50">30-50</option>
                  <option value="50-100">50-100</option>
                  <option value="100-200">100-200</option>
                  <option value="More than 200">More than 200</option>
                </select>
                {errors.studentCount && (
                  <p className="text-sm text-red-600 mt-1">{errors.studentCount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University Email (optional)
                </label>
                <input
                  type="email"
                  placeholder="your.name@university.edu"
                  value={formData.universityEmail}
                  onChange={(e) => setFormData({ ...formData, universityEmail: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none ${
                    errors.universityEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  If you signed up with a personal email, provide your institutional email for faster verification
                </p>
                {errors.universityEmail && (
                  <p className="text-sm text-red-600 mt-1">{errors.universityEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you need instructor access? <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Tell us briefly about your teaching needs and how you plan to use BioSim Lab"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  maxLength={500}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none ${
                    errors.reason ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {formData.reason.length}/500 characters
                  </p>
                  {errors.reason && (
                    <p className="text-sm text-red-600">{errors.reason}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900 mb-2">What You'll Get:</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Create up to 2 free classes</li>
              <li>Manage up to 100 students total</li>
              <li>Track student progress and analytics</li>
              <li>Generate shareable class codes</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              Free for verified instructors. We'll review your request within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
