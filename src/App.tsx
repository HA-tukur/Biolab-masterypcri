import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  FlaskConical,
  AlertCircle,
  BookOpen,
  Target,
  Pipette,
  Box,
  Activity,
  ChevronRight,
  RefreshCw,
  Star,
  Thermometer,
  Award,
  ScrollText,
  Lightbulb,
  ShieldCheck,
  ShieldAlert,
  Leaf,
  ShoppingCart,
  Undo2,
  Medal,
  Database,
  Dna,
  Terminal,
  GraduationCap,
  Sparkles,
  Shirt,
  Glasses,
  Computer,
  Trophy,
  X
} from "lucide-react";
import { SupabaseHistoryStore, HistoryStore } from "./services/historyStore";
import { PCRModule } from "./components/PCRModule";
import { TechniqueLibrary } from "./components/TechniqueLibrary";
import { TechniqueCategories } from "./components/TechniqueCategories";
import { CategoryTechniques } from "./components/CategoryTechniques";
import { PCRMissions } from "./components/PCRMissions";
import { ProtocolOverview } from "./components/ProtocolOverview";
import { AntibodyIcon } from "./components/AntibodyIcon";
import ClassCodePrompt from "./components/ClassCodePrompt";
import { AILabAssistant } from "./components/AILabAssistant";
import { Footer } from "./components/Footer";
import { FeedbackButton } from "./components/FeedbackButton";
import { ContactSection } from "./components/ContactSection";
import { config } from "./config";
import { getOrCreateStudentId } from "./utils/studentId";
import { upsertCertificate } from "./utils/certificateManager";
import { VERIFICATION, MISSIONS_DATA } from "./data/missions";
import { kits_list, tools_list, consumables_ppe_list, design_tools_list } from "./data/equipment";
import { TECHNIQUE_LIBRARY } from "./data/techniqueLibrary";

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

const historyStore: HistoryStore = new SupabaseHistoryStore(
  config.supabase.url,
  config.supabase.anonKey
);

const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, { 'event_category': category, 'event_label': label, 'value': value });
  }
};


const TubeVisual = ({ volume, solidMass, hasPellet, showSeparation, onSupernatantClick, onPelletClick }) => {
  const fillPercent = Math.min((volume / 2000) * 100, 85);
  const solidPercent = Math.min((solidMass / 150) * 40, 40);

  const supernatantHeight = showSeparation ? fillPercent * 0.7 : 0;
  const pelletHeight = showSeparation ? fillPercent * 0.3 : 0;

  return (
    <div className="relative flex flex-col items-center p-2">
      <svg width="60" height="120" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10C20 10 20 150 50 170C80 150 80 10 80 10" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>
        <line x1="15" y1="10" x2="85" y2="10" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>

        {showSeparation && volume > 0 ? (
          <>
            <path
              d={`M25 ${150 - fillPercent}C25 ${150 - fillPercent} 25 ${150 - pelletHeight} 50 ${165 - pelletHeight}C75 ${150 - pelletHeight} 75 ${150 - fillPercent} 75 ${150 - fillPercent}`}
              fill="#fef08a"
              fillOpacity="0.7"
              className={onSupernatantClick ? "cursor-pointer hover:fill-yellow-300 transition-all" : ""}
              onClick={onSupernatantClick}
            />
            <text x="50" y={`${140 - fillPercent + 15}`} textAnchor="middle" fontSize="7" fill="#854d0e" fontWeight="bold">Supernatant</text>

            <path
              d={`M25 ${150 - pelletHeight}C25 ${150 - pelletHeight} 25 150 50 165C75 150 75 ${150 - pelletHeight} 75 ${150 - pelletHeight}`}
              fill="#78350f"
              fillOpacity="0.8"
              className={onPelletClick ? "cursor-pointer hover:fill-amber-800 transition-all" : ""}
              onClick={onPelletClick}
            />
            <text x="50" y={`${158}`} textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="bold">Pellet</text>
          </>
        ) : (
          <>
            {volume > 0 && <path d={`M25 ${150 - fillPercent}C25 ${150 - fillPercent} 25 150 50 165C75 150 75 ${150 - fillPercent} 75 ${150 - fillPercent}`} fill="#38bdf8" fillOpacity="0.4" />}
            {solidMass > 0 && <path d={`M35 ${165 - solidPercent}C35 ${165 - solidPercent} 40 165 50 170C60 165 65 ${165 - solidPercent} 65 ${165 - solidPercent}L35 ${165 - solidPercent}Z`} fill="#78350f" className="opacity-80" />}
          </>
        )}

        {hasPellet && <g><circle cx="50" cy="166" r="3.5" fill="white" className="animate-pulse" /><circle cx="50" cy="166" r="6" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" className="animate-spin" style={{ animationDuration: '3s' }} /></g>}
      </svg>
    </div>
  );
};

const FilterColumnVisual = ({ volume, hasDNA, showSeparation }) => {
  const collectionFillPercent = Math.min((volume / 2000) * 100, 70);

  return (
    <div className="relative flex flex-col items-center p-2">
      <svg width="90" height="160" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Collection Tube (narrower with U-shaped rounded bottom) */}
        <path
          d="M 35 95 L 35 175 Q 35 185 60 190 Q 85 185 85 175 L 85 95"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2.5"
        />
        <ellipse cx="60" cy="95" rx="25" ry="7" fill="#0f172a" stroke="#475569" strokeWidth="2.5"/>

        {/* Liquid in collection tube (flow-through) */}
        {volume > 0 && (
          <>
            <path
              d={`M 37 ${180 - collectionFillPercent} L 37 175 Q 37 183 60 187 Q 83 183 83 175 L 83 ${180 - collectionFillPercent}`}
              fill="#38bdf8"
              opacity="0.4"
            />
            <ellipse
              cx="60"
              cy={180 - collectionFillPercent}
              rx="23"
              ry="6"
              fill="#38bdf8"
              opacity="0.3"
            />
          </>
        )}

        {/* Filter Column (tall, narrow cylinder) - upper half outside, lower half inside */}
        <rect x="46" y="15" width="28" height="115" rx="1" fill="#334155" stroke="#64748b" strokeWidth="2"/>
        <ellipse cx="60" cy="15" rx="14" ry="4" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>

        {/* Bottom of filter column with mild protrusion */}
        <path
          d="M 46 130 L 46 135 Q 46 140 60 142 Q 74 140 74 135 L 74 130"
          fill="#334155"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Porous Silica Membrane at bottom of column */}
        <g>
          <rect x="48" y="125" width="24" height="7" fill="#e2e8f0" opacity="0.85"/>
          <line x1="48" y1="127" x2="72" y2="127" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="2 1"/>
          <line x1="48" y1="129" x2="72" y2="129" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="1.5 1.5"/>
          <line x1="48" y1="131" x2="72" y2="131" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="2 1"/>
          <text x="60" y="130" textAnchor="middle" fontSize="5" fill="#64748b" fontWeight="bold">FILTER</text>
        </g>

        {/* DNA bound to membrane indicator */}
        {hasDNA && (
          <g>
            <rect x="49" y="126" width="22" height="5" fill="#10b981" opacity="0.65" className="animate-pulse"/>
            <text x="60" y="130" textAnchor="middle" fontSize="5.5" fill="#10b981" fontWeight="bold">DNA</text>
          </g>
        )}

        {/* Separation line showing column inserted into tube */}
        <line x1="35" y1="95" x2="46" y2="95" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>
        <line x1="74" y1="95" x2="85" y2="95" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>
      </svg>
      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Filter Column</p>
    </div>
  );
};

const TubeWithFilterColumnVisual = ({ volume, hasDNA, stepTitle }) => {
  const tubeVolume = Math.min((volume / 2000) * 100, 70);

  return (
    <div className="relative flex flex-col items-center p-2">
      <svg width="80" height="140" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sample Tube (microtube style) */}
        <path
          d="M30 20C30 20 30 160 60 180C90 160 90 20 90 20"
          stroke="#475569"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <line x1="25" y1="20" x2="95" y2="20" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>

        {/* Liquid in tube */}
        {volume > 0 && (
          <path
            d={`M35 ${170 - tubeVolume}C35 ${170 - tubeVolume} 35 160 60 175C85 160 85 ${170 - tubeVolume} 85 ${170 - tubeVolume}`}
            fill="#38bdf8"
            fillOpacity="0.3"
          />
        )}

        {/* Filter Column inserted into tube (narrower, reaching 3/4 down) */}
        <rect x="50" y="10" width="20" height="120" rx="1" fill="#334155" stroke="#64748b" strokeWidth="2"/>
        <ellipse cx="60" cy="10" rx="10" ry="3" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>

        {/* Bottom of filter column with mild protrusion */}
        <path
          d="M 50 130 L 50 133 Q 50 137 60 139 Q 70 137 70 133 L 70 130"
          fill="#334155"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Silica filter membrane at bottom of column */}
        <g>
          <rect x="51" y="125" width="18" height="6" fill="#e2e8f0" opacity="0.85"/>
          <line x1="51" y1="126.5" x2="69" y2="126.5" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 1"/>
          <line x1="51" y1="128" x2="69" y2="128" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1.5 1.5"/>
          <line x1="51" y1="129.5" x2="69" y2="129.5" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 1"/>
          <text x="60" y="129" textAnchor="middle" fontSize="4.5" fill="#64748b" fontWeight="bold">FILTER</text>
        </g>

        {/* DNA bound to membrane indicator */}
        {hasDNA && (
          <g>
            <rect x="52" y="126" width="16" height="4" fill="#10b981" opacity="0.65" className="animate-pulse"/>
            <text x="60" y="129" textAnchor="middle" fontSize="5" fill="#10b981" fontWeight="bold">DNA</text>
          </g>
        )}
      </svg>
      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">
        {stepTitle === "Wash Stage" ? "Wash Column" : "Elute DNA"}
      </p>
    </div>
  );
};

const SpinColumnVisual = ({ volume, hasDNA }) => {
  const fillPercent = Math.min((volume / 1500) * 90, 85);
  return (
    <div className="relative flex flex-col items-center p-4">
      <svg width="110" height="160" viewBox="0 0 110 170" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Collection Tube (outer, larger diameter) */}
        <rect x="20" y="40" width="70" height="120" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <ellipse cx="55" cy="40" rx="35" ry="8" fill="#0f172a" stroke="#475569" strokeWidth="2"/>

        {/* Spin Column (inner, smaller, slightly longer) */}
        <rect x="35" y="25" width="40" height="110" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1.5"/>
        <ellipse cx="55" cy="25" rx="20" ry="5" fill="#1e293b" stroke="#64748b" strokeWidth="1.5"/>

        {/* Silica Membrane (inside column) */}
        <rect x="37" y="65" width="36" height="8" fill="#e2e8f0" opacity="0.7"/>
        <line x1="37" y1="69" x2="73" y2="69" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 1"/>

        {/* DNA bound to membrane indicator */}
        {hasDNA && (
          <g>
            <rect x="40" y="66" width="30" height="5" fill="#10b981" opacity="0.5" className="animate-pulse"/>
            <text x="55" y="71" textAnchor="middle" fontSize="6" fill="#10b981" fontWeight="bold">DNA</text>
          </g>
        )}

        {/* Liquid in collection tube */}
        {volume > 0 && (
          <rect x="22" y={`${155 - fillPercent}`} width="66" height={fillPercent} fill="#38bdf8" opacity="0.3"/>
        )}

        {/* Column tip (showing it extends into collection tube) */}
        <line x1="55" y1="133" x2="55" y2="138" stroke="#64748b" strokeWidth="2"/>
      </svg>
      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Spin Column</p>
    </div>
  );
};

const PCRMachineVisual = () => (
  <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
    <rect x="10" y="15" width="40" height="35" rx="2" fill="#475569"/>
    <rect x="15" y="20" width="30" height="20" rx="1" fill="#1e293b"/>
    <circle cx="25" cy="30" r="3" fill="#64748b"/>
    <circle cx="35" cy="30" r="3" fill="#64748b"/>
    <rect x="20" y="42" width="20" height="3" rx="1" fill="#334155"/>
  </svg>
);

const VortexMixerVisual = () => (
  <svg width="45" height="50" viewBox="0 0 55 60" fill="none">
    <ellipse cx="27.5" cy="45" rx="18" ry="5" fill="#334155"/>
    <rect x="22" y="25" width="11" height="20" rx="1" fill="#475569"/>
    <circle cx="27.5" cy="22" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1"/>
    <circle cx="27.5" cy="22" r="4" fill="#334155"/>
  </svg>
);

const IceBoxVisual = () => (
  <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
    <rect x="12" y="20" width="36" height="28" rx="2" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2"/>
    <rect x="15" y="15" width="30" height="5" rx="1" fill="#0ea5e9"/>
    <line x1="20" y1="30" x2="26" y2="36" stroke="#e0f2fe" strokeWidth="2"/>
    <line x1="34" y1="30" x2="40" y2="36" stroke="#e0f2fe" strokeWidth="2"/>
  </svg>
);

const MortarPestleVisual = () => (
  <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
    <ellipse cx="30" cy="45" rx="15" ry="4" fill="#64748b"/>
    <path d="M20 35 Q 30 40 40 35 L 40 45 Q 30 48 20 45 Z" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
    <rect x="32" y="18" width="4" height="18" rx="1" fill="#94a3b8" transform="rotate(25 34 27)"/>
    <circle cx="36" cy="20" r="3" fill="#64748b"/>
  </svg>
);

const LiquidNitrogenVisual = () => (
  <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
    <rect x="20" y="20" width="20" height="28" rx="2" fill="#e0f2fe" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2"/>
    <rect x="22" y="22" width="16" height="20" fill="#38bdf8" fillOpacity="0.4"/>
    <rect x="26" y="15" width="8" height="6" rx="1" fill="#64748b"/>
    <circle cx="30" cy="30" r="2" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
    <text x="30" y="36" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="bold">N₂</text>
  </svg>
);

const FreezerVisual = () => (
  <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
    <rect x="15" y="15" width="30" height="35" rx="2" fill="#334155" stroke="#475569" strokeWidth="2"/>
    <rect x="18" y="18" width="24" height="14" rx="1" fill="#1e293b"/>
    <rect x="18" y="34" width="24" height="14" rx="1" fill="#1e293b"/>
    <circle cx="38" cy="25" r="1.5" fill="#64748b"/>
    <circle cx="38" cy="41" r="1.5" fill="#64748b"/>
    <line x1="25" y1="20" x2="35" y2="20" stroke="#38bdf8" strokeWidth="1.5"/>
    <line x1="25" y1="36" x2="35" y2="36" stroke="#38bdf8" strokeWidth="1.5"/>
  </svg>
);

