import React, { createContext, useContext, useState, useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (assetId: string) => void;
  removeFromWatchlist: (assetId: string) => void;
  toggleWatchlist: (assetId: string) => void;
  isInWatchlist: (assetId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ["apple", "bitcoin", "nvidia"];
      }
    }
    return ["apple", "bitcoin", "nvidia"];
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (assetId: string) => {
    if (!watchlist.includes(assetId)) {
      setWatchlist((prev) => [...prev, assetId]);
      showSuccess("Added to your watchlist");
    }
  };

  const removeFromWatchlist = (assetId: string) => {
    setWatchlist((prev) => prev.filter((id) => id !== assetId));
    showSuccess("Removed from your watchlist");
  };

  const toggleWatchlist = (assetId: string) => {
    if (watchlist.includes(assetId)) {
      removeFromWatchlist(assetId);
    } else {
      addToWatchlist(assetId);
    }
  };

  const isInWatchlist = (assetId: string) => watchlist.includes(assetId);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};