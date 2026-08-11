import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("john@finsight.ai");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      const msg = "Please enter a valid email address";
      setError(msg);
      showError(msg);
      return;
    }

    if (!password || password.length < 6) {
      const msg = "Password must be at least 6 characters long";
      setError(msg);
      showError(msg);
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showSuccess("Welcome back to FinSight AI!");
      navigate("/");
    } catch (err: any) {
      const msg = err?.message || "Invalid email or password. Please try again.";
      setError(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to access your investment intelligence dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(c) => setRememberMe(!!c)}
          />
          <label
            htmlFor="remember"
            className="text-xs text-muted-foreground font-medium leading-none cursor-pointer"
          >
            Remember me on this device
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl font-bold py-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 text-white gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;