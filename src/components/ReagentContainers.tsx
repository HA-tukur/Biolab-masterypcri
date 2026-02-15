import { FlaskConical, TestTube2 } from 'lucide-react';

interface ReagentContainersProps {
  availableReagents: Array<{
    id: string;
    name: string;
    type: 'bottle' | 'tube';
    color: string;
    volume: string;
    available: boolean;
  }>;
  onContainerClick: (reagentId: string, color: string) => void;
  canAspirate: boolean;
  selectedPipette: boolean;
}

export function ReagentContainers({
  availableReagents,
  onContainerClick,
  canAspirate,
  selectedPipette
}: ReagentContainersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase">Available Reagents</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {availableReagents.map((reagent) => (
          <div
            key={reagent.id}
            onClick={() => {
              if (reagent.available && canAspirate && selectedPipette) {
                onContainerClick(reagent.id, reagent.color);
              }
            }}
            className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
              reagent.available && canAspirate && selectedPipette
                ? 'border-emerald-500/50 bg-slate-800/80 cursor-pointer hover:border-emerald-400 hover:bg-slate-700/80 hover:scale-105'
                : 'border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed'
            }`}
          >
            {reagent.available && canAspirate && selectedPipette && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
            )}

            {reagent.type === 'bottle' ? (
              <BufferBottleSVG color={reagent.color} available={reagent.available} />
            ) : (
              <SampleTubeSVG color={reagent.color} available={reagent.available} />
            )}

            <div className="text-center mt-3">
              <p className="text-xs font-bold text-white">{reagent.name}</p>
              <p className="text-[10px] text-slate-400 mt-1">{reagent.volume}</p>
            </div>
          </div>
        ))}
      </div>

      {canAspirate && selectedPipette && (
        <p className="text-xs text-center text-emerald-400 animate-pulse">
          Click a reagent container to aspirate liquid
        </p>
      )}

      {!selectedPipette && (
        <p className="text-xs text-center text-slate-500">
          Select a pipette first
        </p>
      )}
    </div>
  );
}

interface ContainerSVGProps {
  color: string;
  available: boolean;
}

function BufferBottleSVG({ color, available }: ContainerSVGProps) {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-md">
      <defs>
        <linearGradient id={`bottle-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <rect x="28" y="10" width="24" height="15" rx="2" fill="#94a3b8" />
      <rect x="34" y="5" width="12" height="8" rx="1" fill="#64748b" />

      <rect
        x="20"
        y="25"
        width="40"
        height="70"
        rx="4"
        fill={`url(#bottle-grad-${color})`}
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {available && (
        <>
          <rect
            x="22"
            y="50"
            width="36"
            height="43"
            fill={color}
            opacity="0.7"
            className="transition-all duration-300"
          />
          <rect
            x="22"
            y="48"
            width="36"
            height="4"
            fill={color}
            opacity="0.3"
          />
        </>
      )}

      <text x="40" y="40" textAnchor="middle" fontSize="8" fill="#475569" fontWeight="bold">
        {available ? 'FULL' : 'EMPTY'}
      </text>
    </svg>
  );
}

function SampleTubeSVG({ color, available }: ContainerSVGProps) {
  return (
    <svg width="60" height="100" viewBox="0 0 60 100" className="drop-shadow-md">
      <defs>
        <linearGradient id={`tube-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <ellipse cx="30" cy="15" rx="18" ry="5" fill="#94a3b8" />
      <rect x="12" y="15" width="36" height="2" fill="#64748b" />

      <path
        d="M 12 15 L 12 85 Q 12 92 18 95 L 42 95 Q 48 92 48 85 L 48 15 Z"
        fill={`url(#tube-grad-${color})`}
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {available && (
        <>
          <path
            d="M 14 60 L 14 83 Q 14 88 19 90 L 41 90 Q 46 88 46 83 L 46 60 Z"
            fill={color}
            opacity="0.7"
          />
          <ellipse cx="30" cy="60" rx="16" ry="4" fill={color} opacity="0.4" />
        </>
      )}
    </svg>
  );
}
