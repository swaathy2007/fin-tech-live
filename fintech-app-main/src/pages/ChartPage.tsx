import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, LineChart as ChartIcon, Heart, ExternalLink } from "lucide-react";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { useCurrency } from "@/context/CurrencyContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChartComponent } from "@/components/ChartComponent";
import { PriceChange } from "@/components/PriceChange";
import { BuyAssetModal } from "@/components/BuyAssetModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ChartPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  // Selected asset or default to apple
  const activeAssetId = id || MOCK_ASSETS[0].id;
  const asset = MOCK_ASSETS.find((a) => a.id === activeAssetId) || MOCK_ASSETS[0];

  const inWatchlist = isInWatchlist(asset.id);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Navigation & Asset Switcher Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-xl gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {/* Quick Switcher */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <span className="text-xs text-muted-foreground font-semibold">Switch Asset:</span>
            <Select
              value={asset.id}
              onValueChange={(val) => navigate(`/chart/${val}`)}
            >
              <SelectTrigger className="w-[180px] rounded-xl font-bold">
                <SelectValue placeholder="Select asset" />
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

        {/* Asset Header Banner */}
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {asset.name}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-secondary text-secondary-foreground uppercase">
                  {asset.symbol}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 font-semibold uppercase">
                  {asset.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Technical Price Charts & Volume Distribution
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={inWatchlist ? "secondary" : "outline"}
                size="sm"
                onClick={() => toggleWatchlist(asset.id)}
                className="rounded-xl font-bold gap-1.5 border-border"
              >
                <Heart className={`w-4 h-4 ${inWatchlist ? "fill-rose-500 text-rose-500" : ""}`} />
                {inWatchlist ? "Watchlisted" : "Watch"}
              </Button>

              <BuyAssetModal />
            </div>
          </div>

          <div className="flex items-baseline gap-4 pt-2 border-t border-border">
            <span className="text-3xl sm:text-4xl font-black text-foreground">
              {formatPrice(asset.price)}
            </span>
            <PriceChange change={asset.change} size="lg" />
          </div>
        </div>

        {/* Interactive Chart Component */}
        <ChartComponent
          assetId={asset.id}
          assetSymbol={asset.symbol}
          isPositive={asset.change >= 0}
        />
      </div>
    </DashboardLayout>
  );
};

export default ChartPage;