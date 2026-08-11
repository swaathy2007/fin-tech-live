import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      const msg = "Please enter your full name";
      setError(msg);
      showError(msg);
      return;
    }

    if (!email || !email.includes("@")) {
      const msg = "Please enter a valid email address";
      setError(msg);
      showError(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters long";
      setError(msg);
      showError(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      showError(msg);
      return;
    }

    await signup(email, name, password);
    showSuccess("Account created successfully!");
    navigate("/");
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join FinSight AI to unlock real-time market intelligence"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
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

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
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

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 rounded-xl"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl font-bold py-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 text-white gap-2 mt-2"
        >
          Get Started Free
          <ArrowRight className="w-4 h-4" />
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Signup;