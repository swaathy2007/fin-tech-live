import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Flame, Sparkles } from "lucide-react";
import { MOCK_HISTORIC_EVENTS } from "@/data/mockAdvancedData";
import { useCurrency } from "@/context/CurrencyContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ReplayPage: React.FC = () => {
  const { formatPrice } = useCurrency();

  const [selectedEventId, setSelectedEventId] = useState<string>("covid_2020");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const event = MOCK_HISTORIC_EVENTS.find((e) => e.id === selectedEventId) || MOCK_HISTORIC_EVENTS[0];
  const currentStep = event.timeline[stepIndex] || event.timeline[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= event.timeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, event]);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="border-b border-border pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Flame className="w-7 h-7 text-amber-500" /> Historic Market Replay Player
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Scrub through time and watch price charts and headlines evolve during major historic crashes.
          </p>
        </div>

        {/* Historic Event Picker */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-3 shadow-sm">
          <label className="text-xs font-bold text-foreground">Select Historic Market Event</label>
          <Select
            value={selectedEventId}
            onValueChange={(val) => {
              setSelectedEventId(val);
              setStepIndex(0);
              setIsPlaying(false);
            }}
          >
            <SelectTrigger className="rounded-xl font-bold h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {MOCK_HISTORIC_EVENTS.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.title} ({e.period})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{event.description}</p>
        </div>

        {/* Player Controls Bar */}
        <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-2xl h-12 px-6 font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? "Pause Replay" : "Play Replay"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setStepIndex(0);
                  setIsPlaying(false);
                }}
                className="rounded-2xl h-12 border-border"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </Button>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-muted-foreground block">Timeline Date</span>
              <span className="text-2xl font-black text-cyan-400">{currentStep.date}</span>
            </div>
          </div>

          {/* Scrubbing Slider */}
          <div className="space-y-2">
            <Slider
              value={[stepIndex]}
              min={0}
              max={event.timeline.length - 1}
              step={1}
              onValueChange={(val) => {
                setStepIndex(val[0]);
                setIsPlaying(false);
              }}
            />
          </div>

          {/* News Headline Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-cyan-400 font-bold uppercase">Historic Headline</span>
              <span className="px-2 py-0.5 rounded font-extrabold uppercase bg-amber-500/20 text-amber-400">
                {currentStep.sentiment}
              </span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-white">
              "{currentStep.headline}"
            </p>
          </div>

          {/* Asset Prices Grid on Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(currentStep.priceMap).map(([assetKey, price]) => (
              <div key={assetKey} className="p-4 rounded-2xl bg-muted/60 border border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase">{assetKey}</span>
                <p className="text-xl font-black text-foreground mt-1">{formatPrice(price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReplayPage;