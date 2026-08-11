import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Mail, Sun, Moon, LogOut, Trash2, Save, Settings as SettingsIcon, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Currency } from "@/types";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccess } from "@/utils/toast";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  const [name, setName] = useState(user?.name || "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateUser({ name });
      showSuccess("Profile updated successfully!");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-blue-500" /> Account & Notification Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your profile details, display preferences, and price notification channels.
          </p>
        </div>

        {/* Section 1: Profile Details */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-500" /> User Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Full Name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl max-w-md"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-email">Email Address (Read Only)</Label>
              <Input
                id="settings-email"
                value={user?.email || ""}
                disabled
                className="rounded-xl max-w-md bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            <Button type="submit" className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 gap-2">
              <Save className="w-4 h-4" /> Save Profile Changes
            </Button>
          </form>
        </div>

        {/* Section 2: Display Preferences */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
            Display Preferences
          </h2>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-foreground">Dark Theme Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle between sleek dark and light visual appearance.
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>

            {/* Currency Selector */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-foreground">Default Currency</Label>
                <p className="text-xs text-muted-foreground">
                  Select your preferred base currency for prices across the app.
                </p>
              </div>
              <Select
                value={currency}
                onValueChange={(val: Currency) => setCurrency(val)}
              >
                <SelectTrigger className="w-[120px] rounded-xl font-bold">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Preferences */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" /> Notification Channels
          </h2>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold text-foreground">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Instant browser price alerts when targets hit.</p>
              </div>
              <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div>
                <Label className="text-sm font-bold text-foreground">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive target alert emails for watched assets.</p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div>
                <Label className="text-sm font-bold text-foreground">Daily Portfolio Digest</Label>
                <p className="text-xs text-muted-foreground">Daily summary email of top movers and P&L changes.</p>
              </div>
              <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
            </div>
          </div>
        </div>

        {/* Section 4: Account Control */}
        <div className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">
            Account Management
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm text-foreground">Sign Out</p>
              <p className="text-xs text-muted-foreground">
                Logout of your current active session on this browser.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-xl font-bold text-rose-500 hover:text-rose-600 border-border gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;