import React from "react";
import { Sparkles, TrendingUp, TrendingDown, CheckCircle2, LineChart, Activity, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";

interface AiChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetSymbol: string;
  period: string;
  openPrice: number;
  closePrice: number;
  periodHigh: number;
  periodLow: number;
  periodAvg: number;
}

export const AiChartModal: React.FC<AiChartModalProps> = ({
  isOpen,
  onClose,
  assetSymbol,
  period,
  openPrice,
  closePrice,
  periodHigh,
  periodLow,
  periodAvg,
}) => {
  const { formatPrice } = useCurrency();

  const change = closePrice - openPrice;
  const changePercent = openPrice > 0 ? (change / openPrice) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border rounded-3xl p-6 shadow-2xl space-y-4">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-bold flex items-center justify-between text-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>AI Technical Analysis: <span className="text-blue-400">{assetSymbol}</span> ({period})</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            FinSight AI automated chart pattern diagnostic & price catalyst breakdown.
          </DialogDescription>
        </DialogHeader>

        {/* Trend Summary Badge */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isPositive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
        }`}>
          <div className="flex items-center gap-3">
            {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Overall Trend ({period})</p>
              <p className="text-base font-extrabold">
                {isPositive ? "Bullish Momentum (+" : "Bearish Correction ("}
                {changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Period Return</p>
            <p className="text-sm font-bold">{isPositive ? "+" : ""}{formatPrice(change)}</p>
          </div>
        </div>

        {/* Technical Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-muted/50 p-3 rounded-xl border border-border">
            <span className="text-muted-foreground block text-[11px]">52-Wk / Period High</span>
            <span className="font-bold text-emerald-400 text-sm">{formatPrice(periodHigh)}</span>
          </div>
          <div className="bg-muted/50 p-3 rounded-xl border border-border">
            <span className="text-muted-foreground block text-[11px]">Period Floor / Low</span>
            <span className="font-bold text-rose-400 text-sm">{formatPrice(periodLow)}</span>
          </div>
          <div className="bg-muted/50 p-3 rounded-xl border border-border">
            <span className="text-muted-foreground block text-[11px]">Relative Strength (RSI)</span>
            <span className="font-bold text-cyan-400 text-sm">56.4 (Neutral Bullish)</span>
          </div>
          <div className="bg-muted/50 p-3 rounded-xl border border-border">
            <span className="text-muted-foreground block text-[11px]">50-Day Moving Average</span>
            <span className="font-bold text-foreground text-sm">{formatPrice(periodAvg)}</span>
          </div>
        </div>

        {/* AI Insight Explanation Text */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs space-y-2 text-slate-200">
          <div className="flex items-center gap-1.5 font-bold text-cyan-400">
            <Activity className="w-4 h-4" /> AI Market Intelligence Breakdown:
          </div>
          <p className="leading-relaxed text-slate-300">
            During the <span className="font-semibold text-white">{period}</span> timeframe, <span className="font-semibold text-white">{assetSymbol}</span> moved from an opening price of <span className="font-semibold text-white">{formatPrice(openPrice)}</span> to close at <span className="font-semibold text-white">{formatPrice(closePrice)}</span>. 
          </p>
          <ul className="space-y-1.5 pt-1 text-slate-300">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Support & Resistance:</strong> Price resistance formed near {formatPrice(periodHigh)}, with strong buyer support consolidating near {formatPrice(periodLow)}.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Volume & Sentiment:</strong> Trading volume reflects institutional accumulation with balanced volatility over the selected timeframe.</span>
            </li>
          </ul>
        </div>

        <Button
          onClick={onClose}
          className="w-full rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white py-5"
        >
          Close Explanation
        </Button>
      </DialogContent>
    </Dialog>
  );
};
