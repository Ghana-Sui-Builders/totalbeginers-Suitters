import { createContext, useContext, ReactNode } from 'react';
import { EnokiFlowProvider } from '@mysten/enoki/react';

const ENOKI_PUBLIC_KEY = import.meta.env.VITE_ENOKI_PUBLIC_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!ENOKI_PUBLIC_KEY) {
  throw new Error('VITE_ENOKI_PUBLIC_KEY is required');
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error('VITE_GOOGLE_CLIENT_ID is required');
}

interface EnokiContextType {
  // Add any additional context values here
}

const EnokiContext = createContext<EnokiContextType>({});

export function EnokiProvider({ children }: { children: ReactNode }) {
  return (
    <EnokiFlowProvider apiKey={ENOKI_PUBLIC_KEY}>
      <EnokiContext.Provider value={{}}>
        {children}
      </EnokiContext.Provider>
    </EnokiFlowProvider>
  );
}

export function useEnoki() {
  return useContext(EnokiContext);
}
