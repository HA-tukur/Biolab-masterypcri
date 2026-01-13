import { Microscope, Dna, Scissors, Beaker } from "lucide-react";

interface TechniqueCategoriesProps {
  onSelectCategory: (category: string) => void;
}

export const TechniqueCategories = ({ onSelectCategory }: TechniqueCategoriesProps) => {
  const categories = [
    {
      id: "core-lab-skills",
      title: "Core Lab Skills",
      description: "Foundational techniques for molecular biology",
      icon: <Microscope size={40} />,
      color: "emerald",
      techniques: ["DNA Extraction", "Gel Electrophoresis", "Spectrophotometry"]
    },
    {
      id: "nucleic-acid-techniques",
      title: "Nucleic Acid Techniques",
      description: "DNA/RNA amplification and analysis",
      icon: <Dna size={40} />,
      color: "blue",
      techniques: ["PCR", "RT-PCR", "qPCR", "DNA Sequencing"]
    },
    {
      id: "genetic-engineering",
      title: "Genetic Engineering",
      description: "Gene editing and cloning methods",
      icon: <Scissors size={40} />,
      color: "purple",
      techniques: ["Cloning", "CRISPR", "Gene Expression"]
    },
    {
      id: "protein-techniques",
      title: "Protein Techniques",
      description: "Protein analysis and purification",
      icon: <Beaker size={40} />,
      color: "amber",
      techniques: ["Western Blot", "ELISA", "Protein Purification"]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { border: string, bg: string, text: string, hover: string }> = {
      emerald: { border: "border-emerald-500/50", bg: "bg-emerald-900/20", text: "text-emerald-400", hover: "hover:bg-emerald-900/40" },
      blue: { border: "border-blue-500/50", bg: "bg-blue-900/20", text: "text-blue-400", hover: "hover:bg-blue-900/40" },
      purple: { border: "border-purple-500/50", bg: "bg-purple-900/20", text: "text-purple-400", hover: "hover:bg-purple-900/40" },
      amber: { border: "border-amber-500/50", bg: "bg-amber-900/20", text: "text-amber-400", hover: "hover:bg-amber-900/40" }
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
          Technique Categories
        </h1>
        <p className="text-lg text-slate-400">
          Choose a category to explore available techniques
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const colors = getColorClasses(category.color);
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`border ${colors.border} ${colors.bg} ${colors.hover} p-8 rounded-3xl transition-all cursor-pointer text-left group`}
            >
              <div className={`${colors.text} mb-4 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="text-2xl font-black uppercase text-white mb-2">
                {category.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {category.description}
              </p>
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Includes:</p>
                <div className="flex flex-wrap gap-2">
                  {category.techniques.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 ${colors.bg} border ${colors.border} rounded-full text-xs font-bold ${colors.text}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
