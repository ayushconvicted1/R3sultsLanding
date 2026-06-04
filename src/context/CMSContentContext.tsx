"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CMSData, CMSResponse } from "@/types/cms";

interface CMSContentContextType {
  data: CMSData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CMSContentContext = createContext<CMSContentContextType>({
  data: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export const useCMSContent = () => useContext(CMSContentContext);

export const CMSContentProvider: React.FC<{
  children: React.ReactNode;
  initialData?: CMSData | null;
}> = ({ children, initialData = null }) => {
  const [data, setData] = useState<CMSData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const domain = process.env.NEXT_PUBLIC_DOMAIN_NAME || "";
      const response = await fetch(`${domain}/api/landing-content/full`, {
        cache: "no-store", // Ensure we always get fresh data
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CMS content: ${response.statusText}`);
      }
      
      const result: CMSResponse = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error("API returned success: false");
      }
    } catch (err: any) {
      console.error("Error fetching CMS content:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
  }, [initialData]);

  return (
    <CMSContentContext.Provider
      value={{ data, loading, error, refresh: fetchData }}
    >
      {children}
    </CMSContentContext.Provider>
  );
};
