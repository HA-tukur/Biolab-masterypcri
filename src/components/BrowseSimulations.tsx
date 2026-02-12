import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microscope, X } from 'lucide-react';

interface Simulation {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
}

const simulations: Simulation[] = [
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

export function BrowseSimulations() {
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Microscope className="w-6 h-6 text-teal-700" />
            <span className="text-xl font-bold text-gray-900">BioSimLab</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Available Simulations
          </h1>
          <p className="text-xl text-gray-600">
            Sign up free to start practicing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim) => (
            <div
              key={sim.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{sim.name}</h3>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(sim.difficulty)}`}>
                  {sim.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{sim.description}</p>
              <button
                onClick={() => setShowSignupModal(true)}
                className="w-full px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md transition-colors"
              >
                Sign Up to Start
              </button>
            </div>
          ))}
        </div>
      </main>

      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Create a free account to start practicing</h3>
              <button
                onClick={() => setShowSignupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Create a free account to access all simulations and track your progress.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
