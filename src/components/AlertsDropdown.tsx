import React from "react";
import { Bell, Trash2, CheckCircle } from "lucide-react";
import { useAlerts } from "@/context/AlertsContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AlertsDropdown: React.FC = () => {
  const { alerts, deleteAlert } = useAlerts();
  const { formatPrice } = useCurrency();

  const activeAlerts = alerts.filter((a) => a.status === "active");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-xl hover:bg-muted">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {activeAlerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2 shadow-2xl">
        <DropdownMenuLabel className="text-xs font-bold flex items-center justify-between">
          <span>Active Price Alerts</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
            {activeAlerts.length}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {alerts.length > 0 ? (
          <div className="max-h-60 overflow-y-auto divide-y divide-border">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-2 flex items-center justify-between text-xs hover:bg-muted/50 rounded-xl">
                <div>
                  <div className="font-bold text-foreground">{alt.assetSymbol}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Alert when {alt.condition} {formatPrice(alt.targetPrice)}
                  </div>
                </div>

                <button
                  onClick={() => deleteAlert(alt.id)}
                  className="p-1 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-500/10"
                  title="Remove Alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No price alerts configured yet.
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};