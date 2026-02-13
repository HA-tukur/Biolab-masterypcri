import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Microscope, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SharedNavigationProps {
  onShowManual?: () => void;
}

export function SharedNavigation({ onShowManual }: SharedNavigationProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentPath = location.pathname;

  const isInstructorRole = user?.app_metadata?.role === 'instructor' || user?.app_metadata?.role === 'admin';

  const getFirstName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return 'User';
  };

  const handleInstructorPortalClick = () => {
    if (isInstructorRole) {
      navigate('/instructor/setup');
    } else {
      navigate('/instructor/request');
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Microscope className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold text-slate-900">BioSim Lab</span>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className={`font-medium hover:text-emerald-600 transition-colors ${
                currentPath === '/dashboard' ? 'text-slate-900' : 'text-slate-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/browse')}
              className={`hover:text-emerald-600 transition-colors ${
                currentPath === '/browse' ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Browse Simulations
            </button>
            {onShowManual && (
              <button
                onClick={onShowManual}
                className="hover:text-emerald-600 transition-colors text-slate-600"
              >
                Manual
              </button>
            )}
            <button
              onClick={() => navigate('/leaderboard')}
              className={`hover:text-emerald-600 transition-colors ${
                currentPath === '/leaderboard' ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={`hover:text-emerald-600 transition-colors ${
                currentPath === '/profile' ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Profile
            </button>
            <button
              onClick={handleInstructorPortalClick}
              className={`hover:text-emerald-600 transition-colors ${
                currentPath.startsWith('/instructor') ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Instructor Portal
            </button>
          </nav>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">
                {getFirstName()}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User size={16} />
                  Profile
                </button>
                <div className="border-t border-slate-200 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-4 space-y-2">
            <button
              onClick={() => {
                navigate('/dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg ${
                currentPath === '/dashboard' ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate('/browse');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg ${
                currentPath === '/browse' ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Browse Simulations
            </button>
            {onShowManual && (
              <button
                onClick={() => {
                  onShowManual();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                Manual
              </button>
            )}
            <button
              onClick={() => {
                navigate('/leaderboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg ${
                currentPath === '/leaderboard' ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => {
                navigate('/profile');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg ${
                currentPath === '/profile' ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Profile
            </button>
            <button
              onClick={handleInstructorPortalClick}
              className={`w-full text-left px-4 py-2 hover:bg-slate-100 rounded-lg ${
                currentPath.startsWith('/instructor') ? 'text-slate-900 font-medium' : 'text-slate-600'
              }`}
            >
              Instructor Portal
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
