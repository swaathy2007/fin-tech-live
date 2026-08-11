import React, { useState } from "react";
import { Target, Plus, CheckCircle, Award } from "lucide-react";
import { GoalData } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const INITIAL_GOALS: GoalData[] = [
  {
    id: "g_1",
    title: "House Down Payment",
    targetAmount: 500000, // ₹5 Lakhs
    currentAmount: 280000,
    targetDate: "2026-12-31",
    riskPreference: "Medium",
    suggestedStrategy: "60% Equity / 40% Debt",
  },
  {
    id: "g_2",
    title: "Emergency Cash Buffer",
    targetAmount: 200000,
    currentAmount: 200000,
    targetDate: "2025-06-30",
    riskPreference: "Low",
    suggestedStrategy: "High-Yield Savings & Gold",
  }
];

export const GoalPlannerPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [goals, setGoals] = useState<GoalData[]>(INITIAL_GOALS);
  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("500000");
  const [currentAmount, setCurrentAmount] = useState("50000");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newG: GoalData = {
      id: "g_" + Date.now(),
      title,
      targetAmount: parseFloat(targetAmount) || 100000,
      currentAmount: parseFloat(currentAmount) || 0,
      targetDate: "2026-12-31",
      riskPreference: "Medium",
      suggestedStrategy: "Balanced Stock Portfolio",
    };
    setGoals((prev) => [newG, ...prev]);
    setOpenModal(false);
    setTitle("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Target className="w-7 h-7 text-blue-500" /> Goal Planner & Tracker
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Set financial milestones and track your progress with custom investment blueprints.
            </p>
          </div>

          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <Button className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="w-4 h-4" /> Create New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl p-6 bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">New Financial Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>Goal Description</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Save for House Down Payment"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Target Amount (INR)</Label>
                    <Input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Current Savings (INR)</Label>
                    <Input
                      type="number"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full font-bold bg-blue-600 text-white">
                  Save Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            const isCompleted = pct >= 100;
            return (
              <div key={g.id} className="bg-card border border-border p-6 rounded-3xl space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                      {g.title}
                      {isCompleted && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Milestone Reached!
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Strategy: {g.suggestedStrategy}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-foreground">
                      {formatPrice(g.currentAmount)}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      of {formatPrice(g.targetAmount)} ({pct}%)
                    </span>
                  </div>
                </div>

                <Progress value={pct} className="h-3 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GoalPlannerPage;