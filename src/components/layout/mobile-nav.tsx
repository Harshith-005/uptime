"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LogoIcon } from "@/components/shared/logo-icon";

interface MobileNavProps {
  onMenuClick: () => void;
}

export function MobileNav({ onMenuClick }: MobileNavProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4 md:hidden">
      {/* Left: Hamburger */}
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Center: Logo */}
      <div className="flex items-center gap-2">
        <LogoIcon className="w-4 h-4 flex-shrink-0" />
        <span className="text-base font-semibold text-[var(--text-primary)]">
          UptimeGuard
        </span>
      </div>

      {/* Right: Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
