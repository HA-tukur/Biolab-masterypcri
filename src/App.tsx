import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { RealisticPipette } from "./components/RealisticPipette";
import { ReagentContainers } from "./components/ReagentContainers";
import { EnhancedReagentContainers } from "./components/EnhancedReagentContainers";
import { PipetteSelector } from "./components/PipetteSelector";
import { LabEquipment } from "./components/LabEquipment";
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
  Microscope,
  Lock,
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
import { ContactSection } from "./components/ContactSection";
import { SignupBanner } from "./components/SignupBanner";
import { SharedNavigation } from "./components/SharedNavigation";
import { SignupModal } from "./components/SignupModal";
import { useAnonymousUser } from "./hooks/useAnonymousUser";
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


const TubeVisual = ({ volume, solidMass, hasPellet, showSeparation, onSupernatantClick, onPelletClick, stepTitle }) => {
  const fillPercent = Math.min((volume / 2000) * 100, 85);
  const solidPercent = Math.min((solidMass / 150) * 40, 40);

  const supernatantHeight = showSeparation ? fillPercent * 0.7 : 0;
  const pelletHeight = showSeparation ? fillPercent * 0.3 : 0;

  // Determine liquid color based on step
  let liquidColor = "#38bdf8"; // Default blue
  let liquidOpacity = 0.4;
  let supernatantColor = "#F5DEB3"; // Wheat/tan for Step 2 supernatant
  let pelletColor = "#654321"; // Dark brown for Step 2 pellet

  if (stepTitle === "Lysis & Protein Digestion") {
    // Cloudy brownish-pink (homogeneous)
    liquidColor = "#CD9575";
    liquidOpacity = 0.85;
  } else if (stepTitle === "Clarification") {
    // Before spin: same cloudy brownish-pink
    // After spin (showSeparation): wheat supernatant + dark brown pellet
    liquidColor = "#CD9575";
    liquidOpacity = 0.85;
    supernatantColor = "#F5DEB3";
    pelletColor = "#654321";
  } else if (stepTitle === "Binding Preparation" || stepTitle === "Column Binding") {
    // Light blue-white, slightly cloudy
    liquidColor = "#E6F3FF";
    liquidOpacity = 0.7;
  }

  return (
    <div className="relative flex flex-col items-center p-2">
      <svg width="60" height="120" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Original Eppendorf tube shape */}
        <path d="M20 10C20 10 20 150 50 170C80 150 80 10 80 10" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>
        <line x1="15" y1="10" x2="85" y2="10" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>

        {showSeparation && volume > 0 ? (
          <>
            {/* Supernatant (top layer) - inside tube */}
            <path
              d={`M25 ${150 - fillPercent}C25 ${150 - fillPercent} 25 ${150 - pelletHeight} 50 ${165 - pelletHeight}C75 ${150 - pelletHeight} 75 ${150 - fillPercent} 75 ${150 - fillPercent}`}
              fill={supernatantColor}
              fillOpacity="0.6"
              className={onSupernatantClick ? "cursor-pointer hover:opacity-80 transition-all" : ""}
              onClick={onSupernatantClick}
            />
            <text x="50" y={`${140 - fillPercent + 15}`} textAnchor="middle" fontSize="7" fill="#854d0e" fontWeight="bold">Supernatant</text>

            {/* Pellet (bottom layer) - small compact pellet */}
            <ellipse cx="50" cy="166" rx="10" ry="3"
              fill={pelletColor}
              fillOpacity="0.9"
              className={onPelletClick ? "cursor-pointer hover:opacity-95 transition-all" : ""}
              onClick={onPelletClick}
            />
            <text x="50" y={`${169}`} textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="bold">Pellet</text>
          </>
        ) : (
          <>
            {/* Homogeneous liquid (no separation) - inside tube */}
            {volume > 0 && (
              <path
                d={`M25 ${150 - fillPercent}C25 ${150 - fillPercent} 25 150 50 165C75 150 75 ${150 - fillPercent} 75 ${150 - fillPercent}`}
                fill={liquidColor}
                fillOpacity={liquidOpacity}
              />
            )}
            {/* Solid tissue chunks (only for initial state) */}
            {solidMass > 0 && (
              <ellipse cx="50" cy="166" rx="10" ry="3"
                fill="#8B4513"
                fillOpacity="0.85"
              />
            )}
          </>
        )}

        {hasPellet && <g><circle cx="50" cy="166" r="3.5" fill="white" className="animate-pulse" /><circle cx="50" cy="166" r="6" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" className="animate-spin" style={{ animationDuration: '3s' }} /></g>}
      </svg>
    </div>
  );
};

