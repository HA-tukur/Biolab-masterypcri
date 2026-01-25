import { Microscope } from 'lucide-react';

export default function Header() {
  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Microscope className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BioSim Lab</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigation('/')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Student View
            </button>
            <button
              onClick={() => handleNavigation('/instructor/setup')}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Instructor Portal
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
