import { X, Dna, Beaker, Thermometer, Zap, Package, Droplets, ExternalLink } from "lucide-react";
import { useState } from "react";
import { validatePrimerPair } from "../utils/primerValidation";
import { PrimerValidatedPage } from "./PrimerValidatedPage";
import { PrimerNotValidatedPage } from "./PrimerNotValidatedPage";

interface PCRModuleProps {
  onClose: () => void;
  onComplete: () => void;
  missionId?: string;
}

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

type PCRStage = "primer-design" | "primer-ordering" | "primer-reconstitution" | "reaction-setup" | "thermal-cycling" | "gel-electrophoresis";

export const PCRModule = ({ onClose, onComplete, missionId = "lagos-diagnostic" }: PCRModuleProps) => {
  const [currentStage, setCurrentStage] = useState<PCRStage>("primer-design");
  const [completedStages, setCompletedStages] = useState<Set<PCRStage>>(new Set());

  const [primerForward, setPrimerForward] = useState("");
  const [primerReverse, setPrimerReverse] = useState("");
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const [showFinalPage, setShowFinalPage] = useState(false);

  const [primerOrdered, setPrimerOrdered] = useState(false);
  const [reconstitutionDone, setReconstitutionDone] = useState(false);

  const [reactionSetup, setReactionSetup] = useState({
    template: false,
    primers: false,
    masterMix: false,
    water: false,
  });

  const [cyclingStatus, setCyclingStatus] = useState<"idle" | "running" | "complete">("idle");
  const [currentCycle, setCurrentCycle] = useState(0);
  const [cyclingPhase, setCyclingPhase] = useState<"denaturation" | "annealing" | "extension">("denaturation");

  const [gelStep, setGelStep] = useState<"idle" | "running" | "staining" | "complete">("idle");

  const totalCycles = 35;

  const missionData: Record<string, { targetGene: string, geneDesc: string, ncbiGeneId?: string, ncbiAccession?: string, ncbiGeneUrl?: string, ncbiAccessionUrl?: string }> = {
    "lagos-diagnostic": {
      targetGene: "HBB",
      geneDesc: "β-globin gene for Sickle Cell Disease diagnosis",
      ncbiGeneId: "3043",
      ncbiAccession: "NM_000518.5",
      ncbiGeneUrl: "https://www.ncbi.nlm.nih.gov/gene/3043",
      ncbiAccessionUrl: "https://www.ncbi.nlm.nih.gov/nuccore/NM_000518.5"
    },
    "great-green-wall": {
      targetGene: "DREB1",
      geneDesc: "Drought tolerance marker in pearl millet",
      ncbiAccession: "XM_020855695.2",
      ncbiAccessionUrl: "https://www.ncbi.nlm.nih.gov/nuccore/XM_020855695.2"
    }
  };

  const mission = missionData[missionId] || missionData["lagos-diagnostic"];

  const stages = [
    { id: "primer-design" as PCRStage, title: "Primer Design", icon: <Dna size={20} /> },
    { id: "primer-ordering" as PCRStage, title: "Order Primers", icon: <Package size={20} /> },
    { id: "primer-reconstitution" as PCRStage, title: "Reconstitute", icon: <Droplets size={20} /> },
    { id: "reaction-setup" as PCRStage, title: "Reaction Setup", icon: <Beaker size={20} /> },
    { id: "thermal-cycling" as PCRStage, title: "Thermal Cycling", icon: <Thermometer size={20} /> },
    { id: "gel-electrophoresis" as PCRStage, title: "Gel Verification", icon: <Zap size={20} /> },
  ];

  const markStageComplete = (stage: PCRStage) => {
    const newCompleted = new Set(completedStages);
    newCompleted.add(stage);
    setCompletedStages(newCompleted);
  };

  const validatePrimers = () => {
    const result = validatePrimerPair({
      forward: primerForward,
      reverse: primerReverse
    });

    setValidationResult(result);
    setShowFinalPage(true);
  };

  const handleTryAgain = () => {
    setShowFinalPage(false);
    setValidationResult(null);
  };

  const handleBackToLibrary = () => {
    onClose();
  };

  const handleOrderPrimers = () => {
    setPrimerOrdered(true);
    markStageComplete("primer-ordering");
  };

  const handleReconstitutionComplete = () => {
    setReconstitutionDone(true);
    markStageComplete("primer-reconstitution");
  };

  const allReagentsAdded = Object.values(reactionSetup).every((v) => v);

  const handleReactionComplete = () => {
    if (allReagentsAdded) {
      markStageComplete("reaction-setup");
    }
  };

  const startThermalCycling = () => {
    setCyclingStatus("running");
    simulateCycles();
  };

  const simulateCycles = () => {
    let cycle = 0;
    const phases: Array<"denaturation" | "annealing" | "extension"> = ["denaturation", "annealing", "extension"];
    let phaseIndex = 0;

    const interval = setInterval(() => {
      setCyclingPhase(phases[phaseIndex]);
      phaseIndex++;

      if (phaseIndex >= phases.length) {
        phaseIndex = 0;
        cycle++;
        setCurrentCycle(cycle);

        if (cycle >= totalCycles) {
          clearInterval(interval);
          setCyclingStatus("complete");
          markStageComplete("thermal-cycling");
        }
      }
    }, 300);
  };

  const handleGelComplete = () => {
    setGelStep("complete");
    markStageComplete("gel-electrophoresis");
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const canProgress = (stage: PCRStage) => {
    const stageOrder: PCRStage[] = ["primer-design", "primer-ordering", "primer-reconstitution", "reaction-setup", "thermal-cycling", "gel-electrophoresis"];
    const currentIndex = stageOrder.indexOf(stage);
    if (currentIndex === 0) return true;
    const previousStage = stageOrder[currentIndex - 1];
    return completedStages.has(previousStage);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-800 border border-emerald-500/50 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3 text-emerald-400">
            <Dna size={24} />
            <div>
              <h3 className="font-mono font-bold uppercase tracking-widest">PCR Amplification</h3>
              <p className="text-xs text-slate-400 mt-1">Target: {mission.targetGene} ({mission.geneDesc})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white border-0 bg-transparent cursor-pointer transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 p-4 bg-slate-900/30 border-b border-slate-700 overflow-x-auto">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => canProgress(stage.id) && setCurrentStage(stage.id)}
              disabled={!canProgress(stage.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-0 cursor-pointer transition-all whitespace-nowrap text-xs ${
                currentStage === stage.id
                  ? "bg-emerald-600 text-white"
                  : completedStages.has(stage.id)
                  ? "bg-emerald-900/50 text-emerald-300"
                  : canProgress(stage.id)
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              {stage.icon}
              <span className="font-bold">{stage.title}</span>
              {completedStages.has(stage.id) && <span className="text-emerald-400">✓</span>}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-6 text-white max-h-[600px] overflow-y-auto">
          {showFinalPage ? (
            validationResult?.isValid ? (
              <PrimerValidatedPage onTryAgain={handleTryAgain} onBackToLibrary={handleBackToLibrary} />
            ) : (
              <PrimerNotValidatedPage onTryAgain={handleTryAgain} onBackToLibrary={handleBackToLibrary} errors={validationResult?.errors || []} />
            )
          ) : currentStage === "primer-design" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase mb-2">Primer Design</h2>
                <p className="text-slate-400 text-sm">
                  Design primers to flank your target sequence: {mission.targetGene}
                </p>
              </div>

              <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                <p className="text-sm text-emerald-300 font-bold mb-2">Target Gene Reference</p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-emerald-400 font-bold">Gene: </span>
                    <span className="text-white">{mission.targetGene} ({mission.geneDesc})</span>
                  </div>
                  {mission.ncbiGeneId && (
                    <div className="text-sm">
                      <span className="text-emerald-400 font-bold">NCBI Gene ID: </span>
                      <span className="text-white">{mission.ncbiGeneId}</span>
                    </div>
                  )}
                  {mission.ncbiAccession && (
                    <div className="text-sm">
                      <span className="text-emerald-400 font-bold">RefSeq{mission.ncbiGeneId ? ' mRNA' : ' Accession'}: </span>
                      <span className="text-white">{mission.ncbiAccession}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {mission.ncbiGeneUrl && (
                      <a
                        href={mission.ncbiGeneUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-800/30 hover:bg-emerald-800/50 border border-emerald-500/30 rounded-lg transition-all no-underline text-xs font-bold text-emerald-200"
                      >
                        <span>NCBI Gene Page</span>
                        <ExternalLink size={14} className="text-emerald-400" />
                      </a>
                    )}
                    {mission.ncbiAccessionUrl && (
                      <a
                        href={mission.ncbiAccessionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-800/30 hover:bg-emerald-800/50 border border-emerald-500/30 rounded-lg transition-all no-underline text-xs font-bold text-emerald-200"
                      >
                        <span>NCBI Sequence Page</span>
                        <ExternalLink size={14} className="text-emerald-400" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                <p className="text-sm text-blue-300 font-bold mb-2">External Design Tools</p>
                <p className="text-xs text-blue-200 mb-3">
                  Primer-BLAST uses Forward/Reverse primers; Primer3 uses Left/Right primers.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <a
                    href="https://www.ncbi.nlm.nih.gov/tools/primer-blast/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-800/30 hover:bg-blue-800/50 border border-blue-500/30 rounded-lg transition-all no-underline"
                  >
                    <span className="text-sm font-bold text-blue-200">NCBI Primer-BLAST</span>
                    <ExternalLink size={16} className="text-blue-400" />
                  </a>
                  <a
                    href="https://www.primer3plus.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-800/30 hover:bg-blue-800/50 border border-blue-500/30 rounded-lg transition-all no-underline"
                  >
                    <span className="text-sm font-bold text-blue-200">Primer3Plus</span>
                    <ExternalLink size={16} className="text-blue-400" />
                  </a>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-bold text-emerald-400 mb-2">Primer Requirements:</h4>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Length: 18-30 nucleotides</li>
                      <li>• Tm: 55-65°C (within 5°C)</li>
                      <li>• GC Content: 40-60%</li>
                      <li>• Avoid self-complementarity</li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-400 mb-2">Design Tips:</h4>
                    <ul className="space-y-1 text-slate-300">
                      <li>• Check specificity in databases</li>
                      <li>• Avoid repeats (poly-G/C)</li>
                      <li>• End with G or C (clamp)</li>
                      <li>• Target 100-500 bp product</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-emerald-400 mb-2">
                      Forward Primer (5' → 3'):
                    </label>
                    <input
                      type="text"
                      value={primerForward}
                      onChange={(e) => setPrimerForward(e.target.value.toUpperCase().replace(/[^ATCG]/g, ""))}
                      placeholder="Enter primer sequence (A, T, C, G only)"
                      className="w-full bg-slate-950 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-sm"
                      maxLength={30}
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Length: {primerForward.length} bp {primerForward.length >= 18 && primerForward.length <= 30 ? "✓" : ""}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-emerald-400 mb-2">
                      Reverse Primer (5' → 3'):
                    </label>
                    <input
                      type="text"
                      value={primerReverse}
                      onChange={(e) => setPrimerReverse(e.target.value.toUpperCase().replace(/[^ATCG]/g, ""))}
                      placeholder="Enter primer sequence (A, T, C, G only)"
                      className="w-full bg-slate-950 border border-slate-600 rounded-lg px-4 py-3 text-white font-mono text-sm"
                      maxLength={30}
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Length: {primerReverse.length} bp {primerReverse.length >= 18 && primerReverse.length <= 30 ? "✓" : ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={validatePrimers}
                  disabled={primerForward.length === 0 || primerReverse.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer transition-all"
                >
                  Validate Primers
                </button>
              </div>
            </div>
          )}

          {currentStage === "primer-ordering" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase mb-2">Order Primers</h2>
                <p className="text-slate-400 text-sm">
                  Send your primer sequences to a synthesis company
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
                  <p className="text-xs text-amber-300 font-bold mb-2">⏱️ Typical Turnaround Time:</p>
                  <ul className="text-xs text-amber-200 space-y-1">
                    <li>• Standard synthesis: 2-3 business days</li>
                    <li>• Overnight: 24 hours (additional cost)</li>
                    <li>• Primers arrive lyophilized (dry powder)</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-800/50 border border-slate-600 rounded-lg">
                    <h4 className="font-bold text-emerald-400 mb-2">Your Primer Order:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-slate-900/50 p-3 rounded">
                        <p className="text-xs text-slate-400 mb-1">Forward Primer:</p>
                        <p className="text-white font-mono break-all">{primerForward || "Not entered"}</p>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded">
                        <p className="text-xs text-slate-400 mb-1">Reverse Primer:</p>
                        <p className="text-white font-mono break-all">{primerReverse || "Not entered"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <h4 className="font-bold text-blue-400 mb-2 text-sm">Common Synthesis Companies:</h4>
                    <ul className="text-xs text-blue-200 space-y-1">
                      <li>• Integrated DNA Technologies (IDT)</li>
                      <li>• Sigma-Aldrich/Merck</li>
                      <li>• Thermo Fisher Scientific</li>
                      <li>• Eurofins Genomics</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleOrderPrimers}
                  disabled={primerOrdered}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer transition-all"
                >
                  {primerOrdered ? "Order Placed ✓" : "Place Primer Order"}
                </button>
              </div>
            </div>
          )}

          {currentStage === "primer-reconstitution" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase mb-2">Primer Reconstitution</h2>
                <p className="text-slate-400 text-sm">
                  Dissolve lyophilized primers in nuclease-free water
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <p className="text-sm text-blue-300 font-bold mb-2">📋 Reconstitution Protocol:</p>
                  <ol className="text-xs text-blue-200 space-y-2">
                    <li>1. Spin down tube briefly to collect powder at bottom</li>
                    <li>2. Add nuclease-free water to achieve 100 μM concentration</li>
                    <li>3. Vortex thoroughly for 30 seconds</li>
                    <li>4. Let stand for 5 minutes at room temperature</li>
                    <li>5. Create 10 μM working stocks by dilution</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-800/50 border border-emerald-500/30 rounded-lg">
                    <h4 className="font-bold text-emerald-400 mb-3 text-sm">Reconstitution Checklist:</h4>
                    <div className="space-y-2">
                      {[
                        { label: "Centrifuge primers (brief spin)", key: "spin" },
                        { label: "Add nuclease-free water", key: "water" },
                        { label: "Vortex thoroughly", key: "vortex" },
                        { label: "Create working dilutions", key: "dilute" }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-3 p-2 bg-slate-900/30 rounded cursor-pointer hover:bg-slate-900/50 transition-all">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm text-slate-300">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                    <p className="text-xs text-amber-300 font-bold mb-2">💡 Storage Tips:</p>
                    <ul className="text-xs text-amber-200 space-y-1">
                      <li>• Store stock primers at -20°C</li>
                      <li>• Working stocks can be kept at 4°C for 1 month</li>
                      <li>• Avoid repeated freeze-thaw cycles</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleReconstitutionComplete}
                  disabled={reconstitutionDone}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer transition-all"
                >
                  {reconstitutionDone ? "Reconstitution Complete ✓" : "Complete Reconstitution"}
                </button>
              </div>
            </div>
          )}

          {currentStage === "reaction-setup" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase mb-2">Reaction Setup</h2>
                <p className="text-slate-400 text-sm">
                  Combine all reagents in a PCR tube
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
                  <p className="text-xs text-amber-300 font-bold mb-2">⚠️ Contamination Control:</p>
                  <ul className="text-xs text-amber-200 space-y-1">
                    <li>• Use filtered pipette tips</li>
                    <li>• Work in dedicated PCR workstation</li>
                    <li>• Add template DNA last</li>
                    <li>• Keep tubes on ice</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "template", label: "Template DNA", desc: "Your extracted genomic DNA sample", amount: "1 μL" },
                    { key: "primers", label: "Forward & Reverse Primers", desc: "10 μM working stocks", amount: "1 μL each" },
                    { key: "masterMix", label: "Master Mix", desc: "Contains Taq polymerase, dNTPs, buffer, MgCl₂", amount: "12.5 μL" },
                    { key: "water", label: "Nuclease-free Water", desc: "Adjust to final volume", amount: "to 25 μL" }
                  ].map((reagent) => (
                    <div
                      key={reagent.key}
                      className={`p-4 rounded-lg border transition-all ${
                        reactionSetup[reagent.key as keyof typeof reactionSetup]
                          ? "bg-emerald-900/30 border-emerald-500/50"
                          : "bg-slate-800/50 border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white">{reagent.label}</h4>
                            <span className="text-xs text-emerald-400 font-mono">{reagent.amount}</span>
                          </div>
                          <p className="text-xs text-slate-400">{reagent.desc}</p>
                        </div>
                        <button
                          onClick={() =>
                            setReactionSetup({
                              ...reactionSetup,
                              [reagent.key]: !reactionSetup[reagent.key as keyof typeof reactionSetup],
                            })
                          }
                          className={`px-4 py-2 rounded-lg border-0 cursor-pointer font-bold text-sm transition-all ${
                            reactionSetup[reagent.key as keyof typeof reactionSetup]
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-600 hover:bg-slate-500 text-white"
                          }`}
                        >
                          {reactionSetup[reagent.key as keyof typeof reactionSetup] ? "Added ✓" : "Add"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/50 border border-slate-600 p-4 rounded-lg">
                  <p className="text-xs text-slate-400 font-bold mb-2">Final Reaction Volume: 25 μL</p>
                  <p className="text-xs text-slate-500">Mix gently by pipetting. Avoid introducing bubbles.</p>
                </div>

                <button
                  onClick={handleReactionComplete}
                  disabled={!allReagentsAdded}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer transition-all"
                >
                  {allReagentsAdded ? "Reaction Ready ✓" : `Add All Reagents (${Object.values(reactionSetup).filter(Boolean).length}/4)`}
                </button>
              </div>
            </div>
          )}

          {currentStage === "thermal-cycling" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase mb-2">Thermal Cycling</h2>
                <p className="text-slate-400 text-sm">
                  Automated temperature cycling to amplify your target DNA
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className={`p-4 rounded-lg transition-all ${cyclingPhase === "denaturation" && cyclingStatus === "running" ? "bg-red-900/40 border border-red-500/50" : "bg-slate-800/50 border border-slate-600"}`}>
                    <h4 className="font-bold text-red-400 mb-2">1. Denaturation</h4>
                    <p className="text-2xl font-black mb-1">~95°C</p>
                    <p className="text-xs text-slate-300">DNA strands separate</p>
                  </div>
                  <div className={`p-4 rounded-lg transition-all ${cyclingPhase === "annealing" && cyclingStatus === "running" ? "bg-blue-900/40 border border-blue-500/50" : "bg-slate-800/50 border border-slate-600"}`}>
                    <h4 className="font-bold text-blue-400 mb-2">2. Annealing</h4>
                    <p className="text-2xl font-black mb-1">50-65°C</p>
                    <p className="text-xs text-slate-300">Primers bind to DNA</p>
                  </div>
                  <div className={`p-4 rounded-lg transition-all ${cyclingPhase === "extension" && cyclingStatus === "running" ? "bg-green-900/40 border border-green-500/50" : "bg-slate-800/50 border border-slate-600"}`}>
                    <h4 className="font-bold text-green-400 mb-2">3. Extension</h4>
                    <p className="text-2xl font-black mb-1">~72°C</p>
                    <p className="text-xs text-slate-300">Taq synthesizes new DNA</p>
                  </div>
                </div>

                {cyclingStatus !== "idle" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-300">Cycle Progress:</span>
                      <span className="text-lg font-black text-emerald-400">{currentCycle} / {totalCycles}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${(currentCycle / totalCycles) * 100}%` }}
                      />
                    </div>
                    {cyclingStatus === "running" && (
                      <p className="text-xs text-slate-400 text-center animate-pulse">
                        Current: {cyclingPhase.charAt(0).toUpperCase() + cyclingPhase.slice(1)}...
                      </p>
                    )}
                  </div>
                )}

                {cyclingStatus === "idle" && (
                  <div className="bg-slate-800/50 border border-slate-600 p-4 rounded-lg">
                    <h4 className="font-bold text-white mb-2">Protocol Summary:</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Initial Denaturation: 95°C for 3 min</li>
                      <li>• {totalCycles} Cycles: 95°C → 50-65°C → 72°C</li>
                      <li>• Final Extension: 72°C for 5 min</li>
                      <li>• Total Time: ~2-3 hours</li>
                    </ul>
                  </div>
                )}

                <button
                  onClick={startThermalCycling}
                  disabled={cyclingStatus !== "idle"}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer transition-all"
                >
                  {cyclingStatus === "idle" && "Start Thermal Cycler"}
                  {cyclingStatus === "running" && "Cycling in Progress..."}
                  {cyclingStatus === "complete" && "Amplification Complete ✓"}
                </button>
              </div>
            </div>
          )}

          {currentStage === "gel-electrophoresis" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase mb-2">Gel Electrophoresis</h2>
                <p className="text-slate-400 text-sm">
                  Verify your PCR amplification product
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 space-y-6">
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                  <p className="text-xs text-blue-300 font-bold mb-2">ℹ️ Note:</p>
                  <p className="text-xs text-blue-200">
                    This is a quick visualization. Full gel electrophoresis techniques will be covered in the dedicated Gel Electrophoresis module.
                  </p>
                </div>

                <div className="flex justify-center items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-2 font-bold">DNA Ladder</p>
                    <GelLaneComp bands={[{y:20,h:2,w:20},{y:50,h:2,w:20},{y:80,h:2,w:20},{y:110,h:2,w:20}]} blank={false} />
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-2 font-bold">Your PCR Product</p>
                    {gelStep !== "idle" ? (
                      <GelLaneComp bands={[{y:60,h:5,a:0.95,w:26}]} />
                    ) : (
                      <GelLaneComp blank={true} />
                    )}
                  </div>
                </div>

                {gelStep === "complete" && (
                  <div className="bg-emerald-900/30 border border-emerald-500/50 p-4 rounded-lg">
                    <h4 className="font-bold text-emerald-400 mb-2">✓ Amplification Successful!</h4>
                    <p className="text-xs text-emerald-200">
                      A clear, distinct band is visible at the expected size. Your PCR successfully amplified the {mission.targetGene} sequence.
                    </p>
                  </div>
                )}

                {gelStep === "idle" && (
                  <button
                    onClick={() => setGelStep("running")}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer"
                  >
                    Load Gel
                  </button>
                )}

                {gelStep === "running" && (
                  <button
                    onClick={() => {
                      setGelStep("staining");
                      setTimeout(() => {
                        handleGelComplete();
                      }, 2000);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold uppercase border-0 cursor-pointer animate-pulse"
                  >
                    Run Electrophoresis
                  </button>
                )}

                {gelStep === "staining" && (
                  <p className="text-center text-sm text-slate-300 animate-pulse">
                    Staining and imaging...
                  </p>
                )}

                {gelStep === "complete" && (
                  <p className="text-emerald-400 text-sm font-bold text-center uppercase mt-4">
                    PCR Complete ✓
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-bold uppercase border-0 cursor-pointer transition-all"
          >
            Cancel
          </button>
          <div className="text-sm text-slate-400">
            Stage {stages.findIndex(s => s.id === currentStage) + 1} of {stages.length}
          </div>
        </div>
      </div>
    </div>
  );
};
