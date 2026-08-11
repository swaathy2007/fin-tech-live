import React, { useState } from "react";
import { ArrowLeftRight, Check, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { useCurrency } from "@/context/CurrencyContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChartComponent } from "@/components/ChartComponent";
import { PriceChange } from "@/components/PriceChange";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ComparePage: React.FC = () => {
  const { formatPrice } = useCurrency();

  const [asset1Id, setAsset1Id] = useState<string>("apple");
  const [asset2Id, setAsset2Id] = useState<string>("tesla");

  const asset1 = MOCK_ASSETS.find((a) => a.id === asset1Id) || MOCK_ASSETS[0];
  const asset2 = MOCK_ASSETS.find((a) => a.id === asset2Id) || MOCK_ASSETS[1];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b border-border pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <ArrowLeftRight className="w-7 h-7 text-blue-500" /> Compare Companies & Assets
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Side-by-side financial metric comparison and price trend correlation.
          </p>
        </div>

        {/* Dual Search Selector */}
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-2/5 space-y-1.5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Asset 1</span>
            <Select value={asset1Id} onValueChange={setAsset1Id}>
              <SelectTrigger className="rounded-xl font-bold h-12 text-base">
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

          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 font-extrabold flex items-center justify-center shrink-0 border border-blue-500/20">
            VS
          </div>

          <div className="w-full sm:w-2/5 space-y-1.5">
            <span className="text-xs font-bold text-muted-foreground uppercase">Asset 2</span>
            <Select value={asset2Id} onValueChange={setAsset2Id}>
              <SelectTrigger className="rounded-xl font-bold h-12 text-base">
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
        </div>

        {/* Side-by-side Comparison Matrix Table */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="py-4 px-6 font-semibold w-1/3">Financial Metric</th>
                <th className="py-4 px-6 font-extrabold text-blue-400 w-1/3 text-center">
                  {asset1.symbol} ({asset1.name})
                </th>
                <th className="py-4 px-6 font-extrabold text-cyan-400 w-1/3 text-center">
                  {asset2.symbol} ({asset2.name})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-center sm:text-left">
              <tr>
                <td className="py-4 px-6 font-bold text-muted-foreground">Current Price</td>
                <td className="py-4 px-6 font-black text-foreground text-center text-base">
                  {formatPrice(asset1.price)}
                </td>
                <td className="py-4 px-6 font-black text-foreground text-center text-base">
                  {formatPrice(asset2.price)}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-muted-foreground">24h Change</td>
                <td className="py-4 px-6 text-center">
                  <PriceChange change={asset1.change} />
                </td>
                <td className="py-4 px-6 text-center">
                  <PriceChange change={asset2.change} />
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-muted-foreground">Category</td>
                <td className="py-4 px-6 text-center font-semibold capitalize text-foreground">
                  {asset1.category}
                </td>
                <td className="py-4 px-6 text-center font-semibold capitalize text-foreground">
                  {asset2.category}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-muted-foreground">52W High</td>
                <td className="py-4 px-6 text-center font-semibold text-foreground">
                  {formatPrice(asset1.highWeek52)}
                </td>
                <td className="py-4 px-6 text-center font-semibold text-foreground">
                  {formatPrice(asset2.highWeek52)}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-muted-foreground">52W Low</td>
                <td className="py-4 px-6 text-center font-semibold text-foreground">
                  {formatPrice(asset1.lowWeek52)}
                </td>
                <td className="py-4 px-6 text-center font-semibold text-foreground">
                  {formatPrice(asset2.lowWeek52)}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-muted-foreground">Market Cap</td>
                <td className="py-4 px-6 text-center font-bold text-foreground">
                  {asset1.marketCap}
                </td>
                <td className="py-4 px-6 text-center font-bold text-foreground">
                  {asset2.marketCap}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-bold text-muted-foreground">P/E Ratio (Est.)</td>
                <td className="py-4 px-6 text-center font-bold text-emerald-400">
                  28.4
                </td>
                <td className="py-4 px-6 text-center font-bold text-cyan-400">
                  52.1
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dual Side-by-side Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              {asset1.symbol} Price Trend
            </h3>
            <ChartComponent assetId={asset1.id} assetSymbol={asset1.symbol} isPositive={asset1.change >= 0} />
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              {asset2.symbol} Price Trend
            </h3>
            <ChartComponent assetId={asset2.id} assetSymbol={asset2.symbol} isPositive={asset2.change >= 0} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComparePage;