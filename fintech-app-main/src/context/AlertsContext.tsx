import React, { createContext, useContext, useState, useEffect } from "react";
import { PriceAlert } from "@/types";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { useNotifications } from "@/context/NotificationContext";
import { showSuccess, showError } from "@/utils/toast";

interface AlertsContextType {
  alerts: PriceAlert[];
  createAlert: (
    assetId: string,
    targetPrice: number,
    condition: "above" | "below",
    notificationType?: "push" | "email" | "both"
  ) => void;
  deleteAlert: (alertId: string) => void;
  toggleAlertStatus: (alertId: string) => void;
  checkAlerts: () => void;
}

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: "alt_1",
    userId: "usr_101",
    assetId: "apple",
    assetSymbol: "AAPL",
    assetName: "Apple Inc.",
    targetPrice: 230,
    condition: "above",
    status: "active",
    createdDate: "2024-03-20",
    notificationType: "both",
  },
  {
    id: "alt_2",
    userId: "usr_101",
    assetId: "bitcoin",
    assetSymbol: "BTC",
    assetName: "Bitcoin",
    targetPrice: 9000000,
    condition: "below",
    status: "triggered",
    createdDate: "2024-03-21",
    notificationType: "push",
  },
  {
    id: "alt_3",
    userId: "usr_101",
    assetId: "tesla",
    assetSymbol: "TSLA",
    assetName: "Tesla Inc.",
    targetPrice: 200,
    condition: "above",
    status: "active",
    createdDate: "2024-03-22",
    notificationType: "email",
  }
];

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addNotification } = useNotifications();

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem("price_alerts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ALERTS;
      }
    }
    return INITIAL_ALERTS;
  });

  useEffect(() => {
    localStorage.setItem("price_alerts", JSON.stringify(alerts));
  }, [alerts]);

  const createAlert = (
    assetId: string,
    targetPrice: number,
    condition: "above" | "below",
    notificationType: "push" | "email" | "both" = "both"
  ) => {
    const asset = MOCK_ASSETS.find((a) => a.id === assetId);
    if (!asset) {
      showError("Asset not found");
      return;
    }

    const newAlert: PriceAlert = {
      id: "alt_" + Math.random().toString(36).substring(2, 9),
      userId: "usr_101",
      assetId,
      assetSymbol: asset.symbol,
      assetName: asset.name,
      targetPrice,
      condition,
      status: "active",
      createdDate: new Date().toISOString().split("T")[0],
      notificationType,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    showSuccess(`Alert created for ${asset.symbol} when price moves ${condition} ₹${targetPrice.toLocaleString()}`);

    // Create confirmation notification
    addNotification(
      `New Price Alert created for ${asset.symbol} at ₹${targetPrice.toLocaleString()} (${condition})`,
      "alert",
      asset.id
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    showSuccess("Price alert removed.");
  };

  const toggleAlertStatus = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: a.status === "active" ? "inactive" : "active",
            }
          : a
      )
    );
  };

  const checkAlerts = () => {
    // Check if live asset prices cross active alert thresholds
    let triggeredCount = 0;
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.status !== "active") return alert;
        const liveAsset = MOCK_ASSETS.find((a) => a.id === alert.assetId);
        if (!liveAsset) return alert;

        const isTriggered =
          (alert.condition === "above" && liveAsset.price >= alert.targetPrice) ||
          (alert.condition === "below" && liveAsset.price <= alert.targetPrice);

        if (isTriggered) {
          triggeredCount++;
          addNotification(
            `ALERT TRIGGERED: ${alert.assetSymbol} target ${alert.condition} ₹${alert.targetPrice.toLocaleString()} hit! Current: ₹${liveAsset.price.toLocaleString()}`,
            "alert",
            alert.assetId
          );
          return { ...alert, status: "triggered" };
        }
        return alert;
      })
    );

    if (triggeredCount > 0) {
      showSuccess(`${triggeredCount} price alert(s) triggered! Check notifications.`);
    }
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        createAlert,
        deleteAlert,
        toggleAlertStatus,
        checkAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertsProvider");
  }
  return context;
};