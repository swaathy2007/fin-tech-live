import React, { createContext, useContext, useState, useEffect } from "react";
import { NotificationItem } from "@/types";
import { showSuccess } from "@/utils/toast";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (message: string, type: 'alert' | 'news' | 'portfolio' | 'market', relatedAssetId?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    userId: "usr_101",
    type: "alert",
    message: "Apple Inc. (AAPL) reached target threshold of ₹220 ⬆",
    timestamp: "10 mins ago",
    read: false,
    relatedAssetId: "apple",
  },
  {
    id: "notif_2",
    userId: "usr_101",
    type: "market",
    message: "Bitcoin +4.2% today as spot ETF institutional inflows cross $1.2B.",
    timestamp: "1 hour ago",
    read: false,
    relatedAssetId: "bitcoin",
  },
  {
    id: "notif_3",
    userId: "usr_101",
    type: "portfolio",
    message: "Your virtual portfolio total value increased by +₹12,450 (+2.1%) today!",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "notif_4",
    userId: "usr_101",
    type: "news",
    message: "Important market news: Central banks expand physical gold reserves.",
    timestamp: "5 hours ago",
    read: true,
    relatedAssetId: "gold",
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    message: string,
    type: 'alert' | 'news' | 'portfolio' | 'market',
    relatedAssetId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: "notif_" + Math.random().toString(36).substring(2, 9),
      userId: "usr_101",
      type,
      message,
      timestamp: "Just now",
      read: false,
      relatedAssetId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showSuccess("All notifications marked as read.");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
    showSuccess("Notification history cleared.");
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};