import React, { useState } from "react";
import { Sparkles, Send, Bot, User as UserIcon, X, Zap, RefreshCw } from "lucide-react";
import { ChatMessage } from "@/types";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { usePortfolio } from "@/context/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    sender: "ai",
    text: "Hello! I am your FinSight AI Intelligence Assistant. Ask me anything about stock valuations, portfolio risk, market sentiment, or technical indicators!",
    timestamp: "Just now",
    suggestedQuestions: [
      "Analyze my current portfolio risk",
      "Which asset has the highest growth potential?",
      "Explain what P/E Ratio and Market Cap mean",
      "Should I buy Bitcoin or Apple right now?"
    ]
  }
];

export const AiChatDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { stats, holdingsWithMetrics } = usePortfolio();

  const generateAiAnswer = (prompt: string): string => {
    const p = prompt.toLowerCase();

    if (p.includes("portfolio") || p.includes("risk") || p.includes("audit")) {
      const holdingsCount = holdingsWithMetrics.length;
      if (holdingsCount === 0) {
        return "Your portfolio is currently 100% in virtual cash. Consider diversifying into high-cap stocks like Apple or defensive assets like Gold to start compounding value!";
      }
      const isProfitable = stats.totalProfitLoss >= 0;
      return `Portfolio Risk Analysis: You currently hold ${holdingsCount} assets with a net ${
        isProfitable ? "gain of +" : "loss of "
      }₹${Math.abs(stats.totalProfitLoss).toLocaleString()}. Your asset allocation is balanced across ${
        stats.bestHolding ? stats.bestHolding.symbol : "market leaders"
      }. Tip: Ensure you maintain at least 15-20% in defensive assets like Gold or cash reserves.`;
    }

    if (p.includes("apple") || p.includes("aapl")) {
      const apple = MOCK_ASSETS.find((a) => a.id === "apple");
      return `Apple Inc. (AAPL) is trading at ₹${apple?.price}. AI Sentiment: 92% Bullish. Key Drivers: Silicon M4 Max chip releases, robust ecosystem services, and strong cash position ($60B+ buybacks).`;
    }

    if (p.includes("bitcoin") || p.includes("btc") || p.includes("crypto")) {
      return `Bitcoin (BTC) is trading at ₹95,00,000 (+185 Trillion Market Cap). Institutional ETF inflows remain strong at $1.2B/day. Volatility is elevated; recommended maximum portfolio allocation is 5-15%.`;
    }

    if (p.includes("p/e") || p.includes("market cap") || p.includes("explain")) {
      return `Financial Concepts:\n• Market Cap: Total market dollar value of a company's outstanding shares.\n• P/E Ratio: Price-to-Earnings ratio measures if a stock is overvalued or undervalued relative to its profits.\n• Diversification: Spreading capital so single asset crashes don't wipe out total portfolio value.`;
    }

    if (p.includes("growth") || p.includes("buy")) {
      return `Based on live sentiment data:\n1. Tesla (TSLA): High momentum (+4.3% today) driven by Robotaxi testing.\n2. Ethereum (ETH): DeFi TVL rising +25%.\n3. Gold: Strong central bank accumulation as macro inflation hedge.`;
    }

    return `FinSight AI Analysis: Markets are currently displaying bullish momentum (+2.4% average across tech and crypto). Always combine technical charts with risk management when placing trades!`;
  };

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiReplyText = generateAiAnswer(messageText);
      const aiMsg: ChatMessage = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          "How do I rebalance my portfolio?",
          "Show me today's top market catalyst"
        ]
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 rounded-full h-14 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold shadow-2xl hover:scale-105 transition-all gap-2.5 border border-cyan-400/30"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950/80 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <span className="hidden sm:inline text-sm">Ask FinSight Copilot</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col justify-between bg-card border-border rounded-l-3xl shadow-2xl">
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border bg-slate-950/80 text-white rounded-tl-3xl">
          <SheetTitle className="text-base font-extrabold flex items-center gap-2 text-white">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            FinSight AI Intelligence Copilot
          </SheetTitle>
          <p className="text-xs text-slate-400 font-normal">
            Realtime market intelligence & portfolio diagnostic engine
          </p>
        </SheetHeader>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-muted-foreground font-semibold">
                {m.sender === "ai" ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-cyan-400" /> FinSight Copilot
                  </>
                ) : (
                  <>
                    <UserIcon className="w-3.5 h-3.5 text-blue-500" /> You
                  </>
                )}
                <span>• {m.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[88%] whitespace-pre-line ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none shadow-inner"
                }`}
              >
                {m.text}
              </div>

              {/* Preset suggestions */}
              {m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                  {m.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-[11px] px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 font-medium transition-all text-left"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold bg-slate-900 p-3 rounded-2xl w-fit border border-slate-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              FinSight AI is analyzing live market telemetry...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-border bg-card rounded-bl-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI about stocks, risk, or crypto..."
              className="rounded-xl text-xs py-5 bg-background border-border"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              className="rounded-xl h-10 w-10 shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};