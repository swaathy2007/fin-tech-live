import { LearningModule } from "@/types";

export const MOCK_MODULES: LearningModule[] = [
  {
    id: "mod_1",
    title: "Stock Market Basics & Valuation",
    category: "Investing 101",
    readTime: "4 min read",
    level: "Beginner",
    description: "Learn what stocks represent, how market capitalization works, and how to evaluate company shares.",
    xpReward: 100,
    content: [
      "A stock represents fractional ownership in a publicly traded corporation.",
      "Market Capitalization = Total Shares Outstanding × Current Share Price.",
      "Price-to-Earnings (P/E Ratio) measures how much investors are willing to pay per dollar of earnings.",
      "A lower P/E ratio may indicate a bargain or underlying challenges, while a high P/E often reflects high growth expectations."
    ],
    quiz: [
      {
        id: "q1_1",
        question: "If a company has 10 Million shares priced at ₹100 each, what is its Market Cap?",
        options: ["₹100 Million", "₹1 Billion (₹100 Cr)", "₹10 Billion", "₹500 Million"],
        correctIndex: 1,
        explanation: "Market Cap = 10,000,000 shares × ₹100 = ₹1,000,000,000 (₹1 Billion / ₹100 Cr)."
      },
      {
        id: "q1_2",
        question: "What does a P/E ratio compare?",
        options: ["Price vs Dividend", "Share Price vs Annual Earnings per Share", "Assets vs Liabilities", "Revenue vs Profit"],
        correctIndex: 1,
        explanation: "The P/E ratio compares the market price per share to the company's earnings per share (EPS)."
      }
    ]
  },
  {
    id: "mod_2",
    title: "Crypto & Blockchain Fundamentals",
    category: "Cryptocurrency",
    readTime: "5 min read",
    level: "Beginner",
    description: "Understand Bitcoin, smart contracts, decentralized finance (DeFi), and crypto risk management.",
    xpReward: 150,
    content: [
      "Bitcoin operates on a decentralized peer-to-peer ledger without central bank intermediaries.",
      "Ethereum introduced Smart Contracts — self-executing code that runs on the blockchain automatically.",
      "Crypto markets trade 24/7 and experience higher volatility than traditional equities.",
      "Always store private keys securely and never invest more than you can afford to lose."
    ],
    quiz: [
      {
        id: "q2_1",
        question: "What primary innovation did Ethereum introduce beyond Bitcoin?",
        options: ["Slower transactions", "Smart Contracts capability", "Central bank control", "Gold backing"],
        correctIndex: 1,
        explanation: "Ethereum enabled programmable smart contracts that power decentralized apps (dApps)."
      }
    ]
  },
  {
    id: "mod_3",
    title: "Portfolio Diversification & Risk Management",
    category: "Risk Strategy",
    readTime: "6 min read",
    level: "Intermediate",
    description: "Master asset allocation across stocks, crypto, and defensive commodities like gold to weather market crashes.",
    xpReward: 200,
    content: [
      "Diversification reduces unsystematic risk by spreading capital across non-correlated asset classes.",
      "Gold and commodities often act as inflation hedges when currency purchasing power declines.",
      "Rebalancing involves periodically adjusting holding weights back to target risk percentages.",
      "The 50-30-20 rule helps maintain adequate liquidity while aggressively compounding wealth."
    ],
    quiz: [
      {
        id: "q3_1",
        question: "Why do investors add Gold or Commodities to an equity-heavy portfolio?",
        options: ["To guarantee 100% returns", "As a defensive hedge against inflation and volatility", "To eliminate all market fees", "To double company dividends"],
        correctIndex: 1,
        explanation: "Gold historically holds value or rises during currency devaluation and stock market turbulence."
      }
    ]
  }
];
const _unusedAcademy = MOCK_MODULES;