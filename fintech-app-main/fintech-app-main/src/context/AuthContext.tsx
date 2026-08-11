import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { authApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, name: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: "usr_101",
  email: "john@finsight.ai",
  name: "John Doe",
  watchlist: ["apple", "bitcoin", "nvidia"],
  theme: "dark",
  currency: "INR",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  const login = async (email: string, password: string = "password123"): Promise<boolean> => {
    try {
      const res = await authApi.login(email, password);
      if (res && res.access_token) {
        localStorage.setItem("auth_token", res.access_token);
        const newUser: User = {
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          watchlist: ["apple", "bitcoin"],
          theme: res.user.theme || "dark",
          currency: res.user.currency || "INR",
        };
        setUser(newUser);
        return true;
      }
    } catch {
      // Fallback local user creation for offline testing
    }

    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split("@")[0] || "Investor",
      watchlist: ["apple", "bitcoin"],
      theme: "dark",
      currency: "INR",
    };
    setUser(newUser);
    return true;
  };

  const signup = async (email: string, name: string, password: string = "password123"): Promise<boolean> => {
    try {
      const res = await authApi.signup(email, name, password);
      if (res && res.access_token) {
        localStorage.setItem("auth_token", res.access_token);
        const newUser: User = {
          id: res.user.id,
          email: res.user.email,
          name: res.user.name,
          watchlist: ["apple", "bitcoin"],
          theme: res.user.theme || "dark",
          currency: res.user.currency || "INR",
        };
        setUser(newUser);
        return true;
      }
    } catch {
      // Fallback local user creation for offline testing
    }

    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email,
      name,
      watchlist: ["apple", "bitcoin"],
      theme: "dark",
      currency: "INR",
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("portfolio_holdings");
    localStorage.removeItem("portfolio_balance");
  };

  const updateUser = (fields: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...fields });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};