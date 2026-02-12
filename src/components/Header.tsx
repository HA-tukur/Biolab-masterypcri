import { Microscope, User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;
  const isHomepage = currentPath === '/';
  const isLabBench = currentPath === '/lab';
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
    if (tab === 'home' && currentPath !== '/lab') {
      handleNavigation('/lab');
    }
    window.dispatchEvent(new CustomEvent('headerTabClick', { detail: { tab } }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isHomepage) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNavigation(user ? '/dashboard' : '/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Microscope className="w-6 h-6 text-teal-700" />
              <span className="text-xl font-bold text-gray-900">BioSimLab</span>
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('for-instructors')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                For Instructors
              </button>
              <button
                onClick={() => scrollToSection('for-universities')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                For Universities
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#2d2d2d] sticky top-0 z-50 h-[56px]">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNavigation(user ? '/dashboard' : '/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Microscope className="w-5 h-5 text-[#22d3ee]" />
            <span className="text-lg" style={{ fontFamily: 'sans-serif' }}>
              <span className="font-bold text-[#22d3ee]">BioSim</span>
              <span className="font-normal text-gray-900"> Lab</span>
            </span>
          </button>

          {isLabBench && (
            <div className="flex items-center h-full gap-6">
              <button
                onClick={() => handleTabClick('home')}
                className={`text-sm transition-colors pb-0.5 whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'text-gray-900 font-semibold border-b-3'
                    : 'text-gray-600 hover:text-gray-700 font-medium'
                }`}
                style={activeTab === 'home' ? { borderBottom: '3px solid #22d3ee' } : {}}
              >
                Home
              </button>
              <button
                onClick={() => handleTabClick('manual')}
                className="text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors whitespace-nowrap"
              >
                Manual
              </button>
              <a
                href="mailto:info@biosimlab.app"
                className="text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors whitespace-nowrap"
              >
                Contact
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {user && (
            <>
              <button
                onClick={() => handleNavigation('/lab')}
                title="Practice & Learn"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isLabBench
                    ? 'bg-[#0891b2] text-white'
                    : 'bg-transparent text-gray-600 hover:text-gray-700'
                }`}
              >
                Lab Bench
              </button>
              <button
                onClick={() => handleNavigation('/profile')}
                title="Profile"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  currentPath === '/profile'
                    ? 'bg-[#0891b2] text-white'
                    : 'bg-transparent text-gray-600 hover:text-gray-700'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => handleNavigation('/instructor/setup')}
                title="Instructor Portal"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isInstructor
                    ? 'bg-[#0891b2] text-white'
                    : 'bg-transparent text-gray-600 hover:text-gray-700'
                }`}
              >
                Instructor Portal
              </button>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 bg-transparent text-gray-600 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          )}
          {!user && (
            <button
              onClick={() => handleNavigation('/login')}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
