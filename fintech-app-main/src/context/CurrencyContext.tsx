import React, { createContext, useContext, useState, useEffect } from "react";
import { Currency } from "@/types";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (inrAmount: number) => string;
  getSymbol: () => string;
}

const RATES: Record<Currency, { rate: number; symbol: string }> = {
  INR: { rate: 1, symbol: "₹" },
  USD: { rate: 0.012, symbol: "$" },
  EUR: { rate: 0.011, symbol: "€" },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("currency");
    return (saved as Currency) || "INR";
  });

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const getSymbol = () => RATES[currency].symbol;

  const formatPrice = (inrAmount: number): string => {
    const config = RATES[currency];
    const converted = inrAmount * config.rate;

    if (currency === "INR") {
      if (converted >= 10000000) {
        return `${config.symbol}${(converted / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
      }
      return `${config.symbol}${converted.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    }

    return `${config.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: converted < 100 ? 2 : 0,
      maximumFractionDigits: converted < 100 ? 2 : 0,
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, getSymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};