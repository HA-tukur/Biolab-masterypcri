import { Microscope, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isLabBench = currentPath === '/' || (!currentPath.startsWith('/instructor'));
  const isInstructor = currentPath.startsWith('/instructor');
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail.tab);
    };
    window.addEventListener('labTabChange' as any, handleTabChange);
    return () => window.removeEventListener('labTabChange' as any, handleTabChange);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home' && currentPath !== '/') {
      handleNavigation('/');
    }
    window.dispatchEvent(new CustomEvent('headerTabClick', { detail: { tab } }));
  };

  return (
    <header className="bg-[#2d2d2d] sticky top-0 z-50 h-[56px]">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-6">
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

          {isLabBench && (
            <div className="flex items-center h-full gap-6">
              <button
                onClick={() => handleTabClick('home')}
                className={`text-sm transition-colors pb-0.5 whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'text-white font-semibold border-b-3'
                    : 'text-white/60 hover:text-white/80 font-medium'
                }`}
                style={activeTab === 'home' ? { borderBottom: '3px solid #22d3ee' } : {}}
              >
                Home
              </button>
              <button
                onClick={() => handleTabClick('manual')}
                className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors whitespace-nowrap"
              >
                Manual
              </button>
              <button
                onClick={() => handleTabClick('contact')}
                className={`text-sm transition-colors pb-0.5 whitespace-nowrap ${
                  activeTab === 'contact'
                    ? 'text-white font-semibold border-b-3'
                    : 'text-white/60 hover:text-white/80 font-medium'
                }`}
                style={activeTab === 'contact' ? { borderBottom: '3px solid #22d3ee' } : {}}
              >
                Contact
              </button>
            </div>
          )}
        </div>

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
            onClick={() => handleNavigation('/profile')}
            title="Student Profile"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              currentPath === '/profile'
                ? 'bg-[#0891b2] text-white'
                : 'bg-transparent text-white/60 hover:text-white/80'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
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
