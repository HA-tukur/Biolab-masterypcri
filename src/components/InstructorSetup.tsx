import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ChevronRight, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export function InstructorSetup() {
  const navigate = useNavigate();
  const [className, setClassName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateClassCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateClass = async () => {
    if (!className.trim() || !instructorName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const classCode = generateClassCode();

      const { error: insertError } = await supabase
        .from('classes')
        .insert({
          class_code: classCode,
          class_name: className.trim(),
          instructor_name: instructorName.trim()
        });

      if (insertError) throw insertError;

      navigate(`/instructor/${classCode}`);
    } catch (err: any) {
      console.error('Error creating class:', err);
      setError('Failed to create class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-400/50 mb-6">
            <GraduationCap size={40} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Instructor Portal</h1>
          <p className="text-slate-300 text-lg">Create a class and get your unique access code</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="instructorName" className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">
                Instructor Name
              </label>
              <input
                id="instructorName"
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                placeholder="Dr. Smith"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="className" className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">
                Class Name
              </label>
              <input
                id="className"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Biology 101 - Section A"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {error && (
              <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-4">
                <p className="text-rose-300 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleCreateClass}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>Creating Class...</>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Class Code
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-slate-300 font-bold mb-3 uppercase tracking-wide text-sm">What happens next?</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold mt-0.5">1.</span>
                <span>You'll receive a unique 6-character class code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold mt-0.5">2.</span>
                <span>Share this code with your students</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold mt-0.5">3.</span>
                <span>Track their progress on your instructor dashboard</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
