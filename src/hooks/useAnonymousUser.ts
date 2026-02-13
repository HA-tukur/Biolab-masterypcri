import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface AnonymousUserState {
  visitCount: number;
  simulationHistory: string[];
  dismissCount: number;
  lastVisitDate: string;
}

interface UseAnonymousUserReturn {
  isAnonymous: boolean;
  visitCount: number;
  simulationCount: number;
  shouldShowBanner: boolean;
  shouldShowModal: boolean;
  isLastChance: boolean;
  dismissBanner: () => void;
  recordSimulation: (simulationName: string) => void;
}

const STORAGE_KEY = 'biosimlab_anonymous_state';

export function useAnonymousUser(): UseAnonymousUserReturn {
  const { user } = useAuth();
  const [state, setState] = useState<AnonymousUserState>({
    visitCount: 0,
    simulationHistory: [],
    dismissCount: 0,
    lastVisitDate: new Date().toISOString(),
  });

  useEffect(() => {
    if (user) {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedState = JSON.parse(stored) as AnonymousUserState;
      const lastVisit = new Date(parsedState.lastVisitDate);
      const now = new Date();
      const daysSinceLastVisit = Math.floor(
        (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
      );

      const newVisitCount = daysSinceLastVisit > 0 ? parsedState.visitCount + 1 : parsedState.visitCount;

      const newState = {
        ...parsedState,
        visitCount: newVisitCount,
        lastVisitDate: now.toISOString(),
      };

      setState(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } else {
      const initialState: AnonymousUserState = {
        visitCount: 1,
        simulationHistory: [],
        dismissCount: 0,
        lastVisitDate: new Date().toISOString(),
      };
      setState(initialState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    }
  }, [user]);

  const dismissBanner = () => {
    if (user) return;

    const newState = {
      ...state,
      dismissCount: state.dismissCount + 1,
    };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const recordSimulation = (simulationName: string) => {
    if (user) return;

    if (!state.simulationHistory.includes(simulationName)) {
      const newState = {
        ...state,
        simulationHistory: [...state.simulationHistory, simulationName],
      };
      setState(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
  };

  const isAnonymous = !user && state.simulationHistory.length > 0;
  const visitCount = state.visitCount;
  const simulationCount = state.simulationHistory.length;

  const shouldShowBanner = !user && visitCount >= 1 && visitCount <= 3 && state.dismissCount < 3;
  const shouldShowModal = !user && visitCount >= 4;
  const isLastChance = !user && visitCount === 3;

  return {
    isAnonymous,
    visitCount,
    simulationCount,
    shouldShowBanner,
    shouldShowModal,
    isLastChance,
    dismissBanner,
    recordSimulation,
  };
}
