// hooks/useAnalysis.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { geminiService } from '../services/gemini';

export type StockResult = {
  mode: 'STOCK';
  country: 'IN' | 'OTHER';
  text: string;
  vizData: any;
  images?: string[];
  stockMode?: 'SINGLECHART' | 'MULTICHART' | 'STRATEGYONLY';
  indicators?: string[];
  timestamp: string; // ✅ Added
};

export type GlobalResult = {
  mode: 'GLOBAL';
  country: 'IN' | 'OTHER';
  text: string;
  vizData: any;
  marketData?: string;
  timestamp: string; // ✅ Added
};

type AnalysisContextType = {
  loading: boolean;
  error: string;
  lastResult: StockResult | GlobalResult | null;
  analyzeStock: (params: {
    images: string[];
    country: 'IN' | 'OTHER';
    mode?: 'SINGLECHART' | 'MULTICHART' | 'STRATEGYONLY';
    strategyRules?: string;
    indicators?: string[];
  }) => Promise<{ id: undefined } & StockResult>;
  analyzeGlobal: (params: {
    marketData: string;
    country: 'IN' | 'OTHER';
  }) => Promise<{ id: undefined } & GlobalResult>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  clearResult: () => void;
};

const AnalysisContext = createContext<AnalysisContextType | null>(null);

// Provider component - wrap your app with this
export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState<StockResult | GlobalResult | null>(null);

  const analyzeStock = async (params: {
    images: string[];
    country: 'IN' | 'OTHER';
    mode?: 'SINGLECHART' | 'MULTICHART' | 'STRATEGYONLY';
    strategyRules?: string;
    indicators?: string[];
  }) => {
    setLoading(true);
    setError('');
    try {
      const { text, vizData } = await geminiService.analyzeStockChart(
        params.images,
        params.country,
        params.strategyRules,
        params.indicators,
        params.mode,
      );

      const result: StockResult = {
        mode: 'STOCK',
        country: params.country,
        text,
        vizData,
        images: params.images,
        stockMode: params.mode,
        indicators: params.indicators,
        timestamp: new Date().toLocaleString('en-US', { // ✅ Added
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setLastResult(result);
      return { id: undefined, ...result };
    } catch (err: any) {
      setError(err?.message ?? 'Analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeGlobal = async (params: {
    marketData: string;
    country: 'IN' | 'OTHER';
  }) => {
    setLoading(true);
    setError('');
    try {
      const { text, vizData } = await geminiService.analyzeGlobalMarkets(
        params.marketData,
        params.country,
      );

      const result: GlobalResult = {
        mode: 'GLOBAL',
        country: params.country,
        text,
        vizData,
        marketData: params.marketData,
        timestamp: new Date().toLocaleString('en-US', { // ✅ Added
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setLastResult(result);
      return { id: undefined, ...result };
    } catch (err: any) {
      setError(err?.message ?? 'Analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setLastResult(null);
  };

  return (
    <AnalysisContext.Provider
      value={{
        loading,
        error,
        lastResult,
        analyzeStock,
        analyzeGlobal,
        setError,
        clearResult,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

// Hook to use the context
export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
