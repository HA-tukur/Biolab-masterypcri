import React, { useState } from "react";
import { ChevronRight, Lock } from "lucide-react";
import { AntibodyIcon } from "./AntibodyIcon";

interface TechniqueItem {
  id: string;
  title: string;
  level: "Foundation" | "Applied" | "Advanced";
  status: "ACTIVE" | "LOCKED";
  icon: React.ReactNode;
}

interface TechniqueCategory {
  category: string;
  items: TechniqueItem[];
}

interface TechniqueLibraryProps {
  data: TechniqueCategory[];
  onTechniqueClick?: (tech: TechniqueItem) => void;
  lockedTechniqueIds?: string[];
}

export const TechniqueLibrary: React.FC<TechniqueLibraryProps> = ({
  data,
  onTechniqueClick,
  lockedTechniqueIds = []
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const isExpanded = (category: string) => expandedCategory === category;
  const toggleCategory = (category: string) => {
    setExpandedCategory(isExpanded(category) ? null : category);
  };

  const levelColors = {
    Foundation: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30",
    Applied: "bg-amber-600/20 text-amber-400 border-amber-500/30",
    Advanced: "bg-rose-600/20 text-rose-400 border-rose-500/30"
  };

  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, React.ReactNode> = {
      "Core Lab Skills": "🧪",
      "Nucleic Acid Techniques": "🧬",
      "Genetic Engineering": "✂️",
      "Protein Techniques": <AntibodyIcon size={28} />,
      "Imaging and Microscopy": "🔬"
    };
    return icons[categoryName] || "📚";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-black text-slate-50 uppercase tracking-tight mb-6">
          Technique Library
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.map((categoryData) => {
            const expanded = isExpanded(categoryData.category);
            const hasActiveTechniques = categoryData.items.some(
              (item) => item.status === "ACTIVE"
            );

            return (
              <div
                key={categoryData.category}
                className="flex flex-col"
              >
                <button
                  onClick={() => toggleCategory(categoryData.category)}
                  className={`relative rounded-lg p-4 transition-all duration-300 overflow-hidden group ${
                    expanded
                      ? "bg-primary-500 border-primary-500 shadow-sm text-white z-20"
                      : expandedCategory
                        ? "bg-gray-100 border-gray-200 opacity-60"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } border cursor-pointer`}
                >
                  <div className="relative flex flex-col items-start gap-2.5">
                    <div className="flex items-start justify-between w-full">
                      <div className="text-2xl leading-none">
                        {getCategoryIcon(categoryData.category)}
                      </div>
                      <div
                        className={`transform transition-transform duration-300 ${
                          expanded ? "rotate-90" : ""
                        }`}
                      >
                        <ChevronRight
                          size={16}
                          className={expanded ? "text-white" : "text-gray-500"}
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-sm font-bold leading-tight ${expanded ? 'text-white' : 'text-gray-900'}`}>
                        {categoryData.category}
                      </h4>
                      <p className={`text-[10px] mt-1 ${expanded ? 'text-white/80' : 'text-gray-600'}`}>
                        {categoryData.items.length} technique
                        {categoryData.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {hasActiveTechniques && !expandedCategory && (
                      <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                        ✓ Available
                      </div>
                    )}
                  </div>

                  {expanded && (
                    <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-primary-500 rounded-full" />
                  )}
                </button>

                {expanded && (
                  <div className="mt-3 space-y-2 relative z-20">
                    {categoryData.items.map((tech) => {
                      const isGuestLocked = lockedTechniqueIds.includes(tech.id);
                      const isActive = tech.status === "ACTIVE" && !isGuestLocked;
                      const isLocked = tech.status === "LOCKED" || isGuestLocked;

                      return (
                        <button
                          key={tech.id}
                          onClick={() => {
                            if (isActive) {
                              onTechniqueClick?.(tech);
                            }
                          }}
                          disabled={isLocked}
                          className={`w-full rounded-lg p-3 border transition-all duration-200 text-left group/tech ${
                            isActive
                              ? "bg-slate-800/60 border-indigo-500/40 hover:border-indigo-400/60 hover:bg-slate-800/80 hover:shadow-md hover:shadow-indigo-500/15 cursor-pointer"
                              : "bg-gray-100 border-gray-200/50 opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              <div
                                className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 transition-all ${
                                  isActive
                                    ? "bg-indigo-600/30 text-indigo-400 group-hover/tech:bg-indigo-600/50"
                                    : "bg-slate-700/40 text-slate-600"
                                }`}
                              >
                                {tech.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className={`text-xs font-semibold transition-colors ${
                                    isActive
                                      ? "text-white group-hover/tech:text-indigo-300"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {tech.title}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border transition-colors ${
                                      levelColors[tech.level]
                                    }`}
                                  >
                                    {tech.level}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {isLocked && (
                              <div className="flex-shrink-0 mt-0.5">
                                <Lock size={12} className="text-slate-600" />
                              </div>
                            )}

                            {isActive && (
                              <div className="flex-shrink-0 opacity-0 group-hover/tech:opacity-100 transition-opacity">
                                <ChevronRight
                                  size={14}
                                  className="text-indigo-400 translate-x-0 group-hover/tech:translate-x-1 transition-transform"
                                />
                              </div>
                            )}
                          </div>

                          {isLocked && (
                            <p className="text-[10px] text-amber-500/70 font-bold uppercase mt-1.5 ml-8">
                              {isGuestLocked ? 'Sign up to unlock' : 'Coming Soon'}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {expandedCategory && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setExpandedCategory(null)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
