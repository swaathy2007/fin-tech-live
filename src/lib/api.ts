// Centralized API Client for FinSight FastAPI Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/prices";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second fast timeout

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || "API request failed");
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Authentication API
export const authApi = {
  signup: (email: string, name: string, password: string = "password123") =>
    request<{ access_token: string; user: any }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    }),

  login: (email: string, password: string = "password123") =>
    request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request<any>("/auth/me"),
};

// Stock Market API (yfinance)
export const stocksApi = {
  getQuote: (symbol: string) => request<any>(`/stocks/quote/${symbol}`),
  getHistory: (symbol: string, period = "1mo", interval = "1d") =>
    request<any>(`/stocks/history/${symbol}?period=${period}&interval=${interval}`),
  search: (query: string) => request<any[]>(`/stocks/search?q=${query}`),
};

// Portfolio API (PostgreSQL database)
export const portfolioApi = {
  getSummary: () => request<any>("/portfolio/summary"),
  buyAsset: (data: { asset_id: string; asset_name: string; symbol: string; quantity: number; buy_price: number; category?: string }) =>
    request<any>("/portfolio/buy", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  sellAsset: (holdingId: string) =>
    request<any>(`/portfolio/sell/${holdingId}`, {
      method: "POST",
    }),
  reset: () =>
    request<any>("/portfolio/reset", {
      method: "POST",
    }),
};

// Watchlist API
export const watchlistApi = {
  getWatchlist: () => request<any[]>("/watchlist"),
  add: (symbol: string, asset_name: string) =>
    request<any>("/watchlist", {
      method: "POST",
      body: JSON.stringify({ symbol, asset_name }),
    }),
  remove: (symbol: string) =>
    request<any>(`/watchlist/${symbol}`, {
      method: "DELETE",
    }),
};

// Price Alerts API
export const alertsApi = {
  getAlerts: () => request<any[]>("/alerts"),
  create: (symbol: string, target_price: number, condition = "above") =>
    request<any>("/alerts", {
      method: "POST",
      body: JSON.stringify({ symbol, target_price, condition }),
    }),
  delete: (alertId: string) =>
    request<any>(`/alerts/${alertId}`, {
      method: "DELETE",
    }),
};

// Claude AI Copilot Chat API
export const chatApi = {
  getHistory: () => request<any[]>("/chat/history"),
  sendMessage: (message: string, mode = "chat") =>
    request<any>("/chat/send", {
      method: "POST",
      body: JSON.stringify({ message, mode }),
    }),
  clearHistory: () =>
    request<any>("/chat/clear", {
      method: "POST",
    }),
};

// WebSocket Real-time Price Streaming
export function connectPriceWebSocket(onMessage: (data: any) => void): () => void {
  let socket: WebSocket | null = null;
  try {
    socket = new WebSocket(WS_BASE_URL);
    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch (err) {
        console.error("Failed to parse WebSocket message", err);
      }
    };

    socket.onerror = (err) => {
      console.warn("WebSocket error:", err);
    };
  } catch (e) {
    console.warn("WebSocket connection failed:", e);
  }

  return () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };
}