const ElutionVolumeSelector = ({ onSelect, selectedVolume }) => {
  const volumes = [20, 30, 50];

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
      <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
        <FlaskConical size={16} /> Select Elution Volume
      </h3>
      <p className="text-xs text-slate-400 mb-4">Choose the elution buffer volume. Lower volumes give higher concentration but lower total yield.</p>
      <div className="grid grid-cols-3 gap-3">
        {volumes.map(vol => (
          <button
            key={vol}
            onClick={() => onSelect(vol)}
            className={`py-4 px-3 rounded-xl font-bold text-sm transition-all border-2 cursor-pointer ${
              selectedVolume === vol
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-emerald-500'
            }`}
          >
            {vol} µl
          </button>
        ))}
      </div>
      {selectedVolume && (
        <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
          <p className="text-xs text-emerald-300">Selected: {selectedVolume} µl</p>
        </div>
      )}
    </div>
  );
};

const LabBenchVisual = ({ inventory }) => (
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-700 to-slate-800 border-t-4 border-slate-600 flex items-center justify-around px-8 opacity-70">
    <div className="text-[10px] text-slate-500 font-bold absolute bottom-2 left-4">Lab Space</div>
    <div className="flex items-end gap-4 flex-wrap justify-center">
      {inventory.includes("centrifuge") && (
        <div className="flex flex-col items-center opacity-60">
          <RefreshCw size={24} className="text-emerald-400 stroke-[2.5]"/>
          <div className="text-[8px] text-slate-400 font-bold mt-1">Centrifuge</div>
        </div>
      )}
      {inventory.includes("incubator") && (
        <div className="flex flex-col items-center opacity-60">
          <Thermometer size={24} className="text-red-400 stroke-[2.5]"/>
          <div className="text-[8px] text-slate-400 font-bold mt-1">Incubator</div>
        </div>
      )}
      {inventory.includes("freezer") && (
        <div className="flex flex-col items-center opacity-60">
          <FreezerVisual />
          <div className="text-[8px] text-slate-400 font-bold mt-1">Freezer</div>
        </div>
      )}
      {inventory.includes("mortar_pestle") && (
        <div className="flex flex-col items-center opacity-60">
          <MortarPestleVisual />
          <div className="text-[8px] text-slate-400 font-bold mt-1">Mortar</div>
        </div>
      )}
      {inventory.includes("liquid_nitrogen") && (
        <div className="flex flex-col items-center opacity-60">
          <LiquidNitrogenVisual />
          <div className="text-[8px] text-slate-400 font-bold mt-1">LN₂</div>
        </div>
      )}
      <div className="flex flex-col items-center opacity-60">
        <PCRMachineVisual />
        <div className="text-[8px] text-slate-400 font-bold mt-1">PCR</div>
      </div>
      <div className="flex flex-col items-center opacity-60">
        <VortexMixerVisual />
        <div className="text-[8px] text-slate-400 font-bold mt-1">Vortex</div>
      </div>
      <div className="flex flex-col items-center opacity-60">
        <IceBoxVisual />
        <div className="text-[8px] text-slate-400 font-bold mt-1">Ice</div>
      </div>
      {inventory.includes("nanodrop") && (
        <div className="flex flex-col items-center opacity-60">
          <Activity size={24} className="text-indigo-400 stroke-[2.5]"/>
          <div className="text-[8px] text-slate-400 font-bold mt-1">Nanodrop</div>
        </div>
      )}
    </div>
  </div>
);

const IncubatorVisual = ({ isIncubating, hasTube, temperature, onLoadTube, onStartIncubation, canLoad, canStart }) => {
  return (
    <div className="relative flex flex-col items-center p-4">
      <svg width="160" height="140" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base */}
        <rect x="40" y="110" width="100" height="30" rx="3" fill="#334155"/>

        {/* Body */}
        <rect x="50" y="40" width="80" height="70" rx="4" fill="#475569"/>

        {/* Door */}
        <rect x="55" y="45" width="70" height="60" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="1.5"/>

        {/* Window */}
        <rect x="65" y="55" width="50" height="35" rx="2" fill="#0f172a"/>

        {/* Tube inside (if loaded) */}
        {hasTube && (
          <g>
            <rect x="85" y="70" width="10" height="15" rx="1" fill="#475569" opacity="0.8"/>
            <rect x="86" y="72" width="8" height="11" fill="#38bdf8" opacity="0.4"/>
          </g>
        )}

        {/* Temperature Display */}
        {isIncubating && temperature && (
          <text x="90" y="130" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold" fontFamily="monospace" className="animate-pulse">
            {temperature}°C
          </text>
        )}

        {/* Control Panel */}
        <rect x="70" y="100" width="40" height="8" rx="2" fill="#1e293b"/>
        <circle cx="75" cy="104" r="2" fill={isIncubating ? "#ef4444" : "#475569"} className={isIncubating ? "animate-pulse" : ""}/>
      </svg>

      <div className="mt-2 space-y-2 w-full flex flex-col items-center">
        {!hasTube && canLoad && (
          <button onClick={onLoadTube} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-pulse">
            Load Tube
          </button>
        )}

        {hasTube && !isIncubating && canStart && (
          <button onClick={onStartIncubation} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-bounce">
            Start Incubation
          </button>
        )}
      </div>

      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 font-mono text-center">
        Incubator
      </span>
    </div>
  );
};

const ThermocyclerVisual = ({ isIncubating, hasTube, temperature, duration, onLoadTube, onStartIncubation, onTempChange, canLoad, canStart }) => {
  return (
    <div className="relative flex flex-col items-center p-4">
      <svg width="180" height="160" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base */}
        <rect x="50" y="130" width="100" height="40" rx="4" fill="#334155" />

        {/* Body */}
        <rect x="60" y="40" width="80" height="90" rx="4" fill="#475569" />

        {/* Heated lid */}
        <rect x="60" y="30" width="80" height="10" rx="2" fill="#64748b" />

        {/* Temperature display */}
        <rect x="70" y="45" width="60" height="20" rx="2" fill="#1e293b" />
        <text x="100" y="60" textAnchor="middle" fill={isIncubating ? "#ef4444" : "#64748b"} fontSize="14" fontWeight="bold" fontFamily="monospace" className={isIncubating ? "animate-pulse" : ""}>
          {temperature || 25}°C
        </text>

        {/* 5 Tube Slots */}
        {[0, 1, 2, 3, 4].map((i) => {
          const xPos = 70 + i * 14;
          const isSample = i === 2 && hasTube;
          return (
            <g key={i}>
              <circle cx={xPos} cy="95" r="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              {isSample && (
                <>
                  <rect x={xPos - 3} y="90" width="6" height="10" rx="0.5" fill="#475569" opacity="0.8" />
                  <rect x={xPos - 2.5} y="91" width="5" height="8" fill="#38bdf8" opacity="0.5" />
                </>
              )}
            </g>
          );
        })}

        {/* Control Panel */}
        <rect x="75" y="110" width="50" height="15" rx="2" fill="#1e293b" />
        <circle cx="85" cy="117.5" r="3" fill={isIncubating ? "#ef4444" : "#475569"} className={isIncubating ? "animate-pulse" : ""} />
        <rect x="95" y="113" width="25" height="9" rx="1" fill="#334155" />
      </svg>

      <div className="mt-3 space-y-2 w-full flex flex-col items-center">
        {!isIncubating && (
          <>
            <div className="flex items-center gap-1.5 mb-1">
              {[37, 56, 65, 95].map(temp => (
                <button
                  key={temp}
                  onClick={() => {
                    onTempChange(temp - (temperature || 56));
                  }}
                  className={`${
                    temperature === temp
                      ? 'bg-red-600 hover:bg-red-500 border-red-400'
                      : temp === 56
                        ? 'bg-amber-600 hover:bg-amber-500 border-amber-400'
                        : 'bg-slate-700 hover:bg-slate-600 border-slate-500'
                  } text-white px-3 py-1.5 rounded-lg text-xs font-bold border-2 cursor-pointer transition-all`}
                >
                  {temp}°C
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onTempChange(-1)} className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer">−</button>
              <span className="text-xs text-white font-mono">Temp: {temperature || 56}°C</span>
              <button onClick={() => onTempChange(1)} className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer">+</button>
            </div>
          </>
        )}

        {duration && (
          <div className="text-xs text-amber-400 font-mono font-bold">
            Duration: {duration} min
          </div>
        )}

        {!hasTube && canLoad && (
          <button onClick={onLoadTube} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-pulse">
            Load Tube
          </button>
        )}

        {hasTube && !isIncubating && canStart && (
          <button onClick={onStartIncubation} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-bounce">
            Start Incubation
          </button>
        )}
      </div>

      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 font-mono text-center">
        PCR Thermocycler
      </span>
    </div>
  );
};

const CentrifugeVisual = ({ isSpinning, hasTube, onLoadTube, onStartSpin, canLoad, canSpin }) => {
  return (
    <div className="relative flex flex-col items-center p-4">
      <svg width="180" height="140" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base */}
        <rect x="60" y="110" width="80" height="40" rx="4" fill="#334155" />

        {/* Body */}
        <rect x="70" y="40" width="60" height="70" rx="4" fill="#475569" />

        {/* Door/Window */}
        <circle cx="100" cy="75" r="25" fill="#1e293b" stroke="#64748b" strokeWidth="2" />

        {/* Rotor with two balanced tubes (spinning part) */}
        <g className={isSpinning ? "animate-spin" : ""} style={{ transformOrigin: '100px 75px', animationDuration: '0.5s' }}>
          <circle cx="100" cy="75" r="15" fill="#0f172a" stroke="#475569" strokeWidth="2" />

          {/* Tube 1 (top position, user's sample) */}
          {hasTube && (
            <g>
              <rect x="95" y="57" width="10" height="16" rx="1" fill="#475569" opacity="0.8" />
              <rect x="96" y="59" width="8" height="12" fill="#38bdf8" opacity="0.5" />
            </g>
          )}

          {/* Tube 2 (bottom position, balance tube) - always shown when user tube is loaded */}
          {hasTube && (
            <g>
              <rect x="95" y="77" width="10" height="16" rx="1" fill="#475569" opacity="0.8" />
              <rect x="96" y="79" width="8" height="12" fill="#64748b" opacity="0.5" />
            </g>
          )}

          {/* Rotor arms */}
          <line x1="100" y1="60" x2="100" y2="65" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="85" x2="100" y2="90" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Control Panel */}
        <rect x="135" y="55" width="25" height="40" rx="2" fill="#1e293b" />
        <circle cx="147.5" cy="70" r="3" fill={isSpinning ? "#22c55e" : "#475569"} className={isSpinning ? "animate-pulse" : ""} />
        <rect x="140" y="80" width="15" height="8" rx="2" fill="#334155" />

        {/* RPM Display inside base when spinning */}
        {isSpinning && (
          <text x="100" y="135" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace" className="animate-pulse">
            13,000 RPM
          </text>
        )}
      </svg>

      <div className="mt-2 space-y-2 w-full flex flex-col items-center">
        {!hasTube && canLoad && (
          <button
            onClick={onLoadTube}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-pulse"
          >
            Load Tube
          </button>
        )}

        {hasTube && !isSpinning && canSpin && (
          <button
            onClick={onStartSpin}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border-0 cursor-pointer animate-bounce"
          >
            Start Spin
          </button>
        )}
      </div>

      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 font-mono text-center">
        Microcentrifuge
      </span>
    </div>
  );
};

