import { ArrowLeft, FileText, Play, Dna, Beaker, Thermometer, Zap, Package, Droplets } from "lucide-react";
import { useState } from "react";

interface ProtocolOverviewProps {
  missionId: string;
  onBack: () => void;
  onStartMission: () => void;
}

interface ProtocolData {
  title: string;
  subtitle: string;
  location: string;
  targetGene: string;
  scenario: string;
  overview: string;
  objectives: string[];
  materials: {
    equipment: string[];
    reagents: string[];
  };
  steps: {
    title: string;
    icon: JSX.Element;
    description: string;
    keyPoints: string[];
    duration: string;
  }[];
  expectedResults: string;
  tips: string[];
}

const protocolsData: Record<string, ProtocolData> = {
  "lagos-diagnostic": {
    title: "The Lagos Diagnostic Hub",
    subtitle: "Human Genetics - Sickle Cell Disease Diagnosis",
    location: "Lagos, Nigeria",
    targetGene: "HBB (β-globin gene)",
    scenario: "A local clinic has three patients with severe fatigue and joint pain. Sickle Cell Disease (SCD) is suspected, but they need molecular confirmation.",
    overview: "This mission guides you through the complete PCR workflow to amplify a segment of the HBB gene for Sickle Cell Disease diagnosis. You will design primers, order and reconstitute them, set up the PCR reaction, run thermal cycling, and verify your results using gel electrophoresis.",
    objectives: [
      "Design primers that flank the HBB gene target region",
      "Calculate and prepare proper primer concentrations",
      "Assemble a PCR reaction with correct reagent ratios",
      "Execute thermal cycling with appropriate temperature protocols",
      "Verify amplification success using gel electrophoresis"
    ],
    materials: {
      equipment: [
        "Thermal cycler (PCR machine)",
        "Micropipettes (P2, P10, P20, P200)",
        "PCR tubes (0.2 mL)",
        "Vortex mixer",
        "Microcentrifuge",
        "Gel electrophoresis apparatus"
      ],
      reagents: [
        "Forward and Reverse primers (custom ordered)",
        "DNA template (patient genomic DNA)",
        "PCR Master Mix (contains Taq polymerase, dNTPs, buffer, MgCl₂)",
        "Nuclease-free water",
        "DNA ladder (for gel verification)",
        "Agarose gel with staining dye"
      ]
    },
    steps: [
      {
        title: "Primer Design",
        icon: <Dna size={24} />,
        description: "Design forward and reverse primers that flank your target sequence in the HBB gene.",
        keyPoints: [
          "Use NCBI Primer-BLAST or Primer3Plus for design",
          "Primers must be 18-30 bp in length",
          "GC content should be 40-60%",
          "Melting temperatures (Tm) should match within 5°C",
          "Check for specificity to avoid off-target amplification"
        ],
        duration: "15-30 minutes"
      },
      {
        title: "Primer Ordering",
        icon: <Package size={24} />,
        description: "Submit your primer sequences to a DNA synthesis company.",
        keyPoints: [
          "Primers arrive lyophilized (dry powder form)",
          "Standard synthesis takes 2-3 business days",
          "Verify sequences match your design exactly",
          "Store at -20°C until reconstitution"
        ],
        duration: "2-3 business days"
      },
      {
        title: "Primer Reconstitution",
        icon: <Droplets size={24} />,
        description: "Dissolve lyophilized primers in nuclease-free water to create stock solutions.",
        keyPoints: [
          "Centrifuge tubes briefly to collect powder",
          "Add nuclease-free water to achieve 100 μM stock concentration",
          "Vortex thoroughly for 30 seconds",
          "Create 10 μM working stocks by 1:10 dilution",
          "Store stocks at -20°C; working stocks at 4°C"
        ],
        duration: "10-15 minutes"
      },
      {
        title: "Reaction Setup",
        icon: <Beaker size={24} />,
        description: "Assemble all PCR components in a sterile PCR tube.",
        keyPoints: [
          "Work on ice to maintain enzyme activity",
          "Use filtered pipette tips to prevent contamination",
          "Add template DNA last to minimize contamination risk",
          "Mix gently by pipetting (avoid bubbles)",
          "Typical reaction volume: 25 μL total"
        ],
        duration: "10-15 minutes"
      },
      {
        title: "Thermal Cycling",
        icon: <Thermometer size={24} />,
        description: "Run the PCR program with precise temperature cycling.",
        keyPoints: [
          "Initial denaturation: 95°C for 3 minutes",
          "35 cycles of: 95°C (30s) → 50-65°C (30s) → 72°C (45s)",
          "Final extension: 72°C for 5 minutes",
          "Hold at 4°C until ready for next step",
          "Total run time: 2-3 hours"
        ],
        duration: "2-3 hours"
      },
      {
        title: "Gel Verification",
        icon: <Zap size={24} />,
        description: "Verify PCR amplification by running products on an agarose gel.",
        keyPoints: [
          "Load 5 μL of PCR product mixed with loading dye",
          "Run DNA ladder in first lane for size comparison",
          "Run gel at 100V for 30-45 minutes",
          "Visualize bands under UV light or blue light transilluminator",
          "Successful amplification shows a single, clear band"
        ],
        duration: "45-60 minutes"
      }
    ],
    expectedResults: "You should see a single, clear band at the expected molecular weight (approximately 200-500 bp depending on your primer design). The band indicates successful amplification of the HBB gene segment.",
    tips: [
      "Always include a negative control (no template DNA) to check for contamination",
      "Keep primers on ice during setup to maintain integrity",
      "Avoid cross-contamination by using separate workspaces for pre-PCR and post-PCR work",
      "If no band appears, troubleshoot primer design, annealing temperature, or template quality",
      "Document all reagent lot numbers and expiration dates for quality control"
    ]
  },
  "great-green-wall": {
    title: "The Great Green Wall Rescue",
    subtitle: "Plant Genetics - Drought Tolerance Screening",
    location: "Sahel Region, Senegal",
    targetGene: "DREB1 (Drought-tolerance marker)",
    scenario: "Farmers are losing pearl millet crops to drought. A particular landrace appears drought-resistant and might carry a 'stay-green' gene.",
    overview: "This mission guides you through PCR amplification of the DREB1 gene, a key drought tolerance marker in pearl millet. You will screen different millet varieties to identify drought-resistant genotypes for the Great Green Wall initiative.",
    objectives: [
      "Design primers specific to the DREB1 drought tolerance marker",
      "Extract and prepare DNA template from millet seeds",
      "Optimize PCR conditions for plant genomic DNA",
      "Compare amplification across multiple millet varieties",
      "Identify varieties carrying the drought tolerance marker"
    ],
    materials: {
      equipment: [
        "Thermal cycler (PCR machine)",
        "Micropipettes (P2, P10, P20, P200)",
        "PCR tubes (0.2 mL)",
        "Vortex mixer",
        "Microcentrifuge",
        "Gel electrophoresis apparatus"
      ],
      reagents: [
        "Forward and Reverse primers (DREB1-specific)",
        "DNA template (millet genomic DNA)",
        "PCR Master Mix (contains Taq polymerase, dNTPs, buffer, MgCl₂)",
        "Nuclease-free water",
        "DNA ladder (for gel verification)",
        "Agarose gel with staining dye"
      ]
    },
    steps: [
      {
        title: "Primer Design",
        icon: <Dna size={24} />,
        description: "Design primers targeting the DREB1 gene in pearl millet.",
        keyPoints: [
          "Use NCBI databases to find DREB1 sequence for pearl millet",
          "Design primers in conserved regions across varieties",
          "Primers must be 18-30 bp in length",
          "Target amplicon size: 200-400 bp for reliable amplification",
          "Verify specificity against pearl millet genome"
        ],
        duration: "20-40 minutes"
      },
      {
        title: "Primer Ordering",
        icon: <Package size={24} />,
        description: "Order your DREB1-specific primers from a synthesis company.",
        keyPoints: [
          "Verify primer sequences match DREB1 reference",
          "Consider ordering purification for critical applications",
          "Standard desalting is sufficient for most PCR applications",
          "Primers arrive lyophilized within 2-3 business days"
        ],
        duration: "2-3 business days"
      },
      {
        title: "Primer Reconstitution",
        icon: <Droplets size={24} />,
        description: "Prepare primer stock and working solutions.",
        keyPoints: [
          "Reconstitute to 100 μM stock concentration",
          "Prepare 10 μM working stocks for routine use",
          "Label tubes clearly with primer name and concentration",
          "Aliquot to minimize freeze-thaw cycles",
          "Store at -20°C long-term"
        ],
        duration: "10-15 minutes"
      },
      {
        title: "Reaction Setup",
        icon: <Beaker size={24} />,
        description: "Assemble PCR reactions for multiple millet samples.",
        keyPoints: [
          "Set up multiple reactions to screen different varieties",
          "Use master mix to ensure consistency across samples",
          "Include positive control (known drought-resistant variety)",
          "Include negative control (no template)",
          "Keep all components cold during setup"
        ],
        duration: "15-25 minutes"
      },
      {
        title: "Thermal Cycling",
        icon: <Thermometer size={24} />,
        description: "Amplify DREB1 marker using optimized PCR protocol.",
        keyPoints: [
          "Initial denaturation: 95°C for 3 minutes",
          "35 cycles: 95°C (30s) → 58°C (30s) → 72°C (40s)",
          "Final extension: 72°C for 5 minutes",
          "Plant DNA may require optimization of annealing temperature",
          "Run all samples simultaneously for consistency"
        ],
        duration: "2-3 hours"
      },
      {
        title: "Gel Verification",
        icon: <Zap size={24} />,
        description: "Compare amplification across different millet varieties.",
        keyPoints: [
          "Run all samples on the same gel for comparison",
          "Load samples in consistent order for easy tracking",
          "Document which samples show positive amplification",
          "Strong bands indicate presence of DREB1 marker",
          "Varieties with DREB1 marker are drought-tolerant candidates"
        ],
        duration: "45-60 minutes"
      }
    ],
    expectedResults: "Drought-resistant varieties will show a clear band at the expected size (200-400 bp). Varieties lacking the DREB1 marker will show no band or a very faint band. This data identifies which millet varieties to propagate for climate adaptation.",
    tips: [
      "Plant DNA quality is critical - ensure proper extraction methods",
      "Run a gradient PCR if optimization is needed for annealing temperature",
      "Screen multiple plants per variety to confirm genetic consistency",
      "Document field performance data alongside molecular results",
      "Share resistant varieties with farming communities for seed multiplication"
    ]
  }
};

export const ProtocolOverview = ({ missionId, onBack, onStartMission }: ProtocolOverviewProps) => {
  const [showFullProtocol, setShowFullProtocol] = useState(false);
  const protocol = protocolsData[missionId] || protocolsData["lagos-diagnostic"];

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white border-0 cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              Mission Protocol
            </h1>
            <p className="text-slate-400 text-sm">Review the complete protocol before starting</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-emerald-500/50 rounded-3xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-white">
              {protocol.title}
            </h2>
            <p className="text-emerald-400 font-bold">{protocol.subtitle}</p>
            <p className="text-slate-400 text-sm">📍 {protocol.location}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Scenario</h3>
              <p className="text-slate-300 leading-relaxed">{protocol.scenario}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
              <div>
                <h4 className="text-sm font-bold text-emerald-400 uppercase mb-2">Target Gene</h4>
                <p className="text-white font-mono">{protocol.targetGene}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-400 uppercase mb-2">Workflow</h4>
                <p className="text-slate-300 text-sm">Complete PCR Amplification</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-blue-300">Protocol Overview</h3>
            <p className="text-blue-200 text-sm leading-relaxed">{protocol.overview}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Learning Objectives</h3>
            <ul className="space-y-2">
              {protocol.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold mt-1">✓</span>
                  <span className="text-slate-300 text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Workflow Steps</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {protocol.steps.map((step, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="text-emerald-400">{step.icon}</div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{step.title}</h4>
                      <p className="text-xs text-slate-500">{step.duration}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-amber-300">⏱️ Estimated Total Time</h3>
            <p className="text-amber-200 text-sm">
              4-6 hours total (includes 2-3 hours of automated thermal cycling)
            </p>
            <p className="text-amber-200/70 text-xs">
              Note: Primer ordering adds 2-3 business days before you can begin the wet lab work
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowFullProtocol(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-bold uppercase border-0 cursor-pointer transition-all"
            >
              <FileText size={20} />
              View Full Protocol
            </button>
            <button
              onClick={onStartMission}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold uppercase border-0 cursor-pointer transition-all"
            >
              <Play size={20} />
              Start Mission
            </button>
          </div>
        </div>
      </div>

      {showFullProtocol && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-800 border border-emerald-500/50 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
              <h3 className="text-xl font-black uppercase text-emerald-400">Full Protocol Details</h3>
              <button
                onClick={() => setShowFullProtocol(false)}
                className="text-slate-400 hover:text-white border-0 bg-transparent cursor-pointer text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
                <h4 className="text-lg font-bold text-white">Required Equipment</h4>
                <ul className="space-y-2">
                  {protocol.materials.equipment.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-400">•</span>
                      <span className="text-slate-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
                <h4 className="text-lg font-bold text-white">Required Reagents</h4>
                <ul className="space-y-2">
                  {protocol.materials.reagents.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-emerald-400">•</span>
                      <span className="text-slate-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Detailed Step-by-Step Protocol</h4>
                {protocol.steps.map((step, index) => (
                  <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-emerald-400">{step.icon}</div>
                      <div>
                        <h5 className="font-bold text-white">Step {index + 1}: {step.title}</h5>
                        <p className="text-xs text-slate-500">{step.duration}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm">{step.description}</p>
                    <div>
                      <h6 className="text-sm font-bold text-emerald-400 mb-2">Key Points:</h6>
                      <ul className="space-y-1">
                        {step.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-emerald-400">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 space-y-3">
                <h4 className="text-lg font-bold text-emerald-300">Expected Results</h4>
                <p className="text-emerald-200 text-sm leading-relaxed">{protocol.expectedResults}</p>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 space-y-3">
                <h4 className="text-lg font-bold text-amber-300">Expert Tips</h4>
                <ul className="space-y-2">
                  {protocol.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-amber-400">💡</span>
                      <span className="text-amber-200 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 border-t border-slate-700 sticky bottom-0">
              <button
                onClick={onStartMission}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold uppercase border-0 cursor-pointer transition-all"
              >
                <Play size={20} />
                Start Mission
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
