import React from 'react';
import { FlaskConical } from 'lucide-react';

interface Reagent {
  id: string;
  name: string;
  color: string;
  volume: string;
  available: boolean;
  type?: 'tube' | 'bottle';
}

const getReagentTooltip = (reagentId: string): string => {
  const tooltips: Record<string, string> = {
    lysis: 'Buffer ATL (Lysis Buffer) - Breaks cell membranes | Use: Step 1 (200µL)',
    proteinase_k: 'Proteinase K - Digests proteins at 56°C | Use: Step 1 (20µL)',
    binding: 'Buffer AL (Binding Buffer) - Prepares DNA for column | Use: Step 3 (200µL)',
    ethanol: 'Ethanol 96-100% - Required for DNA binding | Use: Step 3 (200µL)',
    wash: 'Wash Buffer - Removes salts and contaminants | Use: Step 5 (500µL × 2)',
    elute: 'Buffer AE (Elution Buffer) - Releases pure DNA | Use: Step 6 (50µL)'
  };
  return tooltips[reagentId] || '';
};

interface EnhancedReagentContainersProps {
  availableReagents: Reagent[];
  onContainerClick: (reagentId: string, color: string) => void;
  canAspirate: boolean;
  selectedPipette: boolean;
}

const TubeVisualization = ({ color, label, volume }: { color: string; label: string; volume: string }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer transition-all hover:scale-105">
    <div className="relative">
      <svg width="50" height="80" viewBox="0 0 50 80" className="drop-shadow-lg">
        <rect x="12" y="5" width="26" height="5" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
        <path d="M15 10 L15 65 Q15 70 25 72 Q35 70 35 65 L35 10 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <ellipse cx="25" cy="10" rx="10" ry="3" fill="#0f172a" stroke="#475569" strokeWidth="1"/>
        <path d="M17 35 L17 60 Q17 64 25 66 Q33 64 33 60 L33 35 Z" fill={color} opacity="0.7"/>
        <ellipse cx="25" cy="35" rx="8" ry="2.5" fill={color} opacity="0.8"/>
      </svg>
      <div className="absolute inset-0 rounded-lg group-hover:bg-white/10 transition-all"/>
    </div>
    <div className="text-center">
      <p className="text-[10px] font-bold text-white">{label}</p>
      <p className="text-[9px] text-slate-400">{volume}</p>
    </div>
  </div>
);

const BottleVisualization = ({ color, label, volume }: { color: string; label: string; volume: string }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer transition-all hover:scale-105">
    <div className="relative">
      <svg width="60" height="90" viewBox="0 0 60 90" className="drop-shadow-lg">
        <rect x="22" y="5" width="16" height="8" rx="2" fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
        <path d="M20 13 L20 75 Q20 80 30 82 Q40 80 40 75 L40 13 Z" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <ellipse cx="30" cy="13" rx="10" ry="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5"/>
        <path d="M22 40 L22 70 Q22 75 30 77 Q38 75 38 70 L38 40 Z" fill={color} opacity="0.6"/>
        <ellipse cx="30" cy="40" rx="8" ry="2.5" fill={color} opacity="0.7"/>
        <rect x="25" y="50" width="10" height="15" rx="1" fill="#1e293b" opacity="0.3"/>
      </svg>
      <div className="absolute inset-0 rounded-lg group-hover:bg-white/10 transition-all"/>
    </div>
    <div className="text-center">
      <p className="text-[10px] font-bold text-white">{label}</p>
      <p className="text-[9px] text-slate-400">{volume}</p>
    </div>
  </div>
);

export const EnhancedReagentContainers: React.FC<EnhancedReagentContainersProps> = ({
  availableReagents,
  onContainerClick,
  canAspirate,
  selectedPipette
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        {availableReagents.map((reagent) => {
          const isClickable = canAspirate && selectedPipette;
          const containerType = reagent.type || (reagent.name.includes('Proteinase') ? 'tube' : 'bottle');

          return (
            <div
              key={reagent.id}
              onClick={() => isClickable && onContainerClick(reagent.id, reagent.color)}
              title={getReagentTooltip(reagent.id)}
              className={`
                bg-slate-900/50 border rounded-xl p-3 transition-all
                ${isClickable
                  ? 'border-emerald-500/50 hover:border-emerald-400 hover:bg-slate-800/70 cursor-pointer shadow-lg shadow-emerald-500/20'
                  : 'border-slate-700 opacity-60 cursor-not-allowed'}
              `}
            >
              {containerType === 'tube' ? (
                <TubeVisualization color={reagent.color} label={reagent.name} volume={reagent.volume} />
              ) : (
                <BottleVisualization color={reagent.color} label={reagent.name} volume={reagent.volume} />
              )}
            </div>
          );
        })}
      </div>

      {!selectedPipette && (
        <p className="text-[10px] text-center text-slate-500 italic">
          Select a pipette first
        </p>
      )}

      {selectedPipette && !canAspirate && (
        <p className="text-[10px] text-center text-emerald-400 font-bold animate-pulse">
          Adjust volume, then click reagent to aspirate
        </p>
      )}

      {canAspirate && selectedPipette && (
        <p className="text-[10px] text-center text-emerald-400 font-bold animate-pulse">
          Click a reagent to aspirate
        </p>
      )}
    </div>
  );
};
