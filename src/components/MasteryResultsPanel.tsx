import React from 'react';
import { Award, AlertTriangle, ShieldCheck, ShieldAlert, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { MasteryReport } from '../utils/masteryAnalysis';

interface MasteryResultsPanelProps {
  report: MasteryReport;
}

export const MasteryResultsPanel: React.FC<MasteryResultsPanelProps> = ({ report }) => {
  const getTechnicalGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-yellow-400';
      case 'D': return 'text-orange-400';
      case 'F': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getSafetyGradeColor = (grade: string) => {
    switch (grade) {
      case 'pass': return 'text-emerald-400';
      case 'warning': return 'text-yellow-400';
      case 'fail': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          Mastery Analysis
        </h2>
        {report.masteryAchieved && (
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500 rounded-lg px-4 py-2">
            <Award size={20} className="text-emerald-400" />
            <span className="text-emerald-400 font-bold text-sm">MASTERY ACHIEVED</span>
          </div>
        )}
      </div>

      {/* Result Summary */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-300 text-sm leading-relaxed">{report.resultSummary}</p>
      </div>

      {/* Grades */}
      <div className="grid grid-cols-2 gap-4">
        {/* Technical Grade */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase">Technical Grade</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${getTechnicalGradeColor(report.technicalGrade)}`}>
              {report.technicalGrade}
            </span>
            <span className="text-slate-500 text-sm">
              {report.technicalGrade === 'A' && 'Perfect Execution'}
              {report.technicalGrade === 'B' && 'Strong Results'}
              {report.technicalGrade === 'C' && 'Adequate Results'}
              {report.technicalGrade === 'D' && 'Poor Results'}
              {report.technicalGrade === 'F' && 'Failed'}
            </span>
          </div>
        </div>

        {/* Safety Grade */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            {report.safetyGrade === 'pass' ? (
              <ShieldCheck size={16} className="text-emerald-400" />
            ) : (
              <ShieldAlert size={16} className="text-red-400" />
            )}
            <h3 className="text-xs font-bold text-slate-400 uppercase">Safety Compliance</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black uppercase ${getSafetyGradeColor(report.safetyGrade)}`}>
              {report.safetyGrade}
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostic Feedback */}
      {report.diagnosticFeedback.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <AlertCircle size={14} className="text-blue-400" />
            Diagnostic Feedback
          </h3>
          <div className="space-y-2">
            {report.diagnosticFeedback.map((feedback, idx) => {
              const isSuccess = feedback.startsWith('✅');
              const isWarning = feedback.startsWith('⚠️');
              const isError = feedback.startsWith('❌');

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    isSuccess ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' :
                    isWarning ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300' :
                    isError ? 'bg-red-500/10 border border-red-500/30 text-red-300' :
                    'bg-slate-900/50 border border-slate-700 text-slate-300'
                  }`}
                >
                  {feedback}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Protocol Deviations */}
      {report.deviations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <XCircle size={14} className="text-red-400" />
            Protocol Deviations
          </h3>
          <div className="space-y-3">
            {report.deviations.map((deviation, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  deviation.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                  deviation.severity === 'major' ? 'bg-orange-500/10 border-orange-500/30' :
                  'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className={`text-xs font-bold uppercase ${
                      deviation.severity === 'critical' ? 'text-red-400' :
                      deviation.severity === 'major' ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>
                      {deviation.severity} Deviation
                    </span>
                    <p className="text-slate-400 text-xs mt-0.5">Step: {deviation.step}</p>
                  </div>
                </div>
                <p className="text-white text-sm font-semibold mb-1">{deviation.description}</p>
                <p className="text-slate-400 text-xs mb-2">
                  <span className="font-semibold text-slate-300">Scientific Impact:</span> {deviation.scientificImpact}
                </p>
                <div className="bg-slate-900/50 border border-slate-700 rounded p-2 mt-2">
                  <p className="text-slate-300 text-xs">
                    <span className="font-semibold text-blue-400">💡 Mastery Advice:</span> {deviation.masteryAdvice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Violations */}
      {report.safetyViolations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-400" />
            Safety Violations
          </h3>
          <div className="space-y-3">
            {report.safetyViolations.map((violation, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border bg-red-500/10 border-red-500/30"
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle size={14} className="text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{violation.description}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Step: {violation.step}</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded p-2 mt-2">
                  <p className="text-slate-300 text-xs">
                    <span className="font-semibold text-red-400">🧪 Professional Impact:</span> {violation.professionalImpact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-400" />
            Recommendations for Next Time
          </h3>
          <div className="space-y-2">
            {report.recommendations.map((recommendation, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs leading-relaxed"
              >
                {recommendation}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mastery Message */}
      <div className="bg-slate-900/50 border-2 border-amber-500/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Award size={20} className="text-amber-400 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-white font-bold text-sm mb-1">Building Mastery</h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              In BioSimLab, actions have consequences. The simulation did not stop you from making mistakes—it let you
              experience the scientific reality of your choices. True mastery is achieving high-yield, high-purity DNA
              while maintaining perfect safety standards. Use this feedback to improve your technique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
