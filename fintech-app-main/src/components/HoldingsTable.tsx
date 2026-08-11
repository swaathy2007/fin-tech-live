import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, LineChart, ExternalLink } from "lucide-react";
import { HoldingWithMetrics, usePortfolio } from "@/context/PortfolioContext";
import { useCurrency } from "@/context/CurrencyContext";
import { PriceChange } from "@/components/PriceChange";
import { Button } from "@/components/ui/button";

interface HoldingsTableProps {
  holdings: HoldingWithMetrics[];
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { sellAsset } = usePortfolio();

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      {/* Desktop View Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="py-3.5 px-5 font-semibold">Asset</th>
              <th className="py-3.5 px-5 font-semibold">Quantity</th>
              <th className="py-3.5 px-5 font-semibold">Avg Buy Price</th>
              <th className="py-3.5 px-5 font-semibold">Current Price</th>
              <th className="py-3.5 px-5 font-semibold">Current Value</th>
              <th className="py-3.5 px-5 font-semibold">Profit / Loss</th>
              <th className="py-3.5 px-5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {holdings.map((hld) => (
              <tr
                key={hld.id}
                onClick={() => navigate(`/asset/${hld.assetId}`)}
                className="hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <td className="py-4 px-5">
                  <div className="font-bold text-foreground flex items-center gap-2">
                    {hld.assetName}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                      {hld.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Bought: {hld.buyDate}
                  </div>
                </td>
                <td className="py-4 px-5 font-semibold text-foreground">
                  {hld.quantity}
                </td>
                <td className="py-4 px-5 font-semibold text-foreground">
                  {formatPrice(hld.buyPrice)}
                </td>
                <td className="py-4 px-5 font-semibold text-foreground">
                  {formatPrice(hld.currentPrice)}
                </td>
                <td className="py-4 px-5 font-extrabold text-foreground">
                  {formatPrice(hld.currentValue)}
                </td>
                <td className="py-4 px-5">
                  <div className="flex flex-col">
                    <span
                      className={`font-bold ${
                        hld.profitLoss >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {hld.profitLoss >= 0 ? "+" : ""}
                      {formatPrice(hld.profitLoss)}
                    </span>
                    <PriceChange change={hld.returnPercent} size="sm" />
                  </div>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/chart/${hld.assetId}`)}
                      className="h-8 w-8 rounded-full text-blue-400 hover:bg-blue-500/10"
                      title="View Chart"
                    >
                      <LineChart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => sellAsset(hld.id)}
                      className="h-8 w-8 rounded-full text-rose-500 hover:bg-rose-500/10"
                      title="Sell Holding"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet View Cards */}
      <div className="lg:hidden divide-y divide-border">
        {holdings.map((hld) => (
          <div
            key={hld.id}
            onClick={() => navigate(`/asset/${hld.assetId}`)}
            className="p-4 space-y-3 hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-foreground text-base mr-2">{hld.symbol}</span>
                <span className="text-xs text-muted-foreground">{hld.assetName}</span>
              </div>
              <PriceChange change={hld.returnPercent} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50">
              <div>
                <span className="text-muted-foreground">Quantity:</span>{" "}
                <span className="font-bold text-foreground">{hld.quantity}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Buy Price:</span>{" "}
                <span className="font-bold text-foreground">{formatPrice(hld.buyPrice)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Current Value:</span>{" "}
                <span className="font-extrabold text-foreground">{formatPrice(hld.currentValue)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total P&L:</span>{" "}
                <span className={`font-bold ${hld.profitLoss >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {hld.profitLoss >= 0 ? "+" : ""}{formatPrice(hld.profitLoss)}
                </span>
              </div>
            </div>

            <div className="flex justify-end items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/chart/${hld.assetId}`)}
                className="rounded-xl text-xs h-8 gap-1.5 border-border"
              >
                <LineChart className="w-3.5 h-3.5 text-blue-400" />
                Chart
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => sellAsset(hld.id)}
                className="rounded-xl text-xs h-8 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sell
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};