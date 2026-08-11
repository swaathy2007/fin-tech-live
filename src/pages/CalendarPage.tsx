import React, { useState } from "react";
import { Calendar, Filter, Sparkles, AlertCircle } from "lucide-react";
import { MOCK_ECONOMIC_EVENTS } from "@/data/mockAdvancedData";
import { ImpactLevel } from "@/types";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";

export const CalendarPage: React.FC = () => {
  const [impactFilter, setImpactFilter] = useState<ImpactLevel | "all">("all");

  const events = MOCK_ECONOMIC_EVENTS.filter((e) => {
    if (impactFilter !== "all" && e.impact !== impactFilter) return false;
    return true;
  });

  const getImpactBadge = (impact: ImpactLevel) => {
    switch (impact) {
      case "high":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            🔴 High Impact
          </span>
        );
      case "medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            🟠 Medium Impact
          </span>
        );
      case "low":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-500/20 text-slate-400 border border-slate-500/30 flex items-center gap-1">
            🟡 Low Impact
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Calendar className="w-7 h-7 text-blue-500" /> Economic Calendar & Earnings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track global Federal Reserve rate decisions, CPI inflation metrics, and earnings calls.
            </p>
          </div>

          {/* Impact Filter Controls */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs text-muted-foreground font-semibold mr-1">Impact:</span>
            {(["all", "high", "medium", "low"] as const).map((lvl) => (
              <Button
                key={lvl}
                variant={impactFilter === lvl ? "default" : "outline"}
                size="sm"
                onClick={() => setImpactFilter(lvl)}
                className="rounded-xl text-xs capitalize font-semibold"
              >
                {lvl}
              </Button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-sm hover:border-blue-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{evt.countryFlag}</span>
                  <div>
                    <h3 className="text-lg font-extrabold text-foreground">{evt.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {evt.country} • {evt.date} @ {evt.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-secondary text-secondary-foreground">
                    {evt.type}
                  </span>
                  {getImpactBadge(evt.impact)}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {evt.description}
              </p>

              {/* Data Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-muted/50 border border-border text-xs">
                <div>
                  <span className="text-muted-foreground font-medium block">Previous</span>
                  <span className="font-bold text-foreground">{evt.previousValue || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium block">Forecast</span>
                  <span className="font-bold text-cyan-400">{evt.forecast || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-medium block">Actual Result</span>
                  <span className="font-extrabold text-emerald-400">{evt.actual || "Pending"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;