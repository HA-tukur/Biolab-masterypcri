import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Copy, CheckCircle2, Plus, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SharedNavigation } from './SharedNavigation';
import { InstructorRequestModal } from './dashboard/InstructorRequestModal';

const AVAILABLE_MODULES = [
  'DNA Extraction',
  'PCR',
  'Western Blot',
  'Gel Electrophoresis',
  'Confocal Microscopy',
];

interface ClassData {
  id: string;
  name: string;
  simulation_name: string;
  class_code: string;
  created_at: string;
  student_count?: number;
}

interface Profile {
  full_name: string;
  university: string;
  program_department: string;
}

export function InstructorPortal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [creating, setCreating] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    className: '',
    module: '',
  });

  const isInstructor = user?.app_metadata?.role === 'instructor' || user?.app_metadata?.role === 'admin';

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, university, program_department')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      if (isInstructor) {
        await loadClasses();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const { data: classesData, error } = await supabase
        .from('classes')
        .select('id, name, simulation_name, class_code, created_at')
        .eq('instructor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (classesData) {
        const classesWithCounts = await Promise.all(
          classesData.map(async (cls) => {
            const { count } = await supabase
              .from('class_enrollments')
              .select('id', { count: 'exact', head: true })
              .eq('class_id', cls.id);

            return { ...cls, student_count: count || 0 };
          })
        );

        setClasses(classesWithCounts);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const generateClassCode = async (): Promise<string> => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const { data } = await supabase
        .from('classes')
        .select('class_code')
        .eq('class_code', code)
        .maybeSingle();

      if (!data) {
        return code;
      }

      attempts++;
    }

    throw new Error('Failed to generate unique class code');
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.className || !formData.module) {
      alert('Please fill in all fields');
      return;
    }

    if (classes.length >= 2) {
      alert('Free tier limit: You can only create 2 classes. Upgrade for more.');
      return;
    }

    setCreating(true);

    try {
      const classCode = await generateClassCode();

      const { data, error } = await supabase
        .from('classes')
        .insert({
          instructor_id: user?.id,
          name: formData.className,
          simulation_name: formData.module,
          class_code: classCode,
          instructor_name: profile?.full_name || '',
          instructor_email: user?.email || '',
        })
        .select()
        .single();

      if (error) throw error;

      alert(`Class created successfully! Code: ${classCode}`);
      setFormData({ className: '', module: '' });
      await loadClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getTotalStudents = () => {
    return classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SharedNavigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInstructor) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SharedNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-slate-200 rounded-lg p-8">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Instructor Portal Access Required
              </h1>
              <p className="text-slate-600">
                You need instructor access to view this page. Request access to create classes and track student progress.
              </p>
            </div>

            <button
              onClick={() => setShowRequestModal(true)}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Request Instructor Access
            </button>
          </div>
        </div>

        {showRequestModal && (
          <InstructorRequestModal onClose={() => setShowRequestModal(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SharedNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Instructor Portal</h1>
          <p className="text-slate-600">Manage your classes and track student progress</p>
        </div>

        {/* Free Tier Quota */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            <strong>Free Tier:</strong> {classes.length}/2 classes created, {getTotalStudents()}/100 total students
          </p>
        </div>

        {/* Create New Class Section */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create a Class</h2>
          <p className="text-slate-600 mb-6">Create a class and get your unique access code</p>

          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Instructor Name
              </label>
              <input
                type="text"
                value={profile?.full_name || ''}
                disabled
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class Name
              </label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                placeholder="e.g., Biology 101 - Section A"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Target Module
              </label>
              <select
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              >
                <option value="">Select a module...</option>
                {AVAILABLE_MODULES.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500 mt-2">
                Students will be directed to this module when they join
              </p>
            </div>

            <button
              type="submit"
              disabled={creating || classes.length >= 2}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
            >
              {creating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Code...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Generate Class Code
                </>
              )}
            </button>
          </form>
        </div>

        {/* My Classes Section */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">My Classes</h2>

          {classes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No classes yet. Create your first class above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {cls.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Module: {cls.simulation_name}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <code className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-center font-mono font-bold text-lg text-slate-900">
                      {cls.class_code}
                    </code>
                    <button
                      onClick={() => handleCopyCode(cls.class_code)}
                      className="p-2 hover:bg-slate-100 rounded transition-colors"
                      title="Copy code"
                    >
                      {copiedCode === cls.class_code ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-600">
                      {cls.student_count} student{cls.student_count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(cls.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/instructor/class/${cls.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    View Students
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
