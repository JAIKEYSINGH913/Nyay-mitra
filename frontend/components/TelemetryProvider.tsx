"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateConfig } from '@/config/apiConfig';

interface TelemetryState {
  status: 'DETERMINISTIC' | 'SYNCING' | 'OFFLINE' | 'KERNEL_ERROR';
  missingKeys?: string[];
  latency: number;
  veracity: number;
  nodeCount: number;
  isDevConsoleOpen: boolean;
  setDevConsoleOpen: (open: boolean) => void;
}

const TelemetryContext = createContext<TelemetryState | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevConsoleOpen, setDevConsoleOpen] = useState(false);
  const [telemetry, setTelemetry] = useState<Omit<TelemetryState, 'isDevConsoleOpen' | 'setDevConsoleOpen'>>({
    status: 'DETERMINISTIC',
    latency: 45,
    veracity: 100,
    nodeCount: 12452,
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const start = Date.now();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`);
        const data = await response.json();
        const end = Date.now();
        
        setTelemetry(prev => ({
          ...prev,
          latency: end - start,
          status: (data.credentials.neo4j && data.credentials.gemini && data.credentials.bhashini) ? 'DETERMINISTIC' : 'KERNEL_ERROR'
        }));
      } catch (err) {
        setTelemetry(prev => ({ ...prev, status: 'OFFLINE' }));
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <TelemetryContext.Provider value={{ ...telemetry, isDevConsoleOpen, setDevConsoleOpen }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error('useTelemetry must be used within TelemetryProvider');
  return context;
};
