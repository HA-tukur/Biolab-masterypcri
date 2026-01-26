import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import {
  GraduationCap,
  Medal,
  Trophy,
  Home,
  Copy,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp
} from 'lucide-react';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

interface ClassData {
  id: string;
  class_name: string;
  instructor_name: string;
  class_code: string;
  created_at: string;
  mission_id?: string;
}

const MISSION_NAMES: Record<string, string> = {
  'DNA_EXT_A': 'DNA Extraction A - Superbug Clinical Diagnostic',
  'DNA_EXT_B': 'DNA Extraction B - Cassava Pathogen Sequencing',
  'PCR_A': 'PCR A - Diagnostic Amplification',
  'PCR_B': 'PCR B - Mutation Screening',
};

interface StudentResult {
  id: string;
  student_id: string;
  mission: string;
  purity_score: number;
  status: string;
  created_at: string;
}

interface LeaderboardEntry {
  student_id: string;
  total_score: number;
  missions_completed: number;
  best_purity: number;
  average_score: number;
  rank?: number;
}

export function InstructorDashboard() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (code) {
      loadClassData();
    }
  }, [code]);

  const loadClassData = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: classInfo, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('class_code', code)
        .maybeSingle();

      if (classError) throw classError;

      if (!classInfo) {
        setError('Class not found. Please check the code and try again.');
        setLoading(false);
        return;
      }

      setClassData(classInfo);

      const { data: resultsData, error: resultsError } = await supabase
        .from('lab_results')
        .select('*')
        .eq('class_id', classInfo.id)
        .order('created_at', { ascending: false });

      if (resultsError) throw resultsError;

      setResults(resultsData || []);
      calculateLeaderboard(resultsData || []);
    } catch (err: any) {
      console.error('Error loading class data:', err);
      setError('Failed to load class data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateLeaderboard = (resultsData: StudentResult[]) => {
    const studentMap = new Map<string, LeaderboardEntry>();

    resultsData.forEach(result => {
      const studentId = result.student_id;
      if (!studentId) return;

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          student_id: studentId,
          total_score: 0,
          missions_completed: 0,
          best_purity: 0,
          average_score: 0
        });
      }

      const entry = studentMap.get(studentId)!;
      const score = result.purity_score || 0;

      entry.total_score += score;
      entry.missions_completed += 1;
      entry.best_purity = Math.max(entry.best_purity, score);
      entry.average_score = entry.total_score / entry.missions_completed;
    });

    const sortedLeaderboard = Array.from(studentMap.values())
      .sort((a, b) => b.total_score - a.total_score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    setLeaderboard(sortedLeaderboard);
  };

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-slate-400" size={24} />;
    if (rank === 3) return <Medal className="text-amber-600" size={24} />;
    return <span className="text-slate-400 font-bold">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-500 border-amber-400';
    if (rank === 2) return 'bg-gradient-to-br from-slate-300 via-gray-200 to-slate-300 border-slate-300';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 via-amber-500 to-orange-500 border-orange-400';
    if (rank <= 10) return 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30';
    return 'bg-slate-800 border-slate-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-slate-300">Loading class data...</p>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
          <AlertCircle className="text-rose-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Class Not Found</h2>
          <p className="text-slate-400 mb-6">{error || 'The class code you entered does not exist.'}</p>
          <button
            onClick={() => navigate('/instructor/setup')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all"
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  const isTopThree = (rank: number) => rank <= 3;
  const textColorMain = (rank: number) => isTopThree(rank) ? 'text-slate-900' : 'text-white';
  const textColorSub = (rank: number) => isTopThree(rank) ? 'text-slate-800' : 'text-slate-300';
  const statColor = (rank: number) => isTopThree(rank) ? 'text-slate-900' : 'text-white';
  const labelColor = (rank: number) => isTopThree(rank) ? 'text-slate-700' : 'text-slate-400';

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>

          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-indigo-400/50 flex items-center justify-center">
                  <GraduationCap size={32} className="text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white mb-1">{classData.class_name}</h1>
                  <p className="text-slate-300 text-lg">{classData.instructor_name}</p>
                  {classData.mission_id && (
                    <div className="mt-2 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg px-3 py-1">
                      <Target size={14} className="text-emerald-400" />
                      <span className="text-emerald-300 text-sm font-bold">
                        {MISSION_NAMES[classData.mission_id] || classData.mission_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Class Code</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white tracking-wider">{classData.class_code}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <CheckCircle2 size={20} className="text-emerald-400" />
                    ) : (
                      <Copy size={20} className="text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/50">
                <Users className="text-indigo-400 mb-2" size={24} />
                <div className="text-2xl font-black text-white">{leaderboard.length}</div>
                <div className="text-slate-400 text-sm">Students</div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/50">
                <TrendingUp className="text-emerald-400 mb-2" size={24} />
                <div className="text-2xl font-black text-white">{results.length}</div>
                <div className="text-slate-400 text-sm">Total Submissions</div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/50">
                <Trophy className="text-amber-400 mb-2" size={24} />
                <div className="text-2xl font-black text-white">
                  {leaderboard[0]?.best_purity.toFixed(2) || '0.00'}
                </div>
                <div className="text-slate-400 text-sm">Top Purity Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white mb-4">Student Leaderboard</h2>

          {leaderboard.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
              <Users className="text-slate-600 mx-auto mb-4" size={48} />
              <p className="text-slate-400 text-lg">No student submissions yet</p>
              <p className="text-slate-500 text-sm mt-2">Students will appear here once they complete missions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.student_id}
                  className={`border-2 rounded-xl p-5 transition-all hover:scale-[1.01] ${getRankBadge(entry.rank!)}`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center">
                        {getRankIcon(entry.rank!)}
                      </div>
                      <div>
                        <h3 className={`font-black ${textColorMain(entry.rank!)} text-xl`}>
                          {entry.student_id}
                        </h3>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-center">
                        <div className={`text-2xl font-black ${statColor(entry.rank!)} mb-1`}>
                          {entry.total_score.toFixed(1)}
                        </div>
                        <div className={`text-xs ${labelColor(entry.rank!)} font-bold uppercase tracking-wide`}>
                          Total Score
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-black ${statColor(entry.rank!)} mb-1`}>
                          {entry.missions_completed}
                        </div>
                        <div className={`text-xs ${labelColor(entry.rank!)} font-bold uppercase tracking-wide`}>
                          Missions
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-black ${statColor(entry.rank!)} mb-1`}>
                          {entry.best_purity.toFixed(2)}
                        </div>
                        <div className={`text-xs ${labelColor(entry.rank!)} font-bold uppercase tracking-wide`}>
                          Best Purity
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-black ${statColor(entry.rank!)} mb-1`}>
                          {entry.average_score.toFixed(2)}
                        </div>
                        <div className={`text-xs ${labelColor(entry.rank!)} font-bold uppercase tracking-wide`}>
                          Average
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
  );
}
