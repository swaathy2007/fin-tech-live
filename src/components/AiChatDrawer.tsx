import React, { useState, useEffect } from "react";
import { Sparkles, Send, Bot, User as UserIcon, X, Zap, RefreshCw, Trash2 } from "lucide-react";
import { ChatMessage } from "@/types";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { usePortfolio } from "@/context/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { chatApi } from "@/lib/api";
import { showSuccess } from "@/utils/toast";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    sender: "ai",
    text: "Hello! I am your FinSight AI Intelligence Copilot. Ask me about stock valuations (FNV, NEM, Gold, Apple, Reliance), app features, or portfolio risk audits!",
    timestamp: "Just now",
    suggestedQuestions: [
      "What is this app and its features?",
      "What is FNV stock?",
      "What is Gold stock?",
      "Audit my portfolio risk"
    ]
  }
];

export const AiChatDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("chat_history_drawer");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { stats, holdingsWithMetrics } = usePortfolio();

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem("chat_history_drawer", JSON.stringify(messages));
  }, [messages]);

  const generateLocalAiAnswer = (prompt: string): string => {
    const p = prompt.toLowerCase().trim();

    // 1. App Features & Overview
    if (p.includes("app") || p.includes("feature") || p.includes("help") || p.includes("what can i do") || p.includes("about")) {
      return (
        "Welcome to FinSight AI Financial Intelligence! 🚀\n\n" +
        "Here are the core features you can explore:\n" +
        "1. 📈 Live Markets & Charts: Real-time price quotes for Gold (FNV, NEM, Barrick, SLV), US Tech, Indian Equities (Reliance, Tata), & Crypto.\n" +
        "2. 💼 Virtual Portfolio: ₹10,00,000 virtual balance to buy and sell stocks risk-free.\n" +
        "3. 🤖 AI Copilot: Ask AI about stock valuations, portfolio risk audits, & financial terms.\n" +
        "4. 🔔 Real-Time Price Alerts: Instant notifications when stock target prices are hit.\n" +
        "5. 🎓 Academy & Calendar: Market replay simulator, economic inflation calendar, & backtesting tools."
      );
    }

    // 2. Asset Lookup in MOCK_ASSETS (e.g. FNV, GOLD, NEM, Reliance, Apple, Bitcoin)
    const matchedAsset = MOCK_ASSETS.find((a) =>
      p.includes(a.symbol.toLowerCase()) ||
      p.includes(a.name.toLowerCase()) ||
      p.includes(a.id.toLowerCase())
    );

    if (matchedAsset) {
      return (
        `${matchedAsset.name} (${matchedAsset.symbol}) is trading at ₹${matchedAsset.price.toLocaleString()} ` +
        `(${matchedAsset.change >= 0 ? "+" : ""}${matchedAsset.change}% today).\n\n` +
        `• Category: ${matchedAsset.category.toUpperCase()}\n` +
        `• Market Cap: ${matchedAsset.marketCap}\n` +
        `• 52-Week Range: ₹${matchedAsset.lowWeek52.toLocaleString()} - ₹${matchedAsset.highWeek52.toLocaleString()}\n\n` +
        `Description: ${matchedAsset.description}`
      );
    }

    // 3. Portfolio Audit
    if (p.includes("portfolio") || p.includes("risk") || p.includes("audit") || p.includes("rebalance")) {
      const holdingsCount = holdingsWithMetrics.length;
      if (holdingsCount === 0) {
        return "Your portfolio is currently 100% in virtual cash (₹10,00,000). Consider diversifying into high-cap stocks like Apple or defensive assets like Gold (FNV, NEM) to start compounding value!";
      }
      const isProfitable = stats.totalProfitLoss >= 0;
      return (
        `Portfolio Risk Analysis:\n` +
        `• Total Value: ₹${stats.totalPortfolioValue.toLocaleString()}\n` +
        `• Cash Balance: ₹${stats.availableBalance.toLocaleString()}\n` +
        `• Active Holdings: ${holdingsCount}\n` +
        `• Overall Net P&L: ${isProfitable ? "+" : ""}₹${stats.totalProfitLoss.toLocaleString()} (${stats.totalReturnPercent.toFixed(1)}%)\n\n` +
        `Recommendation: Diversify capital across equities, digital assets, and commodities to optimize risk-adjusted returns.`
      );
    }

    if (p.includes("p/e") || p.includes("market cap") || p.includes("explain")) {
      return (
        `Financial Concepts:\n` +
        `• Market Cap: Total dollar market value of a company's outstanding shares.\n` +
        `• P/E Ratio: Price-to-Earnings ratio measures if a stock is overvalued or undervalued relative to its profits.\n` +
        `• Diversification: Spreading capital across non-correlated assets to minimize downside risk.`
      );
    }

    return (
      `FinSight AI Analysis for '${prompt}':\n` +
      `Global financial markets prioritize sustained cash flows, earnings stability, and risk management. ` +
      `Always evaluate corporate valuation metrics, 52-week price ranges, and technical momentum before trading.`
    );
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

    // Call FastAPI backend connected to Claude API
    chatApi.sendMessage(messageText, "chat")
      .then((data) => {
        const aiMsg: ChatMessage = {
          id: data.id || ("ai_" + Date.now()),
          sender: "ai",
          text: data.content,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: [
            "What is FNV stock?",
            "What are the features of this app?"
          ]
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      })
      .catch(() => {
        // Intelligent local responder fallback
        setTimeout(() => {
          const aiReplyText = generateLocalAiAnswer(messageText);
          const aiMsg: ChatMessage = {
            id: "ai_" + Date.now(),
            sender: "ai",
            text: aiReplyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedQuestions: [
              "What is FNV stock?",
              "What are the features of this app?"
            ]
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
        }, 600);
      });
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem("chat_history_drawer");
    showSuccess("Chat history cleared.");
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
        <SheetHeader className="p-4 border-b border-border bg-slate-950/80 text-white rounded-tl-3xl flex flex-row items-center justify-between">
          <div>
            <SheetTitle className="text-base font-extrabold flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              FinSight AI Intelligence Copilot
            </SheetTitle>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Realtime market intelligence & portfolio diagnostic engine
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearHistory}
            className="text-slate-400 hover:text-rose-400 h-8 w-8 rounded-lg"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
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
              FinSight AI is analyzing market telemetry...
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
              placeholder="Ask AI about FNV, Gold, app features, or risk..."
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