import React from "react";
import { Link } from "react-router-dom";
import { SearchX, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type?: "watchlist" | "search";
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = "watchlist",
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
}) => {
  const isWatchlist = type === "watchlist";

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40 my-6">
      <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4 text-muted-foreground shadow-inner">
        {isWatchlist ? (
          <Heart className="w-8 h-8 text-rose-500/70" />
        ) : (
          <SearchX className="w-8 h-8 text-blue-500/70" />
        )}
      </div>

      <h3 className="text-xl font-bold text-foreground mb-1">
        {title || (isWatchlist ? "No watchlist items yet" : "No assets found")}
      </h3>

      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description ||
          (isWatchlist
            ? "Search and add assets from the Dashboard to track them here in real-time."
            : "We couldn't find any financial assets matching your criteria. Try another search.")}
      </p>

      {actionLink ? (
        <Button asChild className="rounded-xl font-semibold gap-2">
          <Link to={actionLink}>
            {actionText || "Go to Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      ) : onActionClick ? (
        <Button onClick={onActionClick} className="rounded-xl font-semibold">
          {actionText || "Clear Filters"}
        </Button>
      ) : null}
    </div>
  );
};