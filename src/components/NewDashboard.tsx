import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Trophy, TrendingUp, Award, Calendar, Users, Plus, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SharedNavigation } from './SharedNavigation';
import { JoinClassModal } from './JoinClassModal';

interface Profile {
  full_name: string;
  university: string;
  program_department: string;
  learning_type: string;
  instructor_verified: boolean;
  last_simulation: string | null;
}

interface LastActivity {
  simulation_name: string;
  started_at: string;
  id: string;
}

interface Certificate {
  id: string;
  mission: string;
  best_score: number;
  date_earned: string;
}

interface LeaderboardEntry {
  student_id: string;
  display_name: string;
  total_score: number;
  rank?: number;
}

interface RecentSession {
  id: string;
  simulation_name: string;
  completed: boolean;
  started_at: string;
}

interface EnrolledClass {
  id: string;
  class_id: string;
  class_name: string;
  simulation_name: string;
  instructor_name: string;
  completed: boolean;
  enrolled_at: string;
}

const availableSimulations = [
  { id: 'dna-extraction', name: 'DNA Extraction', difficulty: 'Beginner', completed: false },
  { id: 'pcr-setup', name: 'PCR Setup', difficulty: 'Intermediate', completed: false },
  { id: 'western-blot', name: 'Western Blot', difficulty: 'Advanced', completed: false },
  { id: 'gel-electrophoresis', name: 'Gel Electrophoresis', difficulty: 'Intermediate', completed: false },
  { id: 'confocal-microscopy', name: 'Confocal Microscopy', difficulty: 'Advanced', completed: false },
];

