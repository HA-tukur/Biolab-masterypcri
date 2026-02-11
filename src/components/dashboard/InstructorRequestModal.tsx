import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface Profile {
  full_name: string;
  email: string;
  university: string;
}

interface InstructorRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InstructorRequestModal({ isOpen, onClose, onSuccess }: InstructorRequestModalProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
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
    if (isOpen) {
      loadProfile();
      setSubmitted(false);
      setError('');
      setErrors({});
    }
  }, [isOpen, user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, university')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
        setFormData(prev => ({
          ...prev,
          university: data.university || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
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
        onSuccess();
        onClose();
      }, 2000);
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

  const handleClose = () => {
    if (!submitting) {
      onClose();
      setFormData({
        university: profile?.university || '',
        department: '',
        courseTaught: '',
        studentCount: '',
        universityEmail: '',
        reason: '',
      });
      setErrors({});
      setError('');
    }
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Request Submitted Successfully!
          </h3>
          <p className="text-gray-600 mb-6">
            We'll review your request and email you within 24-48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-lg w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Request Instructor Access</h3>
            <p className="text-sm text-gray-600">
              Get free access to create classes and track student progress
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

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
                placeholder="e.g., Molecular Biology Lab (BCH 301)"
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

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
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
        )}
      </div>
    </div>
  );
}
