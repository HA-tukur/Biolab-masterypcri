import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

interface PipetteProps {
  requiredVolume: number;
  onVolumeSet: (volume: number, pipetteSize: number) => void;
  onDispense: () => void;
  disabled: boolean;
  hasLiquid: boolean;
  liquidColor: string;
}

type PipetteSize = 2.5 | 20 | 1000;

interface PipetteConfig {
  size: PipetteSize;
  min: number;
  max: number;
  step: number;
  defaultVolume: number;
  height: number;
  width: number;
}

const PIPETTE_CONFIGS: Record<PipetteSize, PipetteConfig> = {
  2.5: { size: 2.5, min: 0.5, max: 2.5, step: 0.5, defaultVolume: 2.0, height: 280, width: 50 },
  20: { size: 20, min: 2, max: 20, step: 1, defaultVolume: 10, height: 300, width: 55 },
  1000: { size: 1000, min: 100, max: 1000, step: 100, defaultVolume: 500, height: 320, width: 60 }
};

export function RealisticPipette({ requiredVolume, onVolumeSet, onDispense, disabled, hasLiquid, liquidColor }: PipetteProps) {
  const [selectedPipette, setSelectedPipette] = useState<PipetteSize | null>(null);
  const [volume, setVolume] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');
  const [isDispensing, setIsDispensing] = useState(false);

  const getCorrectPipette = (vol: number): PipetteSize => {
    if (vol <= 2.5) return 2.5;
    if (vol <= 20) return 20;
    return 1000;
  };

  const correctPipette = getCorrectPipette(requiredVolume);

  useEffect(() => {
    if (selectedPipette) {
      const config = PIPETTE_CONFIGS[selectedPipette];
      if (requiredVolume < config.min || requiredVolume > config.max) {
        setValidationError(
          `This pipette can only handle ${config.min}-${config.max}µL. Please select the ${correctPipette}µL pipette for ${requiredVolume}µL.`
        );
      } else {
        setValidationError('');
      }
    }
  }, [selectedPipette, requiredVolume, correctPipette]);

  const handlePipetteSelect = (size: PipetteSize) => {
    if (disabled) return;
    setSelectedPipette(size);
    const config = PIPETTE_CONFIGS[size];
    setVolume(config.defaultVolume);
  };

  const adjustVolume = (delta: number) => {
    if (!selectedPipette) return;
    const config = PIPETTE_CONFIGS[selectedPipette];
    const newVolume = Math.max(config.min, Math.min(config.max, volume + delta * config.step));
    setVolume(newVolume);
    if (!validationError) {
      onVolumeSet(newVolume, config.size);
    }
  };

  const handleDispense = () => {
    if (validationError || !hasLiquid) return;
    setIsDispensing(true);
    setTimeout(() => {
      setIsDispensing(false);
      onDispense();
    }, 600);
  };

  const formatVolume = (vol: number, size: PipetteSize): string => {
    if (size === 2.5) return vol.toFixed(1);
    return Math.round(vol).toString();
  };

  return (
    <div className="space-y-6">
      {validationError && (
        <div className="bg-rose-900/20 border border-rose-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-300">{validationError}</p>
        </div>
      )}

      <div className="flex justify-center gap-8 mb-8">
        {(Object.keys(PIPETTE_CONFIGS) as Array<keyof typeof PIPETTE_CONFIGS>).map((size) => {
          const config = PIPETTE_CONFIGS[size];
          const isSelected = selectedPipette === size;
          const isCorrect = correctPipette === size;
          const shouldHighlight = !selectedPipette && isCorrect;

          return (
            <div
              key={size}
              className={`relative cursor-pointer transition-all ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${shouldHighlight ? 'animate-pulse' : ''}`}
              onClick={() => handlePipetteSelect(size)}
            >
              <div
                className={`relative transition-all p-3 rounded-xl ${
                  isSelected
                    ? 'scale-110 drop-shadow-2xl ring-4 ring-indigo-500 ring-offset-4 ring-offset-slate-900 bg-indigo-900/20'
                    : shouldHighlight
                    ? 'ring-2 ring-emerald-400 ring-offset-4 ring-offset-slate-900 rounded-lg'
                    : 'opacity-40 hover:opacity-80 hover:scale-105'
                }`}
              >
                <PipetteSVG
                  config={config}
                  isSelected={isSelected}
                  volume={isSelected ? volume : config.defaultVolume}
                  hasLiquid={isSelected && hasLiquid}
                  liquidColor={liquidColor}
                  isDispensing={isDispensing}
                />
              </div>
              <p className="text-xs text-center mt-3 text-slate-400 font-bold">
                {size === 2.5 ? '2.5' : size}µL
              </p>
            </div>
          );
        })}
      </div>

      {selectedPipette && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => adjustVolume(-1)}
              disabled={disabled || volume <= PIPETTE_CONFIGS[selectedPipette].min}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors border-0 cursor-pointer"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>

            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">
                {formatVolume(volume, selectedPipette)}
                <span className="text-lg text-slate-400 ml-1">µL</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Range: {PIPETTE_CONFIGS[selectedPipette].min}-{PIPETTE_CONFIGS[selectedPipette].max}µL
              </p>
            </div>

            <button
              onClick={() => adjustVolume(1)}
              disabled={disabled || volume >= PIPETTE_CONFIGS[selectedPipette].max}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors border-0 cursor-pointer"
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </button>
          </div>

          {hasLiquid && !validationError && (
            <div className="text-center">
              <button
                onClick={handleDispense}
                disabled={disabled}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all border-0 cursor-pointer animate-pulse"
              >
                Press Plunger to Dispense
              </button>
              <p className="text-xs text-slate-400 mt-2">Click orange plunger to dispense into sample tube</p>
            </div>
          )}

          {!hasLiquid && !validationError && (
            <p className="text-xs text-center text-emerald-400 font-bold animate-pulse">
              Click a reagent bottle above to aspirate {formatVolume(volume, selectedPipette)}µL
            </p>
          )}
        </div>
      )}

      {!selectedPipette && (
        <p className="text-sm text-center text-slate-400">
          Select a pipette to begin
        </p>
      )}
    </div>
  );
}

