
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PortfolioData } from '../types';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaults';
import { createClient } from '@supabase/supabase-js';
import { parseResumeMarkdown } from '../services/geminiService';

interface PortfolioContextType {
  data: PortfolioData;
  rawMarkdown: string | null;
  isLoading: boolean;
  error: string | null;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: DEFAULT_PORTFOLIO_DATA,
  rawMarkdown: null,
  isLoading: true,
  error: null,
});

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [rawMarkdown, setRawMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRemoteData = async () => {
      const supabaseUrl = (process as any).env.SUPABASE_URL;
      const supabaseKey = (process as any).env.SUPABASE_ANON_KEY;
      const bucketName = (process as any).env.SUPABASE_STORAGE_BUCKET || 'documents';
      const filePath = (process as any).env.SUPABASE_FILE_PATH || 'SophiaCareer/resume.md';

      if (!supabaseUrl || !supabaseKey) {
        console.info("Supabase credentials not found. Using default local data.");
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Generate signed URL (60 seconds expiry)
        const { data: signedData, error: signedError } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(filePath, 60);

        if (signedError) {
          throw signedError;
        }

        if (!signedData?.signedUrl) {
          throw new Error("Failed to generate signed URL.");
        }

        // Fetch the markdown content
        const response = await fetch(signedData.signedUrl, {
          method: 'GET',
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch from signed URL: ${response.statusText}`);
        }

        const markdownText = await response.text();
        setRawMarkdown(markdownText);
        
        // Parse the markdown using Gemini to maintain the UI structure
        const parsedData = await parseResumeMarkdown(markdownText);
        
        if (parsedData) {
          // Merge with defaults to ensure all required fields are present
          setData({
            ...DEFAULT_PORTFOLIO_DATA,
            ...parsedData,
            projects: parsedData.projects || DEFAULT_PORTFOLIO_DATA.projects,
          });
        }
      } catch (err) {
        console.error("Portfolio Data Error:", err);
        setError(err instanceof Error ? err.message : "Error connecting to Supabase or parsing data");
      } finally {
        setIsLoading(false);
      }
    };

    loadRemoteData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, rawMarkdown, isLoading, error }}>
      {children}
    </PortfolioContext.Provider>
  );
};
