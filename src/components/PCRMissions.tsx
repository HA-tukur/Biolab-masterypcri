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
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white border-0 cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            PCR Missions
          </h1>
          <p className="text-slate-400 text-sm">Choose a mission to begin your PCR workflow</p>
        </div>
      </div>

      <div className="space-y-6">
        {missions.map((mission) => {
          const colors = getColorClasses(mission.color);
          return (
            <button
              key={mission.id}
              onClick={() => onSelectMission(mission.id)}
              className={`border ${colors.border} ${colors.bg} ${colors.hover} p-8 rounded-3xl transition-all cursor-pointer text-left group w-full`}
            >
              <div className="grid md:grid-cols-[auto_1fr] gap-6">
                <div className={`${colors.text} group-hover:scale-110 transition-transform`}>
                  {mission.icon}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-black uppercase text-white">
                          {mission.title}
                        </h3>
                        <p className={`text-sm font-bold ${colors.text}`}>
                          {mission.subtitle}
                        </p>
                      </div>
                      <span className={`px-3 py-1 ${colors.bg} border ${colors.border} rounded-full text-xs font-bold ${colors.text} uppercase`}>
                        {mission.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                      <MapPin size={16} />
                      <span>{mission.location}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-3">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {mission.scenario}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Dna size={16} className="text-emerald-400" />
                          <span className="text-xs font-bold text-emerald-400 uppercase">Target Gene</span>
                        </div>
                        <p className="text-white text-sm font-mono">{mission.targetGene}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Target size={16} className="text-amber-400" />
                          <span className="text-xs font-bold text-amber-400 uppercase">Goal</span>
                        </div>
                        <p className="text-slate-300 text-sm">{mission.goal}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mission.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-full text-xs font-bold text-slate-300"
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

      <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
        <h4 className="font-bold text-blue-400 mb-2">About These Missions</h4>
        <p className="text-sm text-blue-200 leading-relaxed">
          Each mission walks you through the complete PCR workflow: primer design, reagent ordering and reconstitution,
          reaction setup, thermal cycling, and result verification. These scenarios are based on real challenges
          facing African communities and showcase how molecular biology addresses health and agriculture problems.
        </p>
      </div>
    </div>
  );
};
