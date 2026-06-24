"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-8">
      <div className="flex flex-col items-center justify-center max-w-md w-full bg-[#18181b] border border-zinc-800 rounded-lg p-8 text-center shadow-xl">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <h2 className="text-lg font-semibold text-white mt-4">Something went wrong</h2>
        <p className="text-sm text-zinc-500 mt-2 mb-6">{error.message || "An unexpected error occurred."}</p>
        
        <Button variant="outline" onClick={() => reset()} className="w-full">
          Try Again
        </Button>
        <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white mt-4 transition-colors">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
