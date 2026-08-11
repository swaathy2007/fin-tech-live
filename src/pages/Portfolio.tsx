import React from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Sparkles,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useCurrency } from "@/context/CurrencyContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { HoldingsTable } from "@/components/HoldingsTable";
import { PieChartAllocation } from "@/components/PieChartAllocation";
import { BuyAssetModal } from "@/components/BuyAssetModal";
import { EmptyState } from "@/components/EmptyState";
import { PriceChange } from "@/components/PriceChange";
import { Button } from "@/components/ui/button";

const Portfolio: React.FC = () => {
  const { availableBalance, holdingsWithMetrics, stats, resetPortfolio } = usePortfolio();
  const { formatPrice } = useCurrency();

  const isProfit = stats.totalProfitLoss >= 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Wallet className="w-7 h-7 text-blue-500" /> Virtual Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Practice paper trading and track your investment strategy risk-free.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <BuyAssetModal />
            <Button
              variant="outline"
              size="icon"
              onClick={resetPortfolio}
              title="Reset Portfolio to ₹10,00,000"
              className="rounded-xl border-border text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Top Summary Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Portfolio Value */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-5 rounded-3xl border border-border shadow-md">
            <p className="text-xs font-semibold text-slate-400">Total Portfolio Value</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">
              {formatPrice(stats.totalPortfolioValue)}
            </p>
            <div className="mt-2 text-[11px] text-slate-400">
              Holdings: <span className="font-bold text-white">{formatPrice(stats.totalHoldingsValue)}</span>
            </div>
          </div>

          {/* Available Cash Balance */}
          <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground">Available Virtual Cash</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              {formatPrice(availableBalance)}
            </p>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Ready to invest in markets
            </div>
          </div>

          {/* Total Profit / Loss */}
          <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground">Total Gain / Loss</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`text-2xl font-black ${isProfit ? "text-emerald-500" : "text-rose-500"}`}>
                {isProfit ? "+" : ""}{formatPrice(stats.totalProfitLoss)}
              </p>
            </div>
            <div className="mt-2">
              <PriceChange change={stats.totalReturnPercent} size="sm" />
            </div>
          </div>

          {/* Holdings Count */}
          <div className="bg-card p-5 rounded-3xl border border-border shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground">Active Holdings</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {holdingsWithMetrics.length}
            </p>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Across stocks, crypto & commodities
            </div>
          </div>
        </div>

        {/* Section 2: Asset Allocation Chart */}
        {holdingsWithMetrics.length > 0 && (
          <div className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-blue-500" /> Portfolio Analytics & Allocation
              </h2>
            </div>
            <PieChartAllocation holdings={holdingsWithMetrics} />
          </div>
        )}

        {/* Section 3: Performance Highlights */}
        {holdingsWithMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Best Holding */}
            {stats.bestHolding && (
              <div className="bg-card border border-emerald-500/30 p-5 rounded-3xl space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" /> Top Performer
                  </span>
                  <span>+{stats.bestHolding.returnPercent.toFixed(1)}%</span>
                </div>
                <div className="font-extrabold text-lg text-foreground">
                  {stats.bestHolding.assetName} ({stats.bestHolding.symbol})
                </div>
                <div className="text-xs text-muted-foreground">
                  Profit:{" "}
                  <span className="font-bold text-emerald-500">
                    +{formatPrice(stats.bestHolding.profitLoss)}
                  </span>
                </div>
              </div>
            )}

            {/* Worst Holding */}
            {stats.worstHolding && (
              <div className="bg-card border border-rose-500/30 p-5 rounded-3xl space-y-2">
                <div className="flex items-center justify-between text-xs text-rose-500 font-bold">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" /> Lowest Return
                  </span>
                  <span>{stats.worstHolding.returnPercent.toFixed(1)}%</span>
                </div>
                <div className="font-extrabold text-lg text-foreground">
                  {stats.worstHolding.assetName} ({stats.worstHolding.symbol})
                </div>
                <div className="text-xs text-muted-foreground">
                  P&L:{" "}
                  <span className="font-bold text-rose-500">
                    {formatPrice(stats.worstHolding.profitLoss)}
                  </span>
                </div>
              </div>
            )}

            {/* Recent Purchase */}
            {stats.recentPurchase && (
              <div className="bg-card border border-blue-500/30 p-5 rounded-3xl space-y-2">
                <div className="flex items-center justify-between text-xs text-blue-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> Latest Purchase
                  </span>
                  <span>{stats.recentPurchase.buyDate}</span>
                </div>
                <div className="font-extrabold text-lg text-foreground">
                  {stats.recentPurchase.assetName} ({stats.recentPurchase.symbol})
                </div>
                <div className="text-xs text-muted-foreground">
                  Qty: {stats.recentPurchase.quantity} @ {formatPrice(stats.recentPurchase.buyPrice)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 4: Holdings List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              Holdings Overview
            </h2>
          </div>

          {holdingsWithMetrics.length > 0 ? (
            <HoldingsTable holdings={holdingsWithMetrics} />
          ) : (
            <EmptyState
              title="No Holdings in Portfolio"
              description="Start building your virtual investment portfolio by buying assets using the button above!"
              actionText="Browse Markets"
              actionLink="/"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;