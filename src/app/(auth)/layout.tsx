"use client";

import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#18181b",
            border: "1px solid #27272a",
            color: "#ffffff",
          },
        }}
      />
    </div>
  );
}
