import React, { useState } from "react";
import { Calculator, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { useCurrency } from "@/context/CurrencyContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SimulatorPage: React.FC = () => {
  const { formatPrice } = useCurrency();

  const [selectedAssetId, setSelectedAssetId] = useState<string>("apple");
  const [initialAmount, setInitialAmount] = useState<string>("100000"); // ₹1,00,000
  const [startDate, setStartDate] = useState<string>("2023-01-01");

  const asset = MOCK_ASSETS.find((a) => a.id === selectedAssetId) || MOCK_ASSETS[0];

  const amountNumber = parseFloat(initialAmount) || 100000;
  // Mock historical growth multiplier (e.g. 1.65x for Apple)
  const growthFactor = asset.id === "apple" ? 1.68 : asset.id === "bitcoin" ? 2.45 : 1.35;
  const currentValue = amountNumber * growthFactor;
  const profitAmount = currentValue - amountNumber;
  const returnPercent = ((growthFactor - 1) * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-border pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Calculator className="w-7 h-7 text-blue-500" /> AI Market Backtest Simulator
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Calculate what your investments would be worth today if you invested in the past.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">Select Financial Asset</Label>
              <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                <SelectTrigger className="rounded-xl font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl max-h-60">
                  {MOCK_ASSETS.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.symbol} - {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sim-amount" className="text-xs font-bold text-foreground">
                Investment Amount (INR)
              </Label>
              <Input
                id="sim-amount"
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sim-date" className="text-xs font-bold text-foreground">
                Historical Start Date
              </Label>
              <Input
                id="sim-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 rounded-3xl border border-border text-white shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase">
            <Sparkles className="w-4 h-4" /> Simulation Results
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-200">
              If you invested <span className="text-cyan-400">{formatPrice(amountNumber)}</span> in{" "}
              <span className="text-white font-black">{asset.name}</span> on {startDate}:
            </h2>

            <div className="mt-4 flex flex-wrap items-baseline gap-6">
              <div>
                <p className="text-xs text-slate-400 font-medium">It would be worth today:</p>
                <p className="text-3xl sm:text-4xl font-black text-emerald-400 mt-0.5">
                  {formatPrice(currentValue)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Total Net Gain:</p>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">
                  +{formatPrice(profitAmount)} (+{returnPercent}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Asset Scenario Comparison Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-foreground">
            What if you invested in these other assets instead?
          </h2>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">Alternative Asset</th>
                  <th className="py-3.5 px-5 font-semibold">Initial Invested</th>
                  <th className="py-3.5 px-5 font-semibold">Today's Value</th>
                  <th className="py-3.5 px-5 text-right font-semibold">Total Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_ASSETS.slice(0, 5).map((a) => {
                  const mult = a.id === "bitcoin" ? 2.45 : a.id === "apple" ? 1.68 : 1.35;
                  const val = amountNumber * mult;
                  const ret = ((mult - 1) * 100).toFixed(1);
                  return (
                    <tr key={a.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-4 px-5 font-bold text-foreground">
                        {a.name} ({a.symbol})
                      </td>
                      <td className="py-4 px-5 font-semibold text-muted-foreground">
                        {formatPrice(amountNumber)}
                      </td>
                      <td className="py-4 px-5 font-black text-foreground">
                        {formatPrice(val)}
                      </td>
                      <td className="py-4 px-5 text-right font-extrabold text-emerald-500">
                        +{ret}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimulatorPage;