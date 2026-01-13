import { ArrowLeft, Dna, Grip, Lock } from "lucide-react";

interface CategoryTechniquesProps {
  categoryId: string;
  onBack: () => void;
  onSelectTechnique: (techniqueId: string) => void;
}

export const CategoryTechniques = ({ categoryId, onBack, onSelectTechnique }: CategoryTechniquesProps) => {
  const categoryData: Record<string, { title: string, techniques: Array<{ id: string, name: string, description: string, status: "available" | "locked" }> }> = {
    "core-lab-skills": {
      title: "Core Lab Skills",
      techniques: [
        {
          id: "dna-extraction",
          name: "DNA Extraction",
          description: "Extract genomic DNA from blood samples",
          status: "available"
        },
        {
          id: "gel-electrophoresis",
          name: "Gel Electrophoresis",
          description: "Separate and visualize DNA fragments",
          status: "locked"
        },
        {
          id: "spectrophotometry",
          name: "Spectrophotometry",
          description: "Quantify DNA concentration and purity",
          status: "locked"
        }
      ]
    },
    "nucleic-acid-techniques": {
      title: "Nucleic Acid Techniques",
      techniques: [
        {
          id: "pcr",
          name: "PCR",
          description: "Amplify specific DNA sequences",
          status: "available"
        },
        {
          id: "rt-pcr",
          name: "RT-PCR",
          description: "Reverse transcription and amplification",
          status: "locked"
        },
        {
          id: "qpcr",
          name: "qPCR",
          description: "Real-time quantitative PCR",
          status: "locked"
        }
      ]
    },
    "genetic-engineering": {
      title: "Genetic Engineering",
      techniques: [
        {
          id: "cloning",
          name: "Cloning",
          description: "Insert genes into plasmid vectors",
          status: "locked"
        },
        {
          id: "crispr",
          name: "CRISPR",
          description: "Precise genome editing",
          status: "locked"
        }
      ]
    },
    "protein-techniques": {
      title: "Protein Techniques",
      techniques: [
        {
          id: "western-blot",
          name: "Western Blot",
          description: "Detect specific proteins in samples",
          status: "locked"
        },
        {
          id: "elisa",
          name: "ELISA",
          description: "Quantify proteins and antibodies",
          status: "locked"
        }
      ]
    }
  };

  const category = categoryData[categoryId];

  if (!category) {
    return (
      <div className="text-center text-white">
        <p>Category not found</p>
        <button onClick={onBack} className="mt-4 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white border-0 cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            {category.title}
          </h1>
          <p className="text-slate-400 text-sm">Select a technique to begin</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {category.techniques.map((technique) => (
          <button
            key={technique.id}
            onClick={() => technique.status === "available" && onSelectTechnique(technique.id)}
            disabled={technique.status === "locked"}
            className={`border p-8 rounded-3xl transition-all cursor-pointer text-left group ${
              technique.status === "available"
                ? "border-emerald-500/50 bg-emerald-900/20 hover:bg-emerald-900/40"
                : "border-slate-700 bg-slate-900/50 cursor-not-allowed opacity-50"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${technique.status === "available" ? "text-emerald-400" : "text-slate-500"} group-hover:scale-110 transition-transform`}>
                {technique.status === "available" ? <Dna size={32} /> : <Lock size={32} />}
              </div>
              {technique.status === "available" && (
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full uppercase">
                  Available
                </span>
              )}
            </div>
            <h3 className="text-xl font-black uppercase text-white mb-2">
              {technique.name}
            </h3>
            <p className="text-slate-400 text-sm">
              {technique.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
