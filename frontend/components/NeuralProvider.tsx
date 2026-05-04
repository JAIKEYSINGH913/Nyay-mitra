"use client";

import React, { createContext, useContext, useState } from 'react';

export interface NeuralContextState {
  activeQuery: string;
  mappedBNS: string;
  provenanceHash: string | null;
  auditText: string;
}

interface NeuralContextType {
  state: NeuralContextState;
  setNeuralState: (updates: Partial<NeuralContextState>) => void;
  clearNeuralState: () => void;
}

const initialState: NeuralContextState = {
  activeQuery: "",
  mappedBNS: "",
  provenanceHash: null,
  auditText: "",
};

const NeuralContext = createContext<NeuralContextType | undefined>(undefined);

export const NeuralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NeuralContextState>(initialState);

  const setNeuralState = (updates: Partial<NeuralContextState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const clearNeuralState = () => {
    setState(initialState);
  };

  return (
    <NeuralContext.Provider value={{ state, setNeuralState, clearNeuralState }}>
      {children}
    </NeuralContext.Provider>
  );
};

export const useNeuralContext = () => {
  const context = useContext(NeuralContext);
  if (!context) throw new Error('useNeuralContext must be used within NeuralProvider');
  return context;
};
