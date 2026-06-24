import Link from "next/link";
import { Shield, Book, Server, Activity, ArrowLeft } from "lucide-react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 1.5L2 5.5V12.5L9 16.5L16 12.5V5.5L9 1.5Z" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M5.5 9L8 11.5L13 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">UptimeGuard</span>
            </Link>
            <div className="h-4 w-px bg-zinc-800 mx-2" />
            <span className="font-mono text-sm text-zinc-500">Docs</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex max-w-[1400px] mx-auto">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-zinc-800/50 hidden md:block">
          <nav className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 space-y-8">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Getting Started</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
                    <Book className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                    Introduction
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Core Features</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/monitoring" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
                    <Server className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                    Website Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group">
                    <Activity className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                    Incident Alerts
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="pt-6 border-t border-zinc-800/50">
              <Link href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
