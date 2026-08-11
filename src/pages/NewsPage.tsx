import React, { useState } from "react";
import { Newspaper, Sparkles, TrendingUp, Search, ExternalLink, Filter } from "lucide-react";
import { NEWS_ARTICLES } from "@/data/mockNewsData";
import { Category } from "@/types";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateAlertModal } from "@/components/CreateAlertModal";

const CATEGORIES = ["All", "Markets", "Tech", "Crypto", "Finance", "Commodities"] as const;

export const NewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = NEWS_ARTICLES.filter((art) => {
    const matchesCategory =
      selectedCategory === "All" || art.category === selectedCategory;
    const matchesSearch =
      art.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Newspaper className="w-7 h-7 text-blue-500" /> Financial News & Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Curated financial headlines paired with AI sentiment analysis and impact takeaways.
            </p>
          </div>

          <CreateAlertModal />
        </div>

        {/* Market Overview Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 rounded-3xl border border-border text-white shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Today's Market Overview
          </div>

          <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-100">
            "Global equity benchmarks rallied strongly as major tech firms expanded AI capital expenditure budgets. Bitcoin crossed $95k while Gold held solid support amidst central bank reserve accumulation."
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-700/60">
            <span>Market Sentiment: <strong className="text-emerald-400">82% Bullish</strong></span>
            <span>Updated: <strong>Just now</strong></span>
          </div>
        </div>

        {/* Controls: Search + Category Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news headlines or keywords..."
              className="pl-10 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl text-xs font-semibold ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border-border text-muted-foreground"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* News Feed Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                className="bg-card border border-border p-6 rounded-3xl space-y-4 hover:border-blue-500/50 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-muted-foreground">
                      {news.source} • {news.timestamp}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-secondary text-secondary-foreground">
                      {news.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-foreground leading-snug">
                    {news.headline}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {news.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-500">
                    AI Sentiment: {news.sentimentScore}% Bullish
                  </span>
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                  >
                    Read Source <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-2">
            <Newspaper className="w-8 h-8 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-base text-foreground">No news articles found</h3>
            <p className="text-xs text-muted-foreground">
              Try switching category filters or searching for another keyword.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NewsPage;