import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  LineChart as ChartIcon,
  Newspaper,
  ExternalLink,
  BarChart2,
} from "lucide-react";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { useCurrency } from "@/context/CurrencyContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PriceChange } from "@/components/PriceChange";
import { ChartComponent } from "@/components/ChartComponent";
import { BuyAssetModal } from "@/components/BuyAssetModal";
import { Button } from "@/components/ui/button";

const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const asset = MOCK_ASSETS.find((a) => a.id === id);

  if (!asset) {
    return (
      <DashboardLayout>
        <div className="text-center py-16 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Asset Not Found</h2>
          <p className="text-muted-foreground text-sm">
            The requested financial instrument does not exist in our system.
          </p>
          <Button onClick={() => navigate("/")} className="rounded-xl font-bold">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const inWatchlist = isInWatchlist(asset.id);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="rounded-xl gap-2 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to previous page
        </Button>

        {/* Main Header Banner */}
        <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {asset.name}
                </span>
                <span className="text-sm font-bold px-2.5 py-1 rounded-xl bg-secondary text-secondary-foreground uppercase">
                  {asset.symbol}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-500 font-semibold uppercase">
                  {asset.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                FinSight ID: {asset.id} • Realtime Data Feed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant={inWatchlist ? "secondary" : "default"}
                onClick={() => toggleWatchlist(asset.id)}
                className={`rounded-2xl font-bold gap-2 ${
                  inWatchlist
                    ? "border border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    inWatchlist ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
                {inWatchlist ? "Remove Watchlist" : "Add to Watchlist"}
              </Button>

              <BuyAssetModal />
            </div>
          </div>

          {/* Price & Change Banner */}
          <div className="flex flex-wrap items-baseline gap-4 pt-4 border-t border-border">
            <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              {formatPrice(asset.price)}
            </span>
            <PriceChange change={asset.change} size="lg" />
          </div>
        </div>

        {/* Section 2: Interactive Chart Component */}
        <ChartComponent
          assetId={asset.id}
          assetSymbol={asset.symbol}
          isPositive={asset.change >= 0}
        />

        {/* Stats Grid & Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <div className="md:col-span-1 bg-card border border-border p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-500" /> Key Metrics
            </h3>

            <div className="space-y-3.5 divide-y divide-border/60 text-sm">
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">52W High</span>
                <span className="font-bold text-foreground">
                  {formatPrice(asset.highWeek52)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">52W Low</span>
                <span className="font-bold text-foreground">
                  {formatPrice(asset.lowWeek52)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-bold text-foreground">{asset.marketCap}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Category</span>
                <span className="font-bold text-foreground capitalize">
                  {asset.category}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2 bg-card border border-border p-6 rounded-3xl space-y-3">
            <h3 className="font-bold text-base text-foreground">About {asset.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {asset.description}
            </p>
          </div>
        </div>

        {/* News Placeholder */}
        <div className="bg-card border border-border p-8 rounded-3xl text-center space-y-3 border-dashed">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center">
            <Newspaper className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">AI News Feed & Sentiment</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Related news will appear here (coming in Phase 3 with sentiment analysis).
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssetDetail;