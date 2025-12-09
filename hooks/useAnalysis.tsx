// hooks/useAnalysis.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { geminiService } from '../services/gemini';

export type Plan = 'Free' | 'Pro' | 'Advanced';

export type StockResult = {
  mode: 'STOCK';
  country: 'IN' | 'OTHER';
  plan: Plan;
  text: string;
  vizData: any;
  images?: string[];
  stockMode?: 'SINGLECHART' | 'MULTICHART' | 'STRATEGYONLY';
  indicators?: string[];
  timestamp: string;
};

export type GlobalResult = {
  mode: 'GLOBAL';
  plan: Plan;
  text: string;
  vizData: any;
  marketData?: string;
  timestamp: string;
};

type AnalysisContextType = {
  loading: boolean;
  error: string;
  lastResult: StockResult | GlobalResult | null;
  analyzeStock: (params: {
    images: string[];
    country: 'IN' | 'OTHER';
    plan: Plan;
    mode?: 'SINGLECHART' | 'MULTICHART' | 'STRATEGYONLY';
    strategyRules?: string;
    indicators?: string[];
  }) => Promise<{ id: undefined } & StockResult>;
  analyzeGlobal: (params: {
    marketData: string;
    plan: Plan;
  }) => Promise<{ id: undefined } & GlobalResult>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  clearResult: () => void;
};

const AnalysisContext = createContext<AnalysisContextType | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState<StockResult | GlobalResult | null>(null);

  const analyzeStock = async (params: {
    images: string[];
    country: 'IN' | 'OTHER';
    plan: Plan;
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
        params.plan, // ✅ Added plan parameter
      );

      const result: StockResult = {
        mode: 'STOCK',
        country: params.country,
        plan: params.plan, // ✅ Added plan to result
        text,
        vizData,
        images: params.images,
        stockMode: params.mode,
        indicators: params.indicators,
        timestamp: new Date().toLocaleString('en-US', {
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
    plan: Plan;
  }) => {
    setLoading(true);
    setError('');
    try {
      const { text, vizData } = await geminiService.analyzeGlobalMarkets(
        params.marketData,
        params.plan,
      );

      const result: GlobalResult = {
        mode: 'GLOBAL',
        plan: params.plan,
        text,
        vizData,
        marketData: params.marketData,
        timestamp: new Date().toLocaleString('en-US', {
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

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
