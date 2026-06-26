"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  AlertTriangle,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Websites",
    href: "/websites",
    icon: Globe,
  },
  {
    label: "Incidents",
    href: "/incidents",
    icon: AlertTriangle,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface UserInfo {
  name: string;
  email: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          name:
            authUser.user_metadata?.name ||
            authUser.email?.split("@")[0] ||
            "User",
          email: authUser.email || "",
        });
      }
    }

    fetchUser();
  }, [supabase.auth]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleNavClick() {
    // Close sidebar on mobile after navigation
    if (onClose) {
      onClose();
    }
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "flex h-screen w-[240px] flex-shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]",
          // Mobile: fixed overlay
          "fixed z-50 md:relative md:z-auto",
          "transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 px-6 py-5 hover:opacity-80 transition-opacity">
          <Shield className="h-5 w-5 text-[var(--text-primary)]" strokeWidth={2} />
          <span className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-geist-sans)" }}>
            UptimeGuard
          </span>
        </Link>

        {/* Separator */}
        <div className="mx-3 h-px bg-[var(--border)]" />

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-r-lg px-3 py-2 text-sm font-medium transition-colors border-l-2",
                      active
                        ? "border-[var(--text-primary)] bg-[var(--border)]/40 text-[var(--text-primary)]"
                        : "border-transparent text-[var(--text-muted)] hover:bg-[var(--border)]/30 hover:text-[var(--text-primary)]"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-[var(--border)] px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-transparent text-xs font-medium text-[var(--text-primary)]">
              {user ? getInitials(user.name) : "··"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {user?.name || "Loading…"}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">
                {user?.email || ""}
              </p>
            </div>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex-shrink-0 rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-red-400"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
