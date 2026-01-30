export const kits_list = [
  { id: "kit_qiagen", name: "Qiagen DNeasy Kit", cost: 1450, desc: "Highest purity yield for complex biopsies.", type: "extraction" },
  { id: "kit_zymo", name: "Zymo Research Quick-DNA", cost: 1100, desc: "Optimized for plant tissue lysis.", type: "extraction" },
  { id: "kit_thermo", name: "Thermo Fisher PureLink", cost: 1300, desc: "Standard genomic DNA kit.", type: "extraction" },
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
  { id: "proteinase_k", name: "Proteinase K Enzyme", cost: 350, desc: "Digests proteins to improve DNA purity.", category: "extraction" },
  { id: "lysis_clean", name: "Manual Lysis Buffer", cost: 400, desc: "Buffer required for cell lysis.", category: "extraction" },
  { id: "wash_buffer", name: "Wash Buffer (Salt/EtOH)", cost: 300, desc: "Removes residual proteins from the matrix.", category: "extraction" },
  { id: "elute_buffer", name: "Elution Buffer (Tris-EDTA)", cost: 300, desc: "Releases DNA from the silica membrane.", category: "extraction" },
  { id: "column", name: "Silica Spin Columns", cost: 450, desc: "Matrix for DNA purification.", category: "extraction" },
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
