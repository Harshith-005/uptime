import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UptimeGuard - Minimal Uptime Monitoring",
  description: "Uptime monitoring for indie makers. Know when your site goes down instantly.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen scroll-smooth bg-[#0a0a0a] text-zinc-400">
      {children}
    </div>
  );
}
