import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/context/AuthContext";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AlertsProvider } from "@/context/AlertsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

import { ProtectedRoute } from "@/components/ProtectedRoute";

import Dashboard from "@/pages/Dashboard";
import Portfolio from "@/pages/Portfolio";
import Watchlist from "@/pages/Watchlist";
import AssetDetail from "@/pages/AssetDetail";
import ChartPage from "@/pages/ChartPage";
import AiChatPage from "@/pages/AiChatPage";
import NewsPage from "@/pages/NewsPage";
import AlertsPage from "@/pages/AlertsPage";
import ComparePage from "@/pages/ComparePage";
import CalendarPage from "@/pages/CalendarPage";
import SimulatorPage from "@/pages/SimulatorPage";
import StrategyPage from "@/pages/StrategyPage";
import ReplayPage from "@/pages/ReplayPage";
import GoalPlannerPage from "@/pages/GoalPlannerPage";
import AdvisorPage from "@/pages/AdvisorPage";
import Academy from "@/pages/Academy";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <NotificationProvider>
              <WatchlistProvider>
                <PortfolioProvider>
                  <AlertsProvider>
                    <TooltipProvider>
                      <Sonner position="top-right" />
                      <BrowserRouter>
                        <Routes>
                          {/* Auth Routes */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />

                          {/* Protected Main Routes */}
                          <Route
                            path="/"
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/chat"
                            element={
                              <ProtectedRoute>
                                <AiChatPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/portfolio"
                            element={
                              <ProtectedRoute>
                                <Portfolio />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/watchlist"
                            element={
                              <ProtectedRoute>
                                <Watchlist />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/news"
                            element={
                              <ProtectedRoute>
                                <NewsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/alerts"
                            element={
                              <ProtectedRoute>
                                <AlertsPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/asset/:id"
                            element={
                              <ProtectedRoute>
                                <AssetDetail />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/chart/:id"
                            element={
                              <ProtectedRoute>
                                <ChartPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/compare"
                            element={
                              <ProtectedRoute>
                                <ComparePage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/calendar"
                            element={
                              <ProtectedRoute>
                                <CalendarPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/simulator"
                            element={
                              <ProtectedRoute>
                                <SimulatorPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/strategy"
                            element={
                              <ProtectedRoute>
                                <StrategyPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/replay"
                            element={
                              <ProtectedRoute>
                                <ReplayPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/goals"
                            element={
                              <ProtectedRoute>
                                <GoalPlannerPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/advisor"
                            element={
                              <ProtectedRoute>
                                <AdvisorPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/academy"
                            element={
                              <ProtectedRoute>
                                <Academy />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/settings"
                            element={
                              <ProtectedRoute>
                                <Settings />
                              </ProtectedRoute>
                            }
                          />

                          {/* Fallback */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </TooltipProvider>
                  </AlertsProvider>
                </PortfolioProvider>
              </WatchlistProvider>
            </NotificationProvider>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;