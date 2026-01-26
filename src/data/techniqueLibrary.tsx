import {
  Dna, Pipette, Beaker, ShieldCheck, Eye, Binary, Grip, Activity,
  SearchCode, Circle, Scissors, FlaskConical, RefreshCw, Droplet,
  ScanEye, Microscope, Camera
} from "lucide-react";
import { AntibodyIcon } from "../components/AntibodyIcon";

export const TECHNIQUE_LIBRARY = [
  {
    category: "Core Lab Skills",
    items: [
      { id: "DNA_EXT", title: "DNA Extraction", level: "Foundation", status: "ACTIVE", icon: <Dna size={22}/> },
      { id: "PIPETTE", title: "Pipetting & Measurements", level: "Foundation", status: "LOCKED", icon: <Pipette size={22}/> },
      { id: "SOL_PREP", title: "Solution Preparation & Dilutions", level: "Foundation", status: "LOCKED", icon: <Beaker size={22}/> },
      { id: "SAFETY", title: "Lab Safety & Equipment", level: "Foundation", status: "LOCKED", icon: <ShieldCheck size={22}/> },
      { id: "MICROSCOPY_BASICS", title: "Microscopy Basics", level: "Foundation", status: "LOCKED", icon: <Eye size={22}/> }
    ]
  },
  {
    category: "Nucleic Acid Techniques",
    items: [
      { id: "PCR", title: "PCR", level: "Applied", status: "ACTIVE", icon: <Binary size={22}/> },
      { id: "GEL", title: "Agarose Gel Electrophoresis", level: "Foundation", status: "LOCKED", icon: <Grip size={22}/> },
      { id: "QPCR", title: "qPCR / RT-PCR", level: "Advanced", status: "LOCKED", icon: <Activity size={22}/> },
      { id: "SEQ", title: "Sequencing", level: "Advanced", status: "LOCKED", icon: <SearchCode size={22}/> }
    ]
  },
  {
    category: "Genetic Engineering",
    items: [
      { id: "TRANS", title: "E. coli Transformation", level: "Applied", status: "LOCKED", icon: <Circle size={22}/> },
      { id: "CLONE", title: "Molecular Cloning", level: "Applied", status: "LOCKED", icon: <Dna size={22}/> },
      { id: "CRISPR", title: "CRISPR / Gene Editing", level: "Advanced", status: "LOCKED", icon: <Scissors size={22}/> }
    ]
  },
  {
    category: "Protein Techniques",
    items: [
      { id: "SDS", title: "SDS-PAGE", level: "Applied", status: "LOCKED", icon: <FlaskConical size={22}/> },
      { id: "WESTERN", title: "Western Blotting", level: "Advanced", status: "LOCKED", icon: <AntibodyIcon size={22}/> },
      { id: "ELISA", title: "ELISA", level: "Applied", status: "LOCKED", icon: <AntibodyIcon size={22}/> },
      { id: "PURIFY", title: "Protein Purification", level: "Advanced", status: "LOCKED", icon: <RefreshCw size={22}/> }
    ]
  },
  {
    category: "Imaging and Microscopy",
    items: [
      { id: "CELL_FIX", title: "Cell Fixation and Staining", level: "Applied", status: "LOCKED", icon: <Droplet size={22}/> },
      { id: "IF", title: "Immunofluorescence (IF)", level: "Applied", status: "LOCKED", icon: <AntibodyIcon size={22}/> },
      { id: "CONFOCAL", title: "Confocal Microscopy", level: "Advanced", status: "LOCKED", icon: <ScanEye size={22}/> },
      { id: "WIDEFIELD", title: "Widefield Microscopy", level: "Applied", status: "LOCKED", icon: <Microscope size={22}/> },
      { id: "LIVE_CELL", title: "Live Cell Imaging", level: "Advanced", status: "LOCKED", icon: <Camera size={22}/> }
    ]
  }
];
