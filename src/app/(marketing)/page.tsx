import Link from "next/link";
import { Search, Globe, Shield, Zap, Lock, BarChart, ArrowRight, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Subtle Background Grid to reduce emptiness */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1200px] mx-auto relative z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-5 h-5 flex-shrink-0">
            <path d="M16 2L4 7v9c0 6.5 5.1 12.6 12 14 6.9-1.4 12-7.5 12-14V7L16 2z" fill="#0a0a0a" stroke="#22c55e" strokeWidth="1.5" />
            <polyline points="6,16 10,16 12,11 14,21 16,14 18,18 20,16 26,16" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          uptime.guard
        </div>
        
        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-2 text-base font-medium text-[var(--text-muted)]">
          <Link href="#features" className="hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md hover:bg-[var(--border)]/30 transition-all">Features</Link>
          <Link href="#pricing" className="hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md hover:bg-[var(--border)]/30 transition-all">Pricing</Link>
          <Link href="/docs" className="hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md hover:bg-[var(--border)]/30 transition-all">Docs</Link>
          <Link href="#contact" className="hover:text-[var(--text-primary)] px-3 py-1.5 rounded-md hover:bg-[var(--border)]/30 transition-all">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-black hover:bg-zinc-200 transition-colors flex items-center gap-2">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-[1200px] mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="text-center lg:text-left">
            <h1 className="text-[40px] md:text-[56px] font-bold leading-[1.1] tracking-tight mb-6">
              Forget manual<br/>checks,<br/>Datadog &<br/>PagerDuty
            </h1>
            <p className="text-[var(--text-muted)] text-lg md:text-xl mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0">
              Monitor your website every 5 minutes.<br/>
              Get instant alerts when downtime happens.<br/>
              Create public status pages in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link href="/register" className="w-full sm:w-auto text-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">
                Start Monitoring Free
              </Link>
              <Link href="/status/demo" className="w-full sm:w-auto text-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-6 py-3 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors">
                View Demo Status Page
              </Link>
            </div>

            <div className="flex items-center gap-4 font-mono text-[10px] text-[var(--text-subtle)] uppercase tracking-widest mt-12 border-t border-[var(--border)] pt-6 inline-flex">
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse"/> 
                Global Network Active
              </span>
              <span>•</span>
              <span>10ms latency</span>
              <span>•</span>
              <span>Zero false positives</span>
            </div>
          </div>

          <div className="lg:mt-8 relative flex justify-center lg:justify-end w-full">
            <style>{`
              @keyframes subtle-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
            `}</style>
            
            <div 
              className="relative w-full max-w-[500px] rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_0_80px_rgba(34,197,94,0.1)] flex flex-col overflow-hidden"
              style={{ animation: 'subtle-float 8s ease-in-out infinite' }}
            >
              {/* Header (Mac window style) */}
              <div className="flex items-center px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
                </div>
                <div className="text-xs font-medium text-[var(--text-muted)] font-mono flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Dashboard / Overview
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-4">
                
                {/* Top Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                    <div className="text-[10px] text-[var(--text-muted)] font-medium mb-1">UPTIME</div>
                    <div className="flex items-end justify-between">
                      <div className="text-lg font-bold text-[var(--text-primary)]">99.99%</div>
                      <div className="w-8 h-4 flex items-end gap-0.5">
                        <div className="w-1.5 h-2 bg-[#22c55e]/40 rounded-sm" />
                        <div className="w-1.5 h-3 bg-[#22c55e]/60 rounded-sm" />
                        <div className="w-1.5 h-4 bg-[#22c55e] rounded-sm" />
                        <div className="w-1.5 h-4 bg-[#22c55e] rounded-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                    <div className="text-[10px] text-[var(--text-muted)] font-medium mb-1">AVG LATENCY</div>
                    <div className="flex items-end justify-between">
                      <div className="text-lg font-bold text-[var(--text-primary)]">89<span className="text-xs text-[var(--text-muted)] font-normal">ms</span></div>
                      <svg className="w-8 h-4 text-[var(--text-subtle)]" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="0,10 5,8 10,12 15,4 20,6 24,2"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                    <div className="text-[10px] text-[var(--text-muted)] font-medium mb-1">INCIDENTS</div>
                    <div className="flex items-end justify-between">
                      <div className="text-lg font-bold text-[var(--text-primary)]">2</div>
                      <div className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--border)]/50 px-1.5 py-0.5 rounded">This Month</div>
                    </div>
                  </div>
                </div>

                {/* Main Monitor List */}
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3 border-b border-[var(--border)] hover:bg-[var(--border)]/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">api.company.com</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">45ms</div>
                    <div className="flex items-center gap-1.5 bg-[#22c55e]/10 text-[#22c55e] px-2 py-0.5 rounded text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      UP
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3 border-b border-[var(--border)] hover:bg-[var(--border)]/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">auth.company.com</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">62ms</div>
                    <div className="flex items-center gap-1.5 bg-[#22c55e]/10 text-[#22c55e] px-2 py-0.5 rounded text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" style={{ animationDelay: '500ms' }} />
                      UP
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3 hover:bg-[var(--border)]/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">payments.company.com</span>
                    </div>
                    <div className="text-[10px] text-[#ef4444] font-mono">TIMEOUT</div>
                    <div className="flex items-center gap-1.5 bg-[#ef4444]/10 text-[#ef4444] px-2 py-0.5 rounded text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                      DOWN
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section: Dashboard */}
        <div id="features" className="mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16">
            <div className="lg:w-1/3 mb-12 lg:mb-0 z-10">
              <h2 className="text-3xl md:text-[40px] font-bold mb-4 tracking-tight">Create amazing status pages<br/>Set up monitoring in under 2 minutes.</h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                The simple but powerful engine supports everything from 5-minute checks to incident reporting and custom domains.
              </p>
            </div>

            {/* Isometric Mockup */}
            <div className="relative w-full lg:w-2/3 h-[400px] lg:h-[600px] flex justify-center items-center">
               {/* Gradient glow */}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
               
               <div 
                 className="absolute right-0 lg:translate-x-[20%] w-full sm:w-[600px] md:w-[800px] rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-[0_0_100px_rgba(0,0,0,0.5)] p-1 flex flex-col"
                 style={{ 
                   transform: "perspective(1200px) rotateX(25deg) rotateY(-15deg) rotateZ(10deg)",
                   transformStyle: "preserve-3d"
                 }}
             >
               <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--border)]">
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
               </div>
               <div className="p-6 bg-[var(--surface)] flex-1 flex gap-6">
                 {/* Sidebar */}
                 <div className="hidden sm:block w-48 space-y-4 border-r border-[var(--border)] pr-4">
                   <div className="flex items-center gap-2 mb-8">
                     <Shield className="h-4 w-4 text-[var(--text-primary)]" />
                     <span className="text-sm font-bold text-[var(--text-primary)]">Monitors</span>
                   </div>
                   <div className="h-3 w-24 bg-[var(--border)] rounded" />
                   <div className="h-3 w-16 bg-[var(--border)] rounded" />
                   <div className="h-3 w-20 bg-[var(--border)] rounded" />
                 </div>
                 {/* Main content */}
                 <div className="flex-1 space-y-4">
                   <div className="flex items-center justify-between h-12 w-full bg-[var(--background)] rounded-lg border border-[var(--border)] px-4">
                     <span className="text-sm font-medium text-[var(--text-primary)]">api.startup.com</span>
                     <span className="text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded">UP</span>
                   </div>
                   <div className="flex items-center justify-between h-12 w-full bg-[var(--background)] rounded-lg border border-[var(--border)] px-4">
                     <span className="text-sm font-medium text-[var(--text-primary)]">auth-service.io</span>
                     <span className="text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded">UP</span>
                   </div>
                   <div className="flex items-center justify-between h-12 w-full bg-[var(--background)] rounded-lg border border-[#ef4444]/50 px-4">
                     <span className="text-sm font-medium text-[var(--text-primary)]">marketing-site.com</span>
                     <span className="text-[10px] font-bold text-[#ef4444] bg-[#ef4444]/10 px-2 py-0.5 rounded">DOWN</span>
                   </div>
                 </div>
               </div>
             </div>
            </div>
          </div>
        </div>

          {/* 3x2 Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl hover:border-[var(--text-muted)]/50 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <Zap className="h-4 w-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-bold text-sm">5-Minute checks</h3>
              </div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                We ping your websites every 5 minutes from our global network. No delays.
              </p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl hover:border-[var(--text-muted)]/50 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <Globe className="h-4 w-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-bold text-sm">Global ping network</h3>
              </div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                Monitor availability from multiple global regions.
              </p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl hover:border-[var(--text-muted)]/50 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <ArrowRight className="h-4 w-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-bold text-sm">Instant email alerts</h3>
              </div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                Get notified within seconds when downtime occurs.
              </p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl hover:border-[var(--text-muted)]/50 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <Lock className="h-4 w-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-bold text-sm">Bring your own SMTP</h3>
              </div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                Connect Postmark, SendGrid, or your personal email to route alerts your way.
              </p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl hover:border-[var(--text-muted)]/50 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <Shield className="h-4 w-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-bold text-sm">Zero false positives</h3>
              </div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                Alerts trigger only after 3 consecutive failures.
              </p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl hover:border-[var(--text-muted)]/50 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)]">
                  <Search className="h-4 w-4 text-[var(--text-primary)]" />
                </div>
                <h3 className="font-bold text-sm">Beautiful status pages</h3>
              </div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                Automatically generate public status pages to build transparency with users.
              </p>
            </div>
          </div>

          {/* Security section */}
          <div className="mt-20 flex flex-col items-center text-center relative overflow-hidden py-16">
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
               {/* Concentric circles */}
               <div className="h-[600px] w-[600px] rounded-full border border-[var(--text-muted)] absolute" />
               <div className="h-[500px] w-[500px] rounded-full border border-[var(--text-muted)] absolute" />
               <div className="h-[400px] w-[400px] rounded-full border border-[var(--text-muted)] absolute" />
               <div className="h-[300px] w-[300px] rounded-full border border-[var(--text-muted)] absolute" />
               {/* Crosshair */}
               <div className="h-[800px] w-[1px] bg-[var(--text-muted)] absolute" />
               <div className="w-[800px] h-[1px] bg-[var(--text-muted)] absolute" />
            </div>

            <h2 className="text-3xl font-bold mb-2 tracking-tight">3 failed checks required before alerts.<br/>Zero false positives.</h2>
            <p className="text-[var(--text-muted)] text-sm mb-12">Designed to stay up when everything else goes down.</p>

            <div className="space-y-4 text-sm text-left relative z-10 bg-[var(--background)]/50 p-6 rounded-2xl backdrop-blur-sm border border-[var(--border)]">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-primary)] font-medium">Edge-optimized</span> 
                <span className="text-[var(--text-muted)]">Pings execute from edge nodes for precise latency tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart className="h-4 w-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-primary)] font-medium">PostgreSQL backed</span> 
                <span className="text-[var(--text-muted)]">Fast, reliable history retention powered by Supabase</span>
              </div>
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-primary)] font-medium">Open & transparent</span> 
                <span className="text-[var(--text-muted)]">No black-box magic. Inspect the queries yourself.</span>
              </div>
            </div>
          </div>

        {/* Section: Email Alerts */}
        <div className="mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16">
            <div className="lg:w-1/3 mb-12 lg:mb-0 z-10 lg:order-2">
              <h2 className="text-3xl md:text-[40px] font-bold mb-4 tracking-tight">Get notified before your<br/>users notice downtime.</h2>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed">
                The first alert compatible messenger: ordered by sender, not individual emails. With clean, minimal UI. Never get distracted again.
              </p>
            </div>

            {/* Another Isometric Mockup */}
            <div className="relative w-full lg:w-2/3 h-[400px] lg:h-[600px] flex justify-center items-center lg:order-1">
               <div 
                 className="absolute left-0 lg:-translate-x-[20%] w-full sm:w-[600px] md:w-[800px] rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-[0_0_100px_rgba(0,0,0,0.5)] p-1 flex flex-col"
                 style={{ 
                   transform: "perspective(1200px) rotateX(25deg) rotateY(15deg) rotateZ(-10deg)",
                   transformStyle: "preserve-3d"
                 }}
             >
               <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--border)]">
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
               </div>
               <div className="p-6 bg-[var(--surface)] flex-1">
                 <div className="space-y-4 max-w-md mx-auto pt-4">
                   <div className="w-full bg-[var(--background)] rounded-lg border border-[#ef4444]/30 p-4">
                     <div className="flex items-center gap-2 mb-2">
                       <div className="h-2 w-2 rounded-full bg-[#ef4444]" />
                       <span className="text-[10px] text-[var(--text-muted)] font-mono">Just now</span>
                     </div>
                     <p className="text-sm font-bold text-[var(--text-primary)] mb-1">Alert: marketing-site.com is DOWN</p>
                     <p className="text-xs text-[var(--text-muted)]">HTTP 500 Internal Server Error received.</p>
                   </div>
                   <div className="w-full bg-[var(--background)] rounded-lg border border-[var(--border)] p-4 opacity-50">
                     <div className="flex items-center gap-2 mb-2">
                       <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
                       <span className="text-[10px] text-[var(--text-muted)] font-mono">2 hours ago</span>
                     </div>
                     <p className="text-sm font-bold text-[var(--text-primary)] mb-1">Resolved: api.startup.com is UP</p>
                     <p className="text-xs text-[var(--text-muted)]">Service has recovered successfully.</p>
                   </div>
                 </div>
               </div>
             </div>
            </div>
          </div>
        </div>

        {/* Section: Keep your free tier alive */}
        <div className="mt-20">
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Left Column — Text */}
              <div>
                <span className="inline-block text-xs font-medium tracking-wide uppercase text-[var(--text-muted)] border border-[var(--border)] rounded-full px-3 py-1">
                  Free tier hack
                </span>
                <h2 className="text-[var(--text-primary)] text-4xl font-bold mt-3 mb-4 tracking-tight">
                  Keep Supabase awake.<br />Automatically.
                </h2>
                <p className="text-[var(--text-muted)] text-base leading-relaxed mb-6">
                  Supabase free tier pauses your database after 7 days of inactivity. Add your Supabase project URL as a monitor and UptimeGuard pings it every 5 minutes — keeping it alive forever, for free.
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#22c55e' }} />
                    <span className="text-[var(--text-secondary)] text-sm">No code changes required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#22c55e' }} />
                    <span className="text-[var(--text-secondary)] text-sm">Works with any free tier service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#22c55e' }} />
                    <span className="text-[var(--text-secondary)] text-sm">Get alerted if it actually goes down</span>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="text-[var(--text-primary)] text-sm font-semibold underline-offset-4 hover:underline hover:text-[var(--text-muted)] transition-colors"
                >
                  Start monitoring free →
                </Link>
              </div>

              {/* Right Column — Mock Card */}
              <div className="flex flex-col items-center md:items-end">
                <div
                  className="w-full max-w-[400px] rounded-xl p-6"
                  style={{
                    backgroundColor: '#111113',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Card header */}
                  <div className="mb-5">
                    <span className="text-[var(--text-primary)] text-sm font-semibold">Add Monitor</span>
                    <div className="mt-3" style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
                  </div>

                  {/* Mock input rows */}
                  <div className="flex flex-col gap-3">
                    {/* Row 1: Name */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: '#71717a' }}>Name</label>
                      <div
                        className="rounded-md px-3 py-2 text-sm font-mono"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#d4d4d8',
                        }}
                      >
                        My Supabase Project
                      </div>
                    </div>

                    {/* Row 2: URL */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: '#71717a' }}>URL</label>
                      <div
                        className="rounded-md px-3 py-2 text-sm font-mono"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(34,197,94,0.3)',
                          color: '#d4d4d8',
                        }}
                      >
                        https://xxxx.supabase.co
                      </div>
                    </div>

                    {/* Row 3: Check interval */}
                    <div>
                      <label className="block text-xs mb-1" style={{ color: '#71717a' }}>Check interval</label>
                      <div
                        className="rounded-md px-3 py-2 text-sm"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#d4d4d8',
                        }}
                      >
                        Every 5 minutes
                      </div>
                    </div>
                  </div>

                  {/* Mock button */}
                  <div className="mt-5">
                    <div
                      className="w-full rounded-md py-2.5 text-center text-sm font-semibold"
                      style={{ backgroundColor: 'white', color: 'black' }}
                    >
                      Start Monitoring
                    </div>
                  </div>
                </div>

                {/* Note below card */}
                <p className="text-xs text-center mt-3 max-w-[400px] w-full" style={{ color: '#52525b' }}>
                  Works with Supabase, PlanetScale, Railway, and any free tier that pauses on inactivity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Pricing & Footer */}
        <div id="pricing" className="mt-20 mb-20 text-center">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Free forever</h2>
          <p className="text-[var(--text-muted)] text-base mb-12">Monitor up to 10 websites with unlimited alerts at no cost.</p>

          <div className="max-w-md mx-auto bg-[var(--surface)] border-2 border-[var(--border)] rounded-2xl p-8 relative shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[var(--text-muted)]/20 to-transparent" />
            <div className="flex items-baseline gap-2 mb-8 justify-center">
              <span className="text-5xl font-bold tracking-tight">$0</span>
              <span className="text-[var(--text-muted)]">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-[var(--text-muted)]">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-[#22c55e]" />
                10 Monitors
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-[#22c55e]" />
                5-minute checks
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-[#22c55e]" />
                Unlimited email alerts
              </li>
            </ul>
            <Link href="/register" className="block w-full text-center rounded-lg bg-white px-4 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">
              Claim free account
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center text-center pb-24 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors flex items-center gap-2">
              Sign in
            </Link>
            <span className="text-xl font-bold tracking-tight">now to secure your uptime</span>
          </div>
        </div>

        {/* Section: Contact */}
        <div id="contact" className="mt-20 mb-12 max-w-md mx-auto text-center w-full">
          <h2 className="text-2xl font-bold mb-2 tracking-tight">Questions?</h2>
          <p className="text-[var(--text-muted)] text-sm mb-8">
            Need help setting up monitoring or have feedback?<br/>
            Send us a message and we&apos;ll get back to you.
          </p>

          <form action="https://directform.vercel.app/f/ab4d95b9-dcd2-4a28-a5ed-825590885cd5" method="POST" className="flex flex-col gap-4 text-left bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl shadow-2xl">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-[var(--text-muted)] mb-1">Email address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="you@example.com"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-subtle)]"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-[var(--text-muted)] mb-1">Message</label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows={4}
                placeholder="How can we help?"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-muted)] transition-colors resize-none placeholder:text-[var(--text-subtle)]"
              ></textarea>
            </div>
            <button type="submit" className="mt-2 w-full bg-white text-black font-bold text-sm py-2.5 rounded-lg hover:bg-zinc-200 transition-colors">
              Send Message
            </button>
          </form>
        </div>

        <footer className="mt-12 flex justify-center gap-8 text-[var(--text-subtle)]">
          <Globe className="h-5 w-5 hover:text-[var(--text-primary)] transition-colors cursor-pointer" />
          <Globe className="h-5 w-5 hover:text-[var(--text-primary)] transition-colors cursor-pointer" />
          <Globe className="h-5 w-5 hover:text-[var(--text-primary)] transition-colors cursor-pointer" />
        </footer>
      </div>
    </div>
  );
}
