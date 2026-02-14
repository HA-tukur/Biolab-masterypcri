import { ArrowLeft, Dna, Droplet, Sprout, MapPin, Target } from "lucide-react";

interface PCRMissionsProps {
  onBack: () => void;
  onSelectMission: (missionId: string) => void;
}

export const PCRMissions = ({ onBack, onSelectMission }: PCRMissionsProps) => {
  const missions = [
    {
      id: "lagos-diagnostic",
      title: "The Lagos Diagnostic Hub",
      subtitle: "Human Genetics",
      location: "Lagos, Nigeria",
      icon: <Droplet size={40} />,
      color: "red",
      scenario: "A local clinic has three patients with severe fatigue and joint pain. Sickle Cell Disease (SCD) is suspected, but they need molecular confirmation.",
      targetGene: "HBB (β-globin)",
      goal: "Use PCR to amplify an HBB segment that distinguishes genotypes",
      difficulty: "Intermediate",
      tags: ["Human Genetics", "Disease Diagnosis", "Clinical"]
    },
    {
      id: "great-green-wall",
      title: "The Great Green Wall Rescue",
      subtitle: "Plant Genetics",
      location: "Sahel Region, Senegal",
      icon: <Sprout size={40} />,
      color: "green",
      scenario: "Farmers are losing pearl millet crops to drought. A particular landrace appears drought-resistant and might carry a 'stay-green' gene.",
      targetGene: "DREB1 (Drought-tolerance marker)",
      goal: "Screen millet seeds to identify drought-resistant varieties for the Great Green Wall",
      difficulty: "Intermediate",
      tags: ["Plant Genetics", "Agriculture", "Climate Adaptation"]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { border: string, bg: string, text: string, hover: string }> = {
      red: { border: "border-red-500/50", bg: "bg-red-900/20", text: "text-red-400", hover: "hover:bg-red-900/40" },
      green: { border: "border-green-500/50", bg: "bg-green-900/20", text: "text-green-400", hover: "hover:bg-green-900/40" }
    };
    return colorMap[color] || colorMap.green;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 lg:py-6 space-y-4 lg:space-y-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="p-2 sm:p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white border-0 cursor-pointer"
        >
          <ArrowLeft size={20} className="sm:hidden" />
          <ArrowLeft size={24} className="hidden sm:block" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
            PCR Missions
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">Choose a mission to begin your PCR workflow</p>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 p-4 sm:p-5 rounded-2xl">
        <h4 className="font-bold text-blue-400 mb-2 text-base sm:text-lg leading-tight">About These Missions</h4>
        <p className="text-sm sm:text-base text-blue-200 leading-relaxed">
          Each mission walks you through the complete PCR workflow: primer design, reagent ordering and reconstitution,
          reaction setup, thermal cycling, and result verification. These scenarios are based on real challenges
          facing African communities and showcase how molecular biology addresses health and agriculture problems.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {missions.map((mission) => {
          const colors = getColorClasses(mission.color);
          return (
            <button
              key={mission.id}
              onClick={() => onSelectMission(mission.id)}
              className={`border ${colors.border} ${colors.bg} ${colors.hover} p-4 sm:p-5 lg:p-6 rounded-2xl transition-all cursor-pointer text-left group w-full`}
            >
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 sm:gap-5">
                <div className={`${colors.text} group-hover:scale-110 transition-transform flex justify-center md:justify-start`}>
                  {mission.icon}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-black uppercase text-white leading-tight">
                          {mission.title}
                        </h3>
                        <p className={`text-sm sm:text-base font-bold ${colors.text}`}>
                          {mission.subtitle}
                        </p>
                      </div>
                      <span className={`px-3 py-1 ${colors.bg} border ${colors.border} rounded-full text-xs sm:text-sm font-bold ${colors.text} uppercase inline-block w-fit`}>
                        {mission.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-sm sm:text-base mb-2">
                      <MapPin size={16} />
                      <span>{mission.location}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {mission.scenario}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Dna size={16} className="text-emerald-400" />
                          <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase">Target Gene</span>
                        </div>
                        <p className="text-white text-sm sm:text-base font-mono">{mission.targetGene}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Target size={16} className="text-amber-400" />
                          <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase">Goal</span>
                        </div>
                        <p className="text-slate-300 text-sm sm:text-base">{mission.goal}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mission.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-slate-800 border border-slate-600 rounded-full text-xs sm:text-sm font-bold text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
