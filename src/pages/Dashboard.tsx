import React, { useState } from "react";
import { TrendingUp, Activity, Sparkles, Filter } from "lucide-react";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SearchBar } from "@/components/SearchBar";
import { AssetCard } from "@/components/AssetCard";
import { EmptyState } from "@/components/EmptyState";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");

  const filteredAssets = MOCK_ASSETS.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header & Summary Stats */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 text-white border border-border shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Real-time Financial Intelligence
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || "Investor"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Track global markets, cryptocurrencies, and commodities with AI insights.
              </p>
            </div>

            {/* Quick Overview Stat Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 min-w-[260px]">
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Market Status
                </div>
                <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  Bullish <span className="text-[10px] text-slate-400 font-normal">(80% +)</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Top Performer
                </div>
                <div className="text-base font-bold text-white mt-1">
                  Tesla <span className="text-xs text-emerald-400">+4.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:max-w-md"
          />

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-muted-foreground font-semibold mr-1 hidden lg:inline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {(["all", "stock", "crypto", "commodity"] as const).map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-xl text-xs capitalize font-semibold transition-all ${
                  categoryFilter === cat
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All Markets" : `${cat}s`}
              </Button>
            ))}
          </div>
        </div>

        {/* Market Overview Section Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                Market Overview
              </h2>
              <p className="text-xs text-muted-foreground">
                Showing {filteredAssets.length} tracked financial instruments
              </p>
            </div>
          </div>

          {/* Cards Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="search"
              onActionClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;