import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ProtocolComparison } from '../utils/performanceTracker';

interface TimelineAnalysisProps {
  comparisons: ProtocolComparison[];
  missionTitle: string;
}

export function TimelineAnalysis({ comparisons, missionTitle }: TimelineAnalysisProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Protocol Timeline Analysis</h3>
        <span className="text-xs text-slate-400 font-mono">{missionTitle}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Phase</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Ideal Protocol</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Your Action</th>
              <th className="text-left py-3 px-4 text-slate-300 font-semibold">Impact on Result</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison, index) => (
              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-4 px-4 text-white font-medium">{comparison.phase}</td>
                <td className="py-4 px-4 text-slate-300 font-mono text-xs">
                  {comparison.idealProtocol}
                </td>
                <td className="py-4 px-4 text-slate-300 font-mono text-xs">
                  {comparison.yourAction}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-start gap-2">
                    {comparison.severity === 'good' && (
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                    {comparison.severity === 'warning' && (
                      <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    {comparison.severity === 'error' && (
                      <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-xs ${
                        comparison.severity === 'good'
                          ? 'text-emerald-400'
                          : comparison.severity === 'warning'
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      {comparison.impact}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
