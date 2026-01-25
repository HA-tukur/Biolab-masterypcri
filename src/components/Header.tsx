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
    <header className="bg-[#2d2d2d] sticky top-0 z-50 min-h-[56px]">
      <div className="flex flex-wrap items-center justify-between h-full px-4 py-2 gap-2">
        <button
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Microscope className="w-5 h-5 text-[#00A3AD]" />
          <span className="text-lg" style={{ fontFamily: 'sans-serif' }}>
            <span className="font-bold text-[#00A3AD]">BioSim</span>
            <span className="font-normal text-white"> Lab</span>
          </span>
        </button>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={() => handleNavigation('/')}
            title="Practice & Learn"
            className={`px-4 py-2 rounded text-sm font-medium transition-all whitespace-nowrap ${
              isLabBench
                ? 'bg-[#00A3AD] text-white'
                : 'bg-transparent text-white opacity-60 hover:opacity-100'
            }`}
          >
            Lab Bench
          </button>
          <button
            onClick={() => handleNavigation('/instructor/setup')}
            title="Manage Students"
            className={`px-4 py-2 rounded text-sm font-medium transition-all whitespace-nowrap ${
              isInstructor
                ? 'bg-[#00A3AD] text-white'
                : 'bg-transparent text-white opacity-60 hover:opacity-100'
            }`}
          >
            Instructor Portal
          </button>
        </div>
      </div>
    </header>
  );
}
