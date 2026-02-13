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
      emerald: { border: "border-teal-500", bg: "bg-white", text: "text-teal-600", hover: "hover:bg-teal-50" },
      blue: { border: "border-primary-500", bg: "bg-white", text: "text-primary-600", hover: "hover:bg-primary-50" },
      purple: { border: "border-primary-500", bg: "bg-white", text: "text-primary-600", hover: "hover:bg-primary-50" },
      amber: { border: "border-accent-500", bg: "bg-white", text: "text-accent-600", hover: "hover:bg-accent-50" }
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Technique Categories
        </h1>
        <p className="text-base text-gray-600">
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
              className={`border ${colors.border} ${colors.bg} ${colors.hover} p-8 rounded-lg transition-all cursor-pointer text-left group shadow-sm`}
            >
              <div className={`${colors.text} mb-4`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">Includes:</p>
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
