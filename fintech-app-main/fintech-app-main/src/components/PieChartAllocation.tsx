import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { HoldingWithMetrics } from "@/context/PortfolioContext";
import { useCurrency } from "@/context/CurrencyContext";

interface PieChartAllocationProps {
  holdings: HoldingWithMetrics[];
}

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
];

export const PieChartAllocation: React.FC<PieChartAllocationProps> = ({ holdings }) => {
  const { formatPrice } = useCurrency();

  if (holdings.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No holdings available to render allocation chart.
      </div>
    );
  }

  // Holdings distribution data
  const holdingData = holdings.map((h) => ({
    name: h.symbol,
    fullName: h.assetName,
    value: h.currentValue,
  }));

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

  // Sector breakdown aggregation
  const sectorMap: Record<string, number> = {};
  holdings.forEach((h) => {
    const cat = h.category.toUpperCase();
    sectorMap[cat] = (sectorMap[cat] || 0) + h.currentValue;
  });

  const sectorData = Object.entries(sectorMap).map(([sector, val]) => ({
    name: sector,
    value: val,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      {/* Holdings Donut Chart */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
          Asset Allocation
        </h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={holdingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
              >
                {holdingData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    const percent = totalValue > 0 ? ((dataPoint.value / totalValue) * 100).toFixed(1) : 0;
                    return (
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs text-white shadow-xl">
                        <p className="font-bold text-cyan-400">{dataPoint.fullName} ({dataPoint.name})</p>
                        <p>{formatPrice(dataPoint.value)} ({percent}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
          {holdingData.map((entry, index) => {
            const pct = totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0;
            return (
              <div key={entry.name} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/60">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-bold text-foreground">{entry.name}</span>
                <span className="text-muted-foreground text-[11px]">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sector Breakdown */}
      <div className="space-y-3 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Sector Breakdown
        </h4>

        <div className="space-y-2.5">
          {sectorData.map((sector, idx) => {
            const pct = totalValue > 0 ? ((sector.value / totalValue) * 100).toFixed(1) : 0;
            return (
              <div key={sector.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{sector.name}</span>
                  <span className="text-muted-foreground">{formatPrice(sector.value)} ({pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: COLORS[idx % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};