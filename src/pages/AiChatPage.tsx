import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Trash2,
  Copy,
  Check,
  GraduationCap,
  MessageSquare,
  BarChart2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { Message, ChatMode } from "@/types";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { usePortfolio } from "@/context/PortfolioContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/utils/toast";
import { chatApi } from "@/lib/api";


const EXAMPLE_QUESTIONS = [
  "What is Bitcoin?",
  "Why is Tesla stock going up?",
  "Explain inflation to me in simple terms",
  "What should a beginner invest in?",
  "How does the stock market work?",
  "What's the difference between stocks and bonds?",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg_1",
    type: "ai",
    content: "Welcome to FinSight AI Financial Copilot! I can explain market concepts in plain language, analyze stock movements, or audit your portfolio risk. Choose a mode above or ask me a question!",
    timestamp: "Just now",
    mode: "chat",
  },
];

const HARDCODED_AI_RESPONSES: Record<string, string> = {
  "what is bitcoin": "Bitcoin (BTC) is a decentralized digital currency created in 2009. Unlike paper currency issued by central banks, Bitcoin operates on a distributed peer-to-peer blockchain network with a capped total supply of 21 million coins, making it a popular store of value.",
  "why is tesla stock going up": "Tesla stock (TSLA) momentum is driven by regulatory approvals for its autonomous Robotaxi testing in California, improving gross profit margins on electric vehicles, and accelerating energy storage deployment.",
  "explain inflation to me in simple terms": "Inflation means money loses purchasing power over time. If a cup of coffee costs ₹100 today and ₹110 next year, inflation is 10%. To prevent inflation from eroding your savings, investors put money into stocks, real estate, or gold.",
  "what should a beginner invest in": "Beginners usually start with a 3-part strategy:\n1. Emergency Fund: 3-6 months of cash in high-yield savings.\n2. Low-Cost Index Funds: Broad stock market exposure.\n3. Defensive Hedges: A small allocation (5-10%) in gold or sovereign bonds.",
  "how does the stock market work": "The stock market is a public marketplace where buyers and sellers trade fractional ownership shares of companies. Prices move based on supply and demand: strong profits drive prices up, while bad news or rising costs drive prices down.",
  "what's the difference between stocks and bonds": "• Stocks: You own a piece of the company. Higher potential returns, but higher risk.\n• Bonds: You lend money to a government or company for fixed interest income. Lower returns, but safer and predictable.",
};

export const AiChatPage: React.FC = () => {
  const { stats, holdingsWithMetrics } = usePortfolio();

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_history");
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
  const [chatMode, setChatMode] = useState<ChatMode>("chat");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (textOverride?: string) => {
    const queryText = textOverride || input;
    if (!queryText.trim()) return;

    const userMessage: Message = {
      id: "usr_" + Date.now(),
      type: "user",
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mode: chatMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textOverride) setInput("");
    setIsTyping(true);

    // Call FastAPI backend connected to Claude API
    chatApi.sendMessage(queryText, chatMode)
      .then((data) => {
        const aiResponse: Message = {
          id: data.id || ("ai_" + Date.now()),
          type: "ai",
          content: data.content,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          mode: chatMode,
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      })
      .catch(() => {
        // Fallback local responder if backend server is not running
        setTimeout(() => {
          let aiText = "";
          const lower = queryText.toLowerCase().trim();

          const keyMatch = Object.keys(HARDCODED_AI_RESPONSES).find((key) => lower.includes(key));

          if (keyMatch) {
            aiText = HARDCODED_AI_RESPONSES[keyMatch];
          } else if (lower.includes("portfolio") || lower.includes("audit") || lower.includes("my risk")) {
            const holdingsCount = holdingsWithMetrics.length;
            aiText = `Portfolio Analysis:\n• Total Value: ₹${stats.totalPortfolioValue.toLocaleString()}\n• Cash Balance: ₹${stats.availableBalance.toLocaleString()}\n• Active Holdings: ${holdingsCount}\n• Overall Return: ${stats.totalReturnPercent >= 0 ? "+" : ""}${stats.totalReturnPercent.toFixed(1)}%\n\nRecommendation: Diversify across stocks, crypto, and commodities to optimize risk-adjusted returns.`;
          } else if (lower.includes("apple") || lower.includes("aapl")) {
            const asset = MOCK_ASSETS.find((a) => a.id === "apple");
            aiText = `Apple Inc. (AAPL) is trading at ₹${asset?.price}. Market Cap: ${asset?.marketCap}. Sentiment: 92% Bullish on strong hardware and service revenue growth.`;
          } else if (chatMode === "learning") {
            aiText = `Learning Mode Explanation: In finance, "${queryText}" can be understood simply. Financial instruments allow people to grow savings by investing in real businesses and global commodities rather than letting cash sit idle.`;
          } else {
            aiText = `FinSight AI Intelligence: Regarding "${queryText}", global financial markets prioritize growth, earnings stability, and risk management. Always evaluate asset valuation and maintain a diversified strategy.`;
          }

          const aiResponse: Message = {
            id: "ai_" + Date.now(),
            type: "ai",
            content: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            mode: chatMode,
          };

          setMessages((prev) => [...prev, aiResponse]);
          setIsTyping(false);
        }, 800);
      });
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    localStorage.removeItem("chat_history");
    showSuccess("Chat history cleared.");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showSuccess("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Sparkles className="w-7 h-7 text-cyan-400" /> FinSight AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Ask questions about financial markets, stock valuation, or your virtual portfolio.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="rounded-xl border-border text-muted-foreground hover:text-rose-500 gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" /> Clear Chat
          </Button>
        </div>

        {/* AI Modes Selector Tabs */}
        <div className="flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => setChatMode("learning")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              chatMode === "learning"
                ? "bg-blue-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Learning Mode (Simple Terms)
          </button>
          <button
            onClick={() => setChatMode("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              chatMode === "chat"
                ? "bg-blue-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Chat Mode (General Q&A)
          </button>
          <button
            onClick={() => setChatMode("analysis")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              chatMode === "analysis"
                ? "bg-blue-600 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Portfolio Analysis Mode
          </button>
        </div>

        {/* Chat History Box */}
        <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 min-h-[420px] max-h-[600px] overflow-y-auto space-y-4 shadow-inner">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.type === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-muted-foreground font-semibold">
                {m.type === "ai" ? (
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

              <div className="relative group max-w-[85%] sm:max-w-[75%]">
                <div
                  className={`p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    m.type === "user"
                      ? "bg-blue-600 text-white rounded-tr-none font-medium"
                      : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>

                {m.type === "ai" && (
                  <button
                    onClick={() => handleCopy(m.content, m.id)}
                    className="absolute -right-9 top-2 p-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy message"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold bg-slate-900 p-3 rounded-2xl w-fit border border-slate-800">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              FinSight AI is processing response...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Example Cards (if few messages) */}
        {messages.length <= 2 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Try asking:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {EXAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="p-3 text-left rounded-2xl bg-card border border-border hover:border-blue-500/40 text-xs font-semibold text-foreground transition-all shadow-sm"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Multi-line Message Input Bar */}
        <div className="bg-card border border-border rounded-3xl p-3 shadow-lg flex items-end gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your question or financial topic... (Press Enter to send)"
            className="min-h-[50px] max-h-32 resize-none rounded-2xl border-none focus-visible:ring-0 text-sm py-2.5 bg-transparent"
          />

          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="rounded-2xl h-12 w-12 shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AiChatPage;