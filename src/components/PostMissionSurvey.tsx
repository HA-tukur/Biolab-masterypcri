import { useState } from 'react';
import { Target, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

interface PostMissionSurveyProps {
  missionName: string;
  resultId: string;
  studentId: string;
  successCount: number;
  onComplete: (responses: SurveyResponses) => void;
}

export interface SurveyResponses {
  muscleMemoryStep: string;
  confidenceLevel: number;
  peerChallengeShared: boolean;
}

const MUSCLE_MEMORY_OPTIONS = [
  { id: 'micropipetting', label: 'Micropipetting', icon: '💧' },
  { id: 'centrifugation', label: 'Centrifugation', icon: '🌀' },
  { id: 'ppe', label: 'PPE & Safety', icon: '🥽' },
  { id: 'result_analysis', label: 'Result Analysis', icon: '📊' }
];

export function PostMissionSurvey({
  missionName,
  resultId,
  studentId,
  successCount,
  onComplete
}: PostMissionSurveyProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [muscleMemoryStep, setMuscleMemoryStep] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(5);
  const [peerChallengeShared, setPeerChallengeShared] = useState<boolean>(false);

  const handleComplete = () => {
    onComplete({
      muscleMemoryStep,
      confidenceLevel,
      peerChallengeShared
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/30 rounded-2xl p-8 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 mb-4">
          <Target size={32} className="text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-tight">
          Mastery Check-In
        </h3>
        <p className="text-sm text-slate-400 mt-2">
          After {successCount} successful {successCount === 1 ? 'run' : 'runs'}, let's track your growth
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`w-3 h-3 rounded-full transition-all ${
              step >= num ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-bold text-white mb-2">Question 1: Skill Building</h4>
            <p className="text-sm text-slate-400">
              After {successCount} {successCount === 1 ? 'run' : 'runs'}, which step feels like second nature now?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MUSCLE_MEMORY_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setMuscleMemoryStep(option.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  muscleMemoryStep === option.id
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <div className="text-sm font-bold text-white">{option.label}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!muscleMemoryStep}
            className={`w-full py-3 rounded-xl font-bold uppercase tracking-wide transition-all ${
              muscleMemoryStep
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={20} className="text-emerald-400" />
              <h4 className="text-lg font-bold text-white">Question 2: Confidence Level</h4>
            </div>
            <p className="text-sm text-slate-400">
              On a scale of 1-10, how "Bench-Ready" do you feel for a real {missionName}?
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs text-slate-500 font-bold">Not Ready</span>
              <span className="text-xs text-slate-500 font-bold">Expert Ready</span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(Number(e.target.value))}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(confidenceLevel - 1) * 11.11}%, #334155 ${(confidenceLevel - 1) * 11.11}%, #334155 100%)`
              }}
            />

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50">
                <span className="text-4xl font-black text-emerald-400">{confidenceLevel}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {confidenceLevel <= 3 && 'Keep practicing - building essential skills!'}
                {confidenceLevel > 3 && confidenceLevel <= 6 && 'Good progress - getting more confident!'}
                {confidenceLevel > 6 && confidenceLevel <= 8 && 'Strong skills - almost ready for the real bench!'}
                {confidenceLevel > 8 && 'Expert level - bench-ready!'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-bold uppercase tracking-wide bg-slate-700 hover:bg-slate-600 text-white transition-all"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-xl font-bold uppercase tracking-wide bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users size={20} className="text-emerald-400" />
              <h4 className="text-lg font-bold text-white">Question 3: Peer Challenge</h4>
            </div>
            <p className="text-sm text-slate-400">
              You've built mastery! Ready to share your results and challenge a colleague?
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="text-4xl">🏆</div>
              <div className="text-left">
                <div className="text-sm text-slate-400">Your Achievement</div>
                <div className="text-lg font-black text-emerald-400">Success x{successCount}</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Share your mastery count with a peer and challenge them to beat your record.
              Collaborative learning accelerates skill development!
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setPeerChallengeShared(true);
                  const shareText = `I've achieved mastery in ${missionName} ${successCount} times on BioSim! 🧬 Think you can beat that? Join me at [Your Lab/Institution]`;
                  if (navigator.share) {
                    navigator.share({ text: shareText }).catch(() => {
                      navigator.clipboard.writeText(shareText);
                    });
                  } else {
                    navigator.clipboard.writeText(shareText);
                    alert('Challenge copied to clipboard!');
                  }
                }}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wide transition-all ${
                  peerChallengeShared
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {peerChallengeShared ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} />
                    <span>Shared!</span>
                  </div>
                ) : (
                  'Share & Challenge Peers'
                )}
              </button>

              <button
                onClick={() => {
                  setPeerChallengeShared(false);
                  handleComplete();
                }}
                className="w-full py-3 rounded-xl font-bold uppercase tracking-wide bg-slate-700 hover:bg-slate-600 text-white transition-all"
              >
                Skip for Now
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-2 rounded-xl font-bold uppercase tracking-wide text-xs bg-transparent text-slate-500 hover:text-slate-400 transition-all"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
