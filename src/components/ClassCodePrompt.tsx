import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getOrCreateStudentId } from '../utils/studentId';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ClassCodePromptProps {
  onComplete: () => void;
  onJoinMission?: (techniqueId: string, missionId: string) => void;
}

export default function ClassCodePrompt({ onComplete, onJoinMission }: ClassCodePromptProps) {
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        .select('id, class_name, instructor_name, mission_id')
        .eq('class_code', classCode.trim().toUpperCase())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Invalid class code. Please check with your instructor.');
        setLoading(false);
        return;
      }

      const studentId = getOrCreateStudentId();

      const { error: sessionError } = await supabase
        .from('lab_sessions')
        .upsert({
          student_id: studentId,
          class_id: data.id,
          last_active: new Date().toISOString()
        }, {
          onConflict: 'student_id,class_id'
        });

      if (sessionError) throw sessionError;

      onComplete();

      if (data.mission_id && onJoinMission) {
        const parts = data.mission_id.split('_');
        if (parts[0] === 'PCR' && parts.length >= 2) {
          const techniqueId = 'PCR';
          const missionId = parts.slice(1).join('_');
          setTimeout(() => {
            onJoinMission(techniqueId, missionId);
          }, 100);
        } else if (parts.length >= 3) {
          const techniqueId = `${parts[0]}_${parts[1]}`;
          const missionId = parts[2];
          setTimeout(() => {
            onJoinMission(techniqueId, missionId);
          }, 100);
        }
      }
    } catch (err) {
      setError('Failed to validate code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Join a Class
        </h2>
        <p className="text-gray-600 mb-6">
          Enter the class code provided by your instructor
        </p>

        <div className="mb-6">
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold uppercase focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#111827] placeholder:text-gray-400"
            maxLength={6}
          />
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onComplete}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleValidateCode}
            disabled={loading || !classCode.trim()}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Joining...' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
}