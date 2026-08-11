import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, CheckCheck, ExternalLink, Sparkles } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open Notifications"
          className="relative w-9 h-9 rounded-xl hover:bg-muted"
        >
          <Bell className="w-4.5 h-4.5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 sm:w-96 rounded-2xl p-2 shadow-2xl bg-card border-border">
        <DropdownMenuLabel className="p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-blue-500 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.length > 0 ? (
          <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                  if (n.relatedAssetId) {
                    navigate(`/asset/${n.relatedAssetId}`);
                  }
                }}
                className={`p-3 space-y-1 cursor-pointer transition-colors hover:bg-muted/50 rounded-xl ${
                  !n.read ? "bg-blue-500/5 font-semibold" : "opacity-80"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        !n.read ? "bg-blue-500" : "bg-transparent"
                      }`}
                    />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                      {n.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                </div>

                <p className="text-xs text-foreground leading-snug">{n.message}</p>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  {n.relatedAssetId && (
                    <span className="text-blue-500 font-bold flex items-center gap-1 hover:underline">
                      View Asset <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    className="p-1 text-muted-foreground hover:text-rose-500 rounded ml-auto"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
            <Bell className="w-6 h-6 mx-auto text-muted-foreground/50 mb-2" />
            <p className="font-bold">No notifications yet</p>
            <p>Target price triggers and market updates will appear here.</p>
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-1 flex items-center justify-between">
              <button
                onClick={() => navigate("/alerts")}
                className="text-xs font-bold text-blue-500 hover:underline px-2 py-1"
              >
                Manage Price Alerts →
              </button>
              <button
                onClick={clearNotifications}
                className="text-xs text-muted-foreground hover:text-rose-500 px-2 py-1"
              >
                Clear History
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};