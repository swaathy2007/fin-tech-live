import React from "react";
import { Bell, Trash2, AlertCircle, CheckCircle, Plus, ShieldCheck } from "lucide-react";
import { useAlerts } from "@/context/AlertsContext";
import { useCurrency } from "@/context/CurrencyContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreateAlertModal } from "@/components/CreateAlertModal";
import { Button } from "@/components/ui/button";

export const AlertsPage: React.FC = () => {
  const { alerts, deleteAlert, toggleAlertStatus, checkAlerts } = useAlerts();
  const { formatPrice } = useCurrency();

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const triggeredAlerts = alerts.filter((a) => a.status === "triggered");

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Bell className="w-7 h-7 text-blue-500" /> Price Alerts & Notifications
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Configure target price triggers for stocks, crypto, and commodities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkAlerts}
              className="rounded-xl border-border text-xs font-bold gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-blue-500" /> Check Triggers
            </Button>
            <CreateAlertModal />
          </div>
        </div>

        {/* Active Alerts List */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            Active Alerts ({activeAlerts.length})
          </h2>

          {activeAlerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="bg-card border border-border p-5 rounded-3xl space-y-3 shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-foreground text-base">
                        {alt.assetSymbol}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-500/20 text-blue-400 uppercase">
                        {alt.condition}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alt.assetName}</p>
                    <p className="text-sm font-extrabold text-foreground pt-1">
                      Target: {formatPrice(alt.targetPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert(alt.id)}
                      className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-500/10"
                      title="Delete Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-2">
              <Bell className="w-8 h-8 text-muted-foreground/60 mx-auto" />
              <p className="font-bold text-sm text-foreground">No active price alerts</p>
              <p className="text-xs text-muted-foreground">
                Set price alerts on any stock or crypto to get notified when price targets hit.
              </p>
            </div>
          )}
        </div>

        {/* Triggered History */}
        {triggeredAlerts.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> Triggered Alert History ({triggeredAlerts.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {triggeredAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="bg-card border border-emerald-500/30 p-5 rounded-3xl space-y-2 shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-foreground text-base">
                        {alt.assetSymbol}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                        TRIGGERED
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target {alt.condition} {formatPrice(alt.targetPrice)} hit
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAlert(alt.id)}
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AlertsPage;