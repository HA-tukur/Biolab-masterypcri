export const VERIFICATION = { NANODROP: "nanodrop", GEL: "gel" };

export const MISSIONS_DATA = {
  DNA_EXT: {
    A: {
      id: "A",
      title: "Superbug Clinical Diagnostic",
      brief: "Clinical Alert: A suspected multi-drug resistant pathogen has been detected. Your mission is to isolate high-purity genomic DNA for PCR verification.",
      summary: "Biopsy DNA Extraction. Target: 200 – 1000 ng/µL.",
      budget: 2000,
      requiredItems: ["kit_qiagen", "ethanol", "centrifuge", "incubator", "nanodrop"],
      verification: { mode: "REQUIRED_ALL", options: [VERIFICATION.NANODROP, VERIFICATION.GEL], label: "Use BOTH Nanodrop AND Gel (both required)." }
    },
    B: {
      id: "B",
      title: "Cassava Pathogen Sequencing",
      brief: "Agricultural Crisis: A new blight is threatening crop yields. Your mission is to isolate high-molecular-weight DNA for Next-Gen Sequencing.",
      summary: "Plant gDNA Extraction. Target: 200 – 350 ng/µL.",
      budget: 3000,
      requiredItems: ["kit_zymo", "ethanol", "mortar_pestle", "liquid_nitrogen", "vortex_mixer", "centrifuge", "incubator", "nanodrop"],
      verification: { mode: "REQUIRED_ALL", options: [VERIFICATION.NANODROP, VERIFICATION.GEL], label: "NGS prep requires BOTH Nanodrop + Gel verification." }
    }
  },
  PCR: {
    A: { id: "PCR_A", title: "Diagnostic Amplification", brief: "Targeting the 16S rRNA gene for pathogen identification.", summary: "Standard PCR Setup.", budget: 1500, locked: true },
    B: { id: "PCR_B", title: "Mutation Screening", brief: "Identifying SNPs in drug-resistance genes.", summary: "Advanced PCR Setup.", budget: 2500, locked: true }
  }
};
