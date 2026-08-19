import React, { useState } from "react";
import { Newspaper, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MOCK_NEWS } from "@/data/mockNews";
import { Category, SentimentType } from "@/types";
import { Button } from "@/components/ui/button";

interface NewsFeedComponentProps {
  assetId?: string;
}

export const NewsFeedComponent: React.FC<NewsFeedComponentProps> = ({ assetId }) => {
  const [filter, setFilter] = useState<Category | "all">("all");

  const articles = MOCK_NEWS.filter((art) => {
    if (assetId && art.assetId !== assetId) return false;
    if (!assetId && filter !== "all" && art.category !== filter) return false;
    return true;
  });

  const getSentimentBadge = (sentiment: SentimentType, score: number) => {
    if (sentiment === "bullish") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
          <TrendingUp className="w-3 h-3" /> Bullish ({score}%)
        </span>
      );
    }
    if (sentiment === "bearish") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
          <TrendingDown className="w-3 h-3" /> Bearish ({score}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/20">
        <Minus className="w-3 h-3" /> Neutral
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters toolbar (if global feed) */}
      {!assetId && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(["all", "stock", "crypto", "commodity"] as const).map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat)}
              className="rounded-xl text-xs capitalize font-semibold"
            >
              {cat === "all" ? "All News" : `${cat}s`}
            </Button>
          ))}
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((news) => (
          <div
            key={news.id}
            className="bg-card border border-border p-5 rounded-3xl space-y-3 hover:border-blue-500/40 transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground font-semibold">
                  {news.source} • {news.timeAgo}
                </span>
                {getSentimentBadge(news.sentiment, news.sentimentScore)}
              </div>

              <h3 className="font-extrabold text-base text-foreground leading-snug">
                {news.title ?? news.headline}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {news.summary}
              </p>
            </div>

            {/* AI Takeaway Box */}
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1 mt-2">
              <div className="text-[11px] font-extrabold text-blue-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Market Takeaway
              </div>
              <p className="text-xs text-slate-200">{news.aiTakeaway ?? news.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};