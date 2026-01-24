import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, TrendingUp, Calendar, Download, Home, Zap, Target } from 'lucide-react';
import { getOrCreateStudentId } from '../utils/studentId';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  category: string;
  date: string;
  score: number;
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
        .select('*')
        .eq('student_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setResults([]);
        setCategoryProgress([]);
        setCertificates([]);
        setStats({ totalAttempts: 0, successfulMissions: 0, averageScore: 0, practiceStreak: 0 });
        setLoading(false);
        return;
      }

      setResults(data);

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

      const certs: Certificate[] = Object.entries(categoryMap)
        .filter(([_, data]) => data.best >= 85)
        .map(([category, data], index) => ({
          id: `cert-${index}`,
          category,
          date: new Date().toLocaleDateString(),
          score: Math.round(data.best)
        }));

      setCertificates(certs);

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

  const downloadCertificate = (cert: Certificate) => {
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
    ctx.fillText('This certifies that', 400, 180);

    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(studentId, 400, 240);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('has demonstrated mastery in', 400, 300);

    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#6366f1';
    ctx.fillText(cert.category, 400, 360);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Score: ${cert.score}%`, 400, 420);
    ctx.fillText(`Date: ${cert.date}`, 400, 460);

    ctx.font = 'italic 16px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('BioSim Lab - Virtual Laboratory Training Platform', 400, 540);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cert.category.replace(/\s+/g, '_')}_Certificate.png`;
    a.click();
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
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="text-amber-400" size={20} />
                          <h3 className="font-bold text-white">{cert.category}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <TrendingUp size={14} />
                            Score: {cert.score}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {cert.date}
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
                ))}
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
