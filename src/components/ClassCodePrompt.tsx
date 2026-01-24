import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ClassCodePromptProps {
  onComplete: () => void;
}

export default function ClassCodePrompt({ onComplete }: ClassCodePromptProps) {
  const [step, setStep] = useState<'initial' | 'enterCode'>('initial');
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSkip = () => {
    localStorage.removeItem('biosim_class_id');
    localStorage.setItem('biosim_class_prompt_shown', 'true');
    onComplete();
  };

  const handleValidateCode = async () => {
    if (!classCode.trim()) {
      setError('Please enter a class code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('classes')
        .select('id, class_name, instructor_name')
        .eq('class_code', classCode.trim().toUpperCase())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Invalid class code. Please check with your instructor.');
        setLoading(false);
        return;
      }

      localStorage.setItem('biosim_class_id', data.id);
      localStorage.setItem('biosim_class_code', classCode.trim().toUpperCase());
      localStorage.setItem('biosim_class_name', data.class_name);
      localStorage.setItem('biosim_class_prompt_shown', 'true');

      onComplete();
    } catch (err) {
      setError('Failed to validate code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'enterCode') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Enter Your Class Code
          </h2>
          <p className="text-gray-600 mb-6">
            Ask your instructor for the class code to join.
          </p>

          <div className="mb-6">
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="MOLB-XXXX"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold uppercase focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={9}
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('initial')}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleValidateCode}
              disabled={loading || !classCode.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Validating...' : 'Join Class'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to BioSim Lab
          </h2>
          <p className="text-gray-600">
            Are you part of a university class?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setStep('enterCode')}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-left flex items-center justify-between"
          >
            <span>Yes - I have a class code</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={handleSkip}
            className="w-full px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-left flex items-center justify-between"
          >
            <span>No - Practice on my own</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            You can always practice without joining a class
          </p>
        </div>
      </div>
    </div>
  );
}