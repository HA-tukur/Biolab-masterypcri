import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, TrendingUp, Calendar, Download, Home, Zap, Target, Eye, EyeOff, Trash2, LogOut, School, Edit, Save, X, Star } from 'lucide-react';
import { getOrCreateStudentId } from '../utils/studentId';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const COUNTRIES = [
  'United Kingdom', 'United States', 'Nigeria', 'Canada', 'Australia',
  'India', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
  'Brazil', 'Mexico', 'Argentina', 'South Africa', 'Kenya',
  'Ghana', 'Egypt', 'Japan', 'China', 'South Korea',
  'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand',
  'Pakistan', 'Bangladesh', 'Poland', 'Sweden', 'Norway',
  'Denmark', 'Finland', 'Ireland', 'New Zealand', 'Unknown'
];

interface LabResult {
  id: string;
  student_id: string;
  mission: string;
  purity_score: number;
  status: string;
  created_at: string;
}

interface CategoryProgress {
  category: string;
  mastery: number;
  fullMark: 100;
}

interface Certificate {
  id: string;
  mission: string;
  best_score: number;
  attempt_count: number;
  success_count: number;
  date_earned: string;
  date_updated: string;
}

interface LeaderboardProfile {
  is_visible: boolean;
  display_name: string;
  real_name: string | null;
  school_name: string | null;
  country: string;
  user_type: string;
}

interface ClassInfo {
  class_id: string | null;
  class_name: string | null;
  class_code: string | null;
}

