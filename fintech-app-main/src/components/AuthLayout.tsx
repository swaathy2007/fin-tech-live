import React from "react";
import { LineChart, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Brand header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20 mb-2">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <LineChart className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border/80 shadow-2xl rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
            {children}
          </div>

          {/* Feature Badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> Secure Data
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Realtime Insights
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI-Powered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};