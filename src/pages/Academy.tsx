import React, { useState } from "react";
import { GraduationCap, Award, CheckCircle, HelpCircle, ArrowRight, BookOpen, Search } from "lucide-react";
import { MOCK_MODULES } from "@/data/mockAcademy";
import { MOCK_GLOSSARY_TERMS } from "@/data/mockAdvancedData";
import { LearningModule } from "@/types";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";

const Academy: React.FC = () => {
  const [tab, setTab] = useState<"modules" | "glossary">("modules");
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState<number>(250);
  const [glossarySearch, setGlossarySearch] = useState("");

  const handleOptionSelect = (qId: string, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleCompleteQuiz = (module: LearningModule) => {
    let allCorrect = true;
    module.quiz.forEach((q) => {
      if (quizAnswers[q.id] !== q.correctIndex) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      if (!completedModules.includes(module.id)) {
        setCompletedModules((prev) => [...prev, module.id]);
        setTotalXp((prev) => prev + module.xpReward);
        showSuccess(`Module Completed! Earned +${module.xpReward} XP! 🎉`);
      } else {
        showSuccess("Quiz passed again!");
      }
      setActiveModule(null);
      setQuizAnswers({});
    } else {
      showError("Some answers were incorrect. Review and try again!");
    }
  };

  const filteredGlossary = MOCK_GLOSSARY_TERMS.filter((t) =>
    t.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    t.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <GraduationCap className="w-7 h-7 text-blue-500" /> FinSight Learning Hub
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Master stock valuation, risk management, and crypto fundamentals.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold text-sm flex items-center gap-2 self-start sm:self-auto">
            <Award className="w-5 h-5 text-amber-400" />
            <span>{totalXp} Investor XP</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => setTab("modules")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === "modules" ? "bg-blue-600 text-white" : "text-muted-foreground"
            }`}
          >
            Interactive Lessons & Quizzes
          </button>
          <button
            onClick={() => setTab("glossary")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === "glossary" ? "bg-blue-600 text-white" : "text-muted-foreground"
            }`}
          >
            A-Z Financial Glossary
          </button>
        </div>

        {/* Content Tab 1: Modules */}
        {tab === "modules" ? (
          activeModule ? (
            <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveModule(null);
                  setQuizAnswers({});
                }}
                className="rounded-xl text-xs text-muted-foreground"
              >
                ← Back to All Modules
              </Button>

              <div className="space-y-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-400">
                  {activeModule.category}
                </span>
                <h2 className="text-2xl font-extrabold text-foreground">{activeModule.title}</h2>
              </div>

              <div className="space-y-4 pt-2 border-t border-border">
                {activeModule.content.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-muted/40 text-sm font-medium">
                    {p}
                  </div>
                ))}
              </div>

              {/* Quiz */}
              <div className="pt-6 border-t border-border space-y-6">
                <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" /> Knowledge Check Quiz
                </h3>

                {activeModule.quiz.map((q) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-white">
                    <p className="font-bold text-sm text-cyan-300">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const selected = quizAnswers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleOptionSelect(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl text-xs font-semibold border ${
                              selected ? "bg-blue-600 border-blue-400 text-white" : "bg-slate-950 border-slate-800 text-slate-300"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() => handleCompleteQuiz(activeModule)}
                  className="w-full rounded-2xl font-bold py-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit Answers & Claim XP
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_MODULES.map((mod) => {
                const isDone = completedModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="bg-card border border-border p-6 rounded-3xl space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold px-2.5 py-0.5 rounded-lg bg-secondary text-secondary-foreground">
                          {mod.level}
                        </span>
                        <span className="font-extrabold text-amber-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> +{mod.xpReward} XP
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg text-foreground">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground">{mod.description}</p>
                    </div>

                    <Button
                      onClick={() => setActiveModule(mod)}
                      variant={isDone ? "secondary" : "default"}
                      className="w-full rounded-xl font-bold gap-2 mt-4"
                    >
                      {isDone ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Completed
                        </>
                      ) : (
                        <>
                          Start Lesson <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Tab 2: Glossary */
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Search financial terms (e.g. Market Cap, P/E Ratio)..."
                className="pl-10 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlossary.map((g, idx) => (
                <div key={idx} className="bg-card border border-border p-5 rounded-3xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-foreground">{g.term}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-secondary text-secondary-foreground">
                      {g.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{g.definition}</p>
                  <p className="text-[11px] text-blue-400 font-semibold pt-1 border-t border-border/50">
                    Example: {g.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Academy;