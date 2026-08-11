import { PricePoint, TimePeriod } from "@/types";
import { MOCK_ASSETS } from "./mockAssets";

// Deterministic mock price generator based on base price and seed
const generateAssetHistory = (assetId: string, currentPrice: number): PricePoint[] => {
  const points: PricePoint[] = [];
  const totalDays = 365;
  const now = new Date();

  // Simple pseudo-random seeded variation
  let seed = assetId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pseudoRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  let simulatedPrice = currentPrice * 0.75; // start ~25% lower 1 year ago

  for (let i = totalDays; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);

    // Daily drift (-2% to +2.3%)
    const changePercent = (pseudoRandom() - 0.48) * 0.045;
    simulatedPrice = Math.max(simulatedPrice * (1 + changePercent), 1);

    // Pull last point to match exact current market price
    if (i === 0) {
      simulatedPrice = currentPrice;
    }

    const dayVolatility = pseudoRandom() * 0.02;
    const high = Number((simulatedPrice * (1 + dayVolatility)).toFixed(2));
    const low = Number((simulatedPrice * (1 - dayVolatility)).toFixed(2));
    const open = Number((low + (high - low) * pseudoRandom()).toFixed(2));
    const close = Number(simulatedPrice.toFixed(2));
    const volume = Math.floor(10000 + pseudoRandom() * 500000);

    const formattedDate = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: i > 180 ? "2-digit" : undefined,
    });

    points.push({
      date: d.toISOString().split("T")[0],
      formattedDate,
      price: close,
      open,
      close,
      high,
      low,
      volume,
    });
  }

  return points;
};

const PRICE_HISTORY_MAP: Record<string, PricePoint[]> = {};

MOCK_ASSETS.forEach((asset) => {
  PRICE_HISTORY_MAP[asset.id] = generateAssetHistory(asset.id, asset.price);
});

export const getPriceHistory = (assetId: string, period: TimePeriod = "1Y"): PricePoint[] => {
  const fullData = PRICE_HISTORY_MAP[assetId] || generateAssetHistory(assetId, 100);

  let sliceDays = 365;
  switch (period) {
    case "1D":
      sliceDays = 1;
      break;
    case "1W":
      sliceDays = 7;
      break;
    case "1M":
      sliceDays = 30;
      break;
    case "3M":
      sliceDays = 90;
      break;
    case "1Y":
      sliceDays = 365;
      break;
    case "ALL":
      sliceDays = 365;
      break;
  }

  return fullData.slice(Math.max(0, fullData.length - sliceDays));
};