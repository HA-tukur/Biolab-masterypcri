import { Lightbulb, AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { DiagnosticInsight } from '../utils/performanceTracker';

interface DiagnosticInsightsProps {
  insights: DiagnosticInsight[];
}

export function DiagnosticInsights({ insights }: DiagnosticInsightsProps) {
  if (insights.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'safety':
        return <ShieldAlert size={20} className="text-amber-500" />;
      case 'contamination':
      case 'ethanol':
        return <AlertTriangle size={20} className="text-red-400" />;
      case 'yield':
        return <AlertCircle size={20} className="text-amber-400" />;
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getBgColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-900/20 border-red-500/30';
      case 'warning':
        return 'bg-amber-900/20 border-amber-500/30';
      default:
        return 'bg-blue-900/20 border-blue-500/30';
    }
  };

  const getTitleColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-red-300';
      case 'warning':
        return 'text-amber-300';
      default:
        return 'text-blue-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb size={20} className="text-emerald-400" />
        <h3 className="text-lg font-bold text-white">Researcher Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border p-5 rounded-xl ${getBgColor(insight.severity)}`}
          >
            <div className="flex items-start gap-3">
              {getIcon(insight.type)}
              <div className="flex-1 space-y-2">
                <h4 className={`font-bold text-sm ${getTitleColor(insight.severity)}`}>
                  {insight.title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