export function NewDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastActivity, setLastActivity] = useState<LastActivity | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [leaderboardPreview, setLeaderboardPreview] = useState<LeaderboardEntry[]>([]);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, university, program_department, learning_type, instructor_verified, last_simulation')
        .eq('id', user?.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Load last activity
      const { data: activityData } = await supabase
        .from('simulation_usage')
        .select('id, simulation_name, started_at')
        .eq('user_id', user?.id)
        .eq('completed', false)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activityData) {
        setLastActivity(activityData);
      }

      // Load completed simulations count
      const { data: completedData } = await supabase
        .from('simulation_usage')
        .select('id')
        .eq('user_id', user?.id)
        .eq('completed', true);

      setCompletedCount(completedData?.length || 0);

      // Load recent sessions
      const { data: sessionsData } = await supabase
        .from('simulation_usage')
        .select('id, simulation_name, completed, started_at')
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false })
        .limit(3);

      setRecentSessions(sessionsData || []);

      // Load certificates (mock for now - would load from database)
      const { data: certsData } = await supabase
        .from('certificates')
        .select('id, mission, best_score, date_earned')
        .order('date_earned', { ascending: false })
        .limit(3);

      setCertificates(certsData || []);

      // Load leaderboard preview
      const { data: leaderboardData } = await supabase
        .from('leaderboard_profiles')
        .select('student_id, display_name, total_score')
        .eq('is_visible', true)
        .order('total_score', { ascending: false })
        .limit(3);

      setLeaderboardPreview((leaderboardData || []).map((entry, index) => ({
        ...entry,
        rank: index + 1
      })));

      // Load enrolled classes
      await loadEnrolledClasses();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrolledClasses = async () => {
    try {
      const { data: enrollments, error } = await supabase
        .from('class_enrollments')
        .select(`
          id,
          class_id,
          enrolled_at
        `)
        .eq('student_id', user?.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      if (enrollments && enrollments.length > 0) {
        const classesWithDetails = await Promise.all(
          enrollments.map(async (enrollment) => {
            const { data: classData } = await supabase
              .from('classes')
              .select('class_name, simulation_name, instructor_name')
              .eq('id', enrollment.class_id)
              .maybeSingle();

            return {
              id: enrollment.id,
              class_id: enrollment.class_id,
              class_name: classData?.class_name || 'Unknown Class',
              simulation_name: classData?.simulation_name || '',
              instructor_name: classData?.instructor_name || '',
              completed: false,
              enrolled_at: enrollment.enrolled_at,
            };
          })
        );

        setEnrolledClasses(classesWithDetails);
      }
    } catch (error) {
      console.error('Error loading enrolled classes:', error);
    }
  };

  const handleStartSimulation = (simId: string) => {
    navigate(`/lab?sim=${simId}`);
  };

  const getSimulationId = (simName: string): string => {
    const nameToIdMap: Record<string, string> = {
      'DNA Extraction': 'dna-extraction',
      'PCR': 'pcr-setup',
      'PCR Setup': 'pcr-setup',
      'Western Blot': 'western-blot',
      'Gel Electrophoresis': 'gel-electrophoresis',
      'Confocal Microscopy': 'confocal-microscopy'
    };
    return nameToIdMap[simName] || 'dna-extraction';
  };

  const getFirstName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    // Fallback to user metadata if profile doesn't have name yet
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return 'there';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-800';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleJoinClassSuccess = () => {
    loadEnrolledClasses(); // Reload enrolled classes after joining
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SharedNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {getFirstName()}!
          </h1>
          <p className="text-slate-600 mb-8">Continue your learning journey</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Last Activity Card */}
            {(lastActivity || profile?.last_simulation) && (
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Last Activity
                </h3>
                <div className="mb-4">
                  <p className="text-slate-900 font-medium">
                    {lastActivity?.simulation_name || profile?.last_simulation || 'DNA Extraction'}
                  </p>
                  {lastActivity && (
                    <p className="text-sm text-slate-600">
                      Started {formatTimeAgo(lastActivity.started_at)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    const simId = lastActivity ? getSimulationId(lastActivity.simulation_name) : (profile?.last_simulation ? getSimulationId(profile.last_simulation) : 'dna-extraction');
                    handleStartSimulation(simId);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  Resume
                </button>
              </div>
            )}

            {/* Progress Card */}
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Your Progress
              </h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Simulations Completed</span>
                  <span className="text-slate-900 font-bold">{completedCount}/5</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-emerald-600 h-3 rounded-full transition-all"
                    style={{ width: `${(completedCount / 5) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Keep going! {5 - completedCount} more to go.
              </p>
            </div>
          </div>
        </section>

        {/* Enrolled Classes Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Enrolled Classes</h2>
            <button
              onClick={() => setShowJoinModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Join a Class
            </button>
          </div>

          {enrolledClasses.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No classes joined yet. Enter a class code to join your instructor's class.</p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Join Your First Class
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white p-6 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{cls.class_name}</h3>
                    <p className="text-sm text-slate-600">Instructor: {cls.instructor_name}</p>
                    <p className="text-sm text-slate-600">Module: {cls.simulation_name}</p>
                  </div>

                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      cls.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cls.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleStartSimulation(getSimulationId(cls.simulation_name))}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {cls.completed ? 'Practice Again' : 'Start Module'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Your Simulations */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Simulations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSimulations.map((sim) => (
              <div
                key={sim.id}
                className="bg-white p-6 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">{sim.name}</h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(sim.difficulty)}`}>
                    {sim.difficulty}
                  </span>
                </div>
                <button
                  onClick={() => handleStartSimulation(sim.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  {sim.completed ? 'Continue' : 'Start'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Leaderboard Preview */}
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Leaderboard</h2>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>

            {leaderboardPreview.length > 0 ? (
              <>
                <div className="space-y-3 mb-4">
                  {leaderboardPreview.map((entry) => (
                    <div key={entry.student_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-600 w-6">#{entry.rank}</span>
                        <span className="text-sm text-slate-900">{entry.display_name}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">
                        {entry.total_score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="w-full text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                >
                  View Full Leaderboard →
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-600">No rankings yet</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>

            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-b-0">
                    <div>
                      <p className="text-slate-900 font-medium">{session.simulation_name}</p>
                      <p className="text-sm text-slate-600">{formatTimeAgo(session.started_at)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {session.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">No recent activity</p>
            )}
          </div>
        </div>

        {/* Certificates Section */}
        {certificates.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Certificates</h2>
              <Award className="w-6 h-6 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certificates.slice(0, 3).map((cert) => (
                <div key={cert.id} className="bg-white p-6 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-slate-900">{cert.mission}</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Best Score</span>
                    <span className="font-bold text-emerald-600">{Math.round(cert.best_score)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600">Earned</span>
                    <span className="text-slate-600">{new Date(cert.date_earned).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {certificates.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/profile')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  View All Certificates →
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Join Class Modal */}
      {showJoinModal && (
        <JoinClassModal
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleJoinClassSuccess}
        />
      )}
    </div>
  );
}