const BiologicalPopup = ({ type, onClose }) => {
  const content = {
    lysis: {
      title: "Phase Separation Complete",
      sections: [
        {
          subtitle: "Supernatant (Liquid Phase)",
          text: "For genomic DNA extraction, most of the DNA is now in the supernatant. This aqueous layer contains soluble proteins, nucleic acids, and your target genomic DNA. You can hover/click to interact with it.",
          color: "text-yellow-400"
        },
        {
          subtitle: "Pellet (Solid Phase)",
          text: "The pellet contains insoluble material: unbroken cells, cell debris, insoluble proteins, and lipids. This is usually discarded in genomic DNA extraction protocols.",
          color: "text-amber-400"
        },
        {
          subtitle: "Note on Plasmid Minipreps",
          text: "In plasmid minipreps, after neutralization, plasmid DNA stays in the supernatant while heavier genomic DNA and proteins precipitate into the pellet.",
          color: "text-emerald-400"
        }
      ]
    },
    supernatant: {
      title: "Supernatant (Liquid Phase)",
      sections: [
        {
          subtitle: "What's Inside",
          text: "The supernatant contains your target genomic DNA dissolved in the lysis buffer along with soluble proteins and other cellular components.",
          color: "text-yellow-400"
        },
        {
          subtitle: "Next Steps",
          text: "In DNA extraction, you typically transfer the supernatant to a silica column or new tube. The column will bind DNA while other contaminants wash through.",
          color: "text-emerald-400"
        }
      ]
    },
    pellet: {
      title: "Pellet (Solid Phase)",
      sections: [
        {
          subtitle: "What's Inside",
          text: "The pellet is composed of insoluble debris: cell walls, membranes, unbroken cells, aggregated proteins, and lipids that precipitated during centrifugation.",
          color: "text-amber-400"
        },
        {
          subtitle: "Why Discard",
          text: "This material would contaminate your DNA prep and interfere with downstream applications. It contains very little recoverable DNA in most genomic extraction protocols.",
          color: "text-red-400"
        }
      ]
    },
    balance: {
      title: "Centrifuge Balancing",
      sections: [
        {
          subtitle: "Why Balance?",
          text: "Centrifuges must be balanced: Placing tubes in opposite directions ensures balanced force for precise sample separation. Without this, vibrations create smeary, inconsistent pellets that are easily lost during processing.",
          color: "text-emerald-400"
        },
        {
          subtitle: "Safety First",
          text: "An unbalanced centrifuge can shake violently, damage the rotor, break tubes, or even cause the machine to fail. Always use a balance tube of equal mass opposite your sample.",
          color: "text-red-400"
        }
      ]
    }
  };

  const popup = content[type] || content.lysis;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-800 border border-indigo-500/50 w-full max-w-lg rounded-3xl p-8 text-white shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black uppercase tracking-tight">{popup.title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white border-0 bg-transparent cursor-pointer">
            <X size={24}/>
          </button>
        </div>
        <div className="space-y-4">
          {popup.sections.map((section, idx) => (
            <div key={idx} className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
              <h4 className={`text-sm font-bold mb-2 ${section.color}`}>{section.subtitle}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-2xl font-bold uppercase text-xs transition-all border-0 cursor-pointer">
          Continue
        </button>
      </div>
    </div>
  );
};

const ReadinessOverlay = ({ onClose }) => (
  <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
    <div className="bg-slate-800 border border-amber-500/50 w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 text-white shadow-2xl">

      {/* Icon */}
      <ShieldCheck size={48} className="mx-auto text-amber-500" />

      {/* Title */}
      <h3 className="text-xl font-black uppercase tracking-tight text-center">
        Bench Readiness Check
      </h3>

      {/* Main disclaimer box */}
      <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-xl text-left space-y-3">
        <h4 className="text-indigo-300 font-bold text-sm flex items-center gap-2">
          <Lightbulb size={16} /> What You're Learning
        </h4>

        <p className="text-sm text-slate-200 leading-relaxed">
          <span className="font-bold text-white">BioSim Lab teaches universal principles,</span>{' '}
          not brand-specific protocols.
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <p className="text-emerald-400 font-bold mb-1">What You Learn Here:</p>
            <p className="text-slate-300">
              • Why techniques work<br/>
              • Decision-making logic<br/>
              • How mistakes cascade
            </p>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-lg">
            <p className="text-amber-400 font-bold mb-1">In Your Lab:</p>
            <p className="text-slate-300">
              • Follow your PI's SOP<br/>
              • Use exact volumes/timing<br/>
              • Match their equipment
            </p>
          </div>
        </div>

        <p className="text-xs text-indigo-200 italic">
          Every lab optimizes protocols for their equipment and reagents.
          The principles you learn here transfer everywhere.
        </p>
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-400 leading-relaxed text-center">
        Review the <b className="text-white">Manual</b> and <b className="text-white">Protocol</b>{' '}
        buttons in the workspace header before starting.
      </p>

      {/* CTA */}
      <button
        onClick={onClose}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all text-sm"
      >
        Proceed to Bench
      </button>
    </div>
  </div>
);

const ProtocolBookOverlay = ({ onClose }) => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans text-white">
      <div className="bg-slate-800 border border-emerald-500/50 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 text-white font-mono font-bold uppercase tracking-widest">
          <div className="flex items-center gap-3"><ScrollText size={24} /><h3>Success Criteria</h3></div>
          <button onClick={onClose} className="text-slate-500 hover:text-white border-0 bg-transparent cursor-pointer"><X size={24}/></button>
        </div>
        <div className="p-8 overflow-y-auto space-y-8 text-xs leading-relaxed text-slate-300 font-mono text-left">
          <section className="space-y-4 border-b border-slate-700 pb-4">
            <div className="flex items-center gap-2 text-white"><ShieldAlert size={16} className="text-rose-400"/><h4 className="text-white font-black uppercase text-lg font-sans">Mission A: Clinical Biopsy</h4></div>
            <ul className="space-y-2 list-decimal ml-4 text-slate-400">
              <li><b>Tissue Disruption:</b> Select <span className="text-emerald-400">Enzymatic Digestion</span> (recommended for biopsy)</li>
              <li><b>Proteinase K:</b> Add 2µL. <span className="text-emerald-400">MIX</span>. INCUBATE at 56°C.</li>
              <li><b>Lysis:</b> Add ~500µL. <span className="text-emerald-400">MIX</span>. SPIN.</li>
              <li><b>Binding/Column Load:</b> Add 500µL binding buffer and ethanol. Load onto spin column. SPIN.</li>
              <li><b>Wash:</b> Add 500µL wash buffer to column. SPIN.</li>
              <li><b>Elute:</b> Add 20µL elution buffer. SPIN.</li>
              <li><b>Success Range:</b> 200-1200 ng/µL, purity ≥1.7</li>
              <li><b>Verify:</b> Use <span className="text-amber-400">BOTH</span> Nanodrop <span className="text-amber-400">AND</span> Gel (both required)</li>
            </ul>
          </section>
          <section className="space-y-4 border-b border-slate-700 pb-4">
            <div className="flex items-center gap-2 text-white"><Leaf size={16} className="text-emerald-400"/><h4 className="text-white font-black uppercase text-lg font-sans">Mission B: Cassava Leaf</h4></div>
            <ul className="space-y-2 list-decimal ml-4 text-slate-400">
              <li><b>Disruption:</b> Select <span className="text-emerald-400">Manual Grinding</span> with liquid nitrogen + mortar/pestle (required for plant tissue)</li>
              <li><b>Lysis:</b> Add ~500µL lysis buffer (CTAB or kit buffer). <span className="text-emerald-400">MIX</span>. SPIN.</li>
              <li><b>Binding/Column Load:</b> Add 500µL binding buffer. Load onto spin column. SPIN.</li>
              <li><b>Wash:</b> Add 500µL wash buffer to column. SPIN.</li>
              <li><b>Elute:</b> Add 50µL elution buffer. SPIN.</li>
              <li><b>Success Range:</b> 200-350 ng/µL, purity ≥1.7</li>
              <li><b>Verify:</b> Use <span className="text-amber-400">BOTH</span> Nanodrop <span className="text-amber-400">AND</span> Gel (both required)</li>
            </ul>
          </section>
        </div>
        <div className="p-6 bg-slate-900/50 border-t border-slate-700 font-mono"><button onClick={onClose} className="w-full bg-emerald-600 py-4 rounded-2xl font-black text-white border-0 cursor-pointer font-bold uppercase tracking-widest">Acknowledge</button></div>
      </div>
    </div>
);

const ProtocolGuideOverlay = ({ onClose, missionId }) => {
  const protocolContent = {
    A: {
      title: "Clinical Tissue Biopsy Protocol",
      subtitle: "Human/Animal DNA Extraction -Select appropriate kit tailored for soft tissues (e.g., 3-25mg biopsies). Volumes: 2/500/500/20 µl.",
      steps: [
        {
          title: "Tissue Disruption (Enzymatic Digestion)",
          content: "Add Proteinase K (2µl concentrated stock). Mix and incubate at 56°C (shortened for simulation; real: 1-3 hours). Targets proteins in animal matrices; no grinding needed unlike plants."
        },
        {
          title: "Lysis",
          content: "Add lysis buffer (500µl). Mix and spin (~12,000g) to pellet debris. Skips RNase for simplicity, assuming minor RNA is tolerable."
        },
        {
          title: "Binding/Wash/Elute",
          content: "Add binding buffer (500µl) and spin to bind DNA to column. Wash (500µl, repeat) and spin. Elute in 20µl, then NanoDrop. Column skips phenol-chloroform (common for phase separation) for safety, speed, and non-toxicity."
        },
        {
          title: "Equipment",
          content: "Microcentrifuge, pipettes/tips, incubator, NanoDrop, safety kit."
        }
      ]
    },
    B: {
      title: "Cassava Extraction Protocol",
      subtitle: "Plant DNA Extraction - Select the Zymo kit for tough plant tissues (e.g., 20-100mg cassava). Volumes: 500/500/20 µl.",
      steps: [
        {
          title: "Tissue Disruption (Manual Grinding + Liquid N₂)",
          content: "Grind in mortar/pestle with LN₂ (no Proteinase K). Flash-freezes to brittle tissue, preventing phenolic oxidation—key for plants but not animals."
        },
        {
          title: "Lysis & Binding",
          content: "Add lysis buffer (500µl). Mix and spin. Add binding buffer (500µl) to column and spin. Skips chloroform:isoamyl alcohol (for phenolic removal in CTAB methods) for safety and speed via column binding."
        },
        {
          title: "Wash & Elute",
          content: "Wash (500µl, repeat) and spin. Elute in 20µl, spin, NanoDrop. No β-mercaptoethanol (BME; reduces oxidation) as small samples/low phenolics rely on buffer additives like PVP."
        },
        {
          title: "Equipment",
          content: "Mortar/pestle, LN₂ (safety kit for cryogenics), microcentrifuge, NanoDrop, pipettes/tips."
        }
      ]
    }
  };

  const protocol = protocolContent[missionId] || protocolContent.A;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans text-white">
      <div className="bg-slate-800 border border-indigo-500/50 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3 text-indigo-400 font-mono font-bold uppercase tracking-widest">
            <BookOpen size={24} />
            <h3>Extraction Protocol</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white border-0 bg-transparent cursor-pointer">
            <X size={24}/>
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-300 text-left">
          <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-2xl space-y-2">
            <h4 className="text-indigo-300 font-black uppercase text-lg font-sans">{protocol.title}</h4>
            <p className="text-slate-300 text-xs italic">{protocol.subtitle}</p>
          </div>

          {protocol.steps.map((step, index) => (
            <section key={index} className="space-y-3 border-b border-slate-700 pb-5 last:border-b-0">
              <h5 className="text-white font-bold uppercase text-sm font-mono flex items-center gap-2">
                <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
                  {index + 1}
                </span>
                {step.title}
              </h5>
              <p className="text-slate-300 text-sm leading-relaxed ml-8">{step.content}</p>
            </section>
          ))}
        </div>
        <div className="p-6 bg-slate-900/50 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black text-white border-0 cursor-pointer uppercase tracking-widest transition-all"
          >
            Close Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

const LabManualOverlay = ({ onClose }) => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans text-white">
      <div className="bg-slate-800 border border-indigo-500/50 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3 text-indigo-400 font-mono font-bold"><BookOpen size={24} /><h3>Laboratory SOP</h3></div>
          <button onClick={onClose} className="text-slate-500 border-0 bg-transparent cursor-pointer"><X size={24}/></button>
        </div>
        <div className="p-8 overflow-y-auto space-y-8 text-sm leading-relaxed text-slate-300 text-left text-white">
          <section className="bg-rose-900/10 border border-rose-500/20 p-4 rounded-2xl space-y-2 text-white">
            <h4 className="text-rose-400 font-bold uppercase text-xs font-mono flex items-center gap-2"><Undo2 size={14} />1. Lab Finality</h4>
            <p className="italic font-mono text-[11px] text-slate-300">Actions in BioSim are final. If you miss a reagent or bypass a spin, you must complete the run. Practice makes perfect!</p>
          </section>
          <section className="space-y-3 font-sans text-white">
            <h4 className="text-indigo-300 font-bold uppercase text-xs font-mono flex items-center gap-2"><ScrollText size={14} />2. How to View Protocols</h4>
            <p className="text-slate-300">Before starting any experiment, review the full protocol:</p>
            <div className="bg-slate-900/30 border border-slate-700/50 p-4 rounded-xl space-y-2">
              <p className="text-indigo-400 font-semibold text-xs flex items-center gap-2">📋 Step-by-Step:</p>
              <ul className="space-y-1.5 text-slate-300 text-xs leading-relaxed ml-4">
                <li>→ Click "Proceed to Bench" → "Proceed to Procurement"</li>
                <li>→ Scroll to bottom → Click "Enter Lab"</li>
                <li>→ Look for "📋 Protocol" button (top-right corner)</li>
                <li>→ Click to read step-by-step instructions</li>
                <li>→ Note which equipment and reagents you need</li>
                <li>→ Click "Add Equipment" to return to Procurement</li>
                <li>→ Select correct tools and reagents</li>
                <li>→ Click "Enter Lab" again to start</li>
              </ul>
            </div>
            <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-xl">
              <p className="text-amber-300 text-xs flex items-center gap-2"><Lightbulb size={12} /><span className="font-semibold">Tip:</span> Protocol button is always visible during experiments. Click it anytime to review steps.</p>
            </div>
          </section>
          <section className="space-y-2 font-sans text-white">
            <h4 className="text-indigo-300 font-bold uppercase text-xs font-mono flex items-center gap-2"><ShoppingCart size={14} />3. Procurement</h4>
            <p className="text-slate-300">Selecting the correct Kit and Equipment is mandatory. Without appropriate buffers, failure is certain. Always review the protocol (see #2 above) before purchasing.</p>
          </section>
          <section className="space-y-2 font-sans text-white">
            <h4 className="text-indigo-300 font-bold uppercase text-xs font-mono flex items-center gap-2"><Database size={14} />4. Lab IDs</h4>
            <p className="text-slate-300">Your progress is saved to your Lab ID and tracked automatically for your learning journey.</p>
          </section>
        </div>
        <div className="p-6 bg-slate-900/50 border-t border-slate-700 font-mono"><button onClick={onClose} className="w-full bg-indigo-600 py-4 rounded-2xl font-black uppercase text-white shadow-lg border-0 cursor-pointer text-xs font-mono font-bold tracking-widest uppercase">Return to Bench</button></div>
      </div>
    </div>
);


const MasteryBadge = () => (
    <div className="flex flex-col items-center p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl shadow-2xl animate-in zoom-in font-sans">
        <Medal size={64} className="text-emerald-500 mb-4" />
        <div className="text-center">
            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Verified Mastery</h4>
            <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-[0.2em] font-bold italic">Standard Range Confirmed</p>
        </div>
    </div>
);

const FeedbackModule = ({ userRating, setUserRating, feedbackSent, setFeedbackSent }) => (
    <div className="bg-gradient-to-br from-amber-500/10 to-indigo-500/10 border-2 border-amber-500/40 p-8 rounded-3xl text-center font-sans space-y-5 shadow-2xl animate-in zoom-in duration-500">
        <div className="space-y-2 font-sans text-white text-center">
          <h3 className="text-2xl font-black uppercase text-white tracking-tight leading-none">How was your experience?</h3>
          <p className="text-sm text-slate-300 font-medium">Rate this simulation to help us improve</p>
        </div>
        <div className="flex justify-center gap-3 font-sans text-white py-2">{[1, 2, 3, 4, 5].map((s) => (<button key={s} onClick={() => { setUserRating(s); trackEvent('StarRating', 'Feedback', `Rating_${s}`, s); if (s > 3) setFeedbackSent(true); }} className="transition-all hover:scale-125 active:scale-95 cursor-pointer border-0 bg-transparent p-1 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
          <Star size={48} className={userRating >= s ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "text-slate-600 hover:text-slate-500"} strokeWidth={2.5} />
        </button>))}</div>
        {userRating > 0 && userRating <= 3 && !feedbackSent && (<div className="space-y-3 animate-in slide-in-from-top-2 font-sans text-slate-400 text-center"><p className="text-xs text-center font-bold text-slate-300 uppercase tracking-wide">What was the primary issue?</p><div className="grid grid-cols-2 gap-2">{["Confusing Path", "Too Difficult", "Technical Bug", "Lack of Guide"].map((tag, i) => (<button key={`tag-${i}`} onClick={() => { setFeedbackSent(true); trackEvent('LowRatingReason', 'Feedback', tag, userRating); }} className="bg-slate-800 p-3 rounded-lg text-xs font-bold uppercase text-slate-300 border border-slate-700 hover:bg-indigo-900/20 transition-all cursor-pointer">{String(tag)}</button>))}</div></div>)}{feedbackSent && <div className="flex items-center justify-center gap-2 text-base font-bold text-emerald-400 animate-in fade-in"><span>✓</span><span>Thank you for your feedback!</span></div>}
    </div>
);

const BenchInventoryVisuals = ({ inventory, status }) => {
    return null;
};

const GelLaneComp = ({ bands = [], smear = false, faint = false, blank = false }) => (
    <div className="relative w-[70px] h-[170px] bg-slate-950/60 border border-slate-700 rounded-md overflow-hidden shadow-inner text-white">
      <div className="absolute top-1 left-1 right-1 h-2 bg-slate-900/70 rounded-sm" />
      {!blank && (
        <>
          {smear && <div className="absolute left-2 right-2 top-8 bottom-2 rounded-sm" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.20), rgba(255,255,255,0.02))", opacity: faint ? 0.35 : 0.65 }} />}
          {bands.map((b, idx) => (
            <div key={idx} className="absolute left-2 right-2 rounded-sm" style={{ top: b.y, height: b.h ?? 3, opacity: faint ? (b.a ?? 0.9) * 0.4 : b.a ?? 0.9, background: "rgba(255,255,255,0.85)", transform: `scaleX(${(b.w ?? 26) / 26})`, transformOrigin: "center" }} />
          ))}
        </>
      )}
    </div>
);

const NanodropVisualComp = ({ step, measured, hasDNA = true, purityScore = 1.8 }) => {
  const armOpen = step === 'open' || step === 'clean' || step === 'blank' || step === 'load';
  const showPipette = step === 'load';
  const showSample = step === 'load' || step === 'measure' || step === 'complete' || measured;

  const generateDNASpectrum = () => {
    const noise = () => (Math.random() - 0.5) * 0.1;
    const purity = parseFloat(purityScore) || 1.8;
    const contaminationFactor = Math.max(0, (1.8 - purity) / 0.4);

    const baseSpectrum = [
      { wl: 220, abs: 0.8 },
      { wl: 230, abs: 1.6 },
      { wl: 240, abs: 2.9 },
      { wl: 250, abs: 4.0 },
      { wl: 260, abs: 4.2 },
      { wl: 270, abs: 3.4 },
      { wl: 280, abs: 2.3 },
      { wl: 290, abs: 1.3 },
      { wl: 300, abs: 0.5 },
      { wl: 310, abs: 0.3 },
      { wl: 320, abs: 0.2 },
      { wl: 330, abs: 0.1 },
      { wl: 340, abs: 0.05 },
      { wl: 350, abs: 0.0 }
    ];

    const wavelengths = baseSpectrum.map(p => {
      let adjustedAbs = p.abs;

      if (purity < 1.8) {
        if (p.wl === 230) adjustedAbs += contaminationFactor * 0.6;
        if (p.wl === 280) adjustedAbs += contaminationFactor * 0.4;
        if (p.wl === 260) adjustedAbs -= contaminationFactor * 0.3;
      }

      return {
        wl: p.wl,
        x: 10 + ((p.wl - 220) / (350 - 220)) * 90,
        abs: Math.max(0, adjustedAbs + noise())
      };
    });

    const absToY = (abs) => {
      const maxAbs = 4.5;
      const clampedAbs = Math.max(0, Math.min(maxAbs, abs));
      return 60 - (clampedAbs / maxAbs) * 50;
    };

    const points = wavelengths.map(p => ({
      x: p.x,
      y: absToY(p.abs)
    }));

    let pathData = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const tension = 0.3;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return pathData;
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="140" width="160" height="40" rx="4" fill="#334155" />
          <rect x="40" y="120" width="120" height="20" fill="#1e293b" />
          <rect x="60" y="40" width="10" height="80" fill="#475569" />
          <rect x="60" y="30" width="80" height="15" rx="2" fill="#64748b" className={armOpen ? 'translate-y-[-20px] transition-all duration-500' : 'transition-all duration-500'} />
          <circle cx="100" cy="115" r="6" fill="#94a3b8" />
          {showSample && <circle cx="100" cy="115" r="2" fill="#60a5fa" className="animate-pulse" />}
          {showPipette && (
            <g className="animate-bounce">
              <line x1="100" y1="10" x2="100" y2="105" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="100" cy="8" r="3" fill="#6366f1" />
              <text x="105" y="50" fill="#6366f1" fontSize="10" fontWeight="bold">1µL</text>
            </g>
          )}
        </svg>

        {measured && (
          <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-3 w-32">
            <div className="text-[8px] text-slate-500 uppercase font-bold mb-2 text-center">Screen</div>
            <svg width="110" height="70" viewBox="0 0 110 70" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="100" height="60" fill="#0f172a" rx="2" />
              <line x1="10" y1="60" x2="100" y2="60" stroke="#475569" strokeWidth="0.5" />
              <line x1="10" y1="15" x2="10" y2="60" stroke="#475569" strokeWidth="0.5" />
              <text x="12" y="13" fill="#64748b" fontSize="6">Abs</text>
              <text x="85" y="68" fill="#64748b" fontSize="6">λ (nm)</text>
              {hasDNA ? (
                <path d={generateDNASpectrum()} stroke="#22c55e" strokeWidth="1.5" fill="none" className="animate-in fade-in" />
              ) : (
                <line x1="10" y1="60" x2="100" y2="60" stroke="#ef4444" strokeWidth="2" className="animate-in fade-in" />
              )}
            </svg>
            <p className={`text-[7px] font-bold text-center mt-1 ${hasDNA ? 'text-emerald-400' : 'text-rose-400'}`}>
              {hasDNA ? 'Peak at 260nm' : 'Flat (No DNA)'}
            </p>
          </div>
        )}
      </div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono text-center font-bold">NanoDrop</span>
      {step === 'measure' && <p className="text-[9px] text-amber-400 animate-pulse">Measuring...</p>}
    </div>
  );
};

export default function App() {
  console.log('App component rendering');

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedRecordId, setSavedRecordId] = useState(null);
  const [showClassCodePrompt, setShowClassCodePrompt] = useState(false);
  const [screen, setScreen] = useState("welcome");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    console.log('App mounted, screen:', screen);
  }, []);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    setupAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const data = await historyStore.fetchHistory(user.id);
        setHistoryRecords(data);
      } catch (error) {
        console.error("History fetch error:", error);
      }
    };
    fetchHistory();
  }, [user]);

  useEffect(() => {
    try {
      const hasSeenPrompt = localStorage.getItem('biosim_class_prompt_shown');
      if (!hasSeenPrompt) {
        setShowClassCodePrompt(true);
      }
    } catch (error) {
      console.error("LocalStorage error:", error);
    }
  }, []);

  useEffect(() => {
    const handleHeaderTabClick = (e: CustomEvent) => {
      const tab = e.detail.tab;
      if (tab === 'home') {
        setScreen('welcome');
      } else if (tab === 'manual') {
        setShowManual(true);
      } else if (tab === 'contact') {
        setScreen('welcome');
        setTimeout(() => {
          const contactElement = document.getElementById('contact');
          if (contactElement) {
            contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };
    window.addEventListener('headerTabClick' as any, handleHeaderTabClick);
    return () => window.removeEventListener('headerTabClick' as any, handleHeaderTabClick);
  }, []);

  useEffect(() => {
    const currentTab = screen === 'welcome' ? 'home' : null;
    if (currentTab) {
      window.dispatchEvent(new CustomEvent('labTabChange', { detail: { tab: currentTab } }));
    }
  }, [screen]);
  const [techniqueId, setTechniqueId] = useState(null);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [missionId, setMissionId] = useState(null);
  const [procureTab, setProcureTab] = useState("kits");
  const [showManual, setShowManual] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  const [showPCRModal, setShowPCRModal] = useState(false);
  const [showProtocolOverview, setShowProtocolOverview] = useState(false);
  const [ndStep, setNdStep] = useState("idle");
  const [gelStep, setGelStep] = useState("idle");
  const [verificationDone, setVerificationDone] = useState({ nanodrop: false, gel: false });
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [protocolIndex, setProtocolIndex] = useState(0);
  const [bufferVolume, setBufferVolume] = useState(0);
  const [volumeAddedThisStep, setVolumeAddedThisStep] = useState(0);
  const [elutionVolume, setElutionVolume] = useState(0);
  const [sampleMass, setSampleMass] = useState(50);
  const [currentSolidMass, setCurrentSolidMass] = useState(0);
  const [hasDispensedThisStep, setHasDispensedThisStep] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpunThisStep, setHasSpunThisStep] = useState(false);
  const [tubeInCentrifuge, setTubeInCentrifuge] = useState(false);
  const [missedSpins, setMissedSpins] = useState(0);
  const [missedReagents, setMissedReagents] = useState(0);
  const [stoichiometryError, setStoichiometryError] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [pipetteVolume, setPipetteVolume] = useState(null);
  const [isMixing, setIsMixing] = useState(false);
  const [needsMixing, setNeedsMixing] = useState(false);
  const [yieldUg, setYieldUg] = useState(null);
  const [finalConc, setFinalConc] = useState(null);
  const [a260_280, setA260_280] = useState(null);
  const [pelletVisible, setPelletVisible] = useState(false);
  const [failReason, setFailReason] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showQuant, setShowQuant] = useState(false);
  const [canNanodropNow, setCanNanodropNow] = useState(false);
  const [usingSpinColumn, setUsingSpinColumn] = useState(false);
  const [isIncubating, setIsIncubating] = useState(false);
  const [incubationTemp, setIncubationTemp] = useState(25);
  const [showPhaseSeparation, setShowPhaseSeparation] = useState(false);
  const [showBioPopup, setShowBioPopup] = useState(null);
  const [tubeAnimating, setTubeAnimating] = useState(false);
  const [hasSeenBalancingTip, setHasSeenBalancingTip] = useState(false);
  const [elutionVolumeChoice, setElutionVolumeChoice] = useState(null);
  const [activeEquipment, setActiveEquipment] = useState('centrifuge');
  const [protocolAdherenceCompromised, setProtocolAdherenceCompromised] = useState(false);
  const [step1Method, setStep1Method] = useState(null);
  const [step2Mixed, setStep2Mixed] = useState(false);
  const [step3Mixed, setStep3Mixed] = useState(false);
  const [stepVolumes, setStepVolumes] = useState({
    protK: 0,
    lysis: 0,
    binding: 0,
    wash: 0,
    elution: 0,
  });
  const [protKIncubationOK, setProtKIncubationOK] = useState(false);
  const [yieldQuality, setYieldQuality] = useState(null);
  const [isGrinding, setIsGrinding] = useState(false);
  const [showGrindingSetup, setShowGrindingSetup] = useState(false);
  const [difficultyMode, setDifficultyMode] = useState("learning");
  const [challengeModeErrors, setChallengeModeErrors] = useState([]);
  const [showProtocolGuide, setShowProtocolGuide] = useState(false);

  const has = (itemId) => inventory.includes(itemId);

  const addLog = (msg, type = 'info') => {
    if (difficultyMode === "challenge") {
      if (type === "error" || type === "success") {
        setChallengeModeErrors(prev => [...prev, { msg, type }]);
      }
    } else {
      setLogs(prev => [...prev, { msg, type }]);
    }
  };

  const hasReagentForStep = (reagentId) => {
    if (!reagentId) return true;
    const reagentMap = {
      proteinase_k: ['proteinase_k'],
      lysis: ['kit_qiagen', 'kit_zymo', 'kit_thermo', 'lysis_clean'],
      binding: ['kit_qiagen', 'kit_zymo', 'kit_thermo', 'column'],
      wash: ['kit_qiagen', 'kit_zymo', 'kit_thermo', 'wash_buffer'],
      elute: ['kit_qiagen', 'kit_zymo', 'kit_thermo', 'elute_buffer']
    };
    return (reagentMap[reagentId] || []).some(r => has(r));
  };

  useEffect(() => {
    if (screen === "lab" && protocolIndex === 0) setCurrentSolidMass(sampleMass);
  }, [screen, protocolIndex, sampleMass]);

  const missionVerification = useMemo(() => {
    if (!techniqueId || !missionId) return null;
    return MISSIONS_DATA[techniqueId]?.[missionId]?.verification || null;
  }, [techniqueId, missionId]);

  const isVerificationSatisfied = useMemo(() => {
    if (!missionVerification) return true;
    const { mode, options } = missionVerification;
    const doneCount = options.filter((k) => verificationDone[k]).length;
    return mode === "REQUIRED_ALL" ? doneCount === options.length : doneCount >= 1;
  }, [missionVerification, verificationDone]);

  const protocolSteps = useMemo(() => {
    if (techniqueId !== "DNA_EXT") return [];
    const allSteps = [
      { title: "Tissue Disruption", prompt: missionId === 'A' ? "Mission A: Use Enzymatic Digestion (recommended for biopsy)" : "Mission B: Use Manual Grinding with liquid nitrogen + mortar/pestle (required for plant tissue)", science: "Biological Context: Cells make up tissues. We must first break down the extracellular matrix to release individual cells into the buffer so lysis reagents can reach the membranes.", options: [{ label: "Enzymatic Digestion", log: "Gentle digestion complete. HMW DNA integrity preserved.", method: "enzymatic", ok: true }, { label: "Manual Grinding", log: "Manual disruption complete with liquid nitrogen. Plant cell walls broken down.", method: "manual", ok: has("mortar_pestle") && has("liquid_nitrogen") }] },
      { title: "Proteinase K Digestion", prompt: "Add Proteinase K, MIX, and INCUBATE at 56°C for 1 hour.", science: "Proteinase K is a powerful enzyme that digests proteins including histones and other contaminants. This enzymatic digestion helps release DNA and improves purity. Incubation at 56°C for 1 hour provides optimal enzyme activity and complete protein digestion.", requiresIncubation: true, incubationTemp: 56, incubationDuration: 60, requiresVolume: true, targetVolume: 2, requiresMixing: true, reagentRequired: "proteinase_k", skipIf: () => step1Method === "manual" && missionId === 'B' },
      { title: "Lysis Phase", prompt: "Add Lysis Buffer (~500 µL), MIX, and SPIN.", science: "Mechanism: Lysis buffer contains detergents (like SDS for animal tissue or CTAB for plant material) to dissolve cell membranes and salts to stabilize the DNA. This releases genomic DNA into the aqueous solution. Spinning separates lysed cellular debris.", requiresVolume: true, targetVolume: 500, requiresMixing: true, requiresSpin: true, reagentRequired: "lysis" },
      { title: "Binding/Column Load", prompt: "Add binding buffer and ethanol, then load onto spin column and SPIN.", science: "Binding Chemistry: In the presence of chaotropic salts and ethanol, DNA binds to the silica membrane in the spin column. The combination of binding buffer and ethanol creates optimal conditions for DNA to adhere to the column while proteins and other contaminants remain in solution.", requiresVolume: true, targetVolume: 500, requiresSpin: true, reagentRequired: "binding" },
      { title: "Wash Stage", prompt: "Add Wash Buffer to column and SPIN.", science: "Wash buffers remove residual salts and proteins while keeping the DNA bound securely to the silica membrane.", requiresVolume: true, targetVolume: 500, requiresSpin: true, reagentRequired: "wash" },
      { title: "Elution", prompt: "Add Elution Buffer and SPIN to collect purified DNA.", science: "Final Step: Low-salt Elution buffer (TE or water) releases the high-purity DNA from the column into your final microtube for quantification.", requiresVolume: true, targetVolume: missionId === 'A' ? 20 : 50, requiresSpin: true, isElution: true, reagentRequired: "elute" }
    ];
    return allSteps.filter(step => !step.skipIf || !step.skipIf());
  }, [techniqueId, missionId, inventory, step1Method]);

  const currentStep = protocolSteps[protocolIndex];

  const startMission = (tId, mId) => {
    setTechniqueId(tId);
    setMissionId(mId);
    setCoins(MISSIONS_DATA[tId][mId].budget);
    const baseInventory = mId === 'B' ? ['mortar_pestle', 'liquid_nitrogen'] : [];
    setInventory(baseInventory);
    setLogs([]);
    setProtocolIndex(0);
    setSampleMass(50);
    setBufferVolume(0);
    setVolumeAddedThisStep(0);
    setElutionVolume(0);
    setNdStep("idle");
    setGelStep("idle");
    setVerificationDone({ nanodrop: false, gel: false });
    setStatus("idle");
    setHasDispensedThisStep(false);
    setHasSpunThisStep(false);
    setTubeInCentrifuge(false);
    setNeedsMixing(false);
    setIsMixing(false);
    setMissedSpins(0);
    setMissedReagents(0);
    setStoichiometryError(false);
    setPelletVisible(false);
    setUserRating(0);
    setFeedbackSent(false);
    setShowQuant(false);
    setCanNanodropNow(false);
    setShowPhaseSeparation(false);
    setShowBioPopup(null);
    setStepVolumes({ protK: 0, lysis: 0, binding: 0, wash: 0, elution: 0 });
    setProtKIncubationOK(false);
    setTubeAnimating(false);
    setHasSeenBalancingTip(false);
    setElutionVolumeChoice(null);
    setIsIncubating(false);
    setIncubationTemp(25);
    setProtocolAdherenceCompromised(false);
    setStep1Method(null);
    setStep2Mixed(false);
    setStep3Mixed(false);
    setYieldQuality(null);
    setDifficultyMode("learning");
    setChallengeModeErrors([]);
    setScreen("briefing");
    setShowReadinessModal(true);
  };

  const handleLoadTube = () => {
    if (!has("centrifuge")) {
      addLog("Hardware Error: Centrifuge required.", "error");
      return;
    }
    setTubeAnimating(true);
    addLog("Loading tube into centrifuge...", "info");
    setTimeout(() => {
      setTubeAnimating(false);
      setTubeInCentrifuge(true);
      addLog("Tube loaded with balance tube.", "success");
      if (!hasSeenBalancingTip) {
        setShowBioPopup("balance");
        setHasSeenBalancingTip(true);
      }
    }, 800);
  };

  const handleSpin = () => {
    if (!has("centrifuge")) {
      addLog("Hardware Error: Centrifuge required.", "error");
      return;
    }
    if (!tubeInCentrifuge) {
      addLog("Error: Load tube first.", "error");
      return;
    }
    setIsSpinning(true);
    addLog("Centrifugation started (13,000 rpm)...", "info");
    setTimeout(() => {
      setIsSpinning(false);
      setHasSpunThisStep(true);
      setTubeInCentrifuge(false);

      // FIX: Standardize residual volume to 15µL after discarding supernatant
      setBufferVolume(15);
      addLog("Spin complete. Supernatant discarded.", "success");

      if (protocolIndex === 1) setCurrentSolidMass(0);

      if (protocolIndex === 2) {
        setShowPhaseSeparation(true);
        setShowBioPopup("lysis");
        setTimeout(() => setShowPhaseSeparation(false), 8000);
      }

      if (protocolIndex === 4 && !stoichiometryError) setPelletVisible(true);
    }, 3000);
  };

  const handleLoadTubeThermocycler = () => {
    setTubeAnimating(true);
    addLog("Loading tube into thermocycler...", "info");
    setTimeout(() => {
      setTubeAnimating(false);
      setTubeInCentrifuge(true);
      addLog("Tube loaded into thermocycler.", "success");
    }, 800);
  };

  const handleStartIncubation = () => {
    if (!tubeInCentrifuge) {
      addLog("Error: Load tube first.", "error");
      return;
    }

    const tempOK = incubationTemp >= 50 && incubationTemp <= 60;
    if (!tempOK) {
      addLog(`ERROR: Temperature ${incubationTemp}°C is outside the required 50-60°C range. Proteinase K will not work correctly!`, "error");
      setProtocolAdherenceCompromised(true);
    } else if (incubationTemp !== currentStep.incubationTemp) {
      addLog(`Temperature set to ${incubationTemp}°C. Within acceptable range for Proteinase K.`, "info");
    }

    setIsIncubating(true);
    addLog(`Incubation started at ${incubationTemp}°C...`, "info");
    setTimeout(() => {
      setIsIncubating(false);
      setHasSpunThisStep(true);
      setTubeInCentrifuge(false);
      addLog("Incubation complete. Tube removed from thermocycler.", "success");
      if (tempOK) {
        addLog("Proteinase K successfully digested proteins at correct temperature.", "success");
        if (currentStep?.title === "Proteinase K Digestion") {
          setProtKIncubationOK(true);
        }
      } else {
        addLog("Proteinase K activity failed due to incorrect temperature. Protocol compromised.", "error");
      }
    }, 3000);
  };

  const handleTempChange = (delta) => {
    const newTemp = Math.max(25, Math.min(95, (incubationTemp || 25) + delta));
    setIncubationTemp(newTemp);
    addLog(`Temperature set to ${newTemp}°C`, "info");
  };

  const getOrCreateStudentId = () => {
    let studentId = localStorage.getItem('biosim_user_id');
    if (!studentId) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      studentId = `BioStudent-${randomNum}`;
      localStorage.setItem('biosim_user_id', studentId);
    }
    return studentId;
  };

  const finalizeCalculations = async () => {
    // Check lab practice (PPE)
    const hasGloves = has("gloves");
    const hasLabCoat = has("lab_coat");
    const poorLabPractice = !hasGloves || !hasLabCoat;
    let labPracticeNote = "";

    if (poorLabPractice) {
      const missing = [];
      if (!hasGloves) missing.push("gloves");
      if (!hasLabCoat) missing.push("lab coat");
      labPracticeNote = `Unsafe lab practice: No ${missing.join(" or ")}.`;
    }

    // Calibration for Mission B yield (0.18 ensures you hit the 200-350 window)
    const yieldMultiplier = missionId === 'A' ? 0.4 : 0.18;
    let localYield = 0, localConc = 0, localPurity = "0.00", localStatus = "fail", localFailReason = "";

    // CRITICAL FAILURE POINTS - Check for zero DNA conditions
    const isMissionBManual = missionId === 'B' && step1Method === 'manual';
    const isMissionAProtK = missionId === 'A' && step1Method === 'enzymatic' && step2Mixed && protKIncubationOK;

    // Critical gatekeepers:
    // 1. Disruption method (Mission A needs ProtK, Mission B needs manual grinding)
    const disruptionFailed = (missionId === 'A' && !isMissionAProtK) ||
                             (missionId === 'B' && step1Method !== 'manual');

    // 2. Lysis buffer not added or not mixed
    const lysisFailed = !step3Mixed || stepVolumes.lysis === 0;

    // 3. Elution buffer not added
    const elutionFailed = elutionVolume === 0;

    // 4. Binding step failed (no binding buffer)
    const bindingFailed = stepVolumes.binding === 0;

    // If any critical step failed, DNA yield is 0
    if (disruptionFailed || lysisFailed || elutionFailed || bindingFailed) {
      localYield = 0;
      localConc = 0;
      localPurity = "0.00";

      if (elutionFailed) {
        localFailReason = "Total Failure: No elution buffer added. DNA remained bound to column.";
      } else if (bindingFailed) {
        localFailReason = "Total Failure: No binding buffer added. DNA washed to waste.";
      } else if (lysisFailed) {
        localFailReason = "Total Failure: Lysis step failed. DNA remained trapped in intact cells.";
      } else if (disruptionFailed) {
        if (missionId === 'A') {
          localFailReason = "Total Failure: Proteinase K digestion failed. DNA trapped in protein complexes.";
        } else {
          localFailReason = "Total Failure: Manual grinding required for plant tissue. DNA remained trapped in cell walls.";
        }
      }
    } else {
      // Normal yield calculation
      let yieldPenalty = 1.0;
      if (missedSpins > 0) yieldPenalty *= 0.1;
      if (protocolAdherenceCompromised) yieldPenalty *= 0.7;

      localYield = parseFloat((sampleMass * yieldMultiplier * yieldPenalty).toFixed(2));
      localConc = parseFloat(((localYield * 1000) / elutionVolume).toFixed(1));

      // PURITY LOGIC: Checking for MIXING and WASH steps
      let purityScore = 1.88;

      // Skipping wash affects purity (not yield)
      if (missedSpins > 0) purityScore -= 0.5;

      // Logic fix for Mission B skipping ProtK (Step 2)
      if (!isMissionBManual && !step2Mixed) purityScore -= 0.4;

      // Lysis (Step 3) MUST be mixed
      if (!step3Mixed) purityScore -= 0.4;

      localPurity = Math.max(0.4, purityScore).toFixed(2);

      // Range validation
      const minOK = missionId === 'A' ? 200 : 200;
      const maxSoft = missionId === 'A' ? 1200 : 350; // soft guidance, not failure

      const meetsMin = localConc >= minOK;
      const needsDilution = localConc > maxSoft;
      const wouldShowNoBand = localConc <= 0;

      if (!isVerificationSatisfied) {
        localStatus = "unverified";
        localFailReason = "Finish NanoDrop AND Gel to verify.";
      } else if (wouldShowNoBand) {
        localStatus = "fail";
        localFailReason = "No DNA band visible in gel electrophoresis. Extraction failed completely.";
      } else if (parseFloat(localPurity) >= 1.7 && meetsMin && missedReagents === 0) {
        localStatus = "mastery";
        if (needsDilution) {
          localFailReason = `Great yield: ${localConc} ng/µL. This is high—dilute to fit downstream protocols.`;
        } else {
          localFailReason = poorLabPractice ? labPracticeNote : "";
        }
      } else {
        localStatus = "fail";
        if (!meetsMin) localFailReason = `Yield too low (${localConc} ng/µL). Try improving lysis/binding/spins.`;
        else if (parseFloat(localPurity) < 1.7) localFailReason = "Purity failed (<1.7). Wash step may have been skipped.";
        else localFailReason = "Protocol blunders detected.";
      }

      // Add lab practice note to successful extractions with poor PPE
      if (poorLabPractice && localStatus === "mastery") {
        localFailReason = localFailReason ? `${localFailReason} | ${labPracticeNote}` : labPracticeNote;
      }
    }

    setYieldUg(localYield);
    setFinalConc(localConc);
    setA260_280(localPurity);
    setStatus(localStatus);
    setFailReason(localFailReason);
    if (localStatus !== "unverified") {
      setShowQuant(true);
    }

    const studentId = getOrCreateStudentId();
    const missionTitle = MISSIONS_DATA[techniqueId][missionId]?.title || 'DNA Extraction';
    const statusText = localStatus === 'mastery' ? 'Verified Mastery' : 'Mission Failed';

    let classId = null;
    try {
      const { data: sessionData } = await supabase
        .from('lab_sessions')
        .select('class_id')
        .eq('student_id', studentId)
        .order('last_active', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionData) {
        classId = sessionData.class_id;
      }
    } catch (sessionError) {
      console.error('Error fetching session:', sessionError);
    }

    const errorLogs = logs.filter(log => log.type === 'error').map(log => ({
      message: log.msg,
      type: log.type
    }));

    try {
      const { data, error } = await supabase
        .from('lab_results')
        .insert([{
          student_id: studentId,
          mission: missionTitle,
          purity_score: parseFloat(localPurity),
          status: statusText,
          class_id: classId || null,
          event_log: errorLogs
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSavedRecordId(data.id);
        setShowSuccessModal(true);
      }

      await upsertCertificate(studentId, missionTitle, parseFloat(localPurity));
    } catch (error) {
      console.error("Database save error:", error);
    }
  };

  useEffect(() => {
    if (status === "verification" && finalConc === null) {
      const yieldMultiplier = missionId === 'A' ? 0.4 : 0.18;

      const isMissionBManual = missionId === 'B' && step1Method === 'manual';
      const isMissionAProtK = missionId === 'A' && step1Method === 'enzymatic' && step2Mixed && protKIncubationOK;

      const disruptionFailed = (missionId === 'A' && !isMissionAProtK) || (missionId === 'B' && step1Method !== 'manual');
      const lysisFailed = !step3Mixed || stepVolumes.lysis === 0;
      const elutionFailed = elutionVolume === 0;
      const bindingFailed = stepVolumes.binding === 0;

      let localYield = 0, localConc = 0, localPurity = "0.00";

      if (disruptionFailed || lysisFailed || elutionFailed || bindingFailed) {
        localYield = 0;
        localConc = 0;
        localPurity = "0.00";
      } else {
        let yieldPenalty = 1.0;
        if (missedSpins > 0) yieldPenalty *= 0.1;
        if (protocolAdherenceCompromised) yieldPenalty *= 0.7;

        localYield = parseFloat((sampleMass * yieldMultiplier * yieldPenalty).toFixed(2));
        localConc = parseFloat(((localYield * 1000) / elutionVolume).toFixed(1));

        let purityScore = 1.88;
        if (missedSpins > 0) purityScore -= 0.5;
        if (!isMissionBManual && !step2Mixed) purityScore -= 0.4;
        if (!step3Mixed) purityScore -= 0.4;

        localPurity = Math.max(0.4, purityScore).toFixed(2);
      }

      setYieldUg(localYield);
      setFinalConc(localConc);
      setA260_280(localPurity);
    }
  }, [status, finalConc, missionId, step1Method, step2Mixed, protKIncubationOK, step3Mixed, stepVolumes, elutionVolume, missedSpins, protocolAdherenceCompromised, sampleMass]);

  const isFail = status === "fail" || !finalConc || finalConc <= 0;
  const isSheared = missedSpins > 0;
  const isFaint = !finalConc || finalConc < 100;

  return (
    <div className="min-h-screen text-slate-100 font-sans bg-[#0f172a]">
      {console.log('Rendering App, screen state:', screen)}

      {showClassCodePrompt && (
        <ClassCodePrompt
          onComplete={() => {
            localStorage.setItem('biosim_class_prompt_shown', 'true');
            setShowClassCodePrompt(false);
            setScreen("welcome");
          }}
          onJoinMission={(techniqueId, missionId) => {
            if (techniqueId === 'PCR') {
              setSelectedMissionId(missionId);
              setShowPCRModal(true);
            } else {
              startMission(techniqueId, missionId);
            }
          }}
        />
      )}
      {showManual && <LabManualOverlay onClose={() => setShowManual(false)} />}
      {showProtocol && <ProtocolBookOverlay onClose={() => setShowProtocol(false)} />}
      {showProtocolGuide && <ProtocolGuideOverlay onClose={() => setShowProtocolGuide(false)} missionId={missionId} />}
      {showReadinessModal && <ReadinessOverlay onClose={() => setShowReadinessModal(false)} />}
      {showProtocolOverview && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full py-8">
            <ProtocolOverview
              missionId={selectedMissionId}
              onBack={() => setShowProtocolOverview(false)}
              onStartMission={() => {
                setShowProtocolOverview(false);
                setShowPCRModal(true);
              }}
            />
          </div>
        </div>
      )}
      {showPCRModal && <PCRModule onClose={() => setShowPCRModal(false)} onComplete={() => setShowPCRModal(false)} onBackToLibrary={() => { setShowPCRModal(false); setScreen("welcome"); }} missionId={selectedMissionId} />}
      {showBioPopup && <BiologicalPopup type={showBioPopup} onClose={() => setShowBioPopup(null)} />}

      <div className="px-4">
        <main>
          {screen === "welcome" && (
            <div className="space-y-12 animate-in fade-in py-8">
              <section className="text-center space-y-6 max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-black text-slate-50 uppercase tracking-tighter">
                  Practice Lab Protocols Before Your First Real Experiment
                </h1>

                <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  Built for students who lack equipment access—fail safely,
                  learn consequences, build confidence before touching real reagents.
                </p>

                <div className="bg-emerald-600/20 border border-emerald-400/30 p-4 rounded-2xl">
                  <p className="text-white font-bold text-lg flex items-center justify-center gap-6 flex-wrap">
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-400">✅</span> Free to Use
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-400">✅</span> No Download Required
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-400">✅</span> Works on Any Device
                    </span>
                  </p>
                </div>
                <div className="bg-gradient-to-r from-emerald-900/20 to-indigo-900/20 border-l-4 border-emerald-500 rounded-xl p-4 mx-auto max-w-4xl my-12 text-center">
  <h3 className="text-emerald-400 text-xl font-semibold mb-1">
    🚀 Practice & Learn
  </h3>
  <p className="text-slate-300 text-base leading-relaxed">
    Make mistakes safely. Get instant feedback. Build confidence. 
    Start with <strong className="text-emerald-400 font-semibold">DNA Extraction (15 mins)</strong>. More techniques soon.
  </p>
</div>
                <button
                  onClick={() => setScreen("categories")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-black uppercase text-lg transition-all border-0 cursor-pointer"
                >
                  Start Practicing Now
                </button>

                
                <section className="max-w-4xl mx-auto space-y-6">
                  <h3 className="text-2xl font-black text-slate-50 uppercase text-center mb-8">
                    Choose Your Learning Path
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                      onClick={() => setShowClassCodePrompt(true)}
                      className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border-2 border-emerald-500/50 p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform hover:border-emerald-400"
                    >
                      <div className="bg-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <GraduationCap size={28} className="text-white" />
                      </div>
                      <h4 className="text-white font-black text-xl mb-2">University Student</h4>
                      <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                        Join your instructor's class. Enter code to sync with your faculty dashboard.
                      </p>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mt-4">
                        <span>Enter Class Code</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>

                    <div
                      onClick={() => setScreen("categories")}
                      className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 border-2 border-indigo-500/50 p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform hover:border-indigo-400"
                    >
                      <div className="bg-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <Target size={28} className="text-white" />
                      </div>
                      <h4 className="text-white font-black text-xl mb-2">Independent Learner</h4>
                      <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                        Master lab techniques at your own pace. Build your digital lab resume.
                      </p>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mt-4">
                        <span>Start Learning</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>

                    <div
                      onClick={() => setScreen("categories")}
                      className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-2 border-amber-500/50 p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform hover:border-amber-400"
                    >
                      <div className="bg-amber-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <Sparkles size={28} className="text-white" />
                      </div>
                      <h4 className="text-white font-black text-xl mb-2">Pre-university</h4>
                      <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                        Get a head start on college science. Explore molecular biology basics.
                      </p>
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mt-4">
                        <span>Start Learning</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl">
                    <p className="text-slate-400 text-sm text-center leading-relaxed">
                      All paths access the same high-quality simulations. Choose based on whether you need instructor tracking or prefer independent progress monitoring.
                    </p>
                  </div>
                </section>

                <section className="max-w-4xl mx-auto py-3">
                  <div
                    onClick={() => navigate('/leaderboard')}
                    className="bg-gradient-to-r from-amber-900/40 via-yellow-900/30 to-amber-900/40 border-2 border-amber-400/60 rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-transform hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-500/20"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-3 rounded-2xl shadow-xl">
                          <Trophy size={28} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white mb-1.5 flex items-center gap-3">
                            Global Rankings
                            <span className="text-xs bg-amber-500 px-2.5 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
                          </h3>
                          <p className="text-slate-300 text-sm leading-snug">
                            Compete with learners worldwide. Track your progress. Build verifiable competency records. From students to researchers—see where you rank.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-amber-400 font-black text-base">
                        <span>View Rankings</span>
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </section>

                <ContactSection />
              </section>

              <section className="space-y-8">
                <TechniqueLibrary
                  data={TECHNIQUE_LIBRARY}
                  onTechniqueClick={(tech) => {
                    if (tech.id === "DNA_EXT") setScreen("missions");
                    if (tech.id === "PCR") setShowPCRModal(true);
                  }}
                />
              </section>
            </div>
          )}

          {screen === "categories" && (
            <div className="animate-in slide-in-from-right">
              <TechniqueCategories
                onSelectCategory={(categoryId) => {
                  setSelectedCategory(categoryId);
                  setScreen("category-techniques");
                }}
              />
            </div>
          )}

          {screen === "category-techniques" && selectedCategory && (
            <div className="animate-in slide-in-from-right">
              <CategoryTechniques
                categoryId={selectedCategory}
                onBack={() => setScreen("categories")}
                onSelectTechnique={(techniqueId) => {
                  setTechniqueId(techniqueId);
                  if (techniqueId === "pcr") {
                    setScreen("pcr-missions");
                  } else if (techniqueId === "dna-extraction") {
                    setScreen("missions");
                  }
                }}
              />
            </div>
          )}

          {screen === "pcr-missions" && (
            <div className="animate-in slide-in-from-right">
              <PCRMissions
                onBack={() => setScreen("category-techniques")}
                onSelectMission={(missionId) => {
                  setSelectedMissionId(missionId);
                  setShowProtocolOverview(true);
                }}
              />
            </div>
          )}

          {screen === "missions" && (
            <div className="space-y-8 animate-in slide-in-from-right">
              <button onClick={() => setScreen("welcome")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm">
                <ChevronRight size={16} className="rotate-180" /> Back to Library
              </button>

              <section className="space-y-6">
                <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter flex items-center gap-3"><Dna size={28} className="text-indigo-400" /> DNA Extraction Missions</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(MISSIONS_DATA.DNA_EXT).map(([key, mission]) => (
                    <div key={key} className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all group">
                      <div className="p-8 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-50 uppercase tracking-tight">{mission.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{mission.brief}</p>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                          <p className="text-xs text-slate-400 font-mono">{mission.summary}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                          <div className="text-left">
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1">Budget</p>
                            <p className="text-lg font-black text-amber-400 font-mono">{mission.budget} BC</p>
                          </div>
                          <button onClick={() => startMission("DNA_EXT", key)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black uppercase text-sm transition-all group-hover:scale-105 cursor-pointer border-0">
                            Start Mission
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {screen === "briefing" && (
            <div className="space-y-8 animate-in slide-in-from-right">
              <div className="bg-gradient-to-br from-indigo-900/20 to-slate-800 border border-indigo-500/30 p-8 rounded-3xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <AlertCircle size={32} className="text-indigo-400" />
                    <div>
                      <h2 className="text-2xl font-black text-slate-50 uppercase tracking-tight">{MISSIONS_DATA[techniqueId]?.[missionId]?.title}</h2>
                      <p className="text-sm text-slate-400 mt-1">{MISSIONS_DATA[techniqueId]?.[missionId]?.brief}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl">
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-2">Target Range</p>
                      <p className="text-sm text-white font-mono">{MISSIONS_DATA[techniqueId]?.[missionId]?.summary}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl">
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-2">Budget</p>
                      <p className="text-2xl text-amber-400 font-black font-mono">{coins} BC</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <h3 className="text-white font-bold uppercase text-sm mb-4 text-center">Select Difficulty Mode</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setDifficultyMode("learning")}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${difficultyMode === "learning" ? "border-emerald-500 bg-emerald-900/20" : "border-slate-700 bg-slate-900 hover:border-indigo-500/50"}`}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl">🎓</div>
                      <h4 className="text-white font-black uppercase text-sm">Learning Mode</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Real-time feedback and hints as you work through the protocol</p>
                      {difficultyMode === "learning" && <p className="text-emerald-400 text-xs font-bold uppercase">Selected</p>}
                    </div>
                  </button>
                  <button
                    onClick={() => setDifficultyMode("challenge")}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${difficultyMode === "challenge" ? "border-amber-500 bg-amber-900/20" : "border-slate-700 bg-slate-900 hover:border-indigo-500/50"}`}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl">🏆</div>
                      <h4 className="text-white font-black uppercase text-sm">Challenge Mode</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Minimal feedback during protocol. All results revealed at the end</p>
                      {difficultyMode === "challenge" && <p className="text-amber-400 text-xs font-bold uppercase">Selected</p>}
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setScreen("procurement")} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-wider transition-all cursor-pointer border-0 text-lg">
                  Proceed to Procurement
                </button>
              </div>
            </div>
          )}

          {screen === "procurement" && (
            <div className="space-y-8 animate-in slide-in-from-right">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-50 uppercase tracking-tight">Laboratory Procurement</h2>
                  <p className="text-sm text-slate-400 mt-1">Laboratory procurement is a core biotech skill that teaches you how to choose the right reagents and equipment, manage budgets, and prioritise resources for real-world experiments.</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1">Available Budget</p>
                  <p className="text-3xl text-amber-400 font-black font-mono">{coins} BC</p>
                </div>
              </div>

              <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
                <button onClick={() => setProcureTab("kits")} className={`px-6 py-3 font-bold uppercase text-sm transition-all border-0 cursor-pointer whitespace-nowrap ${procureTab === "kits" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-slate-300"}`}>
                  Kits
                </button>
                <button onClick={() => setProcureTab("design-tools")} className={`px-6 py-3 font-bold uppercase text-sm transition-all border-0 cursor-pointer whitespace-nowrap ${procureTab === "design-tools" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-slate-300"}`}>
                  Design Tools
                </button>
                <button onClick={() => setProcureTab("tools")} className={`px-6 py-3 font-bold uppercase text-sm transition-all border-0 cursor-pointer whitespace-nowrap ${procureTab === "tools" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-slate-300"}`}>
                  Equipment & Reagents
                </button>
                <button onClick={() => setProcureTab("consumables")} className={`px-6 py-3 font-bold uppercase text-sm transition-all border-0 cursor-pointer whitespace-nowrap ${procureTab === "consumables" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-slate-300"}`}>
                  Consumables/PPE
                </button>
              </div>

              {procureTab === "kits" && (
                <div className="grid grid-cols-1 gap-4">
                  {kits_list.map((kit) => {
                    const owned = has(kit.id);
                    const canAfford = coins >= kit.cost;
                    return (
                      <div key={kit.id} className={`bg-slate-800 border ${owned ? "border-emerald-500/50" : "border-slate-700"} p-6 rounded-2xl flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                          <Box size={32} className={owned ? "text-emerald-400" : "text-slate-600"} />
                          <div>
                            <h3 className="text-white font-bold">{kit.name}</h3>
                            <p className="text-xs text-slate-400 mt-1">{kit.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-black text-amber-400 font-mono">{kit.cost} BC</p>
                          {owned ? (
                            <button onClick={() => { setCoins(coins + kit.cost); setInventory(inventory.filter(i => i !== kit.id)); addLog(`Deselected: ${kit.name}. Refunded ${kit.cost} BC`, 'info'); }} className="px-6 py-2 rounded-lg font-bold uppercase text-sm transition-all cursor-pointer border-0 bg-rose-600 hover:bg-rose-500 text-white">
                              Deselect
                            </button>
                          ) : (
                            <button onClick={() => { if (canAfford) { setCoins(coins - kit.cost); setInventory([...inventory, kit.id]); addLog(`Purchased: ${kit.name}`, 'success'); }}} disabled={!canAfford} className={`px-6 py-2 rounded-lg font-bold uppercase text-sm transition-all cursor-pointer border-0 ${canAfford ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
                              Purchase
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {procureTab === "tools" && (
                <div className="grid grid-cols-1 gap-4">
                  {tools_list.map((tool) => {
                    const owned = has(tool.id);
                    const canAfford = coins >= tool.cost;
                    const isFree = tool.cost === 0;
                    return (
                      <div key={tool.id} className={`bg-slate-800 border ${owned ? "border-emerald-500/50" : "border-slate-700"} p-6 rounded-2xl flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                          {tool.id === "centrifuge" && <RefreshCw size={28} className={owned ? "text-emerald-400" : "text-slate-600"} />}
                          {tool.id === "nanodrop" && <Activity size={28} className={owned ? "text-emerald-400" : "text-slate-600"} />}
                          {tool.id === "incubator" && <Thermometer size={28} className={owned ? "text-emerald-400" : "text-slate-600"} />}
                          {!["centrifuge", "nanodrop", "incubator"].includes(tool.id) && <Box size={28} className={owned ? "text-emerald-400" : "text-slate-600"} />}
                          <div>
                            <h3 className="text-white font-bold">{tool.name}</h3>
                            <p className="text-xs text-slate-400 mt-1">{tool.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-black text-amber-400 font-mono">{isFree ? "FREE" : `${tool.cost} BC`}</p>
                          {owned ? (
                            <button onClick={() => { if (!isFree) setCoins(coins + tool.cost); setInventory(inventory.filter(i => i !== tool.id)); addLog(`Deselected: ${tool.name}${!isFree ? `. Refunded ${tool.cost} BC` : ''}`, 'info'); }} className="px-6 py-2 rounded-lg font-bold uppercase text-sm transition-all cursor-pointer border-0 bg-rose-600 hover:bg-rose-500 text-white">
                              Deselect
                            </button>
                          ) : (
                            <button onClick={() => { if (isFree || canAfford) { if (!isFree) setCoins(coins - tool.cost); setInventory([...inventory, tool.id]); addLog(`Acquired: ${tool.name}`, 'success'); }}} disabled={!isFree && !canAfford} className={`px-6 py-2 rounded-lg font-bold uppercase text-sm transition-all cursor-pointer border-0 ${isFree || canAfford ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
                              {isFree ? "Add to Bench" : "Purchase"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {procureTab === "consumables" && (
                <div className="grid grid-cols-1 gap-4">
                  {consumables_ppe_list.map((item) => {
                    const owned = has(item.id);
                    const canAfford = coins >= item.cost;
                    const isFree = item.cost === 0;
                    return (
                      <div key={item.id} className={`bg-slate-800 border ${owned ? "border-emerald-500/50" : "border-slate-700"} p-6 rounded-2xl flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                          {item.id === "lab_coat" && <Shirt size={28} className={owned ? "text-emerald-400" : "text-slate-600"} />}
                          {item.id === "safety_goggles" && <Glasses size={28} className={owned ? "text-emerald-400" : "text-slate-600"} />}
                          {!["lab_coat", "safety_goggles"].includes(item.id) && <Box size={28} className={owned ? "text-emerald-400" : "text-slate-600"} />}
                          <div>
                            <h3 className="text-white font-bold">{item.name}</h3>
                            <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-black text-amber-400 font-mono">{isFree ? "FREE" : `${item.cost} BC`}</p>
                          {owned ? (
                            <button onClick={() => { if (!isFree) setCoins(coins + item.cost); setInventory(inventory.filter(i => i !== item.id)); addLog(`Deselected: ${item.name}${!isFree ? `. Refunded ${item.cost} BC` : ''}`, 'info'); }} className="px-6 py-2 rounded-lg font-bold uppercase text-sm transition-all cursor-pointer border-0 bg-rose-600 hover:bg-rose-500 text-white">
                              Deselect
                            </button>
                          ) : (
                            <button onClick={() => { if (isFree || canAfford) { if (!isFree) setCoins(coins - item.cost); setInventory([...inventory, item.id]); addLog(`Acquired: ${item.name}`, 'success'); }}} disabled={!isFree && !canAfford} className={`px-6 py-2 rounded-lg font-bold uppercase text-sm transition-all cursor-pointer border-0 ${isFree || canAfford ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
                              {isFree ? "Add to Bench" : "Purchase"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {procureTab === "design-tools" && (
                <div className="space-y-6">
                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                    <p className="text-sm text-blue-300 font-bold mb-2">ℹ️ Computational Primer Design</p>
                    <p className="text-xs text-blue-200 leading-relaxed">
                      Use these external tools to design primers for your target gene. Note: In Primer3, primers are labeled <span className="font-bold">Left and Right</span>; in NCBI Primer-BLAST, they are labeled <span className="font-bold">Forward and Reverse</span>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {design_tools_list.map((tool) => (
                      <div key={tool.id} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Computer size={32} className="text-emerald-400" />
                            <div>
                              <h3 className="text-white font-bold">{tool.name}</h3>
                              <p className="text-xs text-slate-400 mt-1">{tool.desc}</p>
                              <p className="text-xs text-blue-400 mt-2 italic">{tool.note}</p>
                            </div>
                          </div>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold uppercase text-sm transition-all cursor-pointer border-0 no-underline"
                          >
                            Open Tool
                          </a>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
                          <p className="text-xs text-slate-400 font-mono break-all">{tool.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={() => setScreen("briefing")} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-4 px-6 rounded-2xl font-bold uppercase transition-all cursor-pointer border-0">
                  Back
                </button>
                <button onClick={() => { setScreen("lab"); addLog("Protocol initiated. Refer to the Manual and Protocol buttons in the header.", "info"); }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-wider transition-all cursor-pointer border-0">
                  Enter Lab
                </button>
              </div>
            </div>
          )}

          {screen === "lab" && status === "idle" && currentStep && (
            <div className="space-y-8 animate-in fade-in">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-slate-50 uppercase tracking-tight">Step {protocolIndex + 1}: {currentStep.title}</h2>
                  <div className="flex items-center gap-3">
                    {difficultyMode === "challenge" && (
                      <div className="px-3 py-1 bg-amber-900/30 border border-amber-500/30 rounded-lg">
                        <span className="text-[10px] text-amber-400 font-bold uppercase">🏆 Challenge</span>
                      </div>
                    )}
                    <button
                      onClick={() => setShowProtocolGuide(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border-0 flex items-center gap-2"
                    >
                      <BookOpen size={14} />
                      Protocol
                    </button>
                    <button onClick={() => { setScreen("procurement"); addLog("Returned to procurement. Biological state preserved.", "info"); }} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border-0">
                      Add Equipment
                    </button>
                    <span className="text-xs text-slate-500 font-mono">Progress: {protocolIndex + 1}/{protocolSteps.length}</span>
                  </div>
                </div>
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl mb-4">
                  <p className="text-sm text-indigo-300 font-bold mb-2">{currentStep.prompt}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{currentStep.science}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative min-h-[400px]">
                    <LabBenchVisual inventory={inventory} />
                    <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2"><FlaskConical size={16} /> {showGrindingSetup ? "Manual Grinding" : (currentStep.title === "Binding/Column Load" || currentStep.title === "Wash Stage") ? "Filter Column" : "Sample Tube"}</h3>
                    {showGrindingSetup ? (
                      <div className="flex justify-center items-center min-h-[300px]">
                        <div className="relative">
                          <svg width="200" height="250" viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="100" cy="180" rx="60" ry="15" fill="#475569" opacity="0.6" />
                            <path d="M50 180 Q40 150 45 120 L155 120 Q160 150 150 180 Z" fill="#64748b" stroke="#475569" strokeWidth="2" />
                            {isGrinding && (
                              <>
                                <circle cx="70" cy="140" r="3" fill="#60a5fa" opacity="0.7" className="animate-ping" />
                                <circle cx="90" cy="150" r="2" fill="#60a5fa" opacity="0.6" className="animate-ping" style={{animationDelay: '0.2s'}} />
                                <circle cx="110" cy="145" r="2.5" fill="#60a5fa" opacity="0.8" className="animate-ping" style={{animationDelay: '0.4s'}} />
                                <circle cx="130" cy="155" r="2" fill="#60a5fa" opacity="0.7" className="animate-ping" style={{animationDelay: '0.1s'}} />
                              </>
                            )}
                            <rect x="85" y="140" width="30" height="35" rx="2" fill="#1e293b" opacity="0.8" />
                            <text x="100" y="160" textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="bold">LN₂ GAS</text>
                            <path
                              d="M80 60 L100 140 L120 60"
                              fill="#94a3b8"
                              stroke="#64748b"
                              strokeWidth="2"
                              className={isGrinding ? "animate-pulse" : ""}
                              style={{
                                transform: isGrinding ? 'translateY(10px)' : 'translateY(0)',
                                transition: 'transform 0.3s ease-in-out'
                              }}
                            />
                            <ellipse cx="100" cy="55" rx="25" ry="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                          </svg>
                          <p className="text-center text-xs text-emerald-400 font-bold mt-2 animate-pulse">
                            {isGrinding ? "Grinding tissue..." : "Adding liquid nitrogen..."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex justify-center transition-all duration-500 ${tubeAnimating ? 'opacity-20 scale-75' : 'opacity-100 scale-100'}`}>
                        {(currentStep.title === "Binding/Column Load" || currentStep.title === "Wash Stage") ? (
                          <FilterColumnVisual
                            volume={bufferVolume + volumeAddedThisStep}
                            hasDNA={currentStep.title === "Wash Stage"}
                            showSeparation={showPhaseSeparation}
                          />
                        ) : currentStep.title === "Elution" ? (
                          <TubeWithFilterColumnVisual
                            volume={bufferVolume + volumeAddedThisStep}
                            hasDNA={true}
                            stepTitle={currentStep.title}
                          />
                        ) : (
                          <TubeVisual
                            volume={bufferVolume + volumeAddedThisStep}
                            solidMass={currentSolidMass}
                            hasPellet={pelletVisible}
                            showSeparation={showPhaseSeparation}
                            onSupernatantClick={showPhaseSeparation ? () => setShowBioPopup("supernatant") : null}
                            onPelletClick={showPhaseSeparation ? () => setShowBioPopup("pellet") : null}
                          />
                        )}
                      </div>
                    )}
                    <div className="text-center text-xs text-slate-400 font-mono space-y-1">
                      {currentSolidMass > 0 && (bufferVolume + volumeAddedThisStep === 0) ? (
                        <p className="text-sm font-bold">{currentSolidMass} mg tissue</p>
                      ) : (
                        <p className="text-sm font-bold">{bufferVolume + volumeAddedThisStep} µl</p>
                      )}
                    </div>

                    {activeTool === 'pipette' && pipetteVolume && !needsMixing && !hasDispensedThisStep && (
                      <div
                        className="absolute top-8 right-12 p-4 rounded-3xl shadow-2xl border-2 bg-indigo-600 border-indigo-400 animate-bounce cursor-pointer hover:bg-indigo-500 hover:scale-110 transition-all shadow-indigo-500/30"
                        style={{
                          animation: 'bounce 1s infinite, drip 2s ease-in-out infinite'
                        }}
                        onClick={() => {
                          if (!hasReagentForStep(currentStep.reagentRequired)) {
                            addLog(`Aspiration Error: Missing ${currentStep.reagentRequired} reagent.`, "error");
                            setMissedReagents(missedReagents + 1);
                            setPipetteVolume(null);
                            setActiveTool(null);
                            return;
                          }
                          if (currentStep.isElution) {
                            setElutionVolume(pipetteVolume);
                          }
                          setVolumeAddedThisStep(pipetteVolume);
                          setStepVolumes(prev => {
                            const title = currentStep?.title;
                            if (title === "Proteinase K Digestion") return { ...prev, protK: pipetteVolume };
                            if (title === "Lysis Phase") return { ...prev, lysis: pipetteVolume };
                            if (title === "Binding/Column Load") return { ...prev, binding: pipetteVolume };
                            if (title === "Wash Stage") return { ...prev, wash: pipetteVolume };
                            if (title === "Elution") return { ...prev, elution: pipetteVolume };
                            return prev;
                          });
                          addLog(`Dispensed ${pipetteVolume}µL`, "success");
                          if (currentStep.targetVolume && Math.abs(pipetteVolume - currentStep.targetVolume) > 50) {
                            setStoichiometryError(true);
                            addLog("Warning: Volume deviates significantly from protocol.", "error");
                          }
                          setPipetteVolume(null);
                          setActiveTool(null);
                          if (currentStep.isElution) {
                            addLog("Elution buffer added. Wait 1 minute for DNA to elute from the membrane.", "info");
                            setTimeout(() => {
                              setHasDispensedThisStep(true);
                              addLog("Elution wait complete. Proceed to centrifugation.", "success");
                            }, 1000);
                          } else if (currentStep.requiresMixing) {
                            setNeedsMixing(true);
                            addLog("Click pipette above tube to mix solution.", "info");
                          } else {
                            setHasDispensedThisStep(true);
                            addLog("Reagent added. Ready for next step.", "success");
                          }
                        }}
                      >
                        <Pipette size={28} className="text-white" />
                        <span className="block text-[8px] font-black text-center mt-2 uppercase tracking-widest text-white">
                          Dispense
                        </span>
                      </div>
                    )}

                    {needsMixing && !hasDispensedThisStep && (
                      <div
                        className="absolute top-8 right-12 p-4 rounded-3xl shadow-2xl border-2 bg-emerald-600 border-emerald-400 cursor-pointer hover:bg-emerald-500 hover:scale-110 transition-all shadow-emerald-500/30"
                        style={{
                          animation: isMixing ? 'pulse 0.3s ease-in-out infinite' : 'bounce 1s infinite'
                        }}
                        onClick={() => {
                          setIsMixing(true);
                          addLog("Mixing solution...", "info");

                          if (currentStep.title === "Proteinase K Digestion") setStep2Mixed(true);
                          if (currentStep.title === "Lysis Phase") setStep3Mixed(true);

                          setTimeout(() => {
                            setIsMixing(false);
                            setNeedsMixing(false);
                            setHasDispensedThisStep(true);
                            addLog("Mixing complete. Solution homogenized.", "success");
                          }, 2000);
                        }}
                      >
                        <Pipette size={28} className={`text-white ${isMixing ? 'animate-pulse' : ''}`} style={{
                          animation: isMixing ? 'pulse 0.3s ease-in-out infinite' : 'none'
                        }} />
                        <span className="block text-[8px] font-black text-center mt-2 uppercase tracking-widest text-white">
                          {isMixing ? 'Mixing...' : 'Mix'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thermocycler on Bench (for Proteinase K incubation) */}
                  {currentStep?.requiresIncubation && (
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                      <ThermocyclerVisual
                        isIncubating={isIncubating}
                        hasTube={tubeInCentrifuge}
                        temperature={incubationTemp}
                        duration={currentStep?.incubationDuration}
                        onLoadTube={handleLoadTubeThermocycler}
                        onStartIncubation={handleStartIncubation}
                        onTempChange={handleTempChange}
                        canLoad={hasDispensedThisStep && !tubeInCentrifuge && !hasSpunThisStep}
                        canStart={tubeInCentrifuge && !isIncubating}
                      />
                    </div>
                  )}

                  {/* Centrifuge on Bench */}
                  {currentStep?.requiresSpin && !currentStep?.requiresIncubation && has("centrifuge") && (
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                      <CentrifugeVisual
                        isSpinning={isSpinning}
                        hasTube={tubeInCentrifuge}
                        onLoadTube={handleLoadTube}
                        onStartSpin={handleSpin}
                        canLoad={hasDispensedThisStep && !tubeInCentrifuge && !hasSpunThisStep}
                        canSpin={tubeInCentrifuge && !isSpinning}
                      />
                    </div>
                  )}

                  <BenchInventoryVisuals inventory={inventory} status={status} />
                </div>

                <div className="space-y-6">
                  {currentStep.options && protocolIndex === 0 && (
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                      <h3 className="text-sm font-bold text-white uppercase mb-4 text-center">Tissue Disruption Equipment</h3>
                      <div className="flex justify-center gap-8 mb-4">
                        <div className="flex flex-col items-center">
                          <MortarPestleVisual />
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Mortar & Pestle</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <LiquidNitrogenVisual />
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Liquid Nitrogen</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep.options && (
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase mb-4">Select Action</h3>
                      {currentStep.options.map((opt, idx) => (
                        <button key={idx} onClick={() => {
                          if (opt.ok === false) {
                            addLog(`Cannot proceed: ${opt.label} - Missing required equipment.`, "error");
                            return;
                          }

                          if (protocolIndex === 0) {
                            setStep1Method(opt.method);
                            if (missionId === 'A' && opt.method === 'manual') {
                              setProtocolAdherenceCompromised(true);
                              addLog("WARNING: For Mission A (biopsy), enzymatic digestion is required. Manual grinding compromises protocol adherence.", "error");
                            }
                            if (missionId === 'B' && opt.method === 'enzymatic') {
                              setProtocolAdherenceCompromised(true);
                              addLog("WARNING: For Mission B (cassava), manual grinding with mortar & pestle is required. Enzymatic digestion compromises protocol adherence.", "error");
                            }
                            if (opt.method === 'manual') {
                              setShowGrindingSetup(true);
                              setTimeout(() => {
                                setIsGrinding(true);
                                setTimeout(() => {
                                  setIsGrinding(false);
                                  setShowGrindingSetup(false);
                                }, 3000);
                              }, 1000);
                            }
                          }

                          addLog(opt.log, "success");
                          if (opt.triggerReset) {
                            setBufferVolume(0);
                            setVolumeAddedThisStep(0);
                          }

                          if (currentStep.requiresVolume && currentStep.requiresMixing) {
                            setProtocolIndex(protocolIndex + 1);
                            setHasDispensedThisStep(false);
                            setHasSpunThisStep(false);
                            setNeedsMixing(false);
                            setIsMixing(false);
                          } else {
                            setProtocolIndex(protocolIndex + 1);
                            setHasDispensedThisStep(false);
                            setHasSpunThisStep(false);
                            setNeedsMixing(false);
                            setIsMixing(false);
                          }
                        }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-xl font-bold uppercase transition-all cursor-pointer border-0">
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentStep.requiresVolume && (
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Pipette size={16} /> Pipette Control</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-400 mb-2 block">Select Volume (µL)</label>
                          <div className={`grid gap-2 ${currentStep.isElution ? 'grid-cols-3' : 'grid-cols-3'}`}>
                            {(currentStep.title === "Proteinase K Digestion" ? [2, 5, 10] : currentStep.isElution ? [20, 30, 50] : [100, 500, 1000]).map(v => (
                              <button
                                key={v}
                                onClick={() => {
                                  if (!hasDispensedThisStep) {
                                    const volumeToUse = v;
                                    setPipetteVolume(volumeToUse);
                                    setActiveTool('pipette');
                                    addLog(`Pipette set to ${volumeToUse}µL. Click pipette above tube to dispense.`, "info");
                                  }
                                }}
                                disabled={hasDispensedThisStep}
                                className={`py-3 rounded-lg border-2 font-bold transition-all text-sm cursor-pointer ${
                                  pipetteVolume === v && !hasDispensedThisStep
                                    ? "bg-indigo-600 text-white border-indigo-400 shadow-lg"
                                    : hasDispensedThisStep
                                    ? "bg-slate-900 text-slate-600 border-slate-700 cursor-not-allowed"
                                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-indigo-500"
                                }`}
                              >
                                {v}µL
                              </button>
                            ))}
                          </div>
                          {activeTool === 'pipette' && pipetteVolume && !hasDispensedThisStep && (
                            <p className="text-xs text-indigo-400 mt-3 animate-pulse font-bold text-center">
                              Click the bouncing pipette above the tube to dispense {pipetteVolume}µL
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {((currentStep.requiresVolume && hasDispensedThisStep) || (currentStep.options)) && (currentStep.requiresSpin || currentStep.requiresIncubation ? hasSpunThisStep : true) && (currentStep.requiresMixing ? (currentStep.title === "Proteinase K Digestion" ? step2Mixed : currentStep.title === "Lysis Phase" ? step3Mixed : true) : true) && (
                    <button onClick={() => {
                      if (currentStep.requiresSpin && !hasSpunThisStep) {
                        setMissedSpins(missedSpins + 1);
                        addLog("Critical Error: Centrifugation step bypassed!", "error");
                        setProtocolAdherenceCompromised(true);
                      }
                      if (currentStep.requiresVolume && !hasDispensedThisStep) {
                        addLog("Error: No reagent added.", "error");
                        setMissedReagents(missedReagents + 1);
                        setProtocolAdherenceCompromised(true);
                      }
                      if (currentStep.requiresMixing) {
                        let mixedThisStep = false;
                        if (currentStep.title === "Proteinase K Digestion") mixedThisStep = step2Mixed;
                        if (currentStep.title === "Lysis Phase") mixedThisStep = step3Mixed;

                        if (!mixedThisStep) {
                          addLog("Critical Error: Mixing step bypassed! The sample must be mixed after adding reagent.", "error");
                          setProtocolAdherenceCompromised(true);
                        }
                      }
                      if (currentStep.targetVolume && Math.abs(volumeAddedThisStep - currentStep.targetVolume) > (currentStep.targetVolume < 10 ? 2 : 100)) {
                        addLog(`Volume Error: Target is ${currentStep.targetVolume}µL but ${volumeAddedThisStep}µL was used. Significant deviation affects protocol.`, "error");
                        setProtocolAdherenceCompromised(true);
                      }

                      if (protocolIndex === protocolSteps.length - 1) {
                        setCanNanodropNow(true);
                        setStatus("verification");
                      } else {
                        setBufferVolume(bufferVolume + volumeAddedThisStep);
                        setVolumeAddedThisStep(0);
                        setProtocolIndex(protocolIndex + 1);
                        setHasDispensedThisStep(false);
                        setHasSpunThisStep(false);
                        setNeedsMixing(false);
                        setIsMixing(false);
                      }
                    }} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 px-6 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer border-0">
                      Continue to Next Step
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl max-h-40 overflow-y-auto">
                <h3 className="text-xs font-bold text-white uppercase mb-3 flex items-center gap-2"><Terminal size={14} /> Lab Log {difficultyMode === "challenge" && <span className="text-amber-400 text-[9px] font-normal">(Challenge Mode)</span>}</h3>
                <div className="space-y-1 font-mono text-xs">
                  {difficultyMode === "challenge" ? (
                    <p className="text-slate-500 italic">Challenge mode active. Detailed feedback will be revealed after protocol completion.</p>
                  ) : (
                    logs.map((log, i) => (
                      <p key={i} className={log.type === "error" ? "text-rose-400" : log.type === "success" ? "text-emerald-400" : "text-slate-400"}>
                        {log.msg}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {screen === "lab" && status === "verification" && !showQuant && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowProtocolGuide(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border-0 flex items-center gap-2"
                >
                  <BookOpen size={14} />
                  Protocol
                </button>
              </div>
              <div className="bg-gradient-to-br from-amber-900/20 to-slate-800 border border-amber-500/30 p-8 rounded-3xl text-center">
                <Award size={48} className="mx-auto text-amber-400 mb-4" />
                <h2 className="text-2xl font-black text-slate-50 uppercase tracking-tight mb-2">DNA Extraction Complete</h2>
                <p className="text-slate-400">Verify your sample quality before analyzing results</p>
              </div>

              {missionVerification && (
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                  <h3 className="text-sm font-bold text-amber-400 uppercase mb-4">Required Verification</h3>
                  <p className="text-sm text-slate-400 mb-6">{missionVerification.label}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {missionVerification.options.includes(VERIFICATION.NANODROP) && (
                      <div className={`border ${verificationDone.nanodrop ? "border-emerald-500/50 bg-emerald-900/20" : "border-slate-700 bg-slate-900"} p-6 rounded-2xl`}>
                        <div className="text-center mb-4">
                          <NanodropVisualComp step={ndStep} measured={verificationDone.nanodrop} hasDNA={finalConc > 0} purityScore={a260_280} />
                        </div>
                        {!verificationDone.nanodrop ? (
                          <div className="space-y-3">
                            <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-lg mb-3">
                              <p className="text-[10px] text-indigo-300 leading-relaxed">
                                NanoDrop uses UV light (260nm) to measure DNA concentration and purity (A260/280 ratio). Clean pedestal, blank with buffer, then measure 1µL sample.
                              </p>
                            </div>
                            {ndStep === "idle" && (
                              <button onClick={() => setNdStep("open")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer">
                                Open Arm
                              </button>
                            )}
                            {ndStep === "open" && (
                              <button onClick={() => setNdStep("clean")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer">
                                Clean Pedestal
                              </button>
                            )}
                            {ndStep === "clean" && (
                              <button onClick={() => setNdStep("blank")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer">
                                Blank with Buffer
                              </button>
                            )}
                            {ndStep === "blank" && (
                              <button onClick={() => setNdStep("load")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer">
                                Load 1µL DNA
                              </button>
                            )}
                            {ndStep === "load" && (
                              <button onClick={() => { setNdStep("measure"); setTimeout(() => { setNdStep("complete"); setVerificationDone({ ...verificationDone, nanodrop: true }); }, 2000); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer">
                                Measure
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-emerald-400 text-sm font-bold text-center uppercase">Nanodrop Complete</p>
                        )}
                      </div>
                    )}

                    {missionVerification.options.includes(VERIFICATION.GEL) && (
                      <div className={`border ${verificationDone.gel ? "border-emerald-500/50 bg-emerald-900/20" : "border-slate-700 bg-slate-900"} p-6 rounded-2xl`}>
                        <h3 className="text-sm font-bold text-amber-400 uppercase mb-4 text-center">Agarose Gel Electrophoresis</h3>
                        <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-lg mb-4">
                          <p className="text-[9px] text-indigo-300 mb-2 font-bold uppercase">Appearance & Interpretation</p>
                          <ul className="text-[9px] text-indigo-300 leading-relaxed space-y-1">
                            <li><span className="text-emerald-400">•</span> Sharp & straight bands: Ideal result; well-separated DNA fragments</li>
                            <li><span className="text-amber-400">•</span> Thick bands: High DNA concentration</li>
                            <li><span className="text-slate-400">•</span> Faint/thin bands: Low DNA concentration</li>
                            <li><span className="text-rose-400">•</span> Smeared bands: Poor resolution (degraded DNA or buffer/protocol issues)</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-center gap-4">
                            <div className="flex flex-col items-center">
                              <GelLaneComp bands={[{y:20,h:2,w:20},{y:50,h:2,w:20},{y:80,h:2,w:20},{y:110,h:2,w:20}]} blank={false} />
                              <span className="text-[9px] text-slate-500 mt-2 font-mono">Ladder</span>
                            </div>
                            {gelStep !== "idle" && (
                              <div className="flex flex-col items-center">
                                <GelLaneComp smear={isSheared} faint={isFaint} bands={isFail ? [] : [{y:60,h:5,a:0.95,w:26}]} />
                                <span className="text-[9px] text-slate-500 mt-2 font-mono">Sample</span>
                              </div>
                            )}
                          </div>
                          {verificationDone.gel && !isFail && (
                            <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg">
                              <p className="text-[10px] text-emerald-300 font-mono text-center">
                                {isSheared ? "DNA visible but fragmented (shearing detected)" : isFaint ? "Faint band - low yield" : "Sharp high-MW band - excellent quality"}
                              </p>
                            </div>
                          )}
                          {verificationDone.gel && isFail && (
                            <div className="bg-rose-900/20 border border-rose-500/30 p-3 rounded-lg">
                              <p className="text-[10px] text-rose-300 font-mono text-center">
                                No DNA band detected. Extraction failed.
                              </p>
                            </div>
                          )}
                        </div>
                        {!verificationDone.gel ? (
                          <div className="space-y-3 mt-4">
                            {gelStep === "idle" && (
                              <button onClick={() => setGelStep("running")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer">
                                Load Gel
                              </button>
                            )}
                            {gelStep === "running" && (
                              <button onClick={() => { setGelStep("staining"); setTimeout(() => { setGelStep("complete"); setVerificationDone({ ...verificationDone, gel: true }); }, 2000); }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer animate-pulse">
                                Run Electrophoresis
                              </button>
                            )}
                            {gelStep === "staining" && (
                              <p className="text-amber-400 text-sm font-bold text-center uppercase animate-pulse">Staining...</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-emerald-400 text-sm font-bold text-center uppercase mt-4">Gel Complete</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button onClick={finalizeCalculations} disabled={!isVerificationSatisfied} className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider transition-all cursor-pointer border-0 ${isVerificationSatisfied ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
                Analyze Results
              </button>
            </div>
          )}

          {screen === "lab" && showQuant && (
            <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
              <div className={`bg-gradient-to-br ${status === "mastery" ? "from-emerald-900/20 to-slate-800 border-emerald-500/30" : "from-rose-900/20 to-slate-800 border-rose-500/30"} border p-6 rounded-3xl text-center space-y-5`}>
                {status === "mastery" && <MasteryBadge />}
                {status !== "mastery" && (
                  <div className="flex flex-col items-center">
                    <AlertCircle size={64} className="text-rose-500 mb-4" />
                    <h3 className="text-2xl font-black text-slate-50 uppercase tracking-tight">Mission Failed</h3>
                    <p className="text-sm text-slate-400 mt-2">{failReason}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-1">Concentration</p>
                    <p className="text-2xl font-black text-white font-mono">{finalConc}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">ng/µL</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-1">Purity (260/280)</p>
                    <p className="text-2xl font-black text-white font-mono">{a260_280}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{parseFloat(a260_280) >= 1.7 ? "Acceptable" : "Contaminated"}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-1">Total Yield</p>
                    <p className="text-2xl font-black text-white font-mono">{yieldUg}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">µg</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 text-left">
                  <h4 className="text-xs font-bold text-white uppercase mb-2">Protocol Summary</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono">
                    <div><span className="text-slate-500">Elution Volume:</span> <span className="text-white">{elutionVolume}µL</span></div>
                    <div><span className="text-slate-500">Missed Spins:</span> <span className={missedSpins > 0 ? "text-rose-400" : "text-emerald-400"}>{missedSpins}</span></div>
                    <div><span className="text-slate-500">Missed Reagents:</span> <span className={missedReagents > 0 ? "text-rose-400" : "text-emerald-400"}>{missedReagents}</span></div>
                    <div><span className="text-slate-500">Stoichiometry:</span> <span className={stoichiometryError ? "text-rose-400" : "text-emerald-400"}>{stoichiometryError ? "Error" : "OK"}</span></div>
                  </div>
                </div>

                {difficultyMode === "challenge" && challengeModeErrors.length > 0 && (
                  <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-xl text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-xl">🏆</div>
                      <h4 className="text-xs font-bold text-amber-400 uppercase">Challenge Mode Feedback</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-3">Protocol events during your challenge:</p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {challengeModeErrors.map((log, i) => (
                        <div key={i} className={`p-2 rounded-lg border ${log.type === "error" ? "bg-rose-900/20 border-rose-500/30" : "bg-emerald-900/20 border-emerald-500/30"}`}>
                          <p className={`text-[10px] font-mono ${log.type === "error" ? "text-rose-300" : "text-emerald-300"}`}>
                            {log.msg}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <FeedbackModule userRating={userRating} setUserRating={setUserRating} feedbackSent={feedbackSent} setFeedbackSent={setFeedbackSent} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setScreen("welcome");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white py-4 rounded-xl font-black uppercase tracking-wide cursor-pointer border-0 shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50"
                >
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw size={20} />
                    <span>Try Again</span>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/leaderboard')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-black uppercase tracking-wide cursor-pointer border-0 shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Trophy size={20} />
                    <span>Leaderboard</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const shareText = `I just ${status === "mastery" ? "achieved mastery" : "completed"} DNA Extraction on BioSim! 🧬\n\nPurity: ${a260_280} | Concentration: ${finalConc} ng/µL`;
                    if (navigator.share) {
                      navigator.share({ text: shareText }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(shareText);
                      alert('Achievement copied to clipboard!');
                    }
                  }}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-black uppercase tracking-wide cursor-pointer border-0 shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star size={20} />
                    <span>Share</span>
                  </div>
                </button>
              </div>

              <button onClick={() => setScreen("welcome")} className="w-full bg-slate-900/50 py-3 rounded-xl font-bold uppercase text-slate-400 border border-slate-700 cursor-pointer text-xs tracking-wide transition-all hover:bg-slate-900/70">
                Return to Bench
              </button>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <FeedbackButton />

      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/50 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in duration-300">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 mb-4">
                <Dna size={40} className="text-emerald-400" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-emerald-400 mb-2 flex items-center justify-center gap-2">
                  <span>Protocol Logged</span>
                </h2>
                <p className="text-slate-400 text-sm font-mono">
                  ID: {savedRecordId?.substring(0, 8)}...
                </p>
              </div>

              <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-6 space-y-3">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your mastery has been verified and synced to the BioSim Research Cloud for instructor review.
                </p>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Final Purity</span>
                    <span className="text-emerald-400 text-2xl font-black">{a260_280}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Concentration</span>
                    <span className="text-slate-300 text-lg font-bold">{finalConc} ng/µL</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wider text-sm"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Lab Assistant temporarily disabled - needs API key configuration */}
      {/* <AILabAssistant /> */}
    </div>
  );
}
