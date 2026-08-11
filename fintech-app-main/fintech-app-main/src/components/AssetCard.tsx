import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, LineChart } from "lucide-react";
import { Asset } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { PriceChange } from "@/components/PriceChange";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const inWatchlist = isInWatchlist(asset.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(asset.id);
  };

  const handleChartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chart/${asset.id}`);
  };

  const isUp = asset.change >= 0;

  return (
    <Card
      onClick={() => navigate(`/asset/${asset.id}`)}
      className="group relative overflow-hidden p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-500/40 bg-card border-border dark:hover:bg-slate-900/60"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-foreground tracking-tight group-hover:text-blue-500 transition-colors">
              {asset.symbol}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-secondary text-secondary-foreground uppercase">
              {asset.category}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[180px] mt-0.5">
            {asset.name}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleChartClick}
            aria-label="View Chart"
            title="View Technical Chart"
            className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-blue-400 transition-colors"
          >
            <LineChart className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleHeartClick}
            aria-label={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            title={inWatchlist ? "Remove Watchlist" : "Add Watchlist"}
            className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-transform active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                inWatchlist ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-2">
        <div>
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            {formatPrice(asset.price)}
          </span>
        </div>
        <PriceChange change={asset.change} />
      </div>

      {/* Mini Sparkline Chart Visual Placeholder */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="w-full flex items-center justify-between gap-1 h-6 px-1">
          {asset.sparkline ? (
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
              <path
                d={
                  isUp
                    ? "M0,20 Q20,16 40,18 T80,8 T100,4"
                    : "M0,4 Q20,8 40,6 T80,18 T100,22"
                }
                fill="none"
                stroke={isUp ? "#10b981" : "#ef4444"}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <div className="w-full h-1 bg-muted rounded" />
          )}
        </div>
      </div>

      {/* 52-Week Range info */}
      {asset.highWeek52 && asset.lowWeek52 && (
        <div className="mt-2 text-[11px] text-muted-foreground flex justify-between items-center">
          <span>52W L: {formatPrice(asset.lowWeek52)}</span>
          <span>52W H: {formatPrice(asset.highWeek52)}</span>
        </div>
      )}
    </Card>
  );
};