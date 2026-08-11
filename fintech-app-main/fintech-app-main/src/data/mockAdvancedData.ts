import { EconomicEvent, HistoricEvent, GlossaryTerm } from "@/types";

export const MOCK_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: "evt_1",
    name: "US Federal Reserve Rate Decision",
    country: "United States",
    countryFlag: "🇺🇸",
    date: "2025-03-20",
    time: "18:30 IST",
    impact: "high",
    previousValue: "5.25%",
    forecast: "5.00%",
    actual: "5.00%",
    relatedAsset: "stock",
    description: "Federal Open Market Committee (FOMC) interest rate decision and economic projections press conference.",
    type: "Fed",
  },
  {
    id: "evt_2",
    name: "India CPI Inflation Rate YoY",
    country: "India",
    countryFlag: "🇮🇳",
    date: "2025-03-22",
    time: "17:30 IST",
    impact: "high",
    previousValue: "5.10%",
    forecast: "4.85%",
    actual: "4.70%",
    relatedAsset: "gold",
    description: "Measures general price changes in essential consumer goods and services across urban and rural India.",
    type: "Inflation",
  },
  {
    id: "evt_3",
    name: "Apple Q1 Earnings Call",
    country: "United States",
    countryFlag: "🇺🇸",
    date: "2025-03-25",
    time: "02:30 IST",
    impact: "high",
    previousValue: "$2.18 EPS",
    forecast: "$2.35 EPS",
    actual: "$2.42 EPS",
    relatedAsset: "apple",
    description: "Quarterly earnings report covering iPhone sales, AI subscription revenue, and international expansion.",
    type: "Earnings",
  },
  {
    id: "evt_4",
    name: "Bitcoin Halving Network Milestone",
    country: "Global",
    countryFlag: "🌐",
    date: "2025-03-28",
    time: "12:00 IST",
    impact: "high",
    previousValue: "6.25 BTC/block",
    forecast: "3.125 BTC/block",
    actual: "3.125 BTC/block",
    relatedAsset: "bitcoin",
    description: "Programmed block reward halving decreasing new daily Bitcoin issuance by 50%.",
    type: "Economic",
  },
  {
    id: "evt_5",
    name: "US Non-Farm Payrolls (NFP)",
    country: "United States",
    countryFlag: "🇺🇸",
    date: "2025-04-04",
    time: "19:00 IST",
    impact: "medium",
    previousValue: "180K",
    forecast: "195K",
    actual: "210K",
    relatedAsset: "stock",
    description: "Monthly employment change data excluding farm workers, private households, and non-profits.",
    type: "Economic",
  },
  {
    id: "evt_6",
    name: "ECB Interest Rate Announcement",
    country: "Eurozone",
    countryFlag: "🇪🇺",
    date: "2025-04-10",
    time: "17:45 IST",
    impact: "medium",
    previousValue: "3.75%",
    forecast: "3.50%",
    actual: "3.50%",
    relatedAsset: "gold",
    description: "European Central Bank monetary policy update influencing Euro currency and European equities.",
    type: "Fed",
  }
];

export const MOCK_HISTORIC_EVENTS: HistoricEvent[] = [
  {
    id: "covid_2020",
    title: "COVID-19 Market Crash (March 2020)",
    period: "Feb 2020 - May 2020",
    description: "Global pandemic panic triggered the fastest 30% drop in stock market history before central bank stimulus spurred an unprecedented rebound.",
    timeline: [
      {
        date: "2020-02-15",
        priceMap: { apple: 80, bitcoin: 10000, tesla: 60, gold: 1580 },
        headline: "Markets hit record highs amid localized Asia quarantine reports.",
        sentiment: "bullish",
      },
      {
        date: "2020-03-09",
        priceMap: { apple: 65, bitcoin: 7800, tesla: 40, gold: 1670 },
        headline: "Black Monday: Oil price war and European lockdowns trigger global circuit breakers.",
        sentiment: "panic",
      },
      {
        date: "2020-03-23",
        priceMap: { apple: 55, bitcoin: 5200, tesla: 28, gold: 1480 },
        headline: "Fed announces unlimited quantitative easing stimulus as markets bottom.",
        sentiment: "bearish",
      },
      {
        date: "2020-04-15",
        priceMap: { apple: 72, bitcoin: 6800, tesla: 52, gold: 1720 },
        headline: "Tech shares lead sharp rally on work-from-home demand.",
        sentiment: "bullish",
      },
      {
        date: "2020-05-30",
        priceMap: { apple: 82, bitcoin: 9500, tesla: 70, gold: 1750 },
        headline: "Global equities recover pre-crash highs in historic rally.",
        sentiment: "bullish",
      }
    ]
  },
  {
    id: "crypto_2021",
    title: "The 2021 Crypto Bull Run",
    period: "Jan 2021 - Nov 2021",
    description: "Institutional adoption, NFT expansion, and retail participation propelled Bitcoin and Ethereum to record-breaking valuations.",
    timeline: [
      {
        date: "2021-01-01",
        priceMap: { apple: 130, bitcoin: 29000, tesla: 230, gold: 1890 },
        headline: "Bitcoin crosses $30,000 for first time in history.",
        sentiment: "bullish",
      },
      {
        date: "2021-04-14",
        priceMap: { apple: 133, bitcoin: 64000, tesla: 245, gold: 1740 },
        headline: "Coinbase goes public on NASDAQ as BTC reaches $64,000.",
        sentiment: "bullish",
      },
      {
        date: "2021-05-19",
        priceMap: { apple: 125, bitcoin: 37000, tesla: 190, gold: 1870 },
        headline: "China crypto mining ban triggers 40% sharp market correction.",
        sentiment: "panic",
      },
      {
        date: "2021-11-10",
        priceMap: { apple: 150, bitcoin: 69000, tesla: 350, gold: 1860 },
        headline: "Bitcoin hits all-time high of $69,000 behind US ETF launches.",
        sentiment: "bullish",
      }
    ]
  }
];

export const MOCK_GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Market Capitalization",
    category: "Valuation",
    definition: "Total market dollar value of a company's outstanding shares.",
    example: "Market Cap = 1,000,000 shares × ₹100 = ₹10 Crore.",
  },
  {
    term: "P/E Ratio (Price-to-Earnings)",
    category: "Valuation",
    definition: "Measures share price relative to company earnings per share (EPS).",
    example: "A P/E of 20 means investors pay ₹20 for every ₹1 of annual company profit.",
  },
  {
    term: "Dividend Yield",
    category: "Income",
    definition: "Percentage of share price paid out to shareholders annually in cash.",
    example: "If a stock costs ₹1,000 and pays ₹40 annual dividend, its yield is 4%.",
  },
  {
    term: "Volatility & Beta",
    category: "Risk",
    definition: "Measures how violently an asset's price fluctuates relative to the market.",
    example: "A Beta of 1.5 means the stock moves 50% more dramatically than the broader index.",
  },
  {
    term: "Inflation Hedge",
    category: "Strategy",
    definition: "An asset like Gold or Real Estate that preserves purchasing power as currency devalues.",
    example: "During high inflation, investors buy Gold to protect wealth.",
  }
];