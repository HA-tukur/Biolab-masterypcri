import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface SignupModalProps {
  simulationCount: number;
  onContinueAsGuest: () => void;
}

export function SignupModal({ simulationCount, onContinueAsGuest }: SignupModalProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleCreateAccount = () => {
    navigate('/signup');
  };

  const handleContinueAsGuest = () => {
    setIsVisible(false);
    setTimeout(() => {
      onContinueAsGuest();
    }, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleContinueAsGuest}
      />

      <div className="relative bg-white rounded-lg shadow-sm max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Create an account to continue
        </h2>

        <p className="text-gray-600 leading-relaxed mb-6">
          You've practiced {simulationCount} {simulationCount === 1 ? 'simulation' : 'simulations'}. Create a free account to save your progress and access all modules.
        </p>

        <button
          onClick={handleCreateAccount}
          className="w-full px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-md transition-colors mb-3"
        >
          Create Free Account
        </button>

        <button
          onClick={handleContinueAsGuest}
          className="w-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
