import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Users, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SharedNavigation } from './SharedNavigation';

interface ClassInfo {
  id: string;
  name: string;
  simulation_name: string;
  class_code: string;
}

interface StudentProgress {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  enrolled_at: string;
  completed: boolean;
  last_active: string | null;
  score: number | null;
}

export function StudentProgressView() {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<StudentProgress[]>([]);

  useEffect(() => {
    loadClassData();
  }, [classId]);

  const loadClassData = async () => {
    if (!classId || !user) return;

    try {
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('id, name, simulation_name, class_code')
        .eq('id', classId)
        .eq('instructor_id', user.id)
        .maybeSingle();

      if (classError) throw classError;

      if (!classData) {
        alert('Class not found or access denied');
        navigate('/instructor/setup');
        return;
      }

      setClassInfo(classData);

      const { data: enrollments, error: enrollError } = await supabase
        .from('class_enrollments')
        .select(`
          id,
          student_id,
          enrolled_at,
          completed
        `)
        .eq('class_id', classId)
        .order('enrolled_at', { ascending: false });

      if (enrollError) throw enrollError;

      if (enrollments && enrollments.length > 0) {
        const studentsWithDetails = await Promise.all(
          enrollments.map(async (enrollment) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', enrollment.student_id)
              .maybeSingle();

            const { data: lastActivity } = await supabase
              .from('simulation_usage')
              .select('started_at')
              .eq('user_id', enrollment.student_id)
              .eq('simulation_name', classData.simulation_name)
              .order('started_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            const { data: result } = await supabase
              .from('lab_results')
              .select('score')
              .eq('student_id', enrollment.student_id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              id: enrollment.id,
              user_id: enrollment.student_id,
              full_name: profile?.full_name || 'Unknown',
              email: profile?.email || '',
              enrolled_at: enrollment.enrolled_at,
              completed: enrollment.completed,
              last_active: lastActivity?.started_at || null,
              score: result?.score || null,
            };
          })
        );

        setStudents(studentsWithDetails);
      }
    } catch (error) {
      console.error('Error loading class data:', error);
      alert('Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (student: StudentProgress) => {
    if (student.completed) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
          <CheckCircle2 className="w-4 h-4" />
          Completed
        </span>
      );
    }

    if (student.last_active) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
          <Clock className="w-4 h-4" />
          In Progress
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
        <XCircle className="w-4 h-4" />
        Not Started
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleExportCSV = () => {
    if (!classInfo || students.length === 0) return;

    const headers = ['Student Name', 'Email', 'Status', 'Score', 'Enrolled Date', 'Last Active'];
    const rows = students.map((student) => [
      student.full_name,
      student.email,
      student.completed ? 'Completed' : student.last_active ? 'In Progress' : 'Not Started',
      student.score ? student.score.toString() : 'N/A',
      formatDate(student.enrolled_at),
      student.last_active ? formatDate(student.last_active) : 'Never',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classInfo.name.replace(/[^a-z0-9]/gi, '_')}_students.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SharedNavigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading student data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SharedNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-slate-600">Class not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SharedNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/instructor/setup')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to My Classes</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{classInfo.name}</h1>
              <p className="text-slate-600">Module: {classInfo.simulation_name}</p>
              <p className="text-sm text-slate-500">Class Code: {classInfo.class_code}</p>
            </div>
            {students.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export to CSV
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-5 h-5" />
            <span className="font-medium">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No students enrolled yet</p>
              <p className="text-sm text-slate-500 mt-2">
                Share your class code with students to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{student.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(student)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {student.score !== null ? `${student.score}%` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {student.last_active ? formatDate(student.last_active) : 'Never'}
                        </div>
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
