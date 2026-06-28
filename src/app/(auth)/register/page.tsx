"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 0) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return Math.min(score, 3);
  };
  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Weak", "Medium", "Strong"];
  const strengthColors = ["bg-[var(--border)]", "bg-red-500", "bg-yellow-500", "bg-[#22c55e]"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Check your email to confirm your account");
    setIsLoading(false);
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-[var(--background)]">
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Logo & Header */}
          <div className="mb-8">
            <Link href="/" className="mb-6 flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" width="18" height="18">
                  <path d="M16 2L4 7v9c0 6.5 5.1 12.6 12 14 6.9-1.4 12-7.5 12-14V7L16 2z" fill="#0a0a0a" stroke="#22c55e" strokeWidth="1.5" />
                  <polyline points="6,16 10,16 12,11 14,21 16,14 18,18 20,16 26,16" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">UptimeGuard</span>
            </Link>
            
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-2">Start monitoring in under 2 minutes</h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Track uptime, receive alerts, and create public status pages for free.
            </p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/20">
            {/* Google SignIn */}
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="w-full bg-[var(--background)] border-[var(--border)] hover:bg-[var(--border)]/30 hover:text-[var(--text-primary)] transition-colors h-11"
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              )}
              Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-mono">OR</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-1 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-1 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-11 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-1 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e] transition-all pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 flex gap-1 h-1">
                      <div className={`flex-1 rounded-full ${strengthScore >= 1 ? strengthColors[strengthScore] : 'bg-[var(--border)]'} transition-colors duration-300`} />
                      <div className={`flex-1 rounded-full ${strengthScore >= 2 ? strengthColors[strengthScore] : 'bg-[var(--border)]'} transition-colors duration-300`} />
                      <div className={`flex-1 rounded-full ${strengthScore >= 3 ? strengthColors[strengthScore] : 'bg-[var(--border)]'} transition-colors duration-300`} />
                    </div>
                    <span className="text-[10px] font-medium text-[var(--text-muted)] w-12 text-right">{strengthLabels[strengthScore]}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-password" className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-11 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-1 focus-visible:ring-[#22c55e] focus-visible:border-[#22c55e] transition-all pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-white font-bold text-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Start Monitoring Free"
                  )}
                </Button>
                
                <div className="mt-4 text-center space-y-1">
                  <p className="text-xs text-[var(--text-muted)]">No credit card required.</p>
                  <p className="text-xs text-[var(--text-muted)]">Free forever for up to 10 monitors.</p>
                </div>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--text-primary)] font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column - Product Showcase */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden border-l border-[var(--border)] bg-[var(--surface)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_50%)]" />
        
        <div className="relative z-10 max-w-md w-full px-12">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8 tracking-tight">Everything you need to stay online.</h2>
          
          <ul className="space-y-5 mb-12">
            {[
              "Monitor up to 10 websites for free",
              "Unlimited email alerts",
              "Public status pages",
              "Global uptime monitoring",
              "Custom SMTP support"
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-[var(--text-primary)]">
                <CheckCircle2 className="h-5 w-5 text-[#22c55e]" />
                <span className="text-sm font-medium">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Mini Dashboard Preview */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-2xl p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
            </div>
            <div className="space-y-3">
              {[
                { name: "api.company.com", latency: "45ms", status: "UP" },
                { name: "auth.company.com", latency: "62ms", status: "UP" },
                { name: "payments.company.com", latency: "ERR", status: "DOWN" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-md bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-xs text-[var(--text-primary)]">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{item.latency}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.status === 'UP' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-red-500/10 text-red-500'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
