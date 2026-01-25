import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, Medal, Award, Home, TrendingUp, Users, Globe, Share2, Crown, Star, Sparkles } from 'lucide-react';
import { getOrCreateStudentId } from '../utils/studentId';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface LeaderboardProfile {
  id: string;
  student_id: string;
  display_name: string;
  school_name: string | null;
  country: string;
  user_type: 'high_school' | 'university' | 'independent';
  total_score: number;
  missions_completed: number;
  best_purity_score: number;
  average_score: number;
  rank?: number;
}

interface LeaderboardRegistrationData {
  display_name: string;
  school_name: string;
  country: string;
  user_type: 'high_school' | 'university' | 'independent';
}

export default function Leaderboard() {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high_school' | 'university' | 'independent'>('all');
  const [smartFilter, setSmartFilter] = useState<'country' | 'university' | 'class' | 'global'>('country');
  const [studentId] = useState(getOrCreateStudentId());
  const [userProfile, setUserProfile] = useState<LeaderboardProfile | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState<LeaderboardRegistrationData>({
    display_name: '',
    school_name: '',
    country: '',
    user_type: 'high_school'
  });
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    checkUserProfile();
  }, [filter]);

  const checkUserProfile = async () => {
    const { data, error } = await supabase
      .from('leaderboard_profiles')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (!error && data) {
      setUserProfile(data);
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

      if (userProfile) {
        const userRank = rankedData.find(p => p.student_id === studentId);
        if (userRank) {
          setUserProfile(userRank);
        }
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateScoresFromResults = async () => {
    const { data: results } = await supabase
      .from('lab_results')
      .select('*')
      .eq('student_id', studentId);

    if (!results || results.length === 0) {
      return {
        total_score: 0,
        missions_completed: 0,
        best_purity_score: 0,
        average_score: 0
      };
    }

    const totalScore = results.reduce((sum, r) => sum + (r.purity_score || 0), 0);
    const missionsCompleted = results.length;
    const bestPurityScore = Math.max(...results.map(r => r.purity_score || 0));
    const averageScore = totalScore / missionsCompleted;

    return {
      total_score: totalScore,
      missions_completed: missionsCompleted,
      best_purity_score: bestPurityScore,
      average_score: averageScore
    };
  };

  const handleRegister = async () => {
    if (!registrationData.display_name || !registrationData.country) {
      alert('Please fill in all required fields');
      return;
    }

    setIsRegistering(true);

    try {
      const scores = await calculateScoresFromResults();

      const { error } = await supabase
        .from('leaderboard_profiles')
        .insert([{
          student_id: studentId,
          display_name: registrationData.display_name,
          school_name: registrationData.school_name || null,
          country: registrationData.country,
          user_type: registrationData.user_type,
          ...scores
        }]);

      if (error) throw error;

      setShowRegistration(false);
      await checkUserProfile();
      await fetchLeaderboard();
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Failed to register. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const updateLeaderboardScore = async () => {
    if (!userProfile) return;

    const scores = await calculateScoresFromResults();

    await supabase
      .from('leaderboard_profiles')
      .update({
        ...scores,
        updated_at: new Date().toISOString()
      })
      .eq('student_id', studentId);

    await checkUserProfile();
    await fetchLeaderboard();
  };

  const shareToSocial = () => {
    if (!userProfile) return;

    const text = `🏆 I'm ranked #${userProfile.rank} on the BioSim Lab National Leaderboard! Total Score: ${userProfile.total_score.toFixed(1)} | Missions: ${userProfile.missions_completed} 🔬🧬`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: 'BioSim Lab Leaderboard',
        text: text,
        url: url
      });
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="text-yellow-400" size={24} />;
    if (rank === 2) return <Medal className="text-gray-300" size={24} />;
    if (rank === 3) return <Medal className="text-amber-600" size={24} />;
    return <span className="text-slate-400 font-bold">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-600 to-amber-500 border-yellow-400';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-slate-400 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700 to-orange-600 border-amber-500';
    if (rank <= 10) return 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30';
    return 'bg-slate-800 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-amber-900/40 via-slate-800 to-indigo-900/40 border-2 border-amber-500/50 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-600 p-4 rounded-xl">
                <Trophy size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white mb-2">Global Rankings</h1>
                <p className="text-slate-300 text-lg">Compete with students worldwide. Track your ranking. Share your achievements.</p>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2 font-medium">SMART FILTER</label>
              <select
                value={smartFilter}
                onChange={(e) => setSmartFilter(e.target.value as any)}
                className="bg-slate-900/80 border-2 border-amber-500/50 rounded-lg px-4 py-2 text-white font-medium focus:border-amber-500 focus:outline-none"
              >
                <option value="country">My Country</option>
                <option value="university">My University</option>
                <option value="class">My Class</option>
                <option value="global" disabled>Global (Coming Soon)</option>
              </select>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg transition-colors font-medium"
            >
              <Home size={18} />
              Back to Lab
            </a>
          </div>

          {userProfile ? (
            <div className="mt-6 bg-slate-900/60 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-amber-400">
                    #{userProfile.rank || '?'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{userProfile.display_name}</h3>
                    <p className="text-slate-400 text-sm">
                      {userProfile.school_name} • {userProfile.country}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userProfile.total_score.toFixed(1)}</div>
                    <div className="text-xs text-slate-400">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userProfile.missions_completed}</div>
                    <div className="text-xs text-slate-400">Missions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userProfile.best_purity_score.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">Best Score</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={updateLeaderboardScore}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    <TrendingUp size={16} />
                    Update Score
                  </button>
                  <button
                    onClick={shareToSocial}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-slate-900/60 border border-amber-500/30 rounded-xl p-6 text-center">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Join the Competition!</h3>
              <p className="text-slate-300 mb-4">Register to see your rank and compete with students worldwide.</p>
              <button
                onClick={() => setShowRegistration(true)}
                className="bg-amber-600 hover:bg-amber-500 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              >
                Register for Leaderboard
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Rankings</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Users size={16} className="inline mr-2" />
                All
              </button>
              <button
                onClick={() => setFilter('high_school')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'high_school'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Star size={16} className="inline mr-2" />
                High School
              </button>
              <button
                onClick={() => setFilter('university')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'university'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Award size={16} className="inline mr-2" />
                University
              </button>
              <button
                onClick={() => setFilter('independent')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === 'independent'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Globe size={16} className="inline mr-2" />
                Independent
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-300">Loading rankings...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No rankings yet. Be the first to register!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((profile) => {
                const isGoldOrSilver = profile.rank! <= 2;
                const textColor = isGoldOrSilver ? 'text-[#111827]' : 'text-white';
                const subTextColor = isGoldOrSilver ? 'text-[#374151]' : 'text-slate-300';
                const metaTextColor = isGoldOrSilver ? 'text-[#6B7280]' : 'text-slate-400';

                return (
                  <div
                    key={profile.id}
                    className={`border-2 rounded-xl p-4 transition-all hover:scale-[1.02] ${
                      getRankBadge(profile.rank!)
                    } ${profile.student_id === studentId ? 'ring-2 ring-amber-400' : ''}`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 text-center">
                          {getRankIcon(profile.rank!)}
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg flex items-center gap-2 ${textColor}`}>
                            {profile.display_name}
                            {profile.student_id === studentId && (
                              <span className="text-xs bg-amber-500 px-2 py-0.5 rounded-full text-white">YOU</span>
                            )}
                          </h3>
                          <p className={`text-sm ${subTextColor}`}>
                            {profile.school_name || 'Independent'} • {profile.country}
                          </p>
                          <p className={`text-xs mt-1 capitalize ${metaTextColor}`}>
                            {profile.user_type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <div className={`text-xl font-bold ${textColor}`}>{profile.total_score.toFixed(1)}</div>
                          <div className={`text-xs ${metaTextColor}`}>Total Score</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${textColor}`}>{profile.missions_completed}</div>
                          <div className={`text-xs ${metaTextColor}`}>Missions</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${textColor}`}>{profile.best_purity_score.toFixed(2)}</div>
                          <div className={`text-xs ${metaTextColor}`}>Best Purity</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${textColor}`}>{profile.average_score.toFixed(2)}</div>
                          <div className={`text-xs ${metaTextColor}`}>Average</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showRegistration && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border-2 border-amber-500/50 rounded-2xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-black text-white mb-6">Join the Leaderboard</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={registrationData.display_name}
                  onChange={(e) => setRegistrationData({ ...registrationData, display_name: e.target.value })}
                  placeholder="Your name or nickname"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  School Name (Optional)
                </label>
                <input
                  type="text"
                  value={registrationData.school_name}
                  onChange={(e) => setRegistrationData({ ...registrationData, school_name: e.target.value })}
                  placeholder="Your school or institution"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={registrationData.country}
                  onChange={(e) => setRegistrationData({ ...registrationData, country: e.target.value })}
                  placeholder="Your country"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  I am a *
                </label>
                <select
                  value={registrationData.user_type}
                  onChange={(e) => setRegistrationData({ ...registrationData, user_type: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="high_school">High School Student</option>
                  <option value="university">University Student</option>
                  <option value="independent">Independent Learner</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRegistration(false)}
                disabled={isRegistering}
                className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-3 rounded-lg font-bold text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="flex-1 bg-amber-600 hover:bg-amber-500 px-4 py-3 rounded-lg font-bold text-white transition-colors disabled:opacity-50"
              >
                {isRegistering ? 'Registering...' : 'Register'}
              </button>
            </div>

            <p className="text-slate-400 text-xs mt-4 text-center">
              Your display name and scores will be visible on the public leaderboard. You can delete your profile anytime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
