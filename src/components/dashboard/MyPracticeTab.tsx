import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dna, Zap, Activity, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface Simulation {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

interface EnrolledClass {
  id: string;
  class_name: string;
  class_code: string;
  simulation_name: string | null;
  instructor_name: string;
  completed: boolean;
  enrolled_at: string;
}

const simulations: Simulation[] = [
  {
    id: 'dna-extraction',
    title: 'DNA Extraction',
    description: 'Learn DNA isolation techniques',
    icon: Dna,
    path: '/lab',
    color: 'cyan',
  },
  {
    id: 'pcr',
    title: 'PCR Simulation',
    description: 'Master PCR protocols',
    icon: Zap,
    path: '/lab',
    color: 'blue',
  },
  {
    id: 'western-blot',
    title: 'Western Blot',
    description: 'Protein analysis techniques',
    icon: Activity,
    path: '/lab',
    color: 'green',
  },
];

export function MyPracticeTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  useEffect(() => {
    loadEnrolledClasses();
  }, [user]);

  const loadEnrolledClasses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('class_enrollments')
        .select(`
          enrolled_at,
          completed,
          classes!inner (
            id,
            name,
            class_code,
            simulation_name,
            instructor_id,
            profiles!inner (
              full_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      const classes = data?.map((enrollment: any) => ({
        id: enrollment.classes.id,
        class_name: enrollment.classes.name,
        class_code: enrollment.classes.class_code,
        simulation_name: enrollment.classes.simulation_name,
        instructor_name: enrollment.classes.profiles.full_name,
        completed: enrollment.completed,
        enrolled_at: enrollment.enrolled_at,
      })) || [];

      setEnrolledClasses(classes);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      setJoinError('Please enter a class code');
      return;
    }

    setJoining(true);
    setJoinError('');

    try {
      const normalizedCode = classCode.trim().toUpperCase();

      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('class_code', normalizedCode)
        .maybeSingle();

      if (classError) throw classError;

      if (!classData) {
        setJoinError('Invalid class code');
        setJoining(false);
        return;
      }

      const { data: existingEnrollment, error: checkError } = await supabase
        .from('class_enrollments')
        .select('id')
        .eq('class_id', classData.id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingEnrollment) {
        setJoinError("You're already in this class");
        setJoining(false);
        return;
      }

      const { error: enrollError } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: classData.id,
          user_id: user?.id,
          completed: false,
        });

      if (enrollError) throw enrollError;

      setClassCode('');
      setShowJoinModal(false);
      await loadEnrolledClasses();
    } catch (error) {
      console.error('Error joining class:', error);
      setJoinError('Failed to join class. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-600">Continue your molecular biology journey</p>
      </div>

      {/* Solo Practice Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Simulations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim) => {
            const Icon = sim.icon;
            return (
              <button
                key={sim.id}
                onClick={() => navigate(sim.path)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-${sim.color}-50 text-${sim.color}-600 mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{sim.title}</h3>
                <p className="text-gray-600 mb-4">{sim.description}</p>
                <div className="flex items-center text-cyan-600 font-medium group-hover:gap-2 transition-all">
                  <span>Start Practice</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* My Classes Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Classes I've Joined</h2>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Join a Class
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Loading classes...</p>
          </div>
        ) : enrolledClasses.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't joined any classes yet</p>
            <button
              onClick={() => setShowJoinModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Join a Class with Code
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{cls.class_name}</h3>
                  {cls.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Instructor: {cls.instructor_name}
                </p>
                {cls.simulation_name && (
                  <p className="text-sm text-gray-600 mb-1">
                    Simulation: {cls.simulation_name}
                  </p>
                )}
                <p className="text-sm text-gray-500 mb-4">Code: {cls.class_code}</p>

                {cls.simulation_name && (
                  <button
                    onClick={() => navigate('/lab')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    {cls.completed ? 'Review Simulation' : 'Start Simulation'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Join a Class</h3>
            <p className="text-gray-600 mb-4">
              Enter the class code provided by your instructor
            </p>

            {joinError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">{joinError}</p>
              </div>
            )}

            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="Enter class code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none mb-4 uppercase text-center font-semibold text-lg"
              maxLength={6}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setClassCode('');
                  setJoinError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinClass}
                disabled={joining}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {joining ? 'Joining...' : 'Join Class'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
