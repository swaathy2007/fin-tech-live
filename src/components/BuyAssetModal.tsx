import React, { useState } from "react";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { usePortfolio } from "@/context/PortfolioContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const BuyAssetModal: React.FC = () => {
  const { availableBalance, buyAsset } = usePortfolio();
  const { formatPrice } = useCurrency();

  const [open, setOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(MOCK_ASSETS[0].id);
  const [quantity, setQuantity] = useState<string>("1");
  const [buyPrice, setBuyPrice] = useState<string>(MOCK_ASSETS[0].price.toString());
  const [buyDate, setBuyDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState<string>("");

  const handleAssetSelect = (assetId: string) => {
    setSelectedAssetId(assetId);
    const asset = MOCK_ASSETS.find((a) => a.id === assetId);
    if (asset) {
      setBuyPrice(asset.price.toString());
    }
  };

  const parsedQty = parseFloat(quantity) || 0;
  const parsedPrice = parseFloat(buyPrice) || 0;
  const totalCost = parsedQty * parsedPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (parsedQty <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    if (parsedPrice <= 0) {
      setError("Please enter a valid buy price.");
      return;
    }

    if (totalCost > availableBalance) {
      setError(`Insufficient balance. Cost is ${formatPrice(totalCost)} but available balance is ${formatPrice(availableBalance)}.`);
      return;
    }

    const success = buyAsset(selectedAssetId, parsedQty, parsedPrice, buyDate);
    if (success) {
      setOpen(false);
      // Reset form defaults
      setQuantity("1");
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 text-white gap-2">
          <ShoppingBag className="w-4 h-4" />
          Buy New Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" /> Virtual Buy Transaction
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Available Virtual Balance:{" "}
            <span className="font-bold text-emerald-400">{formatPrice(availableBalance)}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Select Asset */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">Select Financial Instrument</Label>
            <Select value={selectedAssetId} onValueChange={handleAssetSelect}>
              <SelectTrigger className="rounded-xl font-medium">
                <SelectValue placeholder="Choose asset" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl max-h-60">
                {MOCK_ASSETS.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-bold">{asset.symbol}</span>
                      <span className="text-xs text-muted-foreground">{asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity & Buy Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="buy-qty" className="text-xs font-bold text-foreground">Quantity</Label>
              <Input
                id="buy-qty"
                type="number"
                step="any"
                min="0.0001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="buy-price" className="text-xs font-bold text-foreground">Buy Price (INR)</Label>
              <Input
                id="buy-price"
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <Label htmlFor="buy-date" className="text-xs font-bold text-foreground">Purchase Date</Label>
            <Input
              id="buy-date"
              type="date"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          {/* Total Summary Banner */}
          <div className="p-3 rounded-2xl bg-muted/60 border border-border flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">Total Transaction Cost:</span>
            <span className="text-base font-extrabold text-foreground">
              {formatPrice(totalCost)}
            </span>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl font-bold py-6 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 text-white"
          >
            Confirm Purchase
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};