const DualTubeVisual = ({ oldTubeHasSupernatant, freshTubeVolume, freshTubeColor = "#E6F3FF" }) => {
  const supernatantFill = oldTubeHasSupernatant ? 30 : 0;
  const freshFill = Math.min((freshTubeVolume / 2000) * 85, 85);

  return (
    <div className="flex items-center justify-center gap-8 p-4">
      {/* LEFT TUBE - Old tube with pellet */}
      <div className="flex flex-col items-center">
        <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">Step 2 Tube (Waste)</p>
        <svg width="60" height="120" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Original Eppendorf tube shape */}
          <path d="M20 10C20 10 20 150 50 170C80 150 80 10 80 10" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>
          <line x1="15" y1="10" x2="85" y2="10" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>

          {/* Remaining supernatant (if any) */}
          {supernatantFill > 0 && (
            <path
              d={`M25 ${150 - supernatantFill}C25 ${150 - supernatantFill} 25 150 50 165C75 150 75 ${150 - supernatantFill} 75 ${150 - supernatantFill}`}
              fill="#F5DEB3"
              fillOpacity="0.5"
            />
          )}

          {/* Brown pellet at bottom */}
          <ellipse cx="50" cy="166" rx="10" ry="3" fill="#654321" fillOpacity="0.9" />
          <text x="50" y="169" textAnchor="middle" fontSize="7" fill="#fbbf24" fontWeight="600">Pellet</text>
        </svg>
      </div>

      {/* ARROW */}
      <div className="flex flex-col items-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 20 L30 20 M30 20 L23 13 M30 20 L23 27" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-[8px] text-emerald-500 font-semibold mt-1">Transfer</p>
      </div>

      {/* RIGHT TUBE - Fresh tube */}
      <div className="flex flex-col items-center">
        <p className="text-[9px] text-emerald-400 font-bold uppercase mb-2">Fresh Tube</p>
        <svg width="60" height="120" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Original Eppendorf tube shape */}
          <path d="M20 10C20 10 20 150 50 170C80 150 80 10 80 10" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>
          <line x1="15" y1="10" x2="85" y2="10" stroke="#475569" strokeWidth="4" strokeLinecap="round"/>

          {/* Fresh tube contents */}
          {freshFill > 0 && (
            <path
              d={`M25 ${150 - freshFill}C25 ${150 - freshFill} 25 150 50 165C75 150 75 ${150 - freshFill} 75 ${150 - freshFill}`}
              fill={freshTubeColor}
              fillOpacity="0.7"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

const FilterColumnVisual = ({ volume, hasDNA, showSeparation, wasteInTube = false, isDiscarding = false }) => {
  const collectionFillPercent = Math.min((volume / 2000) * 100, 70);

  return (
    <div className="relative flex flex-col items-center p-2">
      <svg
        width="90"
        height="160"
        viewBox="0 0 120 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isDiscarding ? 'animate-[tilt_0.5s_ease-in-out]' : ''}
      >
        {/* Collection Tube (narrower with U-shaped rounded bottom) */}
        <path
          d="M 35 95 L 35 175 Q 35 185 60 190 Q 85 185 85 175 L 85 95"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="2.5"
        />
        <ellipse cx="60" cy="95" rx="25" ry="7" fill="#0f172a" stroke="#475569" strokeWidth="2.5"/>

        {/* Liquid in collection tube (flow-through) - only show if wasteInTube and not discarding */}
        {wasteInTube && !isDiscarding && (
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
  const isElution = stepTitle === "Elution";
  const isFreshTube = isElution && volume === 0;

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

        {/* Fresh tube indicator - sparkle when empty in elution step */}
        {isFreshTube && (
          <g>
            <circle cx="40" cy="90" r="2" fill="#10b981" opacity="0.6" className="animate-pulse"/>
            <circle cx="80" cy="95" r="1.5" fill="#10b981" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
            <circle cx="45" cy="120" r="1.5" fill="#10b981" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
          </g>
        )}

        {/* Liquid in tube */}
        {volume > 0 && (
          <path
            d={`M35 ${170 - tubeVolume}C35 ${170 - tubeVolume} 35 160 60 175C85 160 85 ${170 - tubeVolume} 85 ${170 - tubeVolume}`}
            fill={isElution ? "#3b82f6" : "#38bdf8"}
            fillOpacity="0.3"
          />
        )}

        {/* Filter Column inserted into tube (narrower, reaching 3/4 down) */}
        <rect x="50" y="10" width="20" height="120" rx="1" fill="#334155" stroke="#64748b" strokeWidth="2"/>
        <ellipse cx="60" cy="10" rx="10" ry="3" fill="#1e293b" stroke="#64748b" strokeWidth="2"/>

        {/* Bottom of filter column with mild protrusion - NOT touching liquid when fresh */}
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
        {isFreshTube ? "Fresh Tube" : stepTitle === "Wash Stage" ? "Wash Column" : "Elute DNA"}
      </p>
      {isFreshTube && (
        <div className="mt-1 px-2 py-1 bg-emerald-900/20 border border-emerald-500/30 rounded">
          <p className="text-[8px] text-emerald-400 text-center">Empty & Clean</p>
        </div>
      )}
    </div>
  );
};

const SpinColumnVisual = ({ volume, hasDNA, hasSpun = false, wasteInTube = false, isDiscarding = false }) => {
  return (
    <div className="relative flex flex-col items-center p-4">
      <svg
        width="90"
        height="160"
        viewBox="0 0 120 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isDiscarding ? 'animate-[tilt_0.5s_ease-in-out]' : ''}
      >
        {/* Collection tube (outer, wider tube) */}
        <path d="M 35 95 L 35 175 Q 35 185 60 190 Q 85 185 85 175 L 85 95" fill="#1e293b" stroke="#475569" strokeWidth="2.5"></path>
        <ellipse cx="60" cy="95" rx="25" ry="7" fill="#0f172a" stroke="#475569" strokeWidth="2.5"></ellipse>

        {/* Filter column (inner, narrow tube) */}
        <rect x="46" y="15" width="28" height="115" rx="1" fill="#334155" stroke="#64748b" strokeWidth="2"></rect>
        <ellipse cx="60" cy="15" rx="14" ry="4" fill="#1e293b" stroke="#64748b" strokeWidth="2"></ellipse>

        {/* Liquid INSIDE filter column (before spinning) */}
        {volume > 0 && !hasSpun && (
          <path d="M 48 80 L 48 125 L 72 125 L 72 80 Z" fill="#38bdf8" opacity="0.6"></path>
        )}

        {/* Silica membrane (white horizontal line inside filter column) */}
        <g>
          <rect x="48" y="125" width="24" height="7" fill="#e2e8f0" opacity="0.85"></rect>
          <line x1="48" y1="127" x2="72" y2="127" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="2 1"></line>
          <line x1="48" y1="129" x2="72" y2="129" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="1.5 1.5"></line>
          <line x1="48" y1="131" x2="72" y2="131" stroke="#94a3b8" strokeWidth="0.6" strokeDasharray="2 1"></line>
          {hasDNA && (
            <rect x="48" y="125" width="24" height="7" fill="#10b981" opacity="0.3"></rect>
          )}
        </g>

        {/* Air gap indicator lines (subtle guides showing the space) */}
        <line x1="35" y1="95" x2="46" y2="95" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"></line>
        <line x1="74" y1="95" x2="85" y2="95" stroke="#475569" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"></line>

        {/* Flow-through liquid at bottom of collection tube (after spinning) */}
        {wasteInTube && !isDiscarding && (
          <>
            <path d="M 37 154.25 L 37 175 Q 37 183 60 187 Q 83 183 83 175 L 83 154.25" fill="#38bdf8" opacity="0.4"></path>
            <ellipse cx="60" cy="154.25" rx="23" ry="6" fill="#38bdf8" opacity="0.3"></ellipse>
          </>
        )}
      </svg>
      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Spin Column</p>
    </div>
  );
};

const PipetteAnimationIcon = ({ position }) => (
  <div
    className="absolute z-10 animate-bounce"
    style={{
      top: position === 'tube' ? '-40px' : '-30px',
      left: '50%',
      transform: 'translateX(-50%)',
      animation: 'bounce 0.5s ease-in-out infinite'
    }}
  >
    <Pipette size={24} className="text-sky-400 drop-shadow-lg" />
  </div>
);

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
    <div className="bg-slate-800 border border-amber-500/50 w-full max-w-[650px] max-h-[550px] overflow-y-auto rounded-[2.5rem] p-8 space-y-6 text-white shadow-2xl">

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
      subtitle: "Human/Animal DNA Extraction -Select appropriate kit (e.g. Qiagen) tailored for soft tissues (e.g., 3-25mg biopsies). Volumes: 2/500/500/20 µl.",
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
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedRecordId, setSavedRecordId] = useState(null);
  const [showClassCodePrompt, setShowClassCodePrompt] = useState(false);
  const [showGuestSignupModal, setShowGuestSignupModal] = useState(false);
  const [screen, setScreen] = useState("welcome");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    console.log('App mounted, screen:', screen);
    const sim = searchParams.get('sim');
    if (sim) {
      // Only allow DNA Extraction and PCR
      const availableSimulations = ['dna-extraction', 'pcr-setup'];

      if (!availableSimulations.includes(sim)) {
        // Locked simulation - redirect to browse page with message
        console.log('Attempted to access locked simulation:', sim);
        alert('⏳ This simulation is not yet available. Only DNA Extraction and PCR are currently accessible.');
        navigate('/browse');
        return;
      }

      const simulationMap: Record<string, string> = {
        'dna-extraction': 'missions',
        'pcr-setup': 'pcr-missions',
      };
      const targetScreen = simulationMap[sim] || 'welcome';
      const missionFlowScreens = ['briefing', 'procurement', 'lab', 'workspace', 'result'];
      if (!missionFlowScreens.includes(screen)) {
        setScreen(targetScreen);
      }
    } else if (user && screen === 'welcome') {
      navigate('/browse');
    }
  }, [searchParams, user, screen, navigate]);

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

    const updateLastSimulation = async () => {
      try {
        await supabase
          .from('profiles')
          .update({ last_simulation: 'DNA Extraction' })
          .eq('id', user.id);
      } catch (error) {
        console.error("Error updating last simulation:", error);
      }
    };
    updateLastSimulation();
  }, [user]);

  useEffect(() => {
    try {
      const guestTrial = localStorage.getItem('guestTrial');
      if (guestTrial === 'dna-extraction' && !user) {
        setScreen('missions');
        return;
      }

      const hasSeenPrompt = localStorage.getItem('biosim_class_prompt_shown');
      if (!hasSeenPrompt && user) {
        setShowClassCodePrompt(true);
      }
    } catch (error) {
      console.error("LocalStorage error:", error);
    }
  }, [user]);

  useEffect(() => {
    const handleHeaderTabClick = (e: CustomEvent) => {
      const tab = e.detail.tab;
      if (tab === 'home') {
        if (user) {
          navigate('/browse');
        } else {
          setScreen('welcome');
        }
      } else if (tab === 'manual') {
        setShowManual(true);
      } else if (tab === 'contact') {
        if (user) {
          navigate('/browse');
        } else {
          setScreen('welcome');
        }
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
  const [selectedPipetteForTransfer, setSelectedPipetteForTransfer] = useState(null);
  const [hasAspiratedFromTube, setHasAspiratedFromTube] = useState(false);
  const [liquidInColumn, setLiquidInColumn] = useState(false);
  const [showPipetteAnimation, setShowPipetteAnimation] = useState(false);
  const [pipetteAnimationPosition, setPipetteAnimationPosition] = useState('tube');
  const [hasDiscardedWaste, setHasDiscardedWaste] = useState(false);
  const [isDiscardingWaste, setIsDiscardingWaste] = useState(false);
  const [wasteInCollectionTube, setWasteInCollectionTube] = useState(false);
  const [missedSpins, setMissedSpins] = useState(0);
  const [missedReagents, setMissedReagents] = useState(0);
  const [stoichiometryError, setStoichiometryError] = useState(false);
  const [mistakes, setMistakes] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [pipetteVolume, setPipetteVolume] = useState(null);
  const [pipetteHasLiquid, setPipetteHasLiquid] = useState(false);
  const [pipetteLiquidColor, setPipetteLiquidColor] = useState("#3b82f6");
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
    ethanol: 0,
    wash: 0,
    elution: 0,
  });
  const [currentStepReagents, setCurrentStepReagents] = useState({});
  const [currentReagentId, setCurrentReagentId] = useState(null);
  const [step1SubActions, setStep1SubActions] = useState({
    lysisBufferAdded: false,
    proteinaseKAdded: false,
    mixed: false,
    incubated: false
  });
  const [step3SubActions, setStep3SubActions] = useState({
    bindingBufferAdded: false,
    ethanolAdded: false,
    mixed: false
  });
  const [showMixPrompt, setShowMixPrompt] = useState(false);
  const [protKIncubationOK, setProtKIncubationOK] = useState(false);
  const [yieldQuality, setYieldQuality] = useState(null);
  const [isGrinding, setIsGrinding] = useState(false);
  const [showGrindingSetup, setShowGrindingSetup] = useState(false);
  const [difficultyMode, setDifficultyMode] = useState("learning");
  const [toastMessage, setToastMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [challengeModeErrors, setChallengeModeErrors] = useState([]);
  const [showProtocolGuide, setShowProtocolGuide] = useState(false);
  const [guestModeDismissed, setGuestModeDismissed] = useState(false);
  const [equipmentUsageLog, setEquipmentUsageLog] = useState([]);

  const anonymousUser = useAnonymousUser();

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
      proteinase_k: ['kit_qiagen', 'kit_thermo', 'proteinase_k'],
      lysis: ['kit_qiagen', 'kit_zymo', 'kit_thermo', 'lysis_clean'],
      binding: ['kit_qiagen', 'kit_zymo', 'kit_thermo', 'column'],
      ethanol: ['ethanol'],
      wash: ['kit_qiagen', 'kit_zymo', 'kit_thermo', 'wash_buffer'],
      elute: ['kit_qiagen', 'kit_zymo', 'kit_thermo', 'elute_buffer']
    };
    const sources = reagentMap[reagentId] || [];
    const isAvailable = sources.some(r => has(r));

    console.log(`[Reagent Check] ${reagentId}:`, {
      sources,
      inventory,
      available: isAvailable
    });

    return isAvailable;
  };

  const getLiquidColor = (reagentId) => {
    const colorMap = {
      proteinase_k: '#f59e0b',
      lysis: '#ec4899',
      binding: '#a855f7',
      ethanol: '#60a5fa',
      wash: '#e2e8f0',
      elute: '#3b82f6'
    };
    return colorMap[reagentId] || '#3b82f6';
  };

  const getAvailableReagents = (currentStep) => {
    if (!currentStep) return [];

    const allReagents = [
      {
        id: 'proteinase_k',
        name: 'Proteinase K',
        type: 'tube',
        color: '#f59e0b',
        volume: '20µL',
        available: hasReagentForStep('proteinase_k')
      },
      {
        id: 'lysis',
        name: 'Buffer ATL (Lysis Buffer)',
        type: 'bottle',
        color: '#ec4899',
        volume: '50mL',
        available: hasReagentForStep('lysis')
      },
      {
        id: 'binding',
        name: 'Buffer AL (Binding Buffer)',
        type: 'bottle',
        color: '#a855f7',
        volume: '50mL',
        available: hasReagentForStep('binding')
      },
      {
        id: 'ethanol',
        name: 'Ethanol (96-100%)',
        type: 'bottle',
        color: '#60a5fa',
        volume: '500mL',
        available: hasReagentForStep('ethanol')
      },
      {
        id: 'wash',
        name: 'Wash Buffer',
        type: 'bottle',
        color: '#e2e8f0',
        volume: '50mL',
        available: hasReagentForStep('wash')
      },
      {
        id: 'elute',
        name: 'Buffer AE (Elution Buffer)',
        type: 'bottle',
        color: '#3b82f6',
        volume: '10mL',
        available: hasReagentForStep('elute')
      }
    ];

    if (currentStep.reagents) {
      const stepReagentIds = currentStep.reagents.map(r => r.id);
      const availableForStep = allReagents.filter(r => r.available && stepReagentIds.includes(r.id));

      console.log('[Available Reagents]', {
        stepTitle: currentStep.title,
        stepReagentIds,
        allReagents: allReagents.map(r => ({ id: r.id, available: r.available })),
        availableForStep: availableForStep.map(r => r.id)
      });

      return availableForStep;
    }

    return allReagents.filter(r => r.available);
  };

  const getCurrentReagent = () => {
    if (!currentStep || !currentStep.reagents) return null;

    if (currentStep.multipleReagents) {
      const reagentsToAdd = currentStep.reagents.filter(r => !currentStepReagents[r.id]);
      return reagentsToAdd.length > 0 ? reagentsToAdd[0] : currentStep.reagents[0];
    }

    return currentStep.reagents[0];
  };

  const getTargetVolume = () => {
    // If user has selected a specific reagent, use that reagent's target
    if (currentReagentId && currentStep?.reagents) {
      const selectedReagent = currentStep.reagents.find(r => r.id === currentReagentId);
      if (selectedReagent) {
        console.log('[getTargetVolume] Using currentReagentId:', currentReagentId, 'target:', selectedReagent.targetVolume);
        return selectedReagent.targetVolume;
      }
    }

    // Otherwise, use the next reagent to be added
    const reagent = getCurrentReagent();
    if (reagent) {
      console.log('[getTargetVolume] Using getCurrentReagent:', reagent.id, 'target:', reagent.targetVolume);
      return reagent.targetVolume;
    }
    if (currentStep?.targetVolume) return currentStep.targetVolume;
    return 500;
  };

  const getRemainingReagentsText = () => {
    if (!currentStep || !currentStep.multipleReagents || !currentStep.reagents) return null;
    const remaining = currentStep.reagents.filter(r => !currentStepReagents[r.id]);
    if (remaining.length === 0) return null;
    return `Still needed: ${remaining.map(r => `${r.name} (${r.targetVolume}µL)`).join(', ')}`;
  };

  const getSubActionProgress = () => {
    if (currentStep?.title === "Lysis & Protein Digestion") {
      const completed = Object.values(step1SubActions).filter(Boolean).length;
      return { completed, total: 4, actions: step1SubActions };
    }
    if (currentStep?.title === "Binding Preparation") {
      const completed = Object.values(step3SubActions).filter(Boolean).length;
      return { completed, total: 3, actions: step3SubActions };
    }
    return null;
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const trackMistake = (type, details) => {
    setMistakes(prev => [...prev, {
      type,
      step: currentStep?.title || 'Unknown',
      stepIndex: protocolIndex,
      details,
      timestamp: Date.now()
    }]);
  };

  const handleEquipmentUse = (equipment, action, settings = {}) => {
    const currentStepTitle = currentStep?.title || 'Unknown';
    const usageRecord = {
      equipment,
      action,
      settings,
      step: currentStepTitle,
      timestamp: Date.now(),
      protocolIndex
    };
    setEquipmentUsageLog(prev => [...prev, usageRecord]);

    if (action === 'spin' && equipment === 'centrifuge') {
      setIsSpinning(true);
      setTubeInCentrifuge(false);
      setTimeout(() => {
        setIsSpinning(false);
        setHasSpunThisStep(true);
        setPelletVisible(currentStep?.requiresSpin || false);

        // For Clarification step, show phase separation after spinning
        if (currentStep?.title === "Clarification") {
          setShowPhaseSeparation(true);
          addLog("Spin complete. Supernatant and pellet separated.", "success");
        }

        // For Column Binding and Wash steps, liquid goes to collection tube as waste
        if (currentStep?.title === "Column Binding" || currentStep?.title === "Wash & Dry") {
          setWasteInCollectionTube(true);
          setHasDiscardedWaste(false);
          addLog("Spin complete. Flow-through collected at bottom of tube.", "success");
        }
      }, 2500);
    } else if (action === 'start' && equipment === 'thermocycler') {
      if (settings.temp !== undefined) {
        setIncubationTemp(settings.temp);
      }
      setTubeInCentrifuge(true);

      const tempOK = (settings.temp || incubationTemp) >= 50 && (settings.temp || incubationTemp) <= 60;
      if (!tempOK) {
        addLog(`ERROR: Temperature ${settings.temp || incubationTemp}°C is outside the required 50-60°C range. Proteinase K will not work correctly!`, "error");
        setProtocolAdherenceCompromised(true);
      } else if ((settings.temp || incubationTemp) !== currentStep.incubationTemp) {
        addLog(`Temperature set to ${settings.temp || incubationTemp}°C. Within acceptable range for Proteinase K.`, "info");
      }

      setIsIncubating(true);
      addLog(`Incubation started at ${settings.temp || incubationTemp}°C...`, "info");
      setTimeout(() => {
        setIsIncubating(false);
        setHasSpunThisStep(true);
        setTubeInCentrifuge(false);
        addLog("Incubation complete. Tube removed from thermocycler.", "success");
        if (tempOK) {
          addLog("Proteinase K successfully digested proteins at correct temperature.", "success");
          if (currentStep?.title === "Lysis & Protein Digestion") {
            console.log('[STEP 1] Incubation complete: true');
            setProtKIncubationOK(true);
            setStep1SubActions(prev => {
              const updated = { ...prev, incubated: true };
              console.log('[STEP 1] Updated step1SubActions:', updated);
              return updated;
            });
          }
        } else {
          addLog("WARNING: Incorrect temperature used. This may affect DNA yield.", "error");
        }
      }, 3500);
    } else if (action === 'load' && equipment === 'thermocycler') {
      setTubeInCentrifuge(true);
      addLog("Tube loaded into thermocycler.", "success");
    } else if (action === 'remove' && equipment === 'thermocycler') {
      setTubeInCentrifuge(false);
      addLog("Tube removed from thermocycler.", "info");
    }
  };

  const calculateConsequences = () => {
    const consequences = [];
    let yieldPenalty = 0;
    let purityPenalty = 0;
    let concentrationPenalty = 0;

    mistakes.forEach(mistake => {
      let consequence = {
        severity: 'minor',
        title: '',
        description: '',
        impact: ''
      };

      if (mistake.type === 'wrong_reagent') {
        const { expected, actual } = mistake.details;

        if (expected === 'proteinase_k' && actual !== 'proteinase_k') {
          consequence = {
            severity: 'critical',
            title: 'Missing Proteinase K in Lysis',
            description: `Used ${actual} instead of Proteinase K during tissue digestion.`,
            impact: 'Cell membranes not digested. DNA remains trapped in intact cells. Complete extraction failure expected.'
          };
          yieldPenalty = 100;
        } else if (expected === 'lysis' && actual !== 'lysis') {
          consequence = {
            severity: 'critical',
            title: 'Wrong Lysis Buffer',
            description: `Used ${actual} instead of Lysis Buffer.`,
            impact: 'Cells not lysed properly. DNA yield severely reduced (60-90% loss).'
          };
          yieldPenalty += 75;
        } else if (expected === 'binding' && actual !== 'binding') {
          consequence = {
            severity: 'critical',
            title: 'Wrong Binding Buffer',
            description: `Used ${actual} instead of Binding Buffer.`,
            impact: 'DNA not retained on column. Most DNA washed to waste (80-95% loss).'
          };
          yieldPenalty += 85;
        } else if (expected === 'wash' && actual !== 'wash') {
          consequence = {
            severity: 'major',
            title: 'Wrong Wash Buffer',
            description: `Used ${actual} instead of Wash Buffer.`,
            impact: 'Contaminants not removed. DNA purity severely compromised (proteins, salts remain).'
          };
          purityPenalty += 0.6;
        } else if (expected === 'elute' && actual !== 'elute') {
          consequence = {
            severity: 'major',
            title: 'Wrong Elution Buffer',
            description: `Used ${actual} instead of Elution Buffer.`,
            impact: 'DNA poorly eluted from membrane. Low yield and potential DNA degradation.'
          };
          yieldPenalty += 40;
          purityPenalty += 0.3;
        }
      } else if (mistake.type === 'wrong_volume') {
        const { expected, actual, deviation } = mistake.details;
        const percentOff = Math.round((deviation / expected) * 100);

        if (percentOff > 50) {
          consequence = {
            severity: 'major',
            title: 'Severe Volume Deviation',
            description: `Used ${actual}µL instead of ${expected}µL (${percentOff}% deviation).`,
            impact: 'Reagent concentrations incorrect. May affect binding efficiency and elution completeness.'
          };
          if (actual > expected) {
            concentrationPenalty += 30;
          } else {
            yieldPenalty += 20;
          }
        } else if (percentOff > 20) {
          consequence = {
            severity: 'minor',
            title: 'Volume Inaccuracy',
            description: `Used ${actual}µL instead of ${expected}µL (${percentOff}% deviation).`,
            impact: 'Minor impact on DNA concentration and overall yield.'
          };
          concentrationPenalty += 10;
        }
      } else if (mistake.type === 'wrong_pipette') {
        const { expected, actual, volume } = mistake.details;
        consequence = {
          severity: 'minor',
          title: 'Suboptimal Pipette Selection',
          description: `Used ${actual} pipette instead of ${expected} for ${volume}µL.`,
          impact: 'Reduced accuracy. May introduce pipetting errors (±5-10%).'
        };
        yieldPenalty += 5;
      }

      if (consequence.title) {
        consequences.push(consequence);
      }
    });

    return { consequences, yieldPenalty, purityPenalty, concentrationPenalty };
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
      {
        title: "Lysis & Protein Digestion",
        prompt: "Add 200 µL Lysis Buffer (Buffer ATL) and 20 µL Proteinase K to minced tissue. MIX gently and INCUBATE at 56°C for 1-3 hours.",
        science: "Detergents break open cell membranes while Proteinase K digests proteins (histones, nucleases, structural proteins) that interfere with DNA recovery. ⚠️ Note: Both Lysis Buffer and Proteinase K are included in your DNA extraction kit. 20 µL Proteinase K is the standard amount for ~25 mg tissue.",
        requiresIncubation: true,
        incubationTemp: 56,
        incubationDuration: 120,
        requiresVolume: true,
        requiresMixing: true,
        multipleReagents: true,
        reagents: [
          { id: "lysis", name: "Lysis Buffer", targetVolume: 200, tolerance: 0, color: "#ec4899" },
          { id: "proteinase_k", name: "Proteinase K", targetVolume: 20, tolerance: 0, color: "#f59e0b" }
        ],
        successCriteria: "Lysate should be clear with no visible tissue chunks",
        educationalNote: "🔬 Why 20 µL? This is the standard amount for ~25 mg tissue. Insufficient Proteinase K leads to protein contamination and poor yields."
      },
      {
        title: "Clarification",
        prompt: "SPIN at 12,000-14,000 g for 3 minutes. Carefully transfer supernatant to fresh tube.",
        science: "Centrifugation removes debris that could clog the column and reduce DNA purity. The DNA is in the supernatant (liquid), not the pellet.",
        requiresSpin: true,
        spinDuration: 3,
        successCriteria: "Supernatant is clear",
        educationalNote: "⚠️ Carefully pipette only the clear supernatant in the next step. Avoid disturbing the pellet - it contains debris, not DNA."
      },
      {
        title: "Binding Preparation",
        prompt: "Add 200 µL Binding Buffer (Buffer AL) and 200 µL Ethanol (96-100%) to cleared lysate. MIX gently - do not vortex.",
        science: "Chaotropic salts + ethanol create conditions for DNA to bind to silica column membranes. 🧪 WHY THIS MATTERS: Without ethanol, DNA will NOT bind to the silica membrane and will wash away. This is the #1 reason beginners get low yields. ⚠️ Note: Binding Buffer comes from your kit; Ethanol must be purchased separately from Equipment & Reagents.",
        requiresVolume: true,
        requiresMixing: true,
        multipleReagents: true,
        reagents: [
          { id: "binding", name: "Binding Buffer", targetVolume: 200, tolerance: 20, color: "#a855f7" },
          { id: "ethanol", name: "Ethanol (96-100%)", targetVolume: 200, tolerance: 20, color: "#60a5fa" }
        ],
        kitNote: "📋 Kit Reality Check: Your DNA extraction kit includes concentrated wash buffer. In real labs, you would add ethanol from your lab stock before using it. In BioSim Lab, we assume this step is already done - your wash buffer is ready to use.",
        successCriteria: "Binding Buffer added (200 µL), Ethanol added (200 µL), Mixed gently",
        educationalNote: "💡 Transfer ONLY the clear supernatant to the fresh tube. Leave the brown pellet behind - it contains debris, not DNA."
      },
      {
        title: "Column Binding",
        prompt: "Load mixture onto silica spin column and SPIN at 8,000-14,000 g for 1 minute. Discard flow-through.",
        science: "DNA binds to silica membrane while contaminants flow through. The chaotropic salts disrupt water molecules around DNA, making it 'sticky' to the silica. If volume >700 µL, load in multiple batches. ⚠️ The visual shows your sample tube (left) and an empty spin column in a fresh collection tube (right). Transfer the liquid from the sample tube into the column, then centrifuge.",
        requiresSpin: true,
        spinDuration: 1,
        educationalNote: "💡 Pretty cool chemistry! The salts make DNA hydrophobic so it sticks to the silica surface. During centrifugation, contaminants (proteins, salts, cell debris) pass through the membrane and collect in the tube below as waste, while purified DNA stays bound to the silica membrane."
      },
      {
        title: "Wash & Dry",
        prompt: "Add 500 µL Wash Buffer and SPIN (1st wash). Add 500 µL Wash Buffer and SPIN (2nd wash). DRY SPIN at maximum speed for 3 minutes.",
        science: "Remove salts and contaminants without releasing DNA. Two washes = higher purity. ⚠️ CRITICAL: Dry spin removes residual ethanol that would inhibit PCR. Never skip the dry spin! Residual ethanol is PCR's worst enemy - it denatures the polymerase enzyme.",
        requiresVolume: true,
        requiresSpin: true,
        spinDuration: 5,
        reagents: [
          { id: "wash", name: "Wash Buffer", targetVolume: 500, tolerance: 50, color: "#e2e8f0", requireTwoAdditions: true }
        ],
        successCriteria: "Column is completely dry after final spin",
        educationalNote: "This buffer already has ethanol added (see Binding Preparation step). Two washes ensure maximum purity."
      },
      {
        title: "Elution",
        prompt: "Transfer column to fresh tube. Add 50 µL Elution Buffer to membrane center, wait 1-5 minutes, then SPIN at 12,000 g for 1 minute.",
        science: "Low-salt buffer (TE-based) releases pure DNA from the column. TE buffer (Tris-EDTA) protects DNA - the EDTA 'handcuffs' DNase enzymes that would chew up your DNA. Optional: Pre-warm buffer to 56°C for +10-15% yield. ⚠️ CRITICAL: The previous collection tube contains waste (salts, ethanol, proteins). Always transfer the column to a fresh, empty tube before elution - otherwise contaminants wick back into the membrane and re-contaminate your purified DNA.",
        requiresVolume: true,
        requiresSpin: true,
        isElution: true,
        reagents: [
          { id: "elute", name: "Elution Buffer", targetVolume: missionId === 'A' ? 20 : 50, tolerance: 5, color: "#3b82f6" }
        ],
        storageNote: "Store DNA at 4°C (short-term, days-weeks) or -20°C/-80°C (long-term, years)",
        educationalNote: "💡 Why a fresh tube? The old tube contains waste liquid (salts, ethanol, proteins) from washing. If the column touches this liquid, contaminants wick back up into the silica membrane, re-contaminating your DNA. This is a common beginner mistake that ruins otherwise perfect extractions!"
      },
      {
        title: "Quality Check (NanoDrop)",
        prompt: "Measure DNA concentration and purity using NanoDrop.",
        science: "Expected results: Concentration 50-500 ng/µL, A₂₆₀/A₂₈₀ ratio 1.8-2.0 (pure DNA), A₂₆₀/A₂₃₀ ratio 2.0-2.2 (no salt contamination).",
        isQualityCheck: true,
        expectedResults: {
          concentration: "50-500 ng/µL",
          ratio260_280: "1.8-2.0",
          ratio260_230: "2.0-2.2"
        },
        troubleshooting: {
          lowRatio260_280: "⚠️ Protein contamination. Causes: Insufficient Proteinase K digestion (extend incubation) or not enough washes. Next time: Increase Proteinase K or add third wash.",
          lowRatio260_230: "⚠️ Salt/solvent contamination. Causes: Incomplete dry spin (ethanol residue) or chaotropic salts. Next time: Extend dry spin to 5 minutes.",
          lowConcentration: "⚠️ Low yield. Causes: Incomplete lysis (tissue still visible?), Lost DNA in debris pellet, Forgot ethanol → DNA didn't bind (MOST COMMON), or insufficient starting material. Review Steps 1-3 carefully."
        }
      }
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
    setPipetteHasLiquid(false);
    setPipetteLiquidColor("#3b82f6");
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
    setStepVolumes({ protK: 0, lysis: 0, binding: 0, ethanol: 0, wash: 0, elution: 0 });
    setCurrentStepReagents({});
    setCurrentReagentId(null);
    setStep1SubActions({ lysisBufferAdded: false, proteinaseKAdded: false, mixed: false, incubated: false });
    setStep3SubActions({ bindingBufferAdded: false, ethanolAdded: false, mixed: false });
    setShowMixPrompt(false);
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
    setMistakes([]);
    setEquipmentUsageLog([]);
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

      // Step 3 (Binding Preparation) - reset phase separation and pellet since we're using fresh tube
      if (protocolIndex === 2) {
        setShowPhaseSeparation(false);
        setPelletVisible(false);
        setShowBioPopup("lysis");
        addLog("Transferred clear supernatant to a fresh, clean tube. No debris.", "success");
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
        if (currentStep?.title === "Lysis & Protein Digestion") {
          console.log('[STEP 1] Incubation complete: true');
          setProtKIncubationOK(true);
          setStep1SubActions(prev => {
            const updated = { ...prev, incubated: true };
            console.log('[STEP 1] Updated step1SubActions:', updated);
            return updated;
          });
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
      // Calculate mistake-based penalties
      const { yieldPenalty: mistakeYieldPenalty, purityPenalty: mistakePurityPenalty, concentrationPenalty: mistakeConcentrationPenalty } = calculateConsequences();

      // Normal yield calculation
      let yieldPenaltyPercent = 1.0;
      if (missedSpins > 0) yieldPenaltyPercent *= 0.1;
      if (protocolAdherenceCompromised) yieldPenaltyPercent *= 0.7;

      yieldPenaltyPercent *= (1 - mistakeYieldPenalty / 100);

      localYield = parseFloat((sampleMass * yieldMultiplier * yieldPenaltyPercent).toFixed(2));

      let adjustedConcentrationPenalty = 1.0 - (mistakeConcentrationPenalty / 100);
      localConc = parseFloat(((localYield * 1000 * adjustedConcentrationPenalty) / elutionVolume).toFixed(1));

      // PURITY LOGIC: Checking for MIXING and WASH steps
      let purityScore = 1.88;

      // Skipping wash affects purity (not yield)
      if (missedSpins > 0) purityScore -= 0.5;

      // Logic fix for Mission B skipping ProtK (Step 2)
      if (!isMissionBManual && !step2Mixed) purityScore -= 0.4;

      // Lysis (Step 3) MUST be mixed
      if (!step3Mixed) purityScore -= 0.4;

      purityScore -= mistakePurityPenalty;

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
        if (!user && techniqueId === 'DNA_EXT') {
          localStorage.removeItem('guestTrial');
          setShowGuestSignupModal(true);
        } else {
          setShowSuccessModal(true);
        }
        anonymousUser.recordSimulation(missionTitle);
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
    <div className="min-h-screen text-slate-100 font-sans bg-[#0f172a]" style={screen === "welcome" ? {background: '#f9fafb'} : {}}>
      {console.log('Rendering App, screen state:', screen)}

      {anonymousUser.shouldShowBanner && !guestModeDismissed && (
        <SignupBanner
          isLastChance={anonymousUser.isLastChance}
          onDismiss={anonymousUser.dismissBanner}
        />
      )}

      {anonymousUser.shouldShowModal && !guestModeDismissed && (
        <SignupModal
          simulationCount={anonymousUser.simulationCount}
          onContinueAsGuest={() => {
            setGuestModeDismissed(true);
            setScreen("welcome");
          }}
        />
      )}

      {showClassCodePrompt && (
        <ClassCodePrompt
          onComplete={() => {
            localStorage.setItem('biosim_class_prompt_shown', 'true');
            setShowClassCodePrompt(false);
          }}
          onJoinMission={(techniqueId, missionId) => {
            localStorage.setItem('biosim_class_prompt_shown', 'true');
            setShowClassCodePrompt(false);
            if (techniqueId === 'PCR') {
              if (missionId === 'pcr-missions') {
                setScreen('pcr-missions');
              } else {
                setSelectedMissionId(missionId);
                setShowPCRModal(true);
              }
            } else if (techniqueId === 'DNA_EXT' && missionId === 'missions') {
              setScreen('missions');
            } else {
              startMission(techniqueId, missionId);
            }
          }}
        />
      )}
      {showManual && <LabManualOverlay onClose={() => setShowManual(false)} />}
      {showProtocol && <ProtocolBookOverlay onClose={() => setShowProtocol(false)} />}
      {showProtocolGuide && <ProtocolGuideOverlay onClose={() => setShowProtocolGuide(false)} missionId={missionId} />}
      {showReadinessModal && <ReadinessOverlay onClose={() => {
        setShowReadinessModal(false);
        setScreen("briefing");
      }} />}
      {showProtocolOverview && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full">
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
      {showPCRModal && <PCRModule onClose={() => setShowPCRModal(false)} onComplete={() => setShowPCRModal(false)} onBackToLibrary={() => { setShowPCRModal(false); if (user) { navigate('/browse'); } else { setScreen("welcome"); } }} missionId={selectedMissionId} />}
      {showBioPopup && <BiologicalPopup type={showBioPopup} onClose={() => setShowBioPopup(null)} />}

      {guestModeDismissed && anonymousUser.shouldShowModal && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-amber-50 border-b border-amber-200 py-3 px-4">
          <p className="text-sm text-amber-900 text-center font-medium">
            Unlock all modules — <button onClick={() => navigate('/signup')} className="underline hover:text-amber-950">Sign up free</button>
          </p>
        </div>
      )}

      <div className={`px-4 ${anonymousUser.shouldShowBanner && !guestModeDismissed ? 'pt-[60px] md:pt-[70px]' : ''} ${guestModeDismissed && anonymousUser.shouldShowModal ? 'pt-[48px]' : ''}`}>
        <main>
          {screen === "welcome" && (
            <div className="space-y-12 animate-in fade-in">
              {!user && (
                <>
                  <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Microscope className="w-6 h-6 text-teal-700" />
                        <span className="text-xl font-bold text-gray-900">BioSimLab</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate('/login')}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Log In
                        </button>
                        <button
                          onClick={() => navigate('/signup')}
                          className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-md transition-colors"
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </header>
                  <section className="text-center space-y-6 max-w-4xl mx-auto px-6 pt-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                      Practice Lab Protocols Before Your First Real Experiment
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                      Built for students who lack equipment access—fail safely,
                      learn consequences, build confidence before touching real reagents.
                    </p>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                      <p className="text-gray-700 font-medium text-base flex items-center justify-center gap-6 flex-wrap">
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Free to Use
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          No Download Required
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Works on Any Device
                        </span>
                      </p>
                    </div>
                    <div className="bg-teal-50 border-l-4 border-teal-700 rounded-md p-6 mx-auto max-w-4xl my-12 text-left">
                      <h3 className="text-teal-900 text-xl font-bold mb-2">
                        Practice & Learn
                      </h3>
                      <p className="text-gray-700 text-base leading-relaxed">
                        Make mistakes safely. Get instant feedback. Build confidence.
                        Start with <strong className="text-teal-900 font-semibold">DNA Extraction (15 mins)</strong>. More techniques soon.
                      </p>
                    </div>
                    <button
                      onClick={() => setScreen("categories")}
                      className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors border-0 cursor-pointer"
                    >
                      Start Practicing Now
                    </button>
                  </section>
                </>
              )}
              <section className="max-w-6xl mx-auto px-6 pt-8">
                {!user && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 mb-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Choose your learning path
                      </h2>
                      <p className="text-gray-600 text-lg">
                        All paths access the same high-quality simulations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div
                        onClick={() => setShowClassCodePrompt(true)}
                        className="bg-white border-2 border-gray-200 p-6 rounded-md cursor-pointer hover:border-teal-700 transition-colors group"
                      >
                        <div className="bg-teal-50 w-14 h-14 rounded-md flex items-center justify-center mb-4">
                          <GraduationCap size={28} className="text-teal-700" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-xl mb-2">University Student</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          Join your instructor's class. Enter code to sync with your faculty dashboard.
                        </p>
                        <div className="flex items-center gap-2 text-teal-700 font-medium text-sm mt-4">
                          <span>Enter Class Code</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>

                      <div
                        onClick={() => setScreen("categories")}
                        className="bg-white border-2 border-gray-200 p-6 rounded-md cursor-pointer hover:border-teal-700 transition-colors group"
                      >
                        <div className="bg-blue-50 w-14 h-14 rounded-md flex items-center justify-center mb-4">
                          <Target size={28} className="text-blue-700" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-xl mb-2">Independent Learner</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          Master lab techniques at your own pace. Build your digital lab resume.
                        </p>
                        <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mt-4">
                          <span>Start Learning</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>

                      <div
                        onClick={() => setScreen("categories")}
                        className="bg-white border-2 border-gray-200 p-6 rounded-md cursor-pointer hover:border-teal-700 transition-colors group"
                      >
                        <div className="bg-gray-50 w-14 h-14 rounded-md flex items-center justify-center mb-4">
                          <Sparkles size={28} className="text-gray-700" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-xl mb-2">Pre-university</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          Get a head start on college science. Explore molecular biology basics.
                        </p>
                        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm mt-4">
                          <span>Start Learning</span>
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!user && (
                  <div className="py-3">
                    <div
                      onClick={() => navigate('/leaderboard')}
                      className="bg-white border-2 border-gray-200 rounded-md p-6 cursor-pointer hover:border-teal-700 transition-colors"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-amber-50 p-3 rounded-md">
                            <Trophy size={28} className="text-amber-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1.5 flex items-center gap-3">
                              Global Rankings
                              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-semibold">NEW</span>
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              Compete with learners worldwide. Track your progress. Build verifiable competency records. From students to researchers—see where you rank.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-teal-700 font-semibold text-base">
                          <span>View Rankings</span>
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {!user && (
                <section className="space-y-8 px-6">
                  <TechniqueLibrary
                    data={TECHNIQUE_LIBRARY}
                    onTechniqueClick={(tech) => {
                      if (tech.id === "DNA_EXT") setScreen("missions");
                      if (tech.id === "PCR") setShowPCRModal(true);
                    }}
                    lockedTechniqueIds={
                      guestModeDismissed && anonymousUser.shouldShowModal
                        ? TECHNIQUE_LIBRARY.flatMap(cat => cat.items)
                            .filter(item => item.id !== 'DNA_EXT')
                            .map(item => item.id)
                        : []
                    }
                  />
                </section>
              )}

              {user && (
                <section className="space-y-8 px-6">
                  <TechniqueLibrary
                    data={TECHNIQUE_LIBRARY}
                    onTechniqueClick={(tech) => {
                      if (tech.id === "DNA_EXT") setScreen("missions");
                      if (tech.id === "PCR") setShowPCRModal(true);
                    }}
                    lockedTechniqueIds={[]}
                  />
                </section>
              )}
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
                onBack={() => navigate("/browse")}
                onSelectMission={(missionId) => {
                  setSelectedMissionId(missionId);
                  setShowProtocolOverview(true);
                }}
              />
            </div>
          )}

          {screen === "missions" && (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
              <SharedNavigation onShowManual={() => setShowManual(true)} />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                <section className="space-y-6">
                <h2 className="text-4xl font-bold text-slate-900 flex items-center gap-3 mb-8"><Dna size={32} className="text-emerald-600" /> DNA Extraction Missions</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(MISSIONS_DATA.DNA_EXT).map(([key, mission]) => {
                    const isGuestMode = !user && localStorage.getItem('guestTrial') === 'dna-extraction';
                    const isLocked = isGuestMode && key !== 'A';

                    return (
                      <div key={key} className={`bg-white border-2 border-slate-200 rounded-xl overflow-hidden transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500 hover:shadow-lg group'}`}>
                        <div className="p-8 space-y-4 relative">
                          {isLocked && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                              <div className="text-center space-y-2">
                                <Lock className="mx-auto text-slate-400" size={32} />
                                <p className="text-slate-600 font-bold text-sm">Complete Mission 1 First</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{mission.title}</h3>
                              <p className="text-sm text-slate-600 leading-relaxed">{mission.brief}</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <p className="text-xs text-slate-700 font-mono">{mission.summary}</p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <div className="text-left">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Budget</p>
                              <p className="text-lg font-black text-amber-600 font-mono">{mission.budget} BC</p>
                            </div>
                            <button
                              onClick={() => !isLocked && startMission("DNA_EXT", key)}
                              disabled={isLocked}
                              className={`px-6 py-3 rounded-lg font-bold text-sm transition-all border-0 ${
                                isLocked
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white group-hover:scale-105 cursor-pointer'
                              }`}
                            >
                              Start Mission
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
              </div>
            </div>
          )}

          {screen === "briefing" && (
            <div className="min-h-screen bg-[#0f172a]">
              <SharedNavigation onShowManual={() => setShowManual(true)} />
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
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
                <button
                  onClick={() => {
                    if (user) {
                      navigate('/browse');
                    } else {
                      setScreen("missions");
                    }
                  }}
                  className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-bold uppercase tracking-wider transition-all cursor-pointer border-0"
                >
                  ← Exit Lab
                </button>
                <button onClick={() => setScreen("procurement")} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-wider transition-all cursor-pointer border-0 text-lg">
                  Proceed to Procurement
                </button>
              </div>
              </div>
            </div>
          )}

          {screen === "procurement" && (
            <div className="min-h-screen bg-[#0f172a]">
              <SharedNavigation onShowManual={() => setShowManual(true)} />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
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
            </div>
          )}

          {screen === "lab" && status === "idle" && currentStep && (
            <div className="min-h-screen bg-[#0f172a]">
              <SharedNavigation onShowManual={() => setShowManual(true)} />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-slate-50 uppercase tracking-tight">Step {protocolIndex + 1}: {currentStep.title}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 font-mono">Progress: {protocolIndex + 1}/{protocolSteps.length}</span>
                      {(() => {
                        const subProgress = getSubActionProgress();
                        if (subProgress && subProgress.completed === subProgress.total) {
                          return (
                            <span className="text-xs text-emerald-400 font-bold">All tasks complete ✓</span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
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

                    {/* Continue Button - Top Right */}
                    {(() => {
                      const subProgress = getSubActionProgress();
                      let canContinue = false;
                      let remainingTasks = 0;

                      if (subProgress) {
                        // Has subtasks - check if all complete
                        canContinue = subProgress.completed === subProgress.total;
                        remainingTasks = subProgress.total - subProgress.completed;
                        console.log(`[CONTINUE BUTTON] Step "${currentStep?.title}" - Progress: ${subProgress.completed}/${subProgress.total}, Can Continue: ${canContinue}`);
                        if (currentStep?.title === "Lysis & Protein Digestion") {
                          console.log('[CONTINUE BUTTON] Step 1 complete status:', canContinue ? 'true' : 'false');
                          console.log('[CONTINUE BUTTON] Subtasks:', subProgress.actions);
                        }
                      } else {
                        // No subtasks - use existing logic
                        if (currentStep.title === "Column Binding") {
                          // Special condition for Column Binding: must load liquid, spin, and discard waste
                          canContinue = liquidInColumn && hasSpunThisStep && hasDiscardedWaste;
                        } else {
                          const cond1 = (currentStep.requiresVolume && hasDispensedThisStep) || (currentStep.options) || (!currentStep.requiresVolume && !currentStep.options);
                          const cond2 = currentStep.requiresSpin || currentStep.requiresIncubation ? hasSpunThisStep : true;
                          const cond3 = currentStep.requiresMixing ? (currentStep.title === "Lysis & Protein Digestion" ? step2Mixed : currentStep.title === "Binding Preparation" ? step3Mixed : !needsMixing) : true;
                          canContinue = cond1 && cond2 && cond3;
                        }
                      }

                      const nextStepNumber = protocolIndex + 2;
                      const buttonText = canContinue
                        ? `CONTINUE TO STEP ${nextStepNumber} →`
                        : remainingTasks > 0
                          ? `Complete ${remainingTasks} remaining ${remainingTasks === 1 ? 'task' : 'tasks'}`
                          : 'Complete step to continue';

                      return (
                        <button
                          onClick={() => {
                            if (canContinue) {
                              console.log('Moving to step', protocolIndex + 2);

                              // Validation checks
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

                              if (currentStep.title === "Lysis & Protein Digestion") {
                                if (!step1SubActions.lysisBufferAdded) {
                                  addLog("Error: Add Lysis Buffer before proceeding", "error");
                                  setProtocolAdherenceCompromised(true);
                                  return;
                                }
                                if (!step1SubActions.proteinaseKAdded) {
                                  addLog("Error: Add Proteinase K before proceeding", "error");
                                  setProtocolAdherenceCompromised(true);
                                  return;
                                }
                                if (!step1SubActions.mixed) {
                                  addLog("Error: Mix the tube by inversion before incubating", "error");
                                  setProtocolAdherenceCompromised(true);
                                  return;
                                }
                                if (!step1SubActions.incubated) {
                                  addLog("Error: Incubate at 56°C before proceeding", "error");
                                  setProtocolAdherenceCompromised(true);
                                  return;
                                }
                              }

                              if (currentStep.title === "Binding Preparation") {
                                if (!step3SubActions.bindingBufferAdded) {
                                  addLog("Error: Add Binding Buffer before proceeding", "error");
                                  setProtocolAdherenceCompromised(true);
                                  return;
                                }
                                if (!step3SubActions.ethanolAdded) {
                                  addLog("Error: Add Ethanol before proceeding. DNA will NOT bind without ethanol!", "error");
                                  setProtocolAdherenceCompromised(true);
                                  return;
                                }
                                if (!step3SubActions.mixed) {
                                  addLog("Error: Mix the tube by inversion before loading onto column", "error");
                                  setProtocolAdherenceCompromised(true);
                                  return;
                                }
                              }

                              // Volume validation
                              if (currentStep.multipleReagents && currentStep.reagents) {
                                currentStep.reagents.forEach(reagent => {
                                  const addedVolume = currentStepReagents[reagent.id] || 0;
                                  if (addedVolume === 0) {
                                    addLog(`Volume Error: ${reagent.name} was not added!`, "error");
                                    setProtocolAdherenceCompromised(true);
                                  } else if (addedVolume !== reagent.targetVolume) {
                                    addLog(`Volume Error: Use exactly ${reagent.targetVolume}µL of ${reagent.name}.`, "error");
                                    setProtocolAdherenceCompromised(true);
                                  }
                                });
                              } else if (currentStep.reagents && currentStep.reagents[0]) {
                                const reagent = currentStep.reagents[0];
                                if (volumeAddedThisStep !== reagent.targetVolume) {
                                  addLog(`Volume Error: Use exactly ${reagent.targetVolume}µL.`, "error");
                                  setProtocolAdherenceCompromised(true);
                                }
                              }

                              console.log('[NAVIGATE] Moving to Step', protocolIndex + 2);

                              // Check if this is the last step
                              if (protocolIndex === protocolSteps.length - 1) {
                                setCanNanodropNow(true);
                                setStatus("verification");
                              } else {
                                const nextStep = protocolSteps[protocolIndex + 1];

                                // For Binding Preparation step (Step 3), reset volume to ~200µL (supernatant only)
                                if (nextStep?.title === "Binding Preparation") {
                                  setBufferVolume(200);
                                  addLog("Transferred ~200µL clear supernatant to fresh tube. Pellet discarded.", "info");
                                }
                                // For Elution step, reset buffer volume to show fresh, empty tube
                                else if (nextStep?.isElution) {
                                  setBufferVolume(0);
                                  addLog("Column transferred to fresh, empty collection tube.", "info");
                                } else {
                                  setBufferVolume(bufferVolume + volumeAddedThisStep);
                                }

                                setVolumeAddedThisStep(0);
                                setProtocolIndex(protocolIndex + 1);
                                setHasDispensedThisStep(false);
                                setHasSpunThisStep(false);
                                setNeedsMixing(false);
                                setIsMixing(false);
                                setStep2Mixed(false);
                                setStep3Mixed(false);
                                setCurrentStepReagents({});
                                setCurrentReagentId(null);
                                setShowMixPrompt(false);
                                setSelectedPipetteForTransfer(null);
                                setHasAspiratedFromTube(false);
                                setLiquidInColumn(false);
                                setShowPipetteAnimation(false);
                                setPipetteAnimationPosition('tube');
                                setHasDiscardedWaste(false);
                                setIsDiscardingWaste(false);
                                setWasteInCollectionTube(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }
                          }}
                          disabled={!canContinue}
                          className={`
                            w-full lg:w-auto px-6 py-3 rounded-lg font-bold text-sm transition-all border-0 whitespace-nowrap
                            ${canContinue
                              ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40 animate-continue-pulse'
                              : 'cursor-not-allowed'
                            }
                          `}
                          style={canContinue ? {} : {
                            backgroundColor: '#2a2a2a',
                            color: '#666',
                          }}
                        >
                          {buttonText}
                        </button>
                      );
                    })()}
                  </div>
                </div>
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl mb-4">
                  <p className="text-sm text-indigo-300 font-bold mb-2">{currentStep.prompt}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{currentStep.science}</p>
                  {currentStep.educationalNote && (
                    <div className="mt-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                      <p className="text-xs text-emerald-300 leading-relaxed">{currentStep.educationalNote}</p>
                    </div>
                  )}
                  {currentStep.storageNote && (
                    <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                      <p className="text-xs text-blue-300 leading-relaxed">💾 Storage: {currentStep.storageNote}</p>
                    </div>
                  )}
                </div>

                {getSubActionProgress() && (
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-white uppercase">Tasks ({getSubActionProgress().completed}/{getSubActionProgress().total} complete)</h4>
                      <div className="flex gap-1">
                        {Array.from({ length: getSubActionProgress().total }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < getSubActionProgress().completed ? 'bg-emerald-500' : 'bg-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentStep.title === "Lysis & Protein Digestion" && (() => {
                        console.log('[RENDER CHECKLIST] step1SubActions:', step1SubActions);
                        return (
                        <>
                          <div className={`flex items-center gap-2 text-xs ${step1SubActions.lysisBufferAdded ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{step1SubActions.lysisBufferAdded ? '☑' : '☐'}</span>
                            <span>Add Lysis Buffer (200 µL)</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${step1SubActions.proteinaseKAdded ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{step1SubActions.proteinaseKAdded ? '☑' : '☐'}</span>
                            <span>Add Proteinase K (20 µL)</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${step1SubActions.mixed ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{step1SubActions.mixed ? '☑' : '☐'}</span>
                            <span>Mix by inverting tube</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${step1SubActions.incubated ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{step1SubActions.incubated ? '☑' : '☐'}</span>
                            <span>Incubate at 56°C</span>
                          </div>
                        </>
                        );
                      })()}
                      {currentStep.title === "Binding Preparation" && (
                        <>
                          <div className={`flex items-center gap-2 text-xs ${step3SubActions.bindingBufferAdded ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{step3SubActions.bindingBufferAdded ? '☑' : '☐'}</span>
                            <span>Add Binding Buffer (200 µL)</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${step3SubActions.ethanolAdded ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{step3SubActions.ethanolAdded ? '☑' : '☐'}</span>
                            <span>Add Ethanol 96-100% (200 µL)</span>
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${step3SubActions.mixed ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <span>{step3SubActions.mixed ? '☑' : '☐'}</span>
                            <span>Mix by inverting tube</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Column Layout: Sample | Reagents | Pipettes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Sample Tube (30%) */}
                <div className="md:col-span-1">
                  <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl relative">
                    <h3 className="text-sm font-bold text-white uppercase mb-3 flex items-center gap-2"><FlaskConical size={16} /> {showGrindingSetup ? "Manual Grinding" : currentStep.title === "Column Binding" ? "Sample & Column" : (currentStep.title === "Binding/Column Load" || currentStep.title === "Wash Stage" || currentStep.title === "Wash & Dry") ? "Filter Column" : "Sample Tube"}</h3>
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
                      <div className={`flex justify-center transition-all duration-500 ${tubeAnimating ? 'opacity-20 scale-75' : 'opacity-100 scale-100'} ${isMixing ? 'animate-[wiggle_0.5s_ease-in-out_4]' : ''}`}>
                        {currentStep.title === "Column Binding" ? (
                          <div className="flex items-center justify-center gap-6">
                            <div className="flex flex-col items-center relative">
                              <div
                                className={`relative ${selectedPipetteForTransfer && !hasAspiratedFromTube ? 'cursor-pointer hover:scale-105 transition-transform ring-4 ring-sky-400 ring-opacity-50 animate-pulse' : ''}`}
                                onClick={() => {
                                  if (selectedPipetteForTransfer && !hasAspiratedFromTube) {
                                    setHasAspiratedFromTube(true);
                                    setShowPipetteAnimation(true);
                                    setPipetteAnimationPosition('tube');
                                    addLog(`Aspirated ${bufferVolume + volumeAddedThisStep}µL from sample tube`, "info");
                                    setTimeout(() => {
                                      setShowPipetteAnimation(false);
                                    }, 1500);
                                  }
                                }}
                              >
                                {showPipetteAnimation && pipetteAnimationPosition === 'tube' && (
                                  <PipetteAnimationIcon position="tube" />
                                )}
                                <TubeVisual
                                  volume={hasAspiratedFromTube ? 0 : (bufferVolume + volumeAddedThisStep)}
                                  solidMass={currentSolidMass}
                                  hasPellet={pelletVisible}
                                  stepTitle={currentStep.title}
                                />
                              </div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">Sample Tube</p>
                              <p className="text-[8px] text-emerald-400 mt-1">
                                {hasAspiratedFromTube ? '0µL' : `${bufferVolume + volumeAddedThisStep}µL`}
                              </p>
                              {selectedPipetteForTransfer && !hasAspiratedFromTube && (
                                <p className="text-[9px] text-sky-400 mt-1 animate-pulse">Click to aspirate →</p>
                              )}
                            </div>
                            <div className="text-slate-400 text-2xl">→</div>
                            <div className="flex flex-col items-center relative">
                              <div
                                className={`relative ${hasAspiratedFromTube && !liquidInColumn ? 'cursor-pointer hover:scale-105 transition-transform ring-4 ring-sky-400 ring-opacity-50 animate-pulse' : ''}`}
                                onClick={() => {
                                  if (hasAspiratedFromTube && !liquidInColumn) {
                                    setLiquidInColumn(true);
                                    setShowPipetteAnimation(true);
                                    setPipetteAnimationPosition('column');
                                    addLog(`Dispensed ${bufferVolume + volumeAddedThisStep}µL into spin column`, "success");
                                    setTimeout(() => {
                                      setShowPipetteAnimation(false);
                                    }, 1500);
                                  }
                                }}
                              >
                                {showPipetteAnimation && pipetteAnimationPosition === 'column' && (
                                  <PipetteAnimationIcon position="column" />
                                )}
                                <SpinColumnVisual
                                  volume={liquidInColumn ? (bufferVolume + volumeAddedThisStep) : 0}
                                  hasDNA={false}
                                  hasSpun={hasSpunThisStep}
                                  wasteInTube={wasteInCollectionTube}
                                  isDiscarding={isDiscardingWaste}
                                />
                              </div>
                              {hasAspiratedFromTube && !liquidInColumn && (
                                <p className="text-[9px] text-sky-400 mt-1 animate-pulse">Click to dispense →</p>
                              )}

                              {/* Discard Waste Button */}
                              {wasteInCollectionTube && !hasDiscardedWaste && (
                                <button
                                  onClick={() => {
                                    setIsDiscardingWaste(true);
                                    addLog("Discarding flow-through waste...", "info");
                                    setTimeout(() => {
                                      setWasteInCollectionTube(false);
                                      setIsDiscardingWaste(false);
                                      setHasDiscardedWaste(true);
                                      addLog("✓ Waste discarded. DNA remains safely bound to silica membrane.", "success");
                                    }, 800);
                                  }}
                                  className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border-0 flex items-center gap-2 animate-pulse"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  </svg>
                                  DISCARD WASTE
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (currentStep.title === "Binding/Column Load" || currentStep.title === "Wash Stage" || currentStep.title === "Wash & Dry") ? (
                          <div className="flex flex-col items-center">
                            <FilterColumnVisual
                              volume={bufferVolume + volumeAddedThisStep}
                              hasDNA={currentStep.title === "Wash Stage" || currentStep.title === "Wash & Dry"}
                              showSeparation={showPhaseSeparation}
                              wasteInTube={wasteInCollectionTube}
                              isDiscarding={isDiscardingWaste}
                            />

                            {/* Discard Waste Button for Wash & Dry step */}
                            {currentStep.title === "Wash & Dry" && wasteInCollectionTube && !hasDiscardedWaste && (
                              <button
                                onClick={() => {
                                  setIsDiscardingWaste(true);
                                  addLog("Discarding flow-through waste...", "info");
                                  setTimeout(() => {
                                    setWasteInCollectionTube(false);
                                    setIsDiscardingWaste(false);
                                    setHasDiscardedWaste(true);
                                    addLog("✓ Waste discarded. DNA remains safely bound to silica membrane.", "success");
                                  }, 800);
                                }}
                                className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border-0 flex items-center gap-2 animate-pulse"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                                DISCARD WASTE
                              </button>
                            )}

                            {/* Educational tooltip */}
                            {currentStep.title === "Wash & Dry" && wasteInCollectionTube && !hasDiscardedWaste && (
                              <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg max-w-xs">
                                <p className="text-[9px] text-blue-300 text-center">
                                  The flow-through contains salts and contaminants. Your DNA is safely bound to the silica membrane.
                                </p>
                              </div>
                            )}
                          </div>
                        ) : currentStep.title === "Elution" ? (
                          <TubeWithFilterColumnVisual
                            volume={bufferVolume + volumeAddedThisStep}
                            hasDNA={true}
                            stepTitle={currentStep.title}
                          />
                        ) : currentStep.title === "Binding Preparation" ? (
                          <div className="relative">
                            <DualTubeVisual
                              oldTubeHasSupernatant={showPhaseSeparation}
                              freshTubeVolume={bufferVolume + volumeAddedThisStep}
                              freshTubeColor="#E6F3FF"
                            />
                            {showMixPrompt && (
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg animate-pulse whitespace-nowrap z-10">
                                👆 Click fresh tube to mix
                              </div>
                            )}
                            <div
                              className={`${showMixPrompt ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} absolute inset-0`}
                              onClick={() => {
                                if (showMixPrompt && !isMixing) {
                                  setIsMixing(true);
                                  if (difficultyMode !== "challenge") {
                                    addLog("Mixing by inversion...", "info");
                                  }
                                  setTimeout(() => {
                                    setIsMixing(false);
                                    setShowMixPrompt(false);
                                    setNeedsMixing(false);
                                    setStep3SubActions(prev => ({ ...prev, mixed: true }));
                                    setStep3Mixed(true);
                                    if (difficultyMode !== "challenge") {
                                      addLog("✓ Mixed. Ready for column binding.", "success");
                                    }
                                  }, 2000);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <div
                              className={`${showMixPrompt ? 'cursor-pointer hover:scale-105 transition-transform ring-4 ring-emerald-400 ring-opacity-50 animate-pulse rounded-full' : ''}`}
                              onClick={() => {
                                if (showMixPrompt && !isMixing) {
                                  setIsMixing(true);
                                  if (difficultyMode !== "challenge") {
                                    addLog("Mixing by inversion...", "info");
                                  }
                                  setTimeout(() => {
                                    setIsMixing(false);
                                    setShowMixPrompt(false);
                                    setNeedsMixing(false);

                                    if (currentStep.title === "Lysis & Protein Digestion") {
                                      console.log('[STEP 1] Mixing complete: true');
                                      setStep1SubActions(prev => {
                                        const updated = { ...prev, mixed: true };
                                        console.log('[STEP 1] Updated step1SubActions:', updated);
                                        return updated;
                                      });
                                      setStep2Mixed(true);
                                      if (difficultyMode !== "challenge") {
                                        addLog("✓ Mixed. Proceed to incubate at 56°C.", "success");
                                      }
                                    }
                                  }, 2000);
                                }
                              }}
                            >
                              {showMixPrompt && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg animate-pulse whitespace-nowrap">
                                  👆 Click to mix by inversion
                                </div>
                              )}
                              <TubeVisual
                                volume={bufferVolume + volumeAddedThisStep}
                                solidMass={currentSolidMass}
                                hasPellet={pelletVisible}
                                showSeparation={showPhaseSeparation}
                                onSupernatantClick={showPhaseSeparation ? () => setShowBioPopup("supernatant") : null}
                                onPelletClick={showPhaseSeparation ? () => setShowBioPopup("pellet") : null}
                                stepTitle={currentStep.title}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="text-center text-xs text-slate-400 font-mono space-y-1">
                      {currentSolidMass > 0 && (bufferVolume + volumeAddedThisStep === 0) ? (
                        <p className="text-sm font-bold">{currentSolidMass} mg tissue</p>
                      ) : currentStep.title === "Binding Preparation" ? (
                        <p className="text-sm font-bold text-emerald-400">Fresh Tube: {bufferVolume + volumeAddedThisStep} µl</p>
                      ) : (
                        <p className="text-sm font-bold">{bufferVolume + volumeAddedThisStep} µl</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: Reagents (35%) */}
                <div className="md:col-span-1 space-y-4">
                  {currentStep.requiresVolume && (
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                      <h3 className="text-sm font-bold text-white uppercase mb-3 flex items-center gap-2">
                        <FlaskConical size={16} /> Available Reagents
                      </h3>
                      <EnhancedReagentContainers
                        availableReagents={getAvailableReagents(currentStep).map(r => ({
                          ...r,
                          type: r.name.includes('Proteinase') ? 'tube' : 'bottle'
                        }))}
                        onContainerClick={(reagentId, color) => {
                          if (pipetteVolume && activeTool === 'pipette' && !pipetteHasLiquid) {
                            setPipetteHasLiquid(true);
                            setPipetteLiquidColor(color);
                            setCurrentReagentId(reagentId);

                            const reagentName = currentStep.reagents?.find(r => r.id === reagentId)?.name || reagentId;
                            if (difficultyMode !== "challenge") {
                              addLog(`Aspirated ${pipetteVolume}µL of ${reagentName}. Press plunger to dispense.`, "success");
                            }
                          }
                        }}
                        canAspirate={pipetteVolume !== null && !hasDispensedThisStep && !pipetteHasLiquid}
                        selectedPipette={activeTool === 'pipette'}
                      />
                    </div>
                  )}

                  {currentStep.options && protocolIndex === 0 && (
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                      <h3 className="text-sm font-bold text-white uppercase mb-3 text-center">Tissue Disruption Equipment</h3>
                      <div className="flex justify-center gap-8 mb-3">
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
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase mb-3">Select Action</h3>
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
                            setCurrentStepReagents({});
                            setCurrentReagentId(null);
                            setVolumeAddedThisStep(0);
                          } else {
                            setProtocolIndex(protocolIndex + 1);
                            setHasDispensedThisStep(false);
                            setHasSpunThisStep(false);
                            setNeedsMixing(false);
                            setIsMixing(false);
                            setCurrentStepReagents({});
                            setCurrentReagentId(null);
                            setVolumeAddedThisStep(0);
                          }
                        }} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl font-bold uppercase transition-all cursor-pointer border-0">
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column 3: Pipettes (35%) */}
                <div className="md:col-span-1">
                  {currentStep.title === "Column Binding" ? (
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl">
                      <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 mb-4">
                        <Pipette size={16} /> Transfer Tool
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-slate-900/50 border border-slate-600 p-4 rounded-lg">
                          <p className="text-xs text-slate-300 mb-3">Select 1000µL pipette to transfer sample:</p>
                          <button
                            onClick={() => {
                              setSelectedPipetteForTransfer('1000uL');
                              addLog("Selected 1000µL pipette for sample transfer", "info");
                            }}
                            className={`w-full px-4 py-3 rounded-lg font-bold transition-all ${
                              selectedPipetteForTransfer === '1000uL'
                                ? 'bg-sky-600 text-white ring-2 ring-sky-400'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            1000µL Pipette
                          </button>
                        </div>

                        {selectedPipetteForTransfer && (
                          <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg">
                            <p className="text-xs text-emerald-300">
                              <strong>Instructions:</strong><br/>
                              1. Click sample tube to aspirate<br/>
                              2. Click spin column to dispense
                            </p>
                          </div>
                        )}

                        {liquidInColumn && (
                          <div className="bg-sky-900/20 border border-sky-500/30 p-3 rounded-lg">
                            <p className="text-xs text-sky-300">
                              ✓ Sample loaded into column<br/>
                              Ready to spin!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : currentStep.requiresVolume && (
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2"><Pipette size={16} /> Pipettes</h3>
                      <PipetteSelector
                        requiredVolume={getTargetVolume()}
                        onVolumeSet={(volume, pipetteSize) => {
                          if (!hasDispensedThisStep || currentStep.multipleReagents) {
                            setPipetteVolume(volume);
                            setActiveTool('pipette');

                            if (difficultyMode !== "challenge") {
                              const remaining = getRemainingReagentsText();
                              addLog(`Pipette set to ${volume}µL. ${remaining || 'Click reagent container to aspirate.'}`, "info");
                            }
                          }
                        }}
                        onDispense={() => {
                          if (currentStep.isElution) {
                            setElutionVolume(pipetteVolume);
                          }

                          const reagentId = currentReagentId;
                          setVolumeAddedThisStep(prev => prev + pipetteVolume);

                          if (currentStep.multipleReagents && reagentId) {
                            setCurrentStepReagents(prev => ({
                              ...prev,
                              [reagentId]: pipetteVolume
                            }));
                            setStepVolumes(prev => ({ ...prev, [reagentId]: (prev[reagentId] || 0) + pipetteVolume }));
                          } else {
                            setStepVolumes(prev => {
                              const title = currentStep?.title;
                              if (title === "Lysis & Protein Digestion") return { ...prev, lysis: pipetteVolume };
                              if (title === "Wash & Dry") return { ...prev, wash: (prev.wash || 0) + pipetteVolume };
                              if (title === "Elution") return { ...prev, elution: pipetteVolume };
                              return prev;
                            });
                          }

                          const actualReagent = currentStep.reagents?.find(r => r.id === reagentId);
                          if (actualReagent && pipetteVolume) {
                            const targetVol = actualReagent.targetVolume;
                            const tolerance = actualReagent.tolerance || 50;
                            const minAcceptable = targetVol - tolerance;
                            const maxAcceptable = targetVol + tolerance;

                            if (pipetteVolume === targetVol) {
                              if (difficultyMode !== "challenge") {
                                addLog(`✓ Perfect volume: ${pipetteVolume}µL of ${actualReagent.name}`, "success");
                              }
                            } else if (pipetteVolume >= minAcceptable && pipetteVolume <= maxAcceptable) {
                              if (difficultyMode !== "challenge") {
                                addLog(`✓ Acceptable: ${pipetteVolume}µL of ${actualReagent.name} (target ${targetVol}µL)`, "success");
                              }
                            } else {
                              trackMistake('wrong_volume', {
                                expected: targetVol,
                                actual: pipetteVolume,
                                deviation: Math.abs(pipetteVolume - targetVol),
                                reagent: actualReagent.name
                              });
                              if (difficultyMode !== "challenge") {
                                addLog(`⚠️ Volume outside range: ${pipetteVolume}µL. Use ${minAcceptable}-${maxAcceptable}µL for ${actualReagent.name}`, "error");
                              }
                            }
                          } else if (difficultyMode !== "challenge") {
                            const reagentName = currentStep.reagents?.find(r => r.id === reagentId)?.name || 'reagent';
                            addLog(`Dispensed ${pipetteVolume}µL of ${reagentName}`, "success");
                          }

                          console.log('[DISPENSE DEBUG]', {
                            step: currentStep.title,
                            reagentId,
                            volume: pipetteVolume,
                            currentStepReagents
                          });

                          const reagentName = currentStep.reagents?.find(r => r.id === reagentId)?.name || reagentId;

                          if (currentStep.title === "Lysis & Protein Digestion") {
                            if (reagentId === "lysis") {
                              console.log('[STEP 1] Buffer ATL added: true');
                              setStep1SubActions(prev => {
                                const updated = { ...prev, lysisBufferAdded: true };
                                console.log('[STEP 1] Updated step1SubActions:', updated);
                                return updated;
                              });
                              showToastNotification(`✓ Added ${pipetteVolume}µL ${reagentName} to sample`);
                            } else if (reagentId === "proteinase_k") {
                              console.log('[STEP 1] Proteinase K added: true');
                              setStep1SubActions(prev => {
                                const updated = { ...prev, proteinaseKAdded: true };
                                console.log('[STEP 1] Updated step1SubActions:', updated);
                                return updated;
                              });
                              showToastNotification(`✓ Added ${pipetteVolume}µL ${reagentName} to sample`);
                            }
                          } else if (currentStep.title === "Binding Preparation") {
                            if (reagentId === "binding") {
                              setStep3SubActions(prev => ({ ...prev, bindingBufferAdded: true }));
                              showToastNotification(`✓ Added ${pipetteVolume}µL ${reagentName} to sample`);
                            } else if (reagentId === "ethanol") {
                              setStep3SubActions(prev => ({ ...prev, ethanolAdded: true }));
                              showToastNotification(`✓ Added ${pipetteVolume}µL ${reagentName} to sample`);
                            }
                          } else if (currentStep.title === "Wash & Dry") {
                            // For Wash & Dry, reset waste states so user can do multiple wash cycles
                            setHasDiscardedWaste(false);
                            setHasSpunThisStep(false);
                            showToastNotification(`✓ Added ${pipetteVolume}µL ${reagentName} to column`);
                          }

                          if (currentStep.multipleReagents) {
                            const allReagentsAdded = currentStep.reagents.every(r =>
                              currentStepReagents[r.id] || r.id === reagentId
                            );

                            if (!allReagentsAdded) {
                              const remaining = currentStep.reagents.filter(r =>
                                !currentStepReagents[r.id] && r.id !== reagentId
                              );
                              if (difficultyMode !== "challenge") {
                                addLog(`✓ ${reagentName} added. Next: ${remaining[0].name} (${remaining[0].targetVolume}µL)`, "info");
                              }
                              setPipetteVolume(null);
                              setActiveTool(null);
                              setPipetteHasLiquid(false);
                              setCurrentReagentId(null);
                              return;
                            } else {
                              setHasDispensedThisStep(true);
                              if (currentStep.title === "Lysis & Protein Digestion" || currentStep.title === "Binding Preparation") {
                                setShowMixPrompt(true);
                                if (difficultyMode !== "challenge") {
                                  addLog("✓ All reagents added. Click the tube to mix by inversion.", "info");
                                }
                              }
                            }
                          }

                          setPipetteVolume(null);
                          setActiveTool(null);
                          setPipetteHasLiquid(false);
                          setCurrentReagentId(null);

                          if (currentStep.isElution) {
                            if (difficultyMode !== "challenge") {
                              addLog("Elution buffer added. Wait 1 minute for DNA to elute from the membrane.", "info");
                            }
                            setTimeout(() => {
                              setHasDispensedThisStep(true);
                              if (difficultyMode !== "challenge") {
                                addLog("Elution wait complete. Proceed to centrifugation.", "success");
                              }
                            }, 1000);
                          } else if (currentStep.requiresMixing) {
                            setNeedsMixing(true);
                            if (difficultyMode !== "challenge") {
                              addLog("Click mix icon in sample tube to mix solution.", "info");
                            }
                          } else {
                            setHasDispensedThisStep(true);
                            if (difficultyMode !== "challenge") {
                              addLog("Reagent added. Ready for next step.", "success");
                            }
                          }
                        }}
                        disabled={
                          currentStep.multipleReagents
                            ? currentStep.reagents.every(r => currentStepReagents[r.id])
                            : hasDispensedThisStep
                        }
                        hasLiquid={pipetteHasLiquid}
                        liquidColor={pipetteLiquidColor}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Equipment Section - Full Width */}
              <LabEquipment
                inventory={inventory}
                onEquipmentUse={handleEquipmentUse}
                disabled={hasDispensedThisStep && !needsMixing && !(currentStep?.requiresSpin || currentStep?.requiresIncubation)}
              />

              {/* Continue Button - Full Width - DISABLED (now in header) */}
              {false && (() => {
                const cond1 = (currentStep.requiresVolume && hasDispensedThisStep) || (currentStep.options);
                const cond2 = currentStep.requiresSpin || currentStep.requiresIncubation ? hasSpunThisStep : true;
                const cond3 = currentStep.requiresMixing ? (currentStep.title === "Lysis & Protein Digestion" ? step2Mixed : currentStep.title === "Binding Preparation" ? step3Mixed : !needsMixing) : true;
                const showButton = cond1 && cond2 && cond3;

                console.log('[Continue Button Check]', {
                  step: currentStep?.title || 'unknown',
                  condition1: { requiresVolume: currentStep.requiresVolume, hasDispensedThisStep, hasOptions: !!currentStep.options, result: cond1 },
                  condition2: { requiresSpin: currentStep.requiresSpin, requiresIncubation: currentStep.requiresIncubation, hasSpunThisStep, result: cond2 },
                  condition3: { requiresMixing: currentStep.requiresMixing, step2Mixed, step3Mixed, needsMixing, result: cond3 },
                  showButton,
                  step1SubActions,
                  step3SubActions
                });

                return showButton;
              })() && (
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
                    if (currentStep.title === "Lysis & Protein Digestion") mixedThisStep = step2Mixed;
                    if (currentStep.title === "Binding Preparation") mixedThisStep = step3Mixed;

                    if (!mixedThisStep && needsMixing) {
                      addLog("Critical Error: Mixing step bypassed! The sample must be mixed after adding reagent.", "error");
                      setProtocolAdherenceCompromised(true);
                    }
                  }
                  if (currentStep.title === "Lysis & Protein Digestion") {
                    if (!step1SubActions.lysisBufferAdded) {
                      addLog("Error: Add Lysis Buffer before proceeding", "error");
                      setProtocolAdherenceCompromised(true);
                      return;
                    }
                    if (!step1SubActions.proteinaseKAdded) {
                      addLog("Error: Add Proteinase K before proceeding", "error");
                      setProtocolAdherenceCompromised(true);
                      return;
                    }
                    if (!step1SubActions.mixed) {
                      addLog("Error: Mix the tube by inversion before incubating", "error");
                      setProtocolAdherenceCompromised(true);
                      return;
                    }
                    if (!step1SubActions.incubated) {
                      addLog("Error: Incubate at 56°C before proceeding", "error");
                      setProtocolAdherenceCompromised(true);
                      return;
                    }
                  }

                  if (currentStep.title === "Binding Preparation") {
                    if (!step3SubActions.bindingBufferAdded) {
                      addLog("Error: Add Binding Buffer before proceeding", "error");
                      setProtocolAdherenceCompromised(true);
                      return;
                    }
                    if (!step3SubActions.ethanolAdded) {
                      addLog("Error: Add Ethanol before proceeding. DNA will NOT bind without ethanol!", "error");
                      setProtocolAdherenceCompromised(true);
                      return;
                    }
                    if (!step3SubActions.mixed) {
                      addLog("Error: Mix the tube by inversion before loading onto column", "error");
                      setProtocolAdherenceCompromised(true);
                      return;
                    }
                  }

                  if (currentStep.multipleReagents && currentStep.reagents) {
                    currentStep.reagents.forEach(reagent => {
                      const addedVolume = currentStepReagents[reagent.id] || 0;
                      if (addedVolume === 0) {
                        addLog(`Volume Error: ${reagent.name} was not added!`, "error");
                        setProtocolAdherenceCompromised(true);
                      } else if (addedVolume !== reagent.targetVolume) {
                        addLog(`Volume Error: Use exactly ${reagent.targetVolume}µL of ${reagent.name}.`, "error");
                        setProtocolAdherenceCompromised(true);
                      }
                    });
                  } else if (currentStep.reagents && currentStep.reagents[0]) {
                    const reagent = currentStep.reagents[0];
                    if (volumeAddedThisStep !== reagent.targetVolume) {
                      addLog(`Volume Error: Use exactly ${reagent.targetVolume}µL.`, "error");
                      setProtocolAdherenceCompromised(true);
                    }
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
                    setCurrentStepReagents({});
                    setCurrentReagentId(null);
                    setShowMixPrompt(false);
                  }
                }} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-4 px-6 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer border-0">
                  Continue to Next Step
                </button>
              )}

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
            </div>
          )}

          {screen === "lab" && status === "verification" && !showQuant && (
            <div className="min-h-screen bg-[#0f172a]">
              <SharedNavigation onShowManual={() => setShowManual(true)} />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
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
            </div>
          )}

          {screen === "lab" && showQuant && (
            <div className="min-h-screen bg-[#0f172a]">
              <SharedNavigation onShowManual={() => setShowManual(true)} />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
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
                    <div><span className="text-slate-500">Protocol Deviations:</span> <span className={mistakes.length > 0 ? "text-rose-400" : "text-emerald-400"}>{mistakes.length}</span></div>
                    <div><span className="text-slate-500">Stoichiometry:</span> <span className={stoichiometryError ? "text-rose-400" : "text-emerald-400"}>{stoichiometryError ? "Error" : "OK"}</span></div>
                  </div>
                </div>

                {mistakes.length > 0 && (() => {
                  const { consequences } = calculateConsequences();
                  return (
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-rose-500/30 text-left space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-rose-400" />
                        <h4 className="text-xs font-bold text-rose-400 uppercase">Protocol Deviations & Consequences</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-3">
                        Your protocol had {mistakes.length} deviation{mistakes.length !== 1 ? 's' : ''}. Each mistake affects your final DNA quality and yield.
                      </p>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {consequences.map((consequence, i) => (
                          <div key={i} className={`p-3 rounded-lg border ${
                            consequence.severity === 'critical' ? 'bg-rose-900/30 border-rose-500/50' :
                            consequence.severity === 'major' ? 'bg-amber-900/30 border-amber-500/50' :
                            'bg-slate-800/50 border-slate-600/50'
                          }`}>
                            <div className="flex items-start gap-2 mb-1">
                              <span className={`text-xs font-black uppercase tracking-wider ${
                                consequence.severity === 'critical' ? 'text-rose-400' :
                                consequence.severity === 'major' ? 'text-amber-400' :
                                'text-slate-400'
                              }`}>
                                {consequence.severity}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-white mb-1">{consequence.title}</h5>
                            <p className="text-[10px] text-slate-300 mb-1.5">{consequence.description}</p>
                            <div className="bg-slate-950/50 p-2 rounded border border-slate-700/50">
                              <p className="text-[9px] text-slate-400">
                                <span className="font-bold text-rose-300">Impact:</span> {consequence.impact}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-700/50 mt-3">
                        <p className="text-[10px] text-slate-400">
                          <span className="font-bold text-emerald-400">Learning Point:</span> In a real lab, these mistakes would compromise your experiment and waste valuable samples. Understanding WHY each step matters helps you become a better scientist.
                        </p>
                      </div>
                    </div>
                  );
                })()}

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
                    if (user) {
                      navigate('/browse');
                    } else {
                      setScreen("welcome");
                    }
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

              <button onClick={() => { if (user) { navigate('/browse'); } else { setScreen("welcome"); } }} className="w-full bg-slate-900/50 py-3 rounded-xl font-bold uppercase text-slate-400 border border-slate-700 cursor-pointer text-xs tracking-wide transition-all hover:bg-slate-900/70">
                Return to Browse
              </button>
              </div>
            </div>
          )}
        </main>

        {screen === "welcome" && <Footer />}
      </div>

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

      {showGuestSignupModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in duration-300">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <Trophy size={40} className="text-green-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nice work!
                </h2>
                <p className="text-gray-600 text-base">
                  You've completed the DNA Extraction trial. Sign up free to unlock all simulations and track your progress.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Access 10+ lab simulations</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Track your progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">Join your class</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-700">100% free forever</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wider text-sm"
              >
                Create Free Account
              </button>

              <button
                onClick={() => {
                  setShowGuestSignupModal(false);
                  navigate('/browse');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Lab Assistant temporarily disabled - needs API key configuration */}
      {/* <AILabAssistant /> */}

      {/* Toast Notification */}
      {showToast && toastMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
