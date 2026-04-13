import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { SimulationState, Profile, TcoOnPremise, TcoSaas, Hypotheses, CalculationResults } from '@/types/simulation';
import { calculateResults } from '@/lib/calculations';
import { getDefaultState, getExampleData } from '@/lib/exampleData';

const STORAGE_KEY = 'tco-simulator-v1';

interface SimulationContextType {
  state: SimulationState;
  updateProfile: (updates: Partial<Profile>) => void;
  updateTcoOnPremise: (updater: (prev: TcoOnPremise) => TcoOnPremise) => void;
  updateTcoSaas: (updates: Partial<TcoSaas>) => void;
  updateHypotheses: (updates: Partial<Hypotheses>) => void;
  setActiveTab: (tab: number) => void;
  loadExample: () => void;
  reset: () => void;
  runCalculation: () => CalculationResults;
  updateDecisionNote: (section: string, content: string) => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

function loadState(): SimulationState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return getDefaultState();
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState>(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setState(s => ({ ...s, profile: { ...s.profile, ...updates } }));
  }, []);

  const updateTcoOnPremise = useCallback((updater: (prev: TcoOnPremise) => TcoOnPremise) => {
    setState(s => ({ ...s, tcoOnPremise: updater(s.tcoOnPremise) }));
  }, []);

  const updateTcoSaas = useCallback((updates: Partial<TcoSaas>) => {
    setState(s => ({ ...s, tcoSaas: { ...s.tcoSaas, ...updates } }));
  }, []);

  const updateHypotheses = useCallback((updates: Partial<Hypotheses>) => {
    setState(s => ({ ...s, hypotheses: { ...s.hypotheses, ...updates } }));
  }, []);

  const setActiveTab = useCallback((tab: number) => {
    setState(s => ({ ...s, activeTab: tab }));
  }, []);

  const loadExample = useCallback(() => {
    setState(getExampleData());
  }, []);

  const reset = useCallback(() => {
    setState(getDefaultState());
  }, []);

  const runCalculation = useCallback(() => {
    const results = calculateResults(state);
    setState(s => ({ ...s, results, activeTab: 3 }));
    return results;
  }, [state]);

  const updateDecisionNote = useCallback((section: string, content: string) => {
    setState(s => ({ ...s, decisionNoteEdits: { ...s.decisionNoteEdits, [section]: content } }));
  }, []);

  return (
    <SimulationContext.Provider value={{
      state, updateProfile, updateTcoOnPremise, updateTcoSaas,
      updateHypotheses, setActiveTab, loadExample, reset, runCalculation, updateDecisionNote,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
