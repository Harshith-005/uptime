"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    setIsSent(true);
    setIsLoading(false);
  }

  return (
    <div className="w-full max-w-[400px] mx-4 sm:mx-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" width="18" height="18">
            <path d="M16 2L4 7v9c0 6.5 5.1 12.6 12 14 6.9-1.4 12-7.5 12-14V7L16 2z" fill="#0a0a0a" stroke="#22c55e" strokeWidth="1.5" />
            <polyline points="6,16 10,16 12,11 14,21 16,14 18,18 20,16 26,16" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-[var(--text-primary)]">UptimeGuard</span>
      </div>

      {/* Heading */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Reset password</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {isSent
            ? "Check your email for the reset link"
            : "Enter your email to receive a reset link"}
        </p>
      </div>

      {isSent ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4 text-center text-sm text-[var(--text-muted)]">
            Reset link sent to{" "}
            <span className="font-medium text-[var(--text-primary)]">{email}</span>. Check your
            inbox and spam folder.
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsSent(false);
              setEmail("");
            }}
            className="w-full border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] hover:bg-[var(--border)]/30 hover:text-[var(--text-primary)]"
          >
            Try a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm text-[var(--text-muted)]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
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
                Sending…
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      )}

      {/* Back to login */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
