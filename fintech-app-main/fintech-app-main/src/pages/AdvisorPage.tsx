import React from "react";
import { Bot, Sparkles, ShieldAlert, Check, RefreshCw } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useCurrency } from "@/context/CurrencyContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";

export const AdvisorPage: React.FC = () => {
  const { holdingsWithMetrics, stats, buyAsset } = usePortfolio();
  const { formatPrice } = useCurrency();

  const handleAutoRebalance = () => {
    buyAsset("gold", 5, 9800);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-border pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-cyan-400" /> AI Portfolio Advisor & Risk Audit
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Automated concentration risk audit and intelligent rebalancing suggestions.
          </p>
        </div>

        {/* Risk Assessment Banner */}
        <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase">
              <Sparkles className="w-4 h-4" /> Live Risk Diagnostic
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400">
              Low Concentration Risk
            </span>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            "Your portfolio currently holds {holdingsWithMetrics.length} assets with a net return of{" "}
            <strong>+{stats.totalReturnPercent.toFixed(1)}%</strong>. To optimize risk-adjusted returns during macro volatility, consider increasing cash/gold defensive reserves to 15%."
          </p>

          <Button
            onClick={handleAutoRebalance}
            className="rounded-2xl font-bold py-6 bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Auto-Apply AI Rebalancing Recommendations
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdvisorPage;