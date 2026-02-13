import { useState } from 'react';
import { GraduationCap, User, BookOpen, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OnboardingModalProps {
  userId: string;
  onComplete: () => void;
}

export function OnboardingModal({ userId, onComplete }: OnboardingModalProps) {
  const [selectedPath, setSelectedPath] = useState<'university' | 'independent' | 'pre_university' | null>(null);
  const [classCode, setClassCode] = useState('');
  const [showClassCodeInput, setShowClassCodeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPath = (path: 'university' | 'independent' | 'pre_university') => {
    setSelectedPath(path);
    if (path === 'university') {
      setShowClassCodeInput(true);
    } else {
      setShowClassCodeInput(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedPath) {
      setError('Please select a learning path');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update user's profile with selected learning path
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          learning_path: selectedPath,
          onboarding_completed: true,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // If user entered a class code, try to join the class
      if (classCode.trim() && selectedPath === 'university') {
        const normalizedCode = classCode.trim().toUpperCase();

        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('class_code', normalizedCode)
          .maybeSingle();

        if (classError) throw classError;

        if (classData) {
          await supabase
            .from('class_enrollments')
            .insert({
              class_id: classData.id,
              user_id: userId,
              completed: false,
            });
        }
      }

      onComplete();
    } catch (err) {
      console.error('Error completing onboarding:', err);
      setError('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome to BioSim Lab!
          </h2>
          <p className="text-slate-600">
            Let's personalize your experience. Choose your learning path:
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* University Student */}
          <button
            onClick={() => handleSelectPath('university')}
            className={`p-6 border-2 rounded-lg transition-all ${
              selectedPath === 'university'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-emerald-300'
            }`}
          >
            <GraduationCap
              className={`w-12 h-12 mx-auto mb-3 ${
                selectedPath === 'university' ? 'text-emerald-600' : 'text-slate-400'
              }`}
            />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              University Student
            </h3>
            <p className="text-sm text-slate-600">
              Join classes and complete assignments from your instructors
            </p>
          </button>

          {/* Independent Learner */}
          <button
            onClick={() => handleSelectPath('independent')}
            className={`p-6 border-2 rounded-lg transition-all ${
              selectedPath === 'independent'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-emerald-300'
            }`}
          >
            <User
              className={`w-12 h-12 mx-auto mb-3 ${
                selectedPath === 'independent' ? 'text-emerald-600' : 'text-slate-400'
              }`}
            />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Independent Learner
            </h3>
            <p className="text-sm text-slate-600">
              Learn at your own pace without class requirements
            </p>
          </button>

          {/* Pre-university */}
          <button
            onClick={() => handleSelectPath('pre_university')}
            className={`p-6 border-2 rounded-lg transition-all ${
              selectedPath === 'pre_university'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-emerald-300'
            }`}
          >
            <BookOpen
              className={`w-12 h-12 mx-auto mb-3 ${
                selectedPath === 'pre_university' ? 'text-emerald-600' : 'text-slate-400'
              }`}
            />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Pre-university
            </h3>
            <p className="text-sm text-slate-600">
              High school or A-level student exploring biology
            </p>
          </button>
        </div>

        {/* Class Code Input (only for university students) */}
        {showClassCodeInput && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Class Code (Optional)
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="Enter class code if you have one"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none uppercase font-semibold text-center"
              maxLength={6}
            />
            <p className="text-sm text-slate-600 mt-2">
              You can skip this and join a class later from your dashboard
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleContinue}
            disabled={!selectedPath || loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-medium"
          >
            {loading ? 'Setting up...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
