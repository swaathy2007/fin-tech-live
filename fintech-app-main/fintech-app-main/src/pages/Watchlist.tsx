import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { useWatchlist } from "@/context/WatchlistContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AssetTable } from "@/components/AssetTable";
import { EmptyState } from "@/components/EmptyState";

const Watchlist: React.FC = () => {
  const { watchlist } = useWatchlist();

  const watchlistAssets = MOCK_ASSETS.filter((asset) =>
    watchlist.includes(asset.id)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20" /> My Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Monitor your saved stocks, cryptocurrencies, and commodities in real-time.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tracking {watchlistAssets.length} Assets</span>
          </div>
        </div>

        {/* Content */}
        {watchlistAssets.length > 0 ? (
          <AssetTable assets={watchlistAssets} />
        ) : (
          <EmptyState
            type="watchlist"
            actionLink="/"
            actionText="Browse Market Dashboard"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Watchlist;