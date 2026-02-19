import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, EyeOff, Trash2, LogOut, Edit, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SharedNavigation } from './SharedNavigation';

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  university: string;
  program_department: string;
  learning_type: string;
  leaderboard_visible: boolean;
  display_name_preference: 'real_name' | 'student_id' | 'custom_nickname';
  custom_nickname: string | null;
}

export function NewProfile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    loadProfile();
    loadStudentId();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setEditedData(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentId = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('leaderboard_profiles')
        .select('student_id')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setStudentId(data.student_id);
      }
    } catch (error) {
      console.error('Error loading student ID:', error);
    }
  };

  const handleSave = async () => {
    if (!user || !editedData) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedData.full_name,
          university: editedData.university,
          program_department: editedData.program_department,
          learning_type: editedData.learning_type,
          leaderboard_visible: editedData.leaderboard_visible,
          display_name_preference: editedData.display_name_preference,
          custom_nickname: editedData.custom_nickname,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...editedData } as ProfileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProgress = async () => {
    if (!user) return;

    try {
      // Delete all simulation usage
      await supabase
        .from('simulation_usage')
        .delete()
        .eq('user_id', user.id);

      // Delete all certificates
      await supabase
        .from('certificates')
        .delete()
        .eq('student_id', studentId);

      // Delete all lab results
      await supabase
        .from('lab_results')
        .delete()
        .eq('student_id', studentId);

      setShowDeleteConfirm(false);
      alert('All progress has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting progress:', error);
      alert('Failed to delete progress. Please try again.');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleLeaderboardVisibility = async () => {
    if (!user) return;

    const newValue = !profile?.leaderboard_visible;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ leaderboard_visible: newValue })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile!, leaderboard_visible: newValue });
      setEditedData({ ...editedData, leaderboard_visible: newValue });
    } catch (error) {
      console.error('Error updating leaderboard visibility:', error);
      alert('Failed to update visibility. Please try again.');
    }
  };

  const handleChangeLearningPath = async (newPath: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ learning_type: newPath })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile!, learning_type: newPath });
      setEditedData({ ...editedData, learning_type: newPath });
      alert('Learning path updated successfully!');
    } catch (error) {
      console.error('Error updating learning path:', error);
      alert('Failed to update learning path. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SharedNavigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Profile Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Profile & Settings</h1>
              <p className="text-slate-600 mt-2">Manage your account information and preferences</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedData(profile);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors font-medium"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-medium"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.full_name || ''}
                onChange={(e) => setEditedData({ ...editedData, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            ) : (
              <p className="text-lg font-semibold text-slate-900">{profile.full_name}</p>
            )}
          </div>

          {/* Student ID */}
          {studentId && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Student ID
              </label>
              <p className="text-sm text-slate-500 font-mono">{studentId}</p>
            </div>
          )}

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <p className="text-slate-900">{profile.email || user?.email}</p>
          </div>

          {/* Institution */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Institution
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.university || ''}
                onChange={(e) => setEditedData({ ...editedData, university: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            ) : (
              <p className="text-slate-900">{profile.university}</p>
            )}
          </div>

          {/* Department */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Department
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.program_department || ''}
                onChange={(e) => setEditedData({ ...editedData, program_department: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            ) : (
              <p className="text-slate-900">{profile.program_department}</p>
            )}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Privacy Settings</h2>

          {/* Leaderboard Visibility */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Leaderboard Visibility</h3>
              <p className="text-sm text-slate-600">
                {profile.leaderboard_visible
                  ? 'Your scores are visible on the public leaderboard'
                  : 'Your scores are hidden from the public leaderboard'}
              </p>
            </div>
            <button
              onClick={toggleLeaderboardVisibility}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                profile.leaderboard_visible
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {profile.leaderboard_visible ? (
                <>
                  <Eye size={16} />
                  Visible
                </>
              ) : (
                <>
                  <EyeOff size={16} />
                  Hidden
                </>
              )}
            </button>
          </div>

          {/* Display Name Preference */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Display Name Preference
            </label>
            <p className="text-sm text-slate-600 mb-3">
              Choose how your name appears on the leaderboard
            </p>
            <select
              value={profile.display_name_preference}
              onChange={(e) => {
                const newPref = e.target.value as 'real_name' | 'student_id' | 'custom_nickname';
                setEditedData({ ...editedData, display_name_preference: newPref });
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none mb-3"
            >
              <option value="real_name">Real Name</option>
              <option value="student_id">Student ID</option>
              <option value="custom_nickname">Custom Nickname</option>
            </select>

            {(editedData.display_name_preference === 'custom_nickname' || profile.display_name_preference === 'custom_nickname') && (
              <input
                type="text"
                value={editedData.custom_nickname || ''}
                onChange={(e) => setEditedData({ ...editedData, custom_nickname: e.target.value })}
                placeholder="Enter custom nickname"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            )}
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Learning Path</h2>

          <div className="mb-6">
            <p className="text-slate-600 mb-4">
              I am a:{' '}
              <span className="font-semibold text-slate-900">
                {profile.learning_type === 'university_student'
                  ? 'University Student'
                  : profile.learning_type === 'pre_university'
                  ? 'Pre-university'
                  : 'Independent Learner'}
              </span>
            </p>

            <select
              value={profile.learning_type}
              onChange={(e) => handleChangeLearningPath(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="university_student">University Student</option>
              <option value="independent_learner">Independent Learner</option>
              <option value="pre_university">Pre-university</option>
            </select>
            <p className="text-sm text-slate-500 mt-2">This is for analytics only - all users have access to all features</p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Account Actions</h2>

          <div className="space-y-4">
            {/* Delete Progress */}
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Delete All Progress</h3>
                <p className="text-sm text-red-700">
                  Permanently delete all your lab results and certificates
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>

            {/* Sign Out */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Sign Out</h3>
                <p className="text-sm text-slate-600">Sign out of your account</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors font-medium"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
                Delete All Progress?
              </h2>
              <p className="text-slate-600 text-center">
                This will permanently delete all your lab results, certificates, and progress. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProgress}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
