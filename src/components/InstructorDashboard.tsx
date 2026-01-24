import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ClassInfo {
  id: string;
  instructor_name: string;
  instructor_email: string;
  class_name: string;
  class_code: string;
  created_at: string;
}

interface StudentResult {
  studentId: string;
  bestScore: number;
  attempts: number;
  hasMastery: boolean;
}

interface DashboardStats {
  totalStudents: number;
  avgScore: number;
  masteryRate: number;
}

interface InstructorDashboardProps {
  classCode: string;
}

export default function InstructorDashboard({ classCode }: InstructorDashboardProps) {
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [classCode]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('class_code', classCode.toUpperCase())
        .maybeSingle();

      if (classError) throw classError;

      if (!classData) {
        setError('Class not found. Please check the class code.');
        setLoading(false);
        return;
      }

      setClassInfo(classData);

      const { data: results, error: resultsError } = await supabase
        .from('lab_results')
        .select('*')
        .eq('class_id', classData.id)
        .order('timestamp', { ascending: false });

      if (resultsError) throw resultsError;

      if (!results || results.length === 0) {
        setStudents([]);
        setStats({ totalStudents: 0, avgScore: 0, masteryRate: 0 });
        setLoading(false);
        return;
      }

      const studentMap: Record<string, { scores: number[]; attempts: number }> = {};

      results.forEach((result) => {
        if (!studentMap[result.student_id]) {
          studentMap[result.student_id] = { scores: [], attempts: 0 };
        }
        studentMap[result.student_id].scores.push(result.purity_score || 0);
        studentMap[result.student_id].attempts++;
      });

      const studentList: StudentResult[] = Object.entries(studentMap).map(([studentId, data]) => {
        const bestScore = Math.max(...data.scores);
        return {
          studentId,
          bestScore,
          attempts: data.attempts,
          hasMastery: bestScore >= 0.75
        };
      }).sort((a, b) => b.bestScore - a.bestScore);

      setStudents(studentList);

      const totalStudents = studentList.length;
      const avgScore = studentList.reduce((sum, s) => sum + s.bestScore, 0) / totalStudents;
      const masteryCount = studentList.filter(s => s.hasMastery).length;
      const masteryRate = (masteryCount / totalStudents) * 100;

      setStats({ totalStudents, avgScore, masteryRate });
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!classInfo || students.length === 0) return;

    const headers = ['Student ID', 'Best Score', 'Attempts', 'Status'];
    const rows = students.map(s => [
      s.studentId,
      s.bestScore.toFixed(2),
      s.attempts.toString(),
      s.hasMastery ? 'Mastery' : 'In Progress'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classInfo.class_name.replace(/\s+/g, '_')}_results.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/instructor/setup"
            className="inline-block bg-blue-600 text-white rounded-lg py-2 px-6 font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Setup
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                BioSim Lab - Instructor Dashboard
              </h1>
              <div className="space-y-1">
                <p className="text-gray-600">
                  <strong>Class:</strong> {classInfo?.class_name}
                </p>
                <p className="text-gray-600">
                  <strong>Code:</strong> {classInfo?.class_code}
                </p>
                <p className="text-gray-600">
                  <strong>Instructor:</strong> {classInfo?.instructor_name} ({classInfo?.instructor_email})
                </p>
              </div>
            </div>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Back to Lab
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats?.totalStudents || 0}
              </div>
              <div className="text-gray-600">Students</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats ? stats.avgScore.toFixed(2) : '0.00'}
              </div>
              <div className="text-gray-600">Average Score</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats ? Math.round(stats.masteryRate) : 0}%
              </div>
              <div className="text-gray-600">Mastery Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Student Results</h2>
            {students.length > 0 && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            )}
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
              <p className="text-gray-600 mb-4">
                No students have joined this class yet.
              </p>
              <p className="text-sm text-gray-500">
                Share the code: <strong className="text-gray-700">{classInfo?.class_code}</strong>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Best Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Attempts</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{student.studentId}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          student.bestScore >= 0.75 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {student.bestScore.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{student.attempts}</td>
                      <td className="py-3 px-4">
                        {student.hasMastery ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Mastery
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Practice
                          </span>
                        )}
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