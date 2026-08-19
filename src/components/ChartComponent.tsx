import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { TimePeriod, PricePoint } from "@/types";
import { getPriceHistory } from "@/data/mockPriceHistory";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Sparkles, HelpCircle } from "lucide-react";
import { AiChartModal } from "@/components/AiChartModal";

interface ChartComponentProps {
  assetId: string;
  assetSymbol: string;
  isPositive?: boolean;
}

const TIME_PERIODS: TimePeriod[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

export const ChartComponent: React.FC<ChartComponentProps> = ({
  assetId,
  assetSymbol,
  isPositive = true,
}) => {
  const { formatPrice } = useCurrency();
  const [period, setPeriod] = useState<TimePeriod>("1M");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const data: PricePoint[] = getPriceHistory(assetId, period);

  const chartColor = isPositive ? "#10b981" : "#ef4444";

  // Calculate high/low for YAxis domain padding
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.98;
  const maxPrice = Math.max(...prices) * 1.02;

  // Stats calculation over period
  const openPrice = data.length > 0 ? data[0].open : 0;
  const closePrice = data.length > 0 ? data[data.length - 1].close : 0;
  const periodHigh = data.length > 0 ? Math.max(...data.map((d) => d.high)) : 0;
  const periodLow = data.length > 0 ? Math.min(...data.map((d) => d.low)) : 0;
  const periodAvg =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.price, 0) / data.length
      : 0;

  return (
    <>
      <AiChartModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        assetSymbol={assetSymbol}
        period={period}
        openPrice={openPrice}
        closePrice={closePrice}
        periodHigh={periodHigh}
        periodLow={periodLow}
        periodAvg={periodAvg}
      />
      <div className="space-y-6">
        {/* Header Controls & Timeframe Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/80 p-3 rounded-2xl border border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Timeframe:
            </span>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
              {TIME_PERIODS.map((t) => (
                <button
                  key={t}
                  onClick={() => setPeriod(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    period === t
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* AI Explain Chart Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAiModalOpen(true)}
            className="rounded-xl border-blue-500/30 text-blue-400 hover:bg-blue-500/10 gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Explain Chart
            <HelpCircle className="w-3 h-3 text-muted-foreground" />
          </Button>
        </div>

      {/* Primary Price Area Chart */}
      <div className="bg-card border border-border p-4 rounded-3xl space-y-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground px-2 pt-1">
          <span className="font-bold text-foreground">{assetSymbol} Price Trend ({period})</span>
          <span>Hover data points for exact price</span>
        </div>

        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorPrice_${assetId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="formattedDate"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatPrice(val)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as PricePoint;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-2xl shadow-xl text-xs space-y-1 text-white">
                        <p className="text-slate-400 font-semibold">{dataPoint.formattedDate}</p>
                        <p className="text-lg font-bold text-cyan-400">
                          {formatPrice(dataPoint.price)}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                          <span>Open: {formatPrice(dataPoint.open)}</span>
                          <span>Close: {formatPrice(dataPoint.close)}</span>
                          <span>High: {formatPrice(dataPoint.high)}</span>
                          <span>Low: {formatPrice(dataPoint.low)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#colorPrice_${assetId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Bar Chart */}
      <div className="bg-card border border-border p-4 rounded-3xl space-y-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
          <span className="font-semibold text-foreground">Trading Volume ({period})</span>
        </div>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="formattedDate" hide />
              <YAxis hide />
              <Bar dataKey="volume" fill="#3b82f6" opacity={0.6} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Period Statistics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-card border border-border p-3.5 rounded-2xl">
          <p className="text-[11px] text-muted-foreground font-semibold">Period Open</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(openPrice)}</p>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-2xl">
          <p className="text-[11px] text-muted-foreground font-semibold">Period Close</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(closePrice)}</p>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-2xl">
          <p className="text-[11px] text-muted-foreground font-semibold">Period High</p>
          <p className="text-sm font-bold text-emerald-500 mt-0.5">{formatPrice(periodHigh)}</p>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-2xl">
          <p className="text-[11px] text-muted-foreground font-semibold">Period Low</p>
          <p className="text-sm font-bold text-rose-500 mt-0.5">{formatPrice(periodLow)}</p>
        </div>
        <div className="bg-card border border-border p-3.5 rounded-2xl col-span-2 sm:col-span-1">
          <p className="text-[11px] text-muted-foreground font-semibold">Average Price</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(periodAvg)}</p>
        </div>
      </div>
    </div>
  </>
  );
};