import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Play, Square, Loader } from 'lucide-react';

interface LabEquipmentProps {
  inventory: string[];
  onEquipmentUse: (equipment: string, action: string, settings?: any) => void;
  disabled?: boolean;
}

export const LabEquipment: React.FC<LabEquipmentProps> = ({
  inventory,
  onEquipmentUse,
  disabled = false
}) => {
  const [centrifugeState, setCentrifugeState] = useState<'idle' | 'loaded' | 'spinning'>('idle');
  const [centrifugeSpeed, setCentrifugeSpeed] = useState(13000);
  const [centrifugeTime, setCentrifugeTime] = useState(2);

  const [thermocyclerState, setThermocyclerState] = useState<'idle' | 'loaded' | 'heating'>('idle');
  const [thermocyclerTemp, setThermocyclerTemp] = useState(55);
  const [thermocyclerTime, setThermocyclerTime] = useState(60);

  const [vortexState, setVortexState] = useState<'idle' | 'loaded' | 'mixing'>('idle');
  const [vortexTime, setVortexTime] = useState(10);

  const [iceBucketState, setIceBucketState] = useState<'idle' | 'on_ice'>('idle');

  const hasCentrifuge = inventory.includes('centrifuge');
  const hasThermocycler = inventory.includes('incubator');
  const hasVortex = inventory.includes('vortex');
  const hasIceBucket = inventory.includes('ice_bucket');

  const handleCentrifugeAction = (action: string) => {
    if (action === 'load') {
      setCentrifugeState('loaded');
      onEquipmentUse('centrifuge', 'load');
    } else if (action === 'spin') {
      setCentrifugeState('spinning');
      onEquipmentUse('centrifuge', 'spin', { speed: centrifugeSpeed, time: centrifugeTime });
      setTimeout(() => {
        setCentrifugeState('idle');
      }, centrifugeTime * 1000);
    } else if (action === 'remove') {
      setCentrifugeState('idle');
      onEquipmentUse('centrifuge', 'remove');
    }
  };

  const handleThermocyclerAction = (action: string) => {
    if (action === 'load') {
      setThermocyclerState('loaded');
      onEquipmentUse('thermocycler', 'load');
    } else if (action === 'start') {
      setThermocyclerState('heating');
      onEquipmentUse('thermocycler', 'start', { temp: thermocyclerTemp, time: thermocyclerTime });
      setTimeout(() => {
        setThermocyclerState('idle');
      }, thermocyclerTime * 1000);
    } else if (action === 'remove') {
      setThermocyclerState('idle');
      onEquipmentUse('thermocycler', 'remove');
    }
  };

  const handleVortexAction = (action: string) => {
    if (action === 'load') {
      setVortexState('loaded');
      onEquipmentUse('vortex', 'load');
    } else if (action === 'start') {
      setVortexState('mixing');
      onEquipmentUse('vortex', 'start', { time: vortexTime });
      setTimeout(() => {
        setVortexState('idle');
      }, vortexTime * 1000);
    } else if (action === 'remove') {
      setVortexState('idle');
      onEquipmentUse('vortex', 'remove');
    }
  };

  const handleIceBucketAction = (action: string) => {
    if (action === 'place') {
      setIceBucketState('on_ice');
      onEquipmentUse('ice_bucket', 'place');
    } else if (action === 'remove') {
      setIceBucketState('idle');
      onEquipmentUse('ice_bucket', 'remove');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-emerald-500 rounded-full"/>
        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Lab Equipment</h3>
        <div className="flex-1 h-px bg-slate-700"/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasCentrifuge && (
          <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase text-center flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"/>
              Centrifuge
            </h4>

            <div className="relative w-full h-48 flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160" className={centrifugeState === 'spinning' ? "animate-spin" : ""}>
                <circle cx="80" cy="80" r="60" fill="#334155" stroke="#475569" strokeWidth="3"/>
                <circle cx="80" cy="80" r="45" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>
                {centrifugeState !== 'idle' && (
                  <rect x="75" y="50" width="10" height="30" rx="2" fill="#94a3b8" opacity="0.8"/>
                )}
                <circle cx="80" cy="80" r="12" fill="#475569"/>
                <circle cx="80" cy="50" r="6" fill={centrifugeState !== 'idle' ? "#22c55e" : "#64748b"}/>
              </svg>
              {centrifugeState === 'spinning' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-500/20 rounded-full p-4 animate-ping"/>
                </div>
              )}
            </div>

            <div className="bg-slate-950/50 rounded-lg p-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Speed:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCentrifugeSpeed(Math.max(1000, centrifugeSpeed - 1000))}
                    disabled={centrifugeState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronDown size={14} className="mx-auto" />
                  </button>
                  <span className="text-xs text-white font-mono w-20 text-center">{centrifugeSpeed} RPM</span>
                  <button
                    onClick={() => setCentrifugeSpeed(Math.min(20000, centrifugeSpeed + 1000))}
                    disabled={centrifugeState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronUp size={14} className="mx-auto" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Time:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCentrifugeTime(Math.max(1, centrifugeTime - 1))}
                    disabled={centrifugeState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronDown size={14} className="mx-auto" />
                  </button>
                  <span className="text-xs text-white font-mono w-20 text-center">{centrifugeTime} min</span>
                  <button
                    onClick={() => setCentrifugeTime(Math.min(30, centrifugeTime + 1))}
                    disabled={centrifugeState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronUp size={14} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {centrifugeState === 'idle' && (
                <button
                  onClick={() => handleCentrifugeAction('load')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer"
                >
                  Load Tube
                </button>
              )}
              {centrifugeState === 'loaded' && (
                <>
                  <button
                    onClick={() => handleCentrifugeAction('spin')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-pulse flex items-center justify-center gap-2"
                  >
                    <Play size={14} />
                    Start Spin
                  </button>
                  <button
                    onClick={() => handleCentrifugeAction('remove')}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer"
                  >
                    Remove Tube
                  </button>
                </>
              )}
              {centrifugeState === 'spinning' && (
                <button
                  disabled
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader size={14} className="animate-spin" />
                  Spinning...
                </button>
              )}
            </div>
          </div>
        )}

        {hasThermocycler && (
          <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase text-center flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"/>
              Thermocycler
            </h4>

            <div className="relative w-full h-48 flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <rect x="20" y="20" width="120" height="120" rx="8" fill="#334155" stroke="#475569" strokeWidth="3"/>
                <rect x="30" y="30" width="100" height="70" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>
                {thermocyclerState !== 'idle' && (
                  <rect x="75" y="50" width="10" height="40" rx="2" fill="#94a3b8" opacity="0.8"/>
                )}
                {thermocyclerState === 'heating' && (
                  <>
                    <circle cx="50" cy="65" r="3" fill="#ef4444" opacity="0.7" className="animate-ping"/>
                    <circle cx="110" cy="65" r="3" fill="#ef4444" opacity="0.7" className="animate-ping" style={{animationDelay: '0.3s'}}/>
                  </>
                )}
                <rect x="35" y="105" width="90" height="25" rx="4" fill="#475569"/>
                <text x="80" y="122" textAnchor="middle" fontSize="14" fill={thermocyclerState === 'heating' ? "#22c55e" : "#64748b"} fontWeight="bold" fontFamily="monospace">
                  {thermocyclerState === 'heating' ? `${thermocyclerTemp}°C` : '--°C'}
                </text>
              </svg>
              {thermocyclerState === 'heating' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-red-500/10 rounded-full p-8 animate-pulse"/>
                </div>
              )}
            </div>

            <div className="bg-slate-950/50 rounded-lg p-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Temp:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setThermocyclerTemp(Math.max(25, thermocyclerTemp - 5))}
                    disabled={thermocyclerState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronDown size={14} className="mx-auto" />
                  </button>
                  <span className="text-xs text-white font-mono w-16 text-center">{thermocyclerTemp}°C</span>
                  <button
                    onClick={() => setThermocyclerTemp(Math.min(100, thermocyclerTemp + 5))}
                    disabled={thermocyclerState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronUp size={14} className="mx-auto" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Time:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setThermocyclerTime(Math.max(5, thermocyclerTime - 5))}
                    disabled={thermocyclerState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronDown size={14} className="mx-auto" />
                  </button>
                  <span className="text-xs text-white font-mono w-16 text-center">{thermocyclerTime} min</span>
                  <button
                    onClick={() => setThermocyclerTime(Math.min(180, thermocyclerTime + 5))}
                    disabled={thermocyclerState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronUp size={14} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {thermocyclerState === 'idle' && (
                <button
                  onClick={() => handleThermocyclerAction('load')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer"
                >
                  Load Tube
                </button>
              )}
              {thermocyclerState === 'loaded' && (
                <>
                  <button
                    onClick={() => handleThermocyclerAction('start')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-pulse flex items-center justify-center gap-2"
                  >
                    <Play size={14} />
                    Start Incubation
                  </button>
                  <button
                    onClick={() => handleThermocyclerAction('remove')}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer"
                  >
                    Remove Tube
                  </button>
                </>
              )}
              {thermocyclerState === 'heating' && (
                <button
                  disabled
                  className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader size={14} className="animate-spin" />
                  Heating...
                </button>
              )}
            </div>
          </div>
        )}

        {hasVortex && (
          <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase text-center flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"/>
              Vortex Mixer
            </h4>

            <div className="relative w-full h-48 flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160" className={vortexState === 'mixing' ? "animate-[spin_0.3s_linear_infinite]" : ""}>
                <ellipse cx="80" cy="130" rx="50" ry="12" fill="#334155" opacity="0.6"/>
                <rect x="40" y="70" width="80" height="60" rx="8" fill="#334155" stroke="#475569" strokeWidth="3"/>
                <circle cx="80" cy="90" r="22" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>
                {vortexState !== 'idle' && (
                  <rect x="75" y="50" width="10" height="20" rx="2" fill="#94a3b8" opacity="0.8"/>
                )}
                {vortexState === 'mixing' && (
                  <>
                    <circle cx="60" cy="90" r="3" fill="#a855f7" opacity="0.7" className="animate-ping"/>
                    <circle cx="100" cy="90" r="3" fill="#a855f7" opacity="0.7" className="animate-ping" style={{animationDelay: '0.15s'}}/>
                  </>
                )}
                <circle cx="80" cy="90" r="10" fill="#475569" className={vortexState === 'mixing' ? "animate-spin" : ""}/>
              </svg>
            </div>

            <div className="bg-slate-950/50 rounded-lg p-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Duration:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setVortexTime(Math.max(5, vortexTime - 5))}
                    disabled={vortexState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronDown size={14} className="mx-auto" />
                  </button>
                  <span className="text-xs text-white font-mono w-16 text-center">{vortexTime} sec</span>
                  <button
                    onClick={() => setVortexTime(Math.min(60, vortexTime + 5))}
                    disabled={vortexState !== 'idle'}
                    className="w-6 h-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs border-0 cursor-pointer"
                  >
                    <ChevronUp size={14} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {vortexState === 'idle' && (
                <button
                  onClick={() => handleVortexAction('load')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer"
                >
                  Place Tube
                </button>
              )}
              {vortexState === 'loaded' && (
                <>
                  <button
                    onClick={() => handleVortexAction('start')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-pulse flex items-center justify-center gap-2"
                  >
                    <Play size={14} />
                    Start Vortex
                  </button>
                  <button
                    onClick={() => handleVortexAction('remove')}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer"
                  >
                    Remove Tube
                  </button>
                </>
              )}
              {vortexState === 'mixing' && (
                <button
                  disabled
                  className="w-full py-2 bg-purple-600 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader size={14} className="animate-spin" />
                  Vortexing...
                </button>
              )}
            </div>
          </div>
        )}

        {hasIceBucket && (
          <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase text-center flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"/>
              Ice Bucket
            </h4>

            <div className="relative w-full h-48 flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <path d="M35 50 L35 120 Q35 130 45 135 L115 135 Q125 130 125 120 L125 50 Q125 42 117 42 L43 42 Q35 42 35 50 Z" fill="#334155" stroke="#475569" strokeWidth="3"/>
                <ellipse cx="80" cy="48" rx="35" ry="8" fill="#cbd5e1" opacity="0.3"/>
                <rect x="45" y="60" width="70" height="55" fill="#60a5fa" opacity="0.2"/>
                <path d="M55 75 L65 65 M65 75 L75 65 M75 75 L85 65 M85 75 L95 65 M95 75 L105 65" stroke="#60a5fa" strokeWidth="2" opacity="0.4"/>
                <path d="M50 95 L60 85 M60 95 L70 85 M70 95 L80 85 M80 95 L90 85 M90 95 L100 85 M100 95 L110 85" stroke="#60a5fa" strokeWidth="2" opacity="0.4"/>
                {iceBucketState === 'on_ice' && (
                  <rect x="75" y="70" width="10" height="30" rx="2" fill="#94a3b8" opacity="0.9"/>
                )}
                <text x="80" y="80" textAnchor="middle" fontSize="20" fill="#60a5fa" fontWeight="bold">❄</text>
              </svg>
            </div>

            <div className="space-y-2">
              {iceBucketState === 'idle' ? (
                <button
                  onClick={() => handleIceBucketAction('place')}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer"
                >
                  Place on Ice
                </button>
              ) : (
                <>
                  <div className="bg-cyan-900/30 border border-cyan-500/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-cyan-400 font-bold">Sample on Ice</p>
                    <p className="text-[10px] text-cyan-600 mt-1">Keeping cold at 0-4°C</p>
                  </div>
                  <button
                    onClick={() => handleIceBucketAction('remove')}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer"
                  >
                    Remove from Ice
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {!hasCentrifuge && !hasThermocycler && !hasVortex && !hasIceBucket && (
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-slate-500 text-sm">No equipment available</p>
          <p className="text-slate-600 text-xs mt-1">Equipment will appear here after procurement</p>
        </div>
      )}
    </div>
  );
};
