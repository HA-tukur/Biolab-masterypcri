import { X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface SignupBannerProps {
  isLastChance: boolean;
  onDismiss: () => void;
}

export function SignupBanner({ isLastChance, onDismiss }: SignupBannerProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`h-[60px] md:h-[70px] flex items-center justify-between px-4 md:px-6 ${
          isLastChance
            ? 'bg-blue-50 border-b-2 border-blue-200'
            : 'bg-emerald-50 border-b border-emerald-100'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Check className={`w-5 h-5 flex-shrink-0 ${
            isLastChance ? 'text-blue-600' : 'text-emerald-600'
          }`} />
          <p className="text-sm md:text-base text-gray-800 font-medium truncate">
            {isLastChance
              ? 'Last free experiment — Sign up to continue practicing unlimited simulations'
              : 'Save your progress — Create a free account to track your simulations'}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 ml-4">
          <button
            onClick={handleDismiss}
            className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={handleSignUp}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors whitespace-nowrap ${
              isLastChance
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-teal-700 hover:bg-teal-800'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
