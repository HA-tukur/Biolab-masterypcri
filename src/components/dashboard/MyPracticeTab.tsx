import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Microscope, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface InProgressSimulation {
  id: string;
  simulation_name: string;
  started_at: string;
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

interface AvailableSimulation {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

const availableSimulations: AvailableSimulation[] = [
  {
    id: 'dna-extraction',
    name: 'DNA Extraction',
    difficulty: 'Beginner',
    description: 'Learn to isolate DNA from cells',
  },
  {
    id: 'pcr-setup',
    name: 'PCR Setup',
    difficulty: 'Intermediate',
    description: 'Master polymerase chain reaction',
  },
  {
    id: 'western-blot',
    name: 'Western Blot',
    difficulty: 'Advanced',
    description: 'Detect specific proteins',
  },
  {
    id: 'gel-electrophoresis',
    name: 'Gel Electrophoresis',
    difficulty: 'Intermediate',
    description: 'Separate DNA fragments',
  },
  {
    id: 'confocal-microscopy',
    name: 'Confocal Microscopy',
    difficulty: 'Advanced',
    description: 'High-resolution cell imaging',
  },
];

export function MyPracticeTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [inProgressSims, setInProgressSims] = useState<InProgressSimulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    await Promise.all([
      loadEnrolledClasses(),
      loadInProgressSimulations(),
    ]);

    setLoading(false);
  };

  const loadInProgressSimulations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('simulation_usage')
        .select('id, simulation_name, started_at')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('started_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setInProgressSims(data || []);
    } catch (error) {
      console.error('Error loading in-progress simulations:', error);
    }
  };

  const loadEnrolledClasses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('class_enrollments')
        .select(`
          enrolled_at,
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
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      const classes = data?.map((enrollment: any) => ({
        id: enrollment.classes.id,
        class_name: enrollment.classes.name,
        class_code: enrollment.classes.class_code,
        simulation_name: enrollment.classes.simulation_name,
        instructor_name: enrollment.classes.profiles.full_name,
        completed: false,
        enrolled_at: enrollment.enrolled_at,
      })) || [];

      setEnrolledClasses(classes);
    } catch (error) {
      console.error('Error loading classes:', error);
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
        .eq('student_id', user?.id)
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
          student_id: user?.id,
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

  const handleStartSimulation = async (simulationName: string) => {
    if (!user) return;

    try {
      await supabase
        .from('simulation_usage')
        .insert({
          user_id: user.id,
          simulation_name: simulationName,
          started_at: new Date().toISOString(),
          completed: false,
        });

      navigate('/lab');
    } catch (error) {
      console.error('Error recording simulation start:', error);
      navigate('/lab');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">My Practice</h2>
            <p className="text-gray-600 mt-1">Continue learning or start a new simulation</p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Join a Class</span>
          </button>
        </div>
      </section>

      {/* Continue Practicing */}
      {!loading && inProgressSims.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Continue Practicing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressSims.map((sim) => (
              <div
                key={sim.id}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {sim.simulation_name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Started {formatTimeAgo(sim.started_at)}
                </p>
                <button
                  onClick={() => navigate('/lab')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Resume
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Simulations */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Simulations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSimulations.map((sim) => (
            <div
              key={sim.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{sim.name}</h3>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(sim.difficulty)}`}>
                  {sim.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{sim.description}</p>
              <button
                onClick={() => handleStartSimulation(sim.name)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* My Classes */}
      {!loading && enrolledClasses.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Classes</h2>
          <div className="space-y-4">
            {enrolledClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{cls.class_name}</h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    cls.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {cls.completed ? 'Completed' : 'Not Started'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Instructor: {cls.instructor_name}
                </p>
                {cls.simulation_name && (
                  <p className="text-sm text-gray-600 mb-4">
                    Assigned: {cls.simulation_name}
                  </p>
                )}
                {cls.simulation_name && (
                  <button
                    onClick={() => navigate('/lab')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {cls.completed ? 'Review' : 'Start Assignment'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Join a Class</h3>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setClassCode('');
                  setJoinError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4 uppercase text-center font-semibold text-lg"
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
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {joining ? 'Joining...' : 'Join'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
