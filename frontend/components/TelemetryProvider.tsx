"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiConfig, validateConfig } from '@/config/apiConfig';

interface TelemetryState {
  status: 'DETERMINISTIC' | 'SYNCING' | 'OFFLINE' | 'KERNEL_ERROR';
  neo4jStatus: 'ONLINE' | 'OFFLINE';
  fastApiStatus: 'ONLINE' | 'OFFLINE';
  openNyAIStatus: 'ONLINE' | 'OFFLINE';
  missingKeys?: string[];
  latency: number;
  trt: number;
  latencyBreakdown: { stt: number; graph: number; ai: number };
  veracity: number;
  nodeCount: number;
  lastSyncTimestamp: string;
  isDevConsoleOpen: boolean;
  setDevConsoleOpen: (open: boolean) => void;
}

const TelemetryContext = createContext<TelemetryState | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevConsoleOpen, setDevConsoleOpen] = useState(false);
  const [telemetry, setTelemetry] = useState<Omit<TelemetryState, 'isDevConsoleOpen' | 'setDevConsoleOpen'>>({
    status: 'DETERMINISTIC',
    neo4jStatus: 'ONLINE',
    fastApiStatus: 'ONLINE',
    openNyAIStatus: 'ONLINE',
    latency: 45,
    trt: 1880,
    latencyBreakdown: { stt: 600, graph: 80, ai: 1200 },
    veracity: 100,
    nodeCount: 12452,
    lastSyncTimestamp: "SYNCING...",
  });

  // Hydrate dynamic data on client mount to prevent SSR mismatch
  useEffect(() => {
    setTelemetry(prev => ({
      ...prev,
      lastSyncTimestamp: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }));
  }, []);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const start = Date.now();
        const response = await fetch(`${apiConfig.baseUrl}/health`);
        const data = await response.json();
        const end = Date.now();
        
        // Simulate fluctuating TRT between 1800ms and 2400ms to test Cognitive Delay UI
        const simulatedTrt = Math.floor(Math.random() * 600) + 1800;
        
        setTelemetry(prev => ({
          ...prev,
          latency: end - start,
          trt: simulatedTrt,
          latencyBreakdown: {
            stt: Math.floor(simulatedTrt * 0.3),
            graph: Math.floor(simulatedTrt * 0.05),
            ai: Math.floor(simulatedTrt * 0.65)
          },
          status: (data?.credentials?.neo4j && data?.credentials?.gemini && data?.credentials?.sarvam) ? 'DETERMINISTIC' : 'KERNEL_ERROR'
        }));
      } catch (err) {
        setTelemetry(prev => ({ ...prev, status: 'OFFLINE' }));
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000); // Check every 5s for rapid UI testing
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
