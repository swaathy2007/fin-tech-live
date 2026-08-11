import React, { useState } from "react";
import { Compass, Sparkles, Check, ArrowRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { usePortfolio } from "@/context/PortfolioContext";
import { useCurrency } from "@/context/CurrencyContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

export const StrategyPage: React.FC = () => {
  const { buyAsset } = usePortfolio();
  const { formatPrice } = useCurrency();

  const [investmentAmount, setInvestmentAmount] = useState<number>(200000);
  const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High">("Medium");
  const [timeline, setTimeline] = useState<string>("3 Years");

  // Strategy allocation based on risk level
  const allocation =
    riskLevel === "Low"
      ? [
          { name: "Stocks", value: 40, color: "#3b82f6" },
          { name: "Gold/Commodities", value: 40, color: "#f59e0b" },
          { name: "Cash/Reserves", value: 20, color: "#10b981" },
        ]
      : riskLevel === "Medium"
      ? [
          { name: "Stocks (Apple/Tesla)", value: 60, color: "#3b82f6" },
          { name: "Crypto (Bitcoin)", value: 20, color: "#8b5cf6" },
          { name: "Gold/Commodities", value: 20, color: "#f59e0b" },
        ]
      : [
          { name: "High-Growth Stocks", value: 50, color: "#3b82f6" },
          { name: "Crypto Assets", value: 40, color: "#8b5cf6" },
          { name: "Reserves", value: 10, color: "#10b981" },
        ];

  const handleApplyStrategy = () => {
    if (riskLevel === "Low") {
      buyAsset("apple", 20, 220);
      buyAsset("gold", 10, 9800);
    } else {
      buyAsset("apple", 30, 220);
      buyAsset("bitcoin", 0.01, 9500000);
      buyAsset("gold", 5, 9800);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-border pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-blue-500" /> AI Strategy & Portfolio Builder
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tailor a personalized investment allocation based on your risk appetite and target timeline.
          </p>
        </div>

        {/* Input Parameters Form */}
        <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          {/* Amount Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-foreground">Target Capital Allocation</Label>
              <span className="text-lg font-black text-blue-500">
                {formatPrice(investmentAmount)}
              </span>
            </div>
            <Slider
              value={[investmentAmount]}
              min={10000}
              max={1000000}
              step={10000}
              onValueChange={(val) => setInvestmentAmount(val[0])}
            />
          </div>

          {/* Risk Level Picker */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">Risk Appetite Profile</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["Low", "Medium", "High"] as const).map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant={riskLevel === r ? "default" : "outline"}
                  onClick={() => setRiskLevel(r)}
                  className={`rounded-2xl font-bold py-6 ${
                    riskLevel === r ? "bg-blue-600 text-white" : "border-border"
                  }`}
                >
                  {r} Risk
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggested Strategy Result */}
        <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-cyan-400 font-extrabold text-xs uppercase mb-1">
                <Sparkles className="w-4 h-4" /> AI Generated Blueprint
              </div>
              <h2 className="text-xl font-extrabold text-foreground">
                Recommended Allocation for {riskLevel} Risk
              </h2>
            </div>

            <Button
              onClick={handleApplyStrategy}
              className="rounded-2xl font-bold py-6 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-5 h-5" /> Apply to Virtual Portfolio
            </Button>
          </div>

          {/* Donut Chart Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {allocation.map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 rounded-2xl bg-muted/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-foreground">{item.name}</span>
                  </div>
                  <span className="font-black text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StrategyPage;