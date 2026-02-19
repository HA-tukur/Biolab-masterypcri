import { Award, CheckCircle2, XCircle, Target, ShieldCheck, Beaker, ShieldAlert } from 'lucide-react';

interface MasteryBadgeProps {
  badge: {
    earned: boolean;
    technicalSuccess: boolean;
    protocolPrecision: boolean;
    safetyExcellence: boolean;
    blockReason?: string;
  };
  concentration: number;
  a260_280: number;
  successCount?: number;
}

export function MasteryBadge({ badge, concentration, a260_280, successCount = 0 }: MasteryBadgeProps) {
  if (!badge.safetyExcellence && badge.technicalSuccess) {
    return (
      <div className="border-2 rounded-2xl p-6 bg-gradient-to-br from-amber-900/30 to-rose-900/20 border-amber-500">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500/20">
            <ShieldAlert size={32} className="text-amber-400" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-amber-400">
                Safety Breach Detected
              </h3>
              <p className="text-sm text-amber-300 mt-2">
                Technical success achieved, but PPE protocol was violated
              </p>
            </div>

            <div className="bg-rose-900/30 border border-rose-500/30 rounded-lg p-5">
              <p className="text-sm text-rose-200 leading-relaxed">
                You successfully extracted DNA with excellent yield and purity. However, you worked without proper Personal Protective Equipment (goggles, gloves, or lab coat). In a real laboratory, this would result in immediate dismissal from the bench and potential disciplinary action.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-xs font-bold text-white uppercase mb-3">Real-World Consequences</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Chemical exposure to corrosive lysis buffers and ethanol</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Sample contamination from skin oils and particles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Breach of laboratory biosafety protocols</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
              <p className="text-xs text-emerald-300 text-center font-medium">
                Mastery requires both technical skill AND safety compliance. Complete this mission again with full PPE to earn your badge.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`border-2 rounded-2xl p-6 ${
      badge.earned
        ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-500'
        : 'bg-slate-900/50 border-slate-700'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          badge.earned ? 'bg-emerald-500/20' : 'bg-slate-800'
        }`}>
          <Award size={32} className={badge.earned ? 'text-emerald-400' : 'text-slate-500'} />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h3 className={`text-xl font-black uppercase tracking-tight ${
              badge.earned ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {badge.earned ? (successCount > 0 ? `Mastery x${successCount}` : 'Mastery Achieved') : 'Mastery Badge'}
            </h3>
            {successCount > 1 && badge.earned && (
              <p className="text-sm text-emerald-300 mt-1">
                {successCount} consecutive successful extractions
              </p>
            )}
            {badge.blockReason && (
              <p className="text-sm text-amber-400 mt-2">
                {badge.blockReason}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`border rounded-lg p-3 ${
              badge.technicalSuccess
                ? 'bg-emerald-900/20 border-emerald-500/30'
                : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {badge.technicalSuccess ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-slate-500" />
                )}
                <span className={`text-xs font-bold uppercase ${
                  badge.technicalSuccess ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  Technical Success
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Yield:</span>
                  <span className={concentration >= 200 ? 'text-emerald-400' : 'text-red-400'}>
                    {concentration >= 200 ? '✓' : '✗'} {concentration.toFixed(1)} ng/µL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Purity:</span>
                  <span className={a260_280 >= 1.7 ? 'text-emerald-400' : 'text-red-400'}>
                    {a260_280 >= 1.7 ? '✓' : '✗'} {a260_280.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className={`border rounded-lg p-3 ${
              badge.protocolPrecision
                ? 'bg-blue-900/20 border-blue-500/30'
                : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {badge.protocolPrecision ? (
                  <CheckCircle2 size={16} className="text-blue-400" />
                ) : (
                  <XCircle size={16} className="text-slate-500" />
                )}
                <span className={`text-xs font-bold uppercase ${
                  badge.protocolPrecision ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  Protocol Precision
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {badge.protocolPrecision
                  ? 'All steps completed correctly'
                  : 'Protocol deviations detected'}
              </p>
            </div>

            <div className={`border rounded-lg p-3 ${
              badge.safetyExcellence
                ? 'bg-purple-900/20 border-purple-500/30'
                : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {badge.safetyExcellence ? (
                  <CheckCircle2 size={16} className="text-purple-400" />
                ) : (
                  <XCircle size={16} className="text-slate-500" />
                )}
                <span className={`text-xs font-bold uppercase ${
                  badge.safetyExcellence ? 'text-purple-400' : 'text-slate-500'
                }`}>
                  Safety Excellence
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {badge.safetyExcellence
                  ? '100% PPE compliance'
                  : 'Safety equipment missing'}
              </p>
            </div>
          </div>

          {badge.earned && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-emerald-300 text-center font-medium">
                Outstanding work! You have demonstrated mastery of DNA extraction through technical precision, protocol adherence, and safety compliance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
