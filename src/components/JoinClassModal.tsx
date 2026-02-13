import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface JoinClassModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function JoinClassModal({ onClose, onSuccess }: JoinClassModalProps) {
  const { user } = useAuth();
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classCode.trim()) {
      setError('Please enter a class code');
      return;
    }

    if (!user) {
      setError('You must be logged in to join a class');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const normalizedCode = classCode.trim().toUpperCase();

      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('class_code', normalizedCode)
        .maybeSingle();

      if (classError) throw classError;

      if (!classData) {
        setError('Invalid class code. Please check and try again.');
        setLoading(false);
        return;
      }

      const { data: existingEnrollment } = await supabase
        .from('class_enrollments')
        .select('id')
        .eq('class_id', classData.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingEnrollment) {
        setError('You are already enrolled in this class');
        setLoading(false);
        return;
      }

      const { error: enrollError } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: classData.id,
          user_id: user.id,
        });

      if (enrollError) throw enrollError;

      alert('Successfully joined class!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error joining class:', err);
      setError('Failed to join class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Join a Class</h2>
            <p className="text-slate-600">Enter your instructor's class code</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleJoinClass} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Class Code
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => {
                setClassCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="e.g., ABC123"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none uppercase font-semibold text-center text-lg tracking-wider"
              maxLength={6}
              autoFocus
            />
            <p className="text-sm text-slate-500 mt-2">
              Ask your instructor for the 6-character class code
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !classCode.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Class'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
