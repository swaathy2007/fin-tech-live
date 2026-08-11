import React from "react";
import { Navbar } from "./Navbar";
import { AiChatDrawer } from "./AiChatDrawer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200 relative">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <AiChatDrawer />
    </div>
  );
};