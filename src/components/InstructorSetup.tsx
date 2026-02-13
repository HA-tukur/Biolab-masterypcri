import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ChevronRight, Sparkles, AlertTriangle, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const AVAILABLE_SIMULATIONS = [
  { id: 'DNA Extraction', name: 'DNA Extraction' },
  { id: 'PCR', name: 'PCR' },
  { id: 'Western Blot', name: 'Western Blot' },
];

interface InstructorStatus {
  verified: boolean;
  quota: number;
  classesCreated: number;
}

export function InstructorSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [instructorStatus, setInstructorStatus] = useState<InstructorStatus | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [className, setClassName] = useState('');
  const [selectedSimulation, setSelectedSimulation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ classCode: string } | null>(null);
  const [copiedField, setCopiedField] = useState<'classCode' | null>(null);

  useEffect(() => {
    checkInstructorStatus();
  }, [user]);

  const checkInstructorStatus = async () => {
    if (!user) {
      navigate('/dashboard');
      return;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('instructor_verified, classes_quota')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile || !profile.instructor_verified) {
        navigate('/dashboard', { state: { message: 'Request instructor access first' } });
        return;
      }

      const { count, error: countError } = await supabase
        .from('classes')
        .select('id', { count: 'exact', head: true })
        .eq('instructor_id', user.id);

      if (countError) throw countError;

      setInstructorStatus({
        verified: profile.instructor_verified,
        quota: profile.classes_quota,
        classesCreated: count || 0,
      });
    } catch (error) {
      console.error('Error checking instructor status:', error);
      setError('Failed to load instructor status');
    } finally {
      setCheckingStatus(false);
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

      const { data, error } = await supabase
        .from('classes')
        .select('class_code')
        .eq('class_code', code)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return code;
      }

      attempts++;
    }

    throw new Error('Failed to generate unique class code');
  };

  const copyToClipboard = async (text: string, field: 'classCode') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCreateClass = async () => {
    if (!className.trim()) {
      setError('Please enter a class name');
      return;
    }

    if (!selectedSimulation) {
      setError('Please select a simulation');
      return;
    }

    if (!instructorStatus || instructorStatus.classesCreated >= instructorStatus.quota) {
      setError('You have reached your class creation limit');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const classCode = await generateClassCode();

      const { error: insertError } = await supabase
        .from('classes')
        .insert({
          instructor_id: user?.id,
          class_name: className.trim(),
          class_code: classCode,
          simulation_name: selectedSimulation,
        });

      if (insertError) {
        console.error('Supabase error:', insertError);
        throw insertError;
      }

      setSuccessData({ classCode });
      setInstructorStatus({
        ...instructorStatus,
        classesCreated: instructorStatus.classesCreated + 1,
      });
    } catch (err: any) {
      console.error('Error creating class:', err);
      const errorMessage = err?.message || 'Failed to create class. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading instructor status...</p>
        </div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border-2 border-green-400 mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Class Created Successfully!</h1>
            <p className="text-gray-600 text-lg">Share this code with your students</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Student Join Code</h3>
              <span className="text-xs text-gray-500">Share with students</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4">
              <p className="text-4xl font-black text-gray-900 text-center tracking-wider">{successData.classCode}</p>
            </div>
            <button
              onClick={() => copyToClipboard(successData.classCode, 'classCode')}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2 mb-4"
            >
              {copiedField === 'classCode' ? (
                <>
                  <CheckCircle2 size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Code
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 text-center mb-4">
              Share this code: <span className="font-mono font-bold">{successData.classCode}</span>
            </p>
          </div>

          <button
            onClick={goToDashboard}
            className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 group"
          >
            Back to Dashboard
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  const quotaReached = instructorStatus && instructorStatus.classesCreated >= instructorStatus.quota;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-100 border-2 border-cyan-400 mb-6">
            <GraduationCap size={40} className="text-cyan-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create a Class</h1>
          <p className="text-gray-600 text-lg">
            Set up a new class for your students
          </p>
        </div>

        {instructorStatus && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Classes Created</p>
                <p className="text-2xl font-bold text-gray-900">
                  {instructorStatus.classesCreated} / {instructorStatus.quota}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                quotaReached
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                <p className="text-sm font-bold">
                  {quotaReached ? 'Quota Reached' : `${instructorStatus.quota - instructorStatus.classesCreated} Remaining`}
                </p>
              </div>
            </div>
          </div>
        )}

        {quotaReached ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
            <AlertTriangle size={48} className="text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You've Used All {instructorStatus?.quota} Free Classes
            </h2>
            <p className="text-gray-600 mb-6">
              Contact us to increase your class creation limit
            </p>
            <a
              href="mailto:info@biosimlab.app"
              className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Contact: info@biosimlab.app
            </a>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <label htmlFor="className" className="block text-sm font-bold text-gray-700 mb-2">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="className"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g., Biology 101 - Section A"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="simulation" className="block text-sm font-bold text-gray-700 mb-2">
                  Simulation <span className="text-red-500">*</span>
                </label>
                <select
                  id="simulation"
                  value={selectedSimulation}
                  onChange={(e) => setSelectedSimulation(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  required
                >
                  <option value="">Select a simulation...</option>
                  {AVAILABLE_SIMULATIONS.map((sim) => (
                    <option key={sim.id} value={sim.id}>
                      {sim.name}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-xs mt-2">Students will practice this simulation</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleCreateClass}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Class...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Create Class
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-gray-700 font-bold mb-3 text-sm">What happens next?</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold mt-0.5">1.</span>
                    <span>You'll receive a unique 6-character class code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold mt-0.5">2.</span>
                    <span>Share the class code with your students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold mt-0.5">3.</span>
                    <span>Students will join and complete the assigned simulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold mt-0.5">4.</span>
                    <span>Track their progress from your dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={goToDashboard}
          className="w-full mt-6 text-center text-gray-600 hover:text-gray-900 font-medium py-3 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
