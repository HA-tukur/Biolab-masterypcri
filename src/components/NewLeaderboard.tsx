import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SharedNavigation } from './SharedNavigation';

interface LeaderboardProfile {
  id: string;
  student_id: string;
  display_name: string;
  school_name: string | null;
  country: string;
  user_type: 'pre_university' | 'university' | 'independent';
  total_score: number;
  missions_completed: number;
  best_purity_score: number;
  average_score: number;
  rank?: number;
}

interface UserProfile {
  id: string;
  learning_path: string;
  leaderboard_visible: boolean;
  display_name_preference: 'real_name' | 'student_id' | 'custom_nickname';
  custom_nickname: string | null;
  full_name: string;
}

export function NewLeaderboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pre_university' | 'university' | 'independent'>('all');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
    fetchLeaderboard();
  }, [filter, user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, learning_path, leaderboard_visible, display_name_preference, custom_nickname, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leaderboard_profiles')
        .select('*')
        .eq('is_visible', true)
        .order('total_score', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('user_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const rankedData = (data || []).map((profile, index) => ({
        ...profile,
        rank: index + 1
      }));

      setProfiles(rankedData);

      // Find user's rank if they're visible
      if (user) {
        const userEntry = rankedData.find(p => p.student_id === user.id);
        if (userEntry) {
          setUserRank(userEntry.rank!);
        } else {
          setUserRank(null);
        }
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilterLabel = (filterType: string) => {
    switch (filterType) {
      case 'university':
        return 'University';
      case 'pre_university':
        return 'Pre-university';
      case 'independent':
        return 'Independent';
      default:
        return 'All';
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SharedNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-10 h-10 text-amber-500" />
                <h1 className="text-4xl font-bold text-slate-900">Leaderboard</h1>
              </div>
              <p className="text-slate-600 text-lg">
                Compete with students worldwide and track your progress
              </p>
            </div>
          </div>

          {/* User's Rank Card */}
          {user && userProfile?.leaderboard_visible && userRank && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-700 mb-1">Your Rank</p>
                  <p className="text-3xl font-bold text-emerald-900">{getRankDisplay(userRank)}</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                  <TrendingUp size={16} />
                  Update Profile
                </button>
              </div>
            </div>
          )}

          {user && !userProfile?.leaderboard_visible && (
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-6">
              <p className="text-slate-700 mb-2">
                You're currently hidden from the leaderboard
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Update Privacy Settings →
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-bold text-slate-900">Rankings</h2>
            <div className="flex gap-2">
              {(['all', 'university', 'pre_university', 'independent'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === filterType
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {getFilterLabel(filterType)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading rankings...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No rankings yet. Be the first!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Institution
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Total Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Missions
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Best Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {profiles.map((profile) => {
                    const isCurrentUser = user && profile.student_id === user.id;
                    return (
                      <tr
                        key={profile.id}
                        className={`transition-colors ${
                          isCurrentUser ? 'bg-emerald-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-slate-900">
                            {getRankDisplay(profile.rank!)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {profile.display_name}
                            </span>
                            {isCurrentUser && (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 capitalize">
                            {profile.user_type.replace('_', '-')}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-900">{profile.school_name || 'Independent'}</div>
                          <p className="text-sm text-slate-600">{profile.country}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-emerald-600">
                            {profile.total_score.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-900 font-medium">
                            {profile.missions_completed}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-900 font-medium">
                            {profile.best_purity_score.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!user && (
          <div className="mt-8 text-center">
            <p className="text-slate-600 mb-4">
              Want to see your rank? Sign in to compete!
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
