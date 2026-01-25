import { Microscope } from 'lucide-react';

export default function Header() {
  const currentPath = window.location.pathname;
  const isLabBench = currentPath === '/' || (!currentPath.startsWith('/instructor'));
  const isInstructor = currentPath.startsWith('/instructor');

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header className="bg-[#2d2d2d] sticky top-0 z-50 h-[56px]">
      <div className="flex items-center justify-between h-full px-4">
        <button
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Microscope className="w-5 h-5 text-[#22d3ee]" />
          <span className="text-lg" style={{ fontFamily: 'sans-serif' }}>
            <span className="font-bold text-[#22d3ee]">BioSim</span>
            <span className="font-normal text-white"> Lab</span>
          </span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleNavigation('/')}
            title="Practice & Learn"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              isLabBench
                ? 'bg-[#0891b2] text-white'
                : 'bg-transparent text-white/60 hover:text-white/80'
            }`}
          >
            Lab Bench
          </button>
          <button
            onClick={() => handleNavigation('/instructor/setup')}
            title="Manage Students"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              isInstructor
                ? 'bg-[#0891b2] text-white'
                : 'bg-transparent text-white/60 hover:text-white/80'
            }`}
          >
            Instructor Portal
          </button>
        </div>
      </div>
    </header>
  );
}
