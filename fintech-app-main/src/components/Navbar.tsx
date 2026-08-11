import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  LayoutDashboard,
  Heart,
  Wallet,
  Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  CandlestickChart,
  GraduationCap,
  Newspaper,
  Bell,
  Bot,
  ArrowLeftRight,
  Calendar,
  Calculator,
  Compass,
  Flame,
  Target,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Currency } from "@/types";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainNavItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "AI Copilot", path: "/chat", icon: Bot },
    { label: "Portfolio", path: "/portfolio", icon: Wallet },
    { label: "Compare", path: "/compare", icon: ArrowLeftRight },
    { label: "Simulator", path: "/simulator", icon: Calculator },
    { label: "Strategy", path: "/strategy", icon: Compass },
    { label: "Calendar", path: "/calendar", icon: Calendar },
    { label: "Replay", path: "/replay", icon: Flame },
    { label: "Goals", path: "/goals", icon: Target },
    { label: "Academy", path: "/academy", icon: GraduationCap },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <LineChart className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-foreground flex items-center gap-1">
              FinSight <span className="text-blue-500 font-black">AI</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-1 tracking-wider uppercase">
              Financial Intelligence
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden 2xl:flex items-center gap-1 bg-card/60 p-1 rounded-2xl border border-border/50">
          {mainNavItems.slice(0, 8).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Tools Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 text-xs gap-1 border-border">
                <span>Tools & AI</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5">
              <DropdownMenuItem onClick={() => navigate("/compare")} className="rounded-xl cursor-pointer">
                <ArrowLeftRight className="w-4 h-4 mr-2" /> Compare Assets
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/simulator")} className="rounded-xl cursor-pointer">
                <Calculator className="w-4 h-4 mr-2" /> Backtest Simulator
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/strategy")} className="rounded-xl cursor-pointer">
                <Compass className="w-4 h-4 mr-2" /> Strategy Builder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/advisor")} className="rounded-xl cursor-pointer">
                <Bot className="w-4 h-4 mr-2 text-cyan-400" /> Portfolio Advisor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/replay")} className="rounded-xl cursor-pointer">
                <Flame className="w-4 h-4 mr-2 text-amber-500" /> Market Replay
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/goals")} className="rounded-xl cursor-pointer">
                <Target className="w-4 h-4 mr-2 text-blue-500" /> Goal Planner
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NotificationCenter />

          {/* Currency Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 text-xs gap-1 border-border">
                <span>{currency}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {(["INR", "USD", "EUR"] as Currency[]).map((c) => (
                <DropdownMenuItem
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`text-xs font-semibold ${currency === c ? "text-blue-500" : ""}`}
                >
                  {c} {c === "INR" ? " (₹)" : c === "USD" ? " ($)" : " (€)"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-9 h-9 rounded-xl hover:bg-muted"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </Button>

          {/* User Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-xl h-9 px-2.5 gap-2 hover:bg-muted text-foreground font-semibold text-xs border border-border/40"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center font-extrabold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl">
                <div className="px-3 py-2">
                  <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/portfolio")} className="rounded-xl gap-2 cursor-pointer">
                  <Wallet className="w-4 h-4 text-muted-foreground" /> Portfolio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-xl gap-2 cursor-pointer">
                  <Settings className="w-4 h-4 text-muted-foreground" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl gap-2 text-rose-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Burger Toggle */}
        <div className="flex 2xl:hidden items-center gap-2">
          <NotificationCenter />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="w-9 h-9 rounded-xl border-border">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6 flex flex-col justify-between rounded-l-3xl">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-lg text-foreground">FinSight AI</span>
                </div>

                <nav className="space-y-1">
                  {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold ${
                          isActive ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {user && (
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="w-full rounded-2xl font-bold gap-2 text-xs"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};