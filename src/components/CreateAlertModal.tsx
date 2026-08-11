import React, { useState } from "react";
import { Bell, AlertCircle } from "lucide-react";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { useAlerts } from "@/context/AlertsContext";
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

export const CreateAlertModal: React.FC = () => {
  const { addAlert } = useAlerts();
  const { formatPrice } = useCurrency();

  const [open, setOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(MOCK_ASSETS[0].id);
  const [targetPrice, setTargetPrice] = useState(MOCK_ASSETS[0].price.toString());
  const [condition, setCondition] = useState<"above" | "below">("above");

  const handleAssetSelect = (assetId: string) => {
    setSelectedAssetId(assetId);
    const asset = MOCK_ASSETS.find((a) => a.id === assetId);
    if (asset) setTargetPrice(asset.price.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (price > 0) {
      addAlert(selectedAssetId, price, condition);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl font-bold gap-1.5 border-border">
          <Bell className="w-4 h-4 text-blue-500" />
          Set Price Alert
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" /> Set Price Alert
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Get instant notifications when asset prices cross your target thresholds.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">Financial Instrument</Label>
            <Select value={selectedAssetId} onValueChange={handleAssetSelect}>
              <SelectTrigger className="rounded-xl font-medium">
                <SelectValue placeholder="Choose asset" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl max-h-60">
                {MOCK_ASSETS.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.symbol} - {asset.name} ({formatPrice(asset.price)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">Condition</Label>
              <Select
                value={condition}
                onValueChange={(v: "above" | "below") => setCondition(v)}
              >
                <SelectTrigger className="rounded-xl font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="above">Price rises above</SelectItem>
                  <SelectItem value="below">Price falls below</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="target-price" className="text-xs font-bold text-foreground">
                Target Price (INR)
              </Label>
              <Input
                id="target-price"
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl font-bold py-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Price Alert
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};