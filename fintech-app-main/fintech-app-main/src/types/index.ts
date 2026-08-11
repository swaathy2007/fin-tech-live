export type Category = 'stock' | 'crypto' | 'commodity' | 'Markets' | 'Tech' | 'Crypto' | 'Finance' | 'Commodities';
export type Currency = 'INR' | 'USD' | 'EUR';
export type ThemeMode = 'light' | 'dark';
export type TimePeriod = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
export type ChatMode = 'learning' | 'chat' | 'analysis';
export type ImpactLevel = 'low' | 'medium' | 'high';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number; // base price in INR
  change: number; // percentage change
  changeType: 'up' | 'down';
  highWeek52: number;
  lowWeek52: number;
  marketCap: string;
  description: string;
  category: Category;
  volume24h?: string;
  sparkline?: number[];
  peRatio?: number;
  dividendYield?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  watchlist: string[]; // asset IDs
  theme: ThemeMode;
  currency: Currency;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  dailyDigest?: boolean;
  alertSound?: boolean;
}

export interface Holding {
  id: string;
  assetId: string;
  assetName: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  buyDate: string; // ISO date string
  category: Category;
}

export interface Portfolio {
  userId: string;
  availableBalance: number;
  holdings: Holding[];
}

export interface PricePoint {
  date: string;
  formattedDate: string;
  price: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  mode?: ChatMode;
  suggestedQuestions?: string[];
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  thumbnail?: string;
  category: 'Markets' | 'Tech' | 'Crypto' | 'Finance' | 'Commodities';
  timestamp: string;
  fullText?: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  sentimentScore?: number;
}

export interface PriceAlert {
  id: string;
  userId: string;
  assetId: string;
  assetSymbol: string;
  assetName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  status: 'active' | 'triggered' | 'inactive';
  createdDate: string;
  notificationType: 'push' | 'email' | 'both';
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'alert' | 'news' | 'portfolio' | 'market';
  message: string;
  timestamp: string;
  read: boolean;
  relatedAssetId?: string;
}

export interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  date: string;
  time: string;
  impact: ImpactLevel;
  previousValue?: string;
  forecast?: string;
  actual?: string;
  relatedAsset?: string;
  description: string;
  type: 'Economic' | 'Earnings' | 'Fed' | 'Inflation';
}

export interface HistoricEvent {
  id: string;
  title: string;
  period: string;
  description: string;
  timeline: {
    date: string;
    priceMap: Record<string, number>;
    headline: string;
    sentiment: 'bullish' | 'bearish' | 'panic';
  }[];
}

export interface GoalData {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  riskPreference: 'Low' | 'Medium' | 'High';
  suggestedStrategy: string;
}

export interface GlossaryTerm {
  term: string;
  category: string;
  definition: string;
  example: string;
}