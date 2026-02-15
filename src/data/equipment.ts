export const kits_list = [
  { id: "kit_qiagen", name: "Qiagen DNeasy Kit", cost: 1450, desc: "Highest purity yield for animal tissue and blood samples. Kit includes: Buffer ATL (Lysis Buffer), Proteinase K (20 mg/ml), Buffer AL (Binding Buffer), Buffer AW1 & AW2 (Wash Buffers - add ethanol before use), Buffer AE (Elution Buffer), DNeasy Mini Spin Columns (50), Collection tubes. ⚠️ You need to purchase separately: Ethanol 96-100% (150 BC). Capacity: ~50 extractions. Cost per extraction: ~29 BC. Optimized for: Animal tissue, blood, cultured cells", type: "extraction" },
  { id: "kit_zymo", name: "Zymo Research Quick-DNA (Plant)", cost: 1100, desc: "Optimized for PLANT tissue lysis. ⚠️ NOTE: This is a PLANT DNA extraction kit. For animal tissue, use Qiagen or Thermo Fisher kits instead. Kit includes: Lysis Buffer with bead-beating capability, Binding Buffer, Wash Buffers, Elution Buffer, Spin columns (50). ✗ Does NOT include Proteinase K (not needed for plants). Additional equipment needed: Liquid nitrogen, Mortar and pestle (for mechanical disruption), Ethanol 96-100%. Optimized for: Plant leaves, seeds, roots, fungi", type: "extraction" },
  { id: "kit_thermo", name: "Thermo Fisher PureLink", cost: 1300, desc: "Standard genomic DNA extraction kit for animal samples. Kit includes: Lysis Buffer, Proteinase K, Binding Buffer, Wash Buffers (add ethanol before use), Elution Buffer, Spin columns (50). ⚠️ You need to purchase separately: Ethanol 96-100% (150 BC). Capacity: ~50 extractions. Cost per extraction: ~26 BC. Optimized for: Genomic DNA from various animal samples", type: "extraction" },
  { id: "kit_pcr_neb", name: "NEB OneTaq PCR Kit", cost: 1200, desc: "Complete PCR kit with all reagents for reliable amplification.", type: "pcr" },
  { id: "kit_pcr_bio", name: "Bio-Rad iQ PCR Kit", cost: 1350, desc: "High-fidelity PCR system for demanding applications.", type: "pcr" }
];

export const tools_list = [
  { id: "centrifuge", name: "Centrifuge (Communal)", cost: 0, desc: "Mandatory hardware for phase separation.", category: "general" },
  { id: "nanodrop", name: "Nanodrop (Communal)", cost: 0, desc: "Quantifies DNA yield and purity using UV light.", category: "general" },
  { id: "incubator", name: "Incubator (Communal)", cost: 0, desc: "Provides controlled temperature for enzymatic reactions.", category: "general" },
  { id: "freezer", name: "Freezer (Communal)", cost: 0, desc: "Stores samples and reagents at low temperature.", category: "general" },
  { id: "mortar_pestle", name: "Mortar and Pestle", cost: 0, desc: "Mechanical grinding tool for tough plant tissues.", category: "extraction" },
  { id: "liquid_nitrogen", name: "Liquid Nitrogen", cost: 0, desc: "Ultra-cold reagent for flash-freezing tissues before grinding.", category: "extraction" },
  { id: "ethanol", name: "Ethanol (96-100%)", cost: 150, desc: "High-purity ethanol for DNA precipitation, wash buffer preparation, and sterilization. Required to prepare wash buffers in DNA extraction kits. Flammable - store away from heat sources.", category: "solvents", volume: "500 ml" },
  { id: "rnase_a", name: "RNase A (ADVANCED - Optional)", cost: 300, desc: "Ribonuclease A - degrades RNA to produce RNA-free DNA samples. Optional addition to DNA extraction protocols when RNA contamination must be avoided (e.g., sensitive sequencing applications). Storage: -20°C", category: "enzymes", volume: "10 mg (100 µl at 100 mg/ml)", badge: "ADVANCED" },
  { id: "wash_buffer", name: "Wash Buffer (Salt/EtOH)", cost: 300, desc: "Removes residual proteins from the matrix.", category: "extraction" },
  { id: "elute_buffer", name: "Elution Buffer (Tris-EDTA)", cost: 300, desc: "Releases DNA from the silica membrane.", category: "extraction" },
  { id: "thermal_cycler", name: "Thermal Cycler", cost: 0, desc: "Automatically cycles temperatures for DNA amplification.", category: "pcr" },
  { id: "micropipettes", name: "Micropipettes (P10, P20, P200)", cost: 0, desc: "Used to accurately measure microliter volumes.", category: "pcr" },
  { id: "master_mix", name: "Master Mix", cost: 600, desc: "Pre-mixed solution of DNA polymerase (Taq/KOD), dNTPs, and buffer with MgCl₂.", category: "pcr" },
  { id: "nuclease_free_water", name: "Nuclease-free Water", cost: 200, desc: "Used to adjust final reaction volume without contaminants.", category: "pcr" },
  { id: "primers_fw_rv", name: "Forward/Reverse Primers", cost: 450, desc: "Specifically synthesized DNA sequences flanking your target gene.", category: "pcr" }
];

export const consumables_ppe_list = [
  { id: "safety_goggles", name: "Safety Goggles", cost: 0, desc: "Eye protection against chemical splashes and biological hazards.", category: "general" },
  { id: "lab_coat", name: "Lab Coat", cost: 0, desc: "Personal protective clothing to shield from spills and contamination.", category: "general" },
  { id: "petri_dishes", name: "Petri Dishes", cost: 0, desc: "Sterile culture dishes for sample preparation.", category: "general" },
  { id: "pipette_tips", name: "Pipette Tips", cost: 0, desc: "Sterile disposable tips for accurate liquid transfer.", category: "general" },
  { id: "tubes", name: "Tubes", cost: 0, desc: "Single-use 1.5mL or 2mL tubes for sample handling.", category: "general" },
  { id: "gloves", name: "Gloves", cost: 0, desc: "Disposable nitrile or latex gloves for hand protection.", category: "general" },
  { id: "filter_tips", name: "Filter Pipette Tips", cost: 0, desc: "Prevents aerosol contamination between samples.", category: "pcr" },
  { id: "pcr_tubes", name: "0.2 mL PCR Tubes", cost: 0, desc: "Thin-walled tubes for efficient heat transfer in the cycler.", category: "pcr" }
];

export const design_tools_list = [
  {
    id: "ncbi_primer_blast",
    name: "NCBI Primer-BLAST",
    desc: "Design Forward/Reverse primers with specificity checking against databases.",
    url: "https://www.ncbi.nlm.nih.gov/tools/primer-blast/",
    note: "Primers labeled as Forward and Reverse"
  },
  {
    id: "primer3plus",
    name: "Primer3Plus",
    desc: "Design Left/Right primers with advanced parameter control.",
    url: "https://www.primer3plus.com/",
    note: "Primers labeled as Left and Right"
  }
];
