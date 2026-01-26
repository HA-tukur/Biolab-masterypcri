import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ChevronRight, Sparkles, Key, LogIn, AlertTriangle, Copy, CheckCircle2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export function InstructorSetup() {
  const navigate = useNavigate();
  const [view, setView] = useState<'create' | 'login' | 'success'>('create');
  const [className, setClassName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ classCode: string; adminKey: string } | null>(null);
  const [copiedField, setCopiedField] = useState<'classCode' | 'adminKey' | null>(null);

  const generateClassCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const generateAdminKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let key = 'ADM-';
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const copyToClipboard = async (text: string, field: 'classCode' | 'adminKey') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
      const adminKey = generateAdminKey();

      const { data, error: insertError } = await supabase
        .from('classes')
        .insert({
          class_code: classCode,
          class_name: className.trim(),
          instructor_name: instructorName.trim(),
          admin_key: adminKey
        })
        .select();

      if (insertError) {
        console.error('Supabase error:', insertError);
        throw insertError;
      }

      console.log('Class created successfully:', data);
      setSuccessData({ classCode, adminKey });
      setView('success');
    } catch (err: any) {
      console.error('Error creating class:', err);
      const errorMessage = err?.message || 'Failed to create class. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithAdminKey = async () => {
    if (!adminKeyInput.trim()) {
      setError('Please enter your admin key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: queryError } = await supabase
        .from('classes')
        .select('class_code')
        .eq('admin_key', adminKeyInput.trim())
        .maybeSingle();

      if (queryError) {
        console.error('Supabase error:', queryError);
        throw queryError;
      }

      if (!data) {
        setError('Invalid admin key. Please check and try again.');
        return;
      }

      navigate(`/instructor/${data.class_code}`);
    } catch (err: any) {
      console.error('Error logging in:', err);
      const errorMessage = err?.message || 'Failed to login. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    if (successData) {
      navigate(`/instructor/${successData.classCode}`);
    }
  };

  if (view === 'success' && successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 mb-6">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-black text-white mb-4">Class Created Successfully!</h1>
            <p className="text-slate-300 text-lg">Save both codes below to manage your class</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Student Join Code</h3>
                <span className="text-xs text-slate-400">Share with students</span>
              </div>
              <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-3">
                <p className="text-3xl font-black text-white text-center tracking-wider">{successData.classCode}</p>
              </div>
              <button
                onClick={() => copyToClipboard(successData.classCode, 'classCode')}
                className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold py-2 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
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
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-amber-400" />
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">Private Admin Key</h3>
              </div>
              <p className="text-amber-200/80 text-xs mb-3">Save this key to resume your session later. Do not share with students.</p>
              <div className="bg-slate-900/50 border border-amber-600/30 rounded-lg p-4 mb-3">
                <p className="text-2xl font-black text-amber-100 text-center tracking-wider">{successData.adminKey}</p>
              </div>
              <button
                onClick={() => copyToClipboard(successData.adminKey, 'adminKey')}
                className="w-full bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 font-bold py-2 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                {copiedField === 'adminKey' ? (
                  <>
                    <CheckCircle2 size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Admin Key
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={goToDashboard}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 group"
          >
            Go to Dashboard
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-400/50 mb-6">
            <GraduationCap size={40} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Instructor Portal</h1>
          <p className="text-slate-300 text-lg">
            {view === 'create' ? 'Create a class and get your unique access code' : 'Resume your existing session'}
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setView('create');
              setError('');
            }}
            className={`flex-1 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
              view === 'create'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            Create New Class
          </button>
          <button
            onClick={() => {
              setView('login');
              setError('');
            }}
            className={`flex-1 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
              view === 'login'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            Resume Session
          </button>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
          {view === 'create' ? (
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

              <div className="mt-8 pt-8 border-t border-slate-700">
                <h3 className="text-slate-300 font-bold mb-3 uppercase tracking-wide text-sm">What happens next?</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold mt-0.5">1.</span>
                    <span>You'll receive a unique 6-character class code and a private admin key</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold mt-0.5">2.</span>
                    <span>Share the class code with your students (not the admin key)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold mt-0.5">3.</span>
                    <span>Save your admin key to resume your session anytime</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="adminKey" className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">
                  Admin Key
                </label>
                <div className="relative">
                  <Key size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="adminKey"
                    type="text"
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value.toUpperCase())}
                    placeholder="ADM-XXXXXX"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">Enter your private admin key to access your instructor dashboard</p>
              </div>

              {error && (
                <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-4">
                  <p className="text-rose-300 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleLoginWithAdminKey}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>Logging In...</>
                ) : (
                  <>
                    <LogIn size={20} />
                    Access Dashboard
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-8 pt-8 border-t border-slate-700">
                <h3 className="text-slate-300 font-bold mb-3 uppercase tracking-wide text-sm">Need Help?</h3>
                <p className="text-slate-400 text-sm">
                  Your admin key was provided when you created your class. It follows the format ADM-XXXXXX.
                  If you've lost your admin key, you'll need to create a new class.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
