import React, { createContext, useContext, useState, useEffect } from "react";
import { Holding } from "@/types";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { showSuccess, showError } from "@/utils/toast";
import { portfolioApi } from "@/lib/api";

interface PortfolioStats {
  availableBalance: number;
  totalHoldingsValue: number;
  totalPortfolioValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalReturnPercent: number;
  bestHolding: HoldingWithMetrics | null;
  worstHolding: HoldingWithMetrics | null;
  recentPurchase: Holding | null;
}

export interface HoldingWithMetrics extends Holding {
  currentPrice: number;
  currentValue: number;
  investedValue: number;
  profitLoss: number;
  returnPercent: number;
}

interface PortfolioContextType {
  availableBalance: number;
  holdings: Holding[];
  holdingsWithMetrics: HoldingWithMetrics[];
  stats: PortfolioStats;
  buyAsset: (assetId: string, quantity: number, buyPrice: number, buyDate?: string) => boolean;
  sellAsset: (holdingId: string) => void;
  resetPortfolio: () => void;
}

const INITIAL_BALANCE = 1000000; // ₹10,00,000 Initial Virtual Balance

const INITIAL_HOLDINGS: Holding[] = [
  {
    id: "hld_1",
    assetId: "apple",
    assetName: "Apple Inc.",
    symbol: "AAPL",
    quantity: 50,
    buyPrice: 200,
    buyDate: "2024-01-15",
    category: "stock",
  },
  {
    id: "hld_2",
    assetId: "bitcoin",
    assetName: "Bitcoin",
    symbol: "BTC",
    quantity: 0.05,
    buyPrice: 9000000,
    buyDate: "2024-02-10",
    category: "crypto",
  },
  {
    id: "hld_3",
    assetId: "tesla",
    assetName: "Tesla Inc.",
    symbol: "TSLA",
    quantity: 30,
    buyPrice: 170,
    buyDate: "2024-03-01",
    category: "stock",
  },
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableBalance, setAvailableBalance] = useState<number>(() => {
    const saved = localStorage.getItem("portfolio_balance");
    return saved ? Number(saved) : INITIAL_BALANCE - (50 * 200 + 0.05 * 9000000 + 30 * 170);
  });

  const [holdings, setHoldings] = useState<Holding[]>(() => {
    const saved = localStorage.getItem("portfolio_holdings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_HOLDINGS;
      }
    }
    return INITIAL_HOLDINGS;
  });

  // Sync with FastAPI backend if running
  useEffect(() => {
    portfolioApi.getSummary()
      .then((data) => {
        if (data && data.stats) {
          setAvailableBalance(data.stats.available_balance);
          if (data.holdings) {
            setHoldings(data.holdings.map((h: any) => ({
              id: h.id,
              assetId: h.asset_id,
              assetName: h.asset_name,
              symbol: h.symbol,
              quantity: h.quantity,
              buyPrice: h.buy_price,
              buyDate: h.buy_date,
              category: h.category,
            })));
          }
        }
      })
      .catch(() => {
        // Fallback to local storage if API server is offline
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolio_balance", availableBalance.toString());
  }, [availableBalance]);

  useEffect(() => {
    localStorage.setItem("portfolio_holdings", JSON.stringify(holdings));
  }, [holdings]);

  // Compute live metrics for holdings using MOCK_ASSETS current prices
  const holdingsWithMetrics: HoldingWithMetrics[] = holdings.map((hld) => {
    const liveAsset = MOCK_ASSETS.find((a) => a.id === hld.assetId);
    const currentPrice = liveAsset ? liveAsset.price : hld.buyPrice;
    const investedValue = hld.quantity * hld.buyPrice;
    const currentValue = hld.quantity * currentPrice;
    const profitLoss = currentValue - investedValue;
    const returnPercent = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

    return {
      ...hld,
      currentPrice,
      currentValue,
      investedValue,
      profitLoss,
      returnPercent,
    };
  });

  // Calculate Overall Portfolio Stats
  const totalHoldingsValue = holdingsWithMetrics.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = holdingsWithMetrics.reduce((sum, h) => sum + h.investedValue, 0);
  const totalPortfolioValue = availableBalance + totalHoldingsValue;
  const totalProfitLoss = totalHoldingsValue - totalInvested;
  const totalReturnPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  // Best & Worst performers
  let bestHolding: HoldingWithMetrics | null = null;
  let worstHolding: HoldingWithMetrics | null = null;

  if (holdingsWithMetrics.length > 0) {
    const sorted = [...holdingsWithMetrics].sort((a, b) => b.returnPercent - a.returnPercent);
    bestHolding = sorted[0];
    worstHolding = sorted[sorted.length - 1];
  }

  const recentPurchase = holdings.length > 0 ? holdings[holdings.length - 1] : null;

  const stats: PortfolioStats = {
    availableBalance,
    totalHoldingsValue,
    totalPortfolioValue,
    totalInvested,
    totalProfitLoss,
    totalReturnPercent,
    bestHolding,
    worstHolding,
    recentPurchase,
  };

  const buyAsset = (
    assetId: string,
    quantity: number,
    buyPrice: number,
    buyDate: string = new Date().toISOString().split("T")[0]
  ): boolean => {
    const asset = MOCK_ASSETS.find((a) => a.id === assetId);
    if (!asset) {
      showError("Selected asset not found.");
      return false;
    }

    const totalCost = quantity * buyPrice;

    if (totalCost > availableBalance) {
      showError(`Insufficient funds! Transaction cost is ₹${totalCost.toLocaleString()} but you only have ₹${availableBalance.toLocaleString()}`);
      return false;
    }

    const newHolding: Holding = {
      id: "hld_" + Math.random().toString(36).substring(2, 9),
      assetId,
      assetName: asset.name,
      symbol: asset.symbol,
      quantity,
      buyPrice,
      buyDate,
      category: asset.category,
    };

    // Call backend API
    portfolioApi.buyAsset({
      asset_id: assetId,
      asset_name: asset.name,
      symbol: asset.symbol,
      quantity,
      buy_price: buyPrice,
      category: asset.category,
    }).catch(() => {});

    setHoldings((prev) => [...prev, newHolding]);
    setAvailableBalance((prev) => prev - totalCost);
    showSuccess(`Successfully purchased ${quantity} units of ${asset.symbol}!`);
    return true;
  };

  const sellAsset = (holdingId: string) => {
    const target = holdingsWithMetrics.find((h) => h.id === holdingId);
    if (!target) return;

    // Call backend API
    portfolioApi.sellAsset(holdingId).catch(() => {});

    setHoldings((prev) => prev.filter((h) => h.id !== holdingId));
    setAvailableBalance((prev) => prev + target.currentValue);
    showSuccess(`Sold holding ${target.symbol} for ₹${target.currentValue.toLocaleString()}`);
  };

  const resetPortfolio = () => {
    portfolioApi.reset().catch(() => {});
    setAvailableBalance(INITIAL_BALANCE);
    setHoldings([]);
    localStorage.removeItem("portfolio_balance");
    localStorage.removeItem("portfolio_holdings");
    showSuccess("Portfolio reset to default state.");
  };


  return (
    <PortfolioContext.Provider
      value={{
        availableBalance,
        holdings,
        holdingsWithMetrics,
        stats,
        buyAsset,
        sellAsset,
        resetPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};