"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
    <div className="w-full max-w-[400px] rounded-lg border border-[#27272a] bg-[#18181b] p-6">
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 1.5L2 5.5V12.5L9 16.5L16 12.5V5.5L9 1.5Z"
              fill="#0a0a0a"
              stroke="#0a0a0a"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 9L8 11.5L13 6.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-lg font-semibold text-white">UptimeGuard</span>
      </div>

      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-white">Create an account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Get started with UptimeGuard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm text-zinc-400">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="border-[#27272a] bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm text-zinc-400">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-[#27272a] bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm text-zinc-400">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="border-[#27272a] bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-password" className="text-sm text-zinc-400">
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="border-[#27272a] bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white font-medium text-black hover:bg-zinc-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#27272a]" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="h-px flex-1 bg-[#27272a]" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        disabled={isGoogleLoading}
        onClick={handleGoogleSignIn}
        className="w-full border-[#27272a] bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-white transition-colors hover:text-zinc-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
