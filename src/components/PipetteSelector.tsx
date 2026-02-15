import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Droplet } from 'lucide-react';

interface PipetteSelectorProps {
  requiredVolume: number;
  onVolumeSet: (volume: number, pipetteSize: string) => void;
  disabled: boolean;
  hasLiquid: boolean;
  liquidColor: string;
  onDispense: () => void;
}

const PIPETTES = [
  { id: 'p2.5', name: '2.5µL', range: [0.5, 2.5], step: 0.5, color: 'bg-purple-600' },
  { id: 'p20', name: '20µL', range: [2, 20], step: 5, color: 'bg-yellow-600' },
  { id: 'p1000', name: '1000µL', range: [100, 1000], step: 100, color: 'bg-blue-600' }
];

export const PipetteSelector: React.FC<PipetteSelectorProps> = ({
  requiredVolume,
  onVolumeSet,
  disabled,
  hasLiquid,
  liquidColor,
  onDispense
}) => {
  const [selectedPipette, setSelectedPipette] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(requiredVolume);

  const getRecommendedPipette = (vol: number) => {
    if (vol <= 2.5) return 'p2.5';
    if (vol <= 20) return 'p20';
    return 'p1000';
  };

  const handlePipetteSelect = (pipetteId: string) => {
    if (disabled) return;

    const pipette = PIPETTES.find(p => p.id === pipetteId);
    if (!pipette) return;

    setSelectedPipette(pipetteId);
    const clampedVolume = Math.max(pipette.range[0], Math.min(pipette.range[1], requiredVolume));
    setVolume(clampedVolume);
    onVolumeSet(clampedVolume, pipette.name);
  };

  const adjustVolume = (delta: number) => {
    if (!selectedPipette || disabled) return;

    const pipette = PIPETTES.find(p => p.id === selectedPipette);
    if (!pipette) return;

    const newVolume = Math.max(
      pipette.range[0],
      Math.min(pipette.range[1], volume + delta)
    );
    setVolume(newVolume);
    onVolumeSet(newVolume, pipette.name);
  };

  const PipetteVisual = ({ pipette, isSelected, isRecommended }: any) => (
    <div
      onClick={() => handlePipetteSelect(pipette.id)}
      className={`
        relative transition-all duration-300 cursor-pointer
        ${isSelected
          ? 'scale-100 opacity-100'
          : 'scale-75 opacity-60 hover:opacity-80 hover:scale-80'}
        ${disabled ? 'cursor-not-allowed' : ''}
      `}
    >
      <svg width={isSelected ? "80" : "60"} height={isSelected ? "120" : "90"} viewBox="0 0 80 120" className="drop-shadow-xl">
        <defs>
          <linearGradient id={`pipette-grad-${pipette.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isSelected ? "#64748b" : "#475569"} />
            <stop offset="100%" stopColor={isSelected ? "#475569" : "#334155"} />
          </linearGradient>
          <linearGradient id={`liquid-grad-${pipette.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={liquidColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <rect x="32" y="10" width="16" height="20" rx="3" fill={`url(#pipette-grad-${pipette.id})`} stroke="#94a3b8" strokeWidth="1.5"/>
        <rect x="25" y="30" width="30" height="8" rx="2" fill={`url(#pipette-grad-${pipette.id})`} stroke="#94a3b8" strokeWidth="1.5"/>
        <rect x="36" y="38" width="8" height="60" rx="1" fill="#1e293b" stroke="#64748b" strokeWidth="1"/>

        {hasLiquid && isSelected && (
          <rect x="37" y="68" width="6" height="25" rx="1" fill={`url(#liquid-grad-${pipette.id})`} className="animate-pulse"/>
        )}

        <path d="M36 98 L38 108 L42 108 L44 98 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>

        {isSelected && (
          <circle cx="40" cy="60" r="20" fill="none" stroke="#22c55e" strokeWidth="2" className="animate-pulse"/>
        )}

        {isRecommended && !isSelected && (
          <text x="40" y="115" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">★</text>
        )}
      </svg>

      <div className="text-center mt-2">
        <p className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
          {pipette.name}
        </p>
        <p className="text-[9px] text-slate-500">
          {pipette.range[0]}-{pipette.range[1]}µL
        </p>
      </div>

      {isSelected && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full font-bold">
          SELECTED
        </div>
      )}
    </div>
  );

  const selectedPipetteObj = PIPETTES.find(p => p.id === selectedPipette);
  const recommendedPipette = getRecommendedPipette(requiredVolume);

  return (
    <div className="space-y-4">
      <div className="flex justify-around items-end">
        {PIPETTES.map(pipette => (
          <PipetteVisual
            key={pipette.id}
            pipette={pipette}
            isSelected={selectedPipette === pipette.id}
            isRecommended={recommendedPipette === pipette.id}
          />
        ))}
      </div>

      {!selectedPipette && (
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-center">
          <p className="text-sm text-slate-300 font-semibold mb-1">Select a pipette to begin</p>
          <p className="text-xs text-slate-500">
            Recommended for {requiredVolume}µL: <span className="text-emerald-400 font-bold">{PIPETTES.find(p => p.id === recommendedPipette)?.name}</span>
          </p>
        </div>
      )}

      {selectedPipette && selectedPipetteObj && (
        <div className="space-y-3">
          <div className="bg-slate-900/50 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 uppercase font-bold">Volume Control</span>
              <span className="text-xs text-slate-500">Target: {requiredVolume}µL</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => adjustVolume(-selectedPipetteObj.step)}
                disabled={disabled || volume <= selectedPipetteObj.range[0]}
                className="w-12 h-12 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xl transition-all border-0 cursor-pointer"
              >
                <ChevronDown size={24} className="mx-auto" />
              </button>

              <div className="bg-slate-950 border border-slate-700 rounded-lg px-6 py-3 min-w-[120px] text-center">
                <p className="text-2xl font-bold text-emerald-400 font-mono">{volume.toFixed(1)}</p>
                <p className="text-xs text-slate-500">microliters</p>
              </div>

              <button
                onClick={() => adjustVolume(selectedPipetteObj.step)}
                disabled={disabled || volume >= selectedPipetteObj.range[1]}
                className="w-12 h-12 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xl transition-all border-0 cursor-pointer"
              >
                <ChevronUp size={24} className="mx-auto" />
              </button>
            </div>

            {Math.abs(volume - requiredVolume) > 10 && (
              <p className="text-xs text-amber-400 text-center mt-2">
                ⚠ Volume differs from target by {Math.abs(volume - requiredVolume).toFixed(1)}µL
              </p>
            )}
          </div>

          {hasLiquid && (
            <button
              onClick={onDispense}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-lg font-bold uppercase transition-all animate-pulse border-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <Droplet size={20} />
              Dispense into Sample
            </button>
          )}
        </div>
      )}
    </div>
  );
};
