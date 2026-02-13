import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import { SharedNavigation } from './SharedNavigation';
import { TECHNIQUE_LIBRARY } from '../data/techniqueLibrary';

export function BrowseSimulations() {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    const firstItem = TECHNIQUE_LIBRARY.find(cat => cat.category === category)?.items[0];
    return firstItem?.icon || null;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Foundation':
        return 'bg-emerald-100 text-emerald-800';
      case 'Applied':
        return 'bg-amber-100 text-amber-800';
      case 'Advanced':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleStartPracticing = (techniqueId: string) => {
    const simMap: Record<string, string> = {
      'DNA_EXT': 'dna-extraction',
      'PCR': 'pcr-setup',
    };

    const simId = simMap[techniqueId];
    if (simId) {
      navigate(`/lab?sim=${simId}`);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SharedNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Browse All Simulations
          </h1>
          <p className="text-lg text-slate-600">
            Explore techniques and choose what to practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECHNIQUE_LIBRARY.map((category) => (
            <div
              key={category.category}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    {getCategoryIcon(category.category)}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {category.category}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {category.items.length} {category.items.length === 1 ? 'technique' : 'techniques'}
                    </p>
                  </div>
                </div>
                {expandedCategory === category.category ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {expandedCategory === category.category && (
                <div className="border-t border-slate-200 bg-slate-50">
                  {category.items.map((technique) => (
                    <div
                      key={technique.id}
                      className="p-4 border-b border-slate-200 last:border-b-0 hover:bg-white transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="text-slate-600 mt-1">
                            {technique.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 mb-1">
                              {technique.title}
                            </h4>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(technique.level)}`}>
                              {technique.level}
                            </span>
                          </div>
                        </div>
                      </div>

                      {technique.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleStartPracticing(technique.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                        >
                          <Play size={16} />
                          Start Practicing
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-medium cursor-not-allowed">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