export default function StudentProfile() {
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    successfulMissions: 0,
    averageScore: 0,
    practiceStreak: 0
  });
  const [leaderboardProfile, setLeaderboardProfile] = useState<LeaderboardProfile>({
    is_visible: true,
    display_name: '',
    real_name: null,
    school_name: null,
    country: 'Unknown',
    user_type: 'independent'
  });
  const [classInfo, setClassInfo] = useState<ClassInfo>({
    class_id: null,
    class_name: null,
    class_code: null
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<{
    display_name: string;
    real_name: string;
    school_name: string;
    country: string;
    user_type: string;
  }>({
    display_name: '',
    real_name: '',
    school_name: '',
    country: 'Unknown',
    user_type: 'independent'
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    const id = getOrCreateStudentId();
    setStudentId(id);

    try {
      const { data, error } = await supabase
        .from('lab_results')
        .select('*, classes(class_name, class_code)')
        .eq('student_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('leaderboard_profiles')
        .select('is_visible, display_name, real_name, school_name, country, user_type')
        .eq('student_id', id)
        .maybeSingle();

      if (profileData) {
        const profile = {
          is_visible: profileData.is_visible ?? true,
          display_name: profileData.display_name || '',
          real_name: profileData.real_name || null,
          school_name: profileData.school_name,
          country: profileData.country || 'Unknown',
          user_type: profileData.user_type || 'independent'
        };
        setLeaderboardProfile(profile);
        setEditedProfile({
          display_name: profile.display_name,
          real_name: profile.real_name || '',
          school_name: profile.school_name || '',
          country: profile.country,
          user_type: profile.user_type
        });
      }

      if (!data || data.length === 0) {
        setResults([]);
        setCategoryProgress([]);
        setCertificates([]);
        setStats({ totalAttempts: 0, successfulMissions: 0, averageScore: 0, practiceStreak: 0 });
        setClassInfo({ class_id: null, class_name: null, class_code: null });
        setLoading(false);
        return;
      }

      setResults(data);

      const firstResultWithClass = data.find((r: any) => r.class_id && r.classes);
      if (firstResultWithClass) {
        setClassInfo({
          class_id: firstResultWithClass.class_id,
          class_name: firstResultWithClass.classes?.class_name || null,
          class_code: firstResultWithClass.classes?.class_code || null
        });
      }

      const categoryMap: Record<string, { scores: number[]; best: number }> = {};

      data.forEach((result) => {
        let category = 'Unknown';
        if (result.mission.includes('DNA') || result.mission.includes('Extraction')) {
          category = 'DNA Extraction';
        } else if (result.mission.includes('PCR')) {
          category = 'PCR';
        } else if (result.mission.includes('CRISPR')) {
          category = 'CRISPR';
        } else if (result.mission.includes('Gel')) {
          category = 'Gel Electrophoresis';
        } else if (result.mission.includes('Western') || result.mission.includes('Blot')) {
          category = 'Western Blot';
        }

        if (!categoryMap[category]) {
          categoryMap[category] = { scores: [], best: 0 };
        }

        const normalizedScore = result.purity_score ? Math.min((result.purity_score / 2) * 100, 100) : 0;
        categoryMap[category].scores.push(normalizedScore);
        categoryMap[category].best = Math.max(categoryMap[category].best, normalizedScore);
      });

      const progressData: CategoryProgress[] = Object.entries(categoryMap).map(([category, data]) => ({
        category,
        mastery: Math.round(data.best),
        fullMark: 100
      }));

      setCategoryProgress(progressData);

      const { data: certsData } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', id)
        .order('date_earned', { ascending: false });

      setCertificates(certsData || []);

      const totalAttempts = data.length;
      const successfulMissions = data.filter(r => r.purity_score >= 1.7).length;
      const avgScore = data.reduce((sum, r) => sum + (r.purity_score || 0), 0) / totalAttempts;

      const uniqueDays = new Set(data.map(r => new Date(r.created_at).toDateString())).size;

      setStats({
        totalAttempts,
        successfulMissions,
        averageScore: avgScore,
        practiceStreak: uniqueDays
      });

    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (cert: Certificate) => {
    let missionDisplayName = cert.mission;
    let realName = '';

    try {
      const { data: missionData } = await supabase
        .from('missions')
        .select('display_name')
        .eq('slug', cert.mission)
        .maybeSingle();

      if (missionData) {
        missionDisplayName = missionData.display_name;
      }

      const { data: profileData } = await supabase
        .from('leaderboard_profiles')
        .select('real_name')
        .eq('student_id', studentId)
        .maybeSingle();

      if (profileData?.real_name) {
        realName = profileData.real_name;
      }
    } catch (err) {
      console.error('Failed to fetch certificate data:', err);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 800, 600);

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 760, 560);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Mastery', 400, 100);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('This certifies that', 400, 170);

    if (realName) {
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(realName, 400, 220);

      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`(${studentId})`, 400, 250);
    } else {
      ctx.font = 'bold 36px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(studentId, 400, 220);
    }

    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('has demonstrated mastery in', 400, 290);

    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#6366f1';
    const finalMissionName = missionDisplayName.length > 50 ? missionDisplayName.substring(0, 47) + '...' : missionDisplayName;
    ctx.fillText(finalMissionName, 400, 340);

    const successRate = Math.round((cert.success_count / cert.attempt_count) * 100);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Best Score: ${Math.round(cert.best_score)}%`, 400, 400);
    ctx.fillText(`Total Attempts: ${cert.attempt_count}`, 400, 430);
    ctx.fillText(`Success Rate: ${cert.success_count}/${cert.attempt_count} (${successRate}%)`, 400, 460);
    ctx.fillText(`Date Earned: ${new Date(cert.date_earned).toLocaleDateString()}`, 400, 490);

    ctx.font = 'italic 16px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('BioSim Lab - Virtual Laboratory Training Platform', 400, 540);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${missionDisplayName.replace(/\s+/g, '_')}_Certificate.png`;
    a.click();
  };

  const toggleLeaderboardVisibility = async () => {
    try {
      const newVisibility = !leaderboardProfile.is_visible;

      const { data: existingProfile } = await supabase
        .from('leaderboard_profiles')
        .select('id')
        .eq('student_id', studentId)
        .maybeSingle();

      if (existingProfile) {
        await supabase
          .from('leaderboard_profiles')
          .update({ is_visible: newVisibility })
          .eq('student_id', studentId);
      } else {
        await supabase
          .from('leaderboard_profiles')
          .insert({
            student_id: studentId,
            display_name: studentId,
            is_visible: newVisibility,
            user_type: 'independent'
          });
      }

      setLeaderboardProfile(prev => ({ ...prev, is_visible: newVisibility }));
    } catch (err) {
      console.error('Failed to update leaderboard visibility:', err);
      alert('Failed to update settings. Please try again.');
    }
  };

  const deleteAllProgress = async () => {
    try {
      await supabase
        .from('lab_results')
        .delete()
        .eq('student_id', studentId);

      localStorage.clear();

      setResults([]);
      setCategoryProgress([]);
      setCertificates([]);
      setStats({ totalAttempts: 0, successfulMissions: 0, averageScore: 0, practiceStreak: 0 });
      setClassInfo({ class_id: null, class_name: null, class_code: null });
      setShowDeleteConfirm(false);

      alert('All progress has been deleted successfully.');
    } catch (err) {
      console.error('Failed to delete progress:', err);
      alert('Failed to delete progress. Please try again.');
    }
  };

  const leaveClass = async () => {
    try {
      await supabase
        .from('lab_results')
        .update({ class_id: null })
        .eq('student_id', studentId);

      setClassInfo({ class_id: null, class_name: null, class_code: null });

      alert('You have left the class successfully.');
    } catch (err) {
      console.error('Failed to leave class:', err);
      alert('Failed to leave class. Please try again.');
    }
  };

  const startEditingProfile = () => {
    setEditedProfile({
      display_name: leaderboardProfile.display_name || studentId,
      real_name: leaderboardProfile.real_name || '',
      school_name: leaderboardProfile.school_name || '',
      country: leaderboardProfile.country,
      user_type: leaderboardProfile.user_type
    });
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setIsEditingProfile(false);
  };

  const saveProfileChanges = async () => {
    try {
      const { data: existingProfile } = await supabase
        .from('leaderboard_profiles')
        .select('id')
        .eq('student_id', studentId)
        .maybeSingle();

      const profileUpdate = {
        student_id: studentId,
        display_name: editedProfile.display_name || studentId,
        real_name: editedProfile.real_name || null,
        school_name: editedProfile.school_name || null,
        country: editedProfile.country,
        user_type: editedProfile.user_type
      };

      if (existingProfile) {
        await supabase
          .from('leaderboard_profiles')
          .update(profileUpdate)
          .eq('student_id', studentId);
      } else {
        await supabase
          .from('leaderboard_profiles')
          .insert({
            ...profileUpdate,
            is_visible: true
          });
      }

      setLeaderboardProfile({
        ...leaderboardProfile,
        display_name: profileUpdate.display_name,
        real_name: profileUpdate.real_name,
        school_name: profileUpdate.school_name,
        country: profileUpdate.country,
        user_type: profileUpdate.user_type
      });

      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Student Profile</h1>
              <p className="text-slate-400">Student ID: <span className="text-indigo-400 font-mono">{studentId}</span></p>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Home size={16} />
              Back to Lab
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border border-indigo-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-indigo-400" size={24} />
              <span className="text-slate-400 text-sm">Total Attempts</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalAttempts}</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-emerald-400" size={24} />
              <span className="text-slate-400 text-sm">Successful</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.successfulMissions}</div>
          </div>

          <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-amber-400" size={24} />
              <span className="text-slate-400 text-sm">Avg Score</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.averageScore.toFixed(2)}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-purple-400" size={24} />
              <span className="text-slate-400 text-sm">Practice Days</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.practiceStreak}</div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Profile Information</h2>
            {!isEditingProfile ? (
              <button
                onClick={startEditingProfile}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors font-medium text-white text-sm"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEditingProfile}
                  className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg transition-colors font-medium text-white text-sm"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={saveProfileChanges}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors font-medium text-white text-sm"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <label className="block text-slate-400 text-sm mb-2">Display Name (Leaderboard)</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={editedProfile.display_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, display_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter display name"
                />
              ) : (
                <p className="text-white font-medium">
                  {leaderboardProfile.display_name || studentId}
                </p>
              )}
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <label className="block text-slate-400 text-sm mb-2">Real Name (Certificates)</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={editedProfile.real_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, real_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your real name"
                />
              ) : (
                <p className="text-white font-medium">
                  {leaderboardProfile.real_name || 'Not specified'}
                </p>
              )}
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <label className="block text-slate-400 text-sm mb-2">School/Institution</label>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={editedProfile.school_name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, school_name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your school"
                />
              ) : (
                <p className="text-white font-medium">
                  {leaderboardProfile.school_name || 'Not specified'}
                </p>
              )}
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <label className="block text-slate-400 text-sm mb-2">Country/Location</label>
              {isEditingProfile ? (
                <select
                  value={editedProfile.country}
                  onChange={(e) => setEditedProfile({ ...editedProfile, country: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-white font-medium">
                  {leaderboardProfile.country}
                </p>
              )}
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <label className="block text-slate-400 text-sm mb-2">User Type</label>
              {isEditingProfile ? (
                <select
                  value={editedProfile.user_type}
                  onChange={(e) => setEditedProfile({ ...editedProfile, user_type: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high_school">High School Student</option>
                  <option value="university">University Student</option>
                  <option value="independent">Independent Learner</option>
                </select>
              ) : (
                <p className="text-white font-medium">
                  {leaderboardProfile.user_type === 'high_school' ? 'High School Student' :
                   leaderboardProfile.user_type === 'university' ? 'University Student' : 'Independent Learner'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Privacy Settings</h2>

          <div className="space-y-6">
            <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {leaderboardProfile.is_visible ? (
                    <Eye className="text-emerald-400" size={24} />
                  ) : (
                    <EyeOff className="text-slate-400" size={24} />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">National Leaderboard Visibility</h3>
                    <p className="text-slate-400 text-sm">
                      {leaderboardProfile.is_visible
                        ? 'Your scores are visible on the public leaderboard'
                        : 'Your scores are hidden from the public leaderboard'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleLeaderboardVisibility}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    leaderboardProfile.is_visible
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                  }`}
                >
                  {leaderboardProfile.is_visible ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>

            {classInfo.class_id && (
              <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <School className="text-blue-400" size={24} />
                    <div>
                      <h3 className="font-semibold text-white">Current Class</h3>
                      <p className="text-slate-400 text-sm">
                        {classInfo.class_name} <span className="text-slate-500">({classInfo.class_code})</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={leaveClass}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg transition-colors font-medium text-white"
                  >
                    <LogOut size={18} />
                    Leave Class
                  </button>
                </div>
              </div>
            )}

            <div className="bg-red-900/20 rounded-xl p-5 border border-red-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="text-red-400" size={24} />
                  <div>
                    <h3 className="font-semibold text-white">Delete All Progress</h3>
                    <p className="text-slate-400 text-sm">
                      Permanently delete all your lab results and local data
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors font-medium text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Delete All Progress?</h2>
                <p className="text-slate-300">
                  This will permanently delete all your lab results and cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg transition-colors font-medium text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAllProgress}
                  className="flex-1 bg-red-600 hover:bg-red-500 px-4 py-3 rounded-lg transition-colors font-medium text-white"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Skill Progress</h2>
            <p className="text-slate-400 text-sm mb-6">Mastery levels across different techniques</p>

            {categoryProgress.length === 0 ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No progress data yet</p>
                  <p className="text-slate-500 text-sm mt-2">Complete some missions to see your skill chart</p>
                </div>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={categoryProgress}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: '#cbd5e1', fontSize: 12 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Radar
                      name="Mastery"
                      dataKey="mastery"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Certificate Gallery</h2>
            <p className="text-slate-400 text-sm mb-6">Achievements for mastering techniques (85%+)</p>

            {certificates.length === 0 ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No certificates earned yet</p>
                  <p className="text-slate-500 text-sm mt-2">Score 85% or higher to earn certificates</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {certificates.map((cert) => {
                  const successRate = Math.round((cert.success_count / cert.attempt_count) * 100);
                  return (
                    <div
                      key={cert.id}
                      className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="text-amber-400" size={20} />
                            <h3 className="font-bold text-white">{cert.mission}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <TrendingUp size={14} />
                              Best: {Math.round(cert.best_score)}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Target size={14} />
                              {cert.attempt_count} attempt{cert.attempt_count > 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={14} />
                              {successRate}% success rate
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(cert.date_earned).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadCertificate(cert)}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No activity yet. Start practicing to build your profile!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-300 text-sm">Mission</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300 text-sm">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300 text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-300 text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 10).map((result) => (
                    <tr key={result.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-slate-300">{result.mission}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          result.purity_score >= 1.8 ? 'text-emerald-400' :
                          result.purity_score >= 1.7 ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {result.purity_score?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.status.includes('Mastery') || result.status.includes('Validated')
                            ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                            : 'bg-orange-900/40 text-orange-400 border border-orange-500/30'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(result.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