interface PipetteSVGProps {
  config: PipetteConfig;
  isSelected: boolean;
  volume: number;
  hasLiquid: boolean;
  liquidColor: string;
  isDispensing: boolean;
}

function PipetteSVG({ config, isSelected, volume, hasLiquid, liquidColor, isDispensing }: PipetteSVGProps) {
  const { height, width } = config;
  const bodyWidth = width * 0.3;
  const tipWidth = width * 0.4;
  const plungerWidth = width * 0.5;

  const liquidFillPercent = (volume / config.max) * 60;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="drop-shadow-lg"
    >
      <defs>
        <linearGradient id={`plunger-${config.size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id={`body-${config.size}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      <rect
        x={(width - plungerWidth) / 2}
        y={isDispensing ? 25 : 15}
        width={plungerWidth}
        height={20}
        rx={4}
        fill={`url(#plunger-${config.size})`}
        className={`transition-all duration-300 ${isSelected && hasLiquid ? 'cursor-pointer' : ''}`}
      />

      <rect
        x={(width - bodyWidth) / 2}
        y={40}
        width={bodyWidth}
        height={height - 140}
        rx={2}
        fill={`url(#body-${config.size})`}
        stroke="#cbd5e1"
        strokeWidth={1}
      />

      <rect
        x={(width - bodyWidth * 1.3) / 2}
        y={height * 0.35}
        width={bodyWidth * 1.3}
        height={height * 0.15}
        rx={2}
        fill="#fef08a"
        stroke="#eab308"
        strokeWidth={1.5}
      />

      <text
        x={width / 2}
        y={height * 0.35 + height * 0.08}
        textAnchor="middle"
        fontSize={config.size === 2.5 ? 8 : config.size === 20 ? 9 : 10}
        fill="#713f12"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {isSelected ? (config.size === 2.5 ? volume.toFixed(1) : Math.round(volume)) : config.defaultVolume}
      </text>

      <path
        d={`M ${(width - tipWidth) / 2} ${height - 100}
            L ${(width - tipWidth * 0.6) / 2} ${height - 20}
            L ${(width + tipWidth * 0.6) / 2} ${height - 20}
            L ${(width + tipWidth) / 2} ${height - 100} Z`}
        fill={hasLiquid && !isDispensing ? liquidColor : '#e2e8f0'}
        stroke="#94a3b8"
        strokeWidth={1}
        opacity={hasLiquid && !isDispensing ? 0.9 : 0.3}
        className="transition-all duration-300"
      />

      {hasLiquid && !isDispensing && (
        <rect
          x={(width - tipWidth * 0.5) / 2}
          y={height - 20 - liquidFillPercent}
          width={tipWidth * 0.5}
          height={liquidFillPercent}
          fill={liquidColor}
          opacity={0.8}
          className="transition-all duration-500"
        />
      )}

      {isSelected && (
        <circle
          cx={width / 2}
          cy={height - 40}
          r={width * 0.15}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          opacity={0.5}
          className="animate-pulse"
        />
      )}
    </svg>
  );
}
