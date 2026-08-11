import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowUpDown, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Asset, Category } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { PriceChange } from "@/components/PriceChange";
import { Button } from "@/components/ui/button";

interface AssetTableProps {
  assets: Asset[];
}

type SortField = "name" | "price" | "change";

export const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { removeFromWatchlist } = useWatchlist();

  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Filter
  const filteredAssets = assets.filter((asset) => {
    if (categoryFilter === "all") return true;
    return asset.category === categoryFilter;
  });

  // Sort
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let result = 0;
    if (sortField === "name") {
      result = a.name.localeCompare(b.name);
    } else if (sortField === "price") {
      result = a.price - b.price;
    } else if (sortField === "change") {
      result = a.change - b.change;
    }
    return sortAsc ? result : -result;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default high-to-low for numbers
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls: Category Filter + Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-3 rounded-2xl border border-border">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all", "stock", "crypto", "commodity"] as const).map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "ghost"}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className="rounded-xl text-xs capitalize font-medium transition-all"
            >
              {cat === "all" ? "All Assets" : `${cat}s`}
            </Button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-muted-foreground font-medium hidden xs:inline">Sort by:</span>
          <Button
            variant={sortField === "name" ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleSort("name")}
            className="rounded-xl text-xs h-8 gap-1"
          >
            Name
            <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
          </Button>
          <Button
            variant={sortField === "price" ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleSort("price")}
            className="rounded-xl text-xs h-8 gap-1"
          >
            Price
            <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
          </Button>
          <Button
            variant={sortField === "change" ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleSort("change")}
            className="rounded-xl text-xs h-8 gap-1"
          >
            Change %
            <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Desktop & Tablet Table / Mobile Card Grid */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Asset</th>
                <th className="py-3.5 px-5 font-semibold">Category</th>
                <th className="py-3.5 px-5 font-semibold">Price</th>
                <th className="py-3.5 px-5 font-semibold">24h Change</th>
                <th className="py-3.5 px-5 font-semibold">52W Range</th>
                <th className="py-3.5 px-5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedAssets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => navigate(`/asset/${asset.id}`)}
                  className="hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="font-bold text-foreground">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground uppercase">
                      {asset.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-foreground">
                    {formatPrice(asset.price)}
                  </td>
                  <td className="py-4 px-5">
                    <PriceChange change={asset.change} />
                  </td>
                  <td className="py-4 px-5 text-xs text-muted-foreground">
                    <div>High: {formatPrice(asset.highWeek52)}</div>
                    <div>Low: {formatPrice(asset.lowWeek52)}</div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(asset.id);
                      }}
                      className="h-8 w-8 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      title="Remove from watchlist"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="md:hidden divide-y divide-border">
          {sortedAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => navigate(`/asset/${asset.id}`)}
              className="p-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-base">{asset.symbol}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                    {asset.category}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {asset.name}
                </div>
                <div className="text-xs text-muted-foreground pt-1">
                  52W Range: {formatPrice(asset.lowWeek52)} - {formatPrice(asset.highWeek52)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-extrabold text-foreground text-sm">
                    {formatPrice(asset.price)}
                  </div>
                  <div className="mt-1">
                    <PriceChange change={asset.change} size="sm" />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(asset.id);
                  }}
                  className="h-8 w-8 rounded-full text-rose-500 hover:bg-rose-500/10"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};