import Link from "next/link";
import { Search, Globe, Shield, Zap, Lock, BarChart, ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Subtle Background Grid to reduce emptiness */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1200px] mx-auto relative z-50">
        <div className="font-bold text-xl tracking-tight">uptime.guard</div>
        
        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-2 text-base font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-all">Features</Link>
          <Link href="#pricing" className="hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-all">Pricing</Link>
          <Link href="#contact" className="hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-all">Contact</Link>
        </div>

        <Link href="/login" className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-black hover:bg-zinc-200 transition-colors flex items-center gap-2">
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="max-w-[1200px] mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h1 className="text-[40px] md:text-[56px] font-bold leading-[1.1] tracking-tight mb-6">
              Forget manual<br/>checks,<br/>Datadog &<br/>PagerDuty
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              Monitor your website every 5 minutes.<br/>
              Get instant alerts when downtime happens.<br/>
              Create public status pages in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link href="/register" className="w-full sm:w-auto text-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">
                Start Monitoring Free
              </Link>
              <Link href="/status/demo" className="w-full sm:w-auto text-center rounded-lg border border-zinc-800 bg-[#0a0a0a] px-6 py-3 text-sm font-bold text-white hover:bg-zinc-900 transition-colors">
                View Demo Status Page
              </Link>
            </div>

            <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-600 uppercase tracking-widest mt-12 border-t border-zinc-900 pt-6 inline-flex">
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

          <div className="lg:mt-8 relative flex justify-center lg:justify-end">
            <style>{`
              @keyframes float-stack {
                0%, 100% { transform: translateY(0) rotateX(60deg) rotateZ(-45deg); }
                50% { transform: translateY(-20px) rotateX(60deg) rotateZ(-45deg); }
              }
            `}</style>
            
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]" style={{ perspective: '1200px' }}>
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15)_0%,transparent_50%)] -z-10 blur-2xl" />
              
              {/* The 3D Stack */}
              <div 
                className="relative w-full h-full" 
                style={{ 
                  transformStyle: 'preserve-3d', 
                  animation: 'float-stack 6s ease-in-out infinite' 
                }}
              >
                {/* Bottom Blade (Database) */}
                <div 
                  className="absolute inset-16 bg-[#050505] border border-zinc-800 rounded-xl"
                  style={{ transform: 'translateZ(-60px)', boxShadow: '20px 20px 0px rgba(0,0,0,0.8)' }}
                >
                   <div className="absolute right-4 bottom-4 w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" style={{ animationDelay: '0ms'}} />
                   <div className="absolute left-4 bottom-4 text-[10px] text-zinc-600 font-mono">DB-PRIMARY</div>
                </div>

                {/* Middle Blade (API) */}
                <div 
                  className="absolute inset-16 bg-[#080808] border border-zinc-700/80 rounded-xl backdrop-blur-sm"
                  style={{ transform: 'translateZ(0px)', boxShadow: '20px 20px 0px rgba(0,0,0,0.6)' }}
                >
                   <div className="absolute right-4 bottom-4 w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" style={{ animationDelay: '500ms'}} />
                   <div className="absolute left-4 bottom-4 text-[10px] text-zinc-500 font-mono">API-GATEWAY</div>
                </div>

                {/* Top Blade (Edge) */}
                <div 
                  className="absolute inset-16 bg-[#0a0a0a] border border-zinc-600 rounded-xl backdrop-blur-md flex flex-col justify-between p-6"
                  style={{ transform: 'translateZ(60px)', boxShadow: '20px 20px 20px rgba(0,0,0,0.5)' }}
                >
                   <div className="flex justify-between items-center">
                     <div className="text-xs text-white font-mono font-bold">EDGE-NODE</div>
                     <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_12px_#22c55e]" style={{ animationDelay: '1000ms'}} />
                   </div>
                   
                   <div className="space-y-2 mt-4">
                     <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                       <span>UPTIME</span>
                       <span className="text-[#22c55e]">99.99%</span>
                     </div>
                     <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                       <div className="h-full w-[99.9%] bg-[#22c55e]" />
                     </div>
                   </div>
                   
                   <div className="space-y-1.5 mt-auto">
                     <div className="h-1.5 w-full bg-zinc-800/50 rounded-full" />
                     <div className="h-1.5 w-3/4 bg-zinc-800/50 rounded-full" />
                     <div className="h-1.5 w-1/2 bg-zinc-800/50 rounded-full" />
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
              <p className="text-zinc-400 text-lg leading-relaxed">
                The simple but powerful engine supports everything from 5-minute checks to incident reporting and custom domains.
              </p>
            </div>

            {/* Isometric Mockup */}
            <div className="relative w-full lg:w-2/3 h-[400px] lg:h-[600px] flex justify-center items-center">
               {/* Gradient glow to make it visible against black */}
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
               
               <div 
                 className="absolute right-0 lg:translate-x-[20%] w-[600px] md:w-[800px] rounded-xl border border-zinc-800/50 bg-[#0a0a0a] shadow-[0_0_100px_rgba(0,0,0,1)] p-1 flex flex-col"
                 style={{ 
                 transform: "perspective(1200px) rotateX(25deg) rotateY(-15deg) rotateZ(10deg)",
                 transformStyle: "preserve-3d"
               }}
             >
               <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/50">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
               </div>
               <div className="p-6 bg-[#050505] flex-1 flex gap-6">
                 {/* Sidebar */}
                 <div className="w-48 space-y-4 border-r border-zinc-800/50 pr-4">
                   <div className="flex items-center gap-2 mb-8">
                     <Shield className="h-4 w-4 text-white" />
                     <span className="text-sm font-bold text-white">Monitors</span>
                   </div>
                   <div className="h-3 w-24 bg-zinc-800 rounded" />
                   <div className="h-3 w-16 bg-zinc-800 rounded" />
                   <div className="h-3 w-20 bg-zinc-800 rounded" />
                 </div>
                 {/* Main content */}
                 <div className="flex-1 space-y-4">
                   <div className="flex items-center justify-between h-12 w-full bg-[#0a0a0a] rounded-lg border border-zinc-800/50 px-4">
                     <span className="text-sm font-medium text-white">api.startup.com</span>
                     <span className="text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded">UP</span>
                   </div>
                   <div className="flex items-center justify-between h-12 w-full bg-[#0a0a0a] rounded-lg border border-zinc-800/50 px-4">
                     <span className="text-sm font-medium text-white">auth-service.io</span>
                     <span className="text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded">UP</span>
                   </div>
                   <div className="flex items-center justify-between h-12 w-full bg-[#0a0a0a] rounded-lg border border-[#ef4444]/50 px-4">
                     <span className="text-sm font-medium text-white">marketing-site.com</span>
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
            <div className="bg-[#050505] border border-zinc-900/80 p-8 rounded-2xl hover:border-zinc-700 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-sm">5-Minute checks</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                We ping your websites every 5 minutes from our global network. No delays.
              </p>
            </div>
            <div className="bg-[#050505] border border-zinc-900/80 p-8 rounded-2xl hover:border-zinc-700 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-sm">Global ping network</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Monitor availability from multiple global regions.
              </p>
            </div>
            <div className="bg-[#050505] border border-zinc-900/80 p-8 rounded-2xl hover:border-zinc-700 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-sm">Instant email alerts</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Get notified within seconds when downtime occurs.
              </p>
            </div>
            <div className="bg-[#050505] border border-zinc-900/80 p-8 rounded-2xl hover:border-zinc-700 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Lock className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-sm">Bring your own SMTP</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Connect Postmark, SendGrid, or your personal email to route alerts your way.
              </p>
            </div>
            <div className="bg-[#050505] border border-zinc-900/80 p-8 rounded-2xl hover:border-zinc-700 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-sm">Zero false positives</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Alerts trigger only after 3 consecutive failures.
              </p>
            </div>
            <div className="bg-[#050505] border border-zinc-900/80 p-8 rounded-2xl hover:border-zinc-700 transition-colors shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-sm">Beautiful status pages</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Automatically generate public status pages to build transparency with users.
              </p>
            </div>
          </div>

          {/* Security section */}
          <div className="mt-20 flex flex-col items-center text-center relative overflow-hidden py-16">
            <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
               {/* Concentric circles */}
               <div className="h-[600px] w-[600px] rounded-full border border-zinc-700 absolute" />
               <div className="h-[500px] w-[500px] rounded-full border border-zinc-700 absolute" />
               <div className="h-[400px] w-[400px] rounded-full border border-zinc-700 absolute" />
               <div className="h-[300px] w-[300px] rounded-full border border-zinc-700 absolute" />
               {/* Crosshair */}
               <div className="h-[800px] w-[1px] bg-zinc-700 absolute" />
               <div className="w-[800px] h-[1px] bg-zinc-700 absolute" />
            </div>

            <h2 className="text-3xl font-bold mb-2 tracking-tight">3 failed checks required before alerts.<br/>Zero false positives.</h2>
            <p className="text-zinc-500 text-sm mb-12">Designed to stay up when everything else goes down.</p>

            <div className="space-y-4 text-sm text-left relative z-10 bg-black/50 p-6 rounded-2xl backdrop-blur-sm border border-zinc-800/50">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-zinc-400" />
                <span className="text-white font-medium">Edge-optimized</span> 
                <span className="text-zinc-500">Pings execute from edge nodes for precise latency tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <BarChart className="h-4 w-4 text-zinc-400" />
                <span className="text-white font-medium">PostgreSQL backed</span> 
                <span className="text-zinc-500">Fast, reliable history retention powered by Supabase</span>
              </div>
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-zinc-400" />
                <span className="text-white font-medium">Open & transparent</span> 
                <span className="text-zinc-500">No black-box magic. Inspect the queries yourself.</span>
              </div>
            </div>
          </div>

        {/* Section: Email Alerts */}
        <div className="mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16">
            <div className="lg:w-1/3 mb-12 lg:mb-0 z-10 lg:order-2">
              <h2 className="text-3xl md:text-[40px] font-bold mb-4 tracking-tight">Get notified before your<br/>users notice downtime.</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                The first alert compatible messenger: ordered by sender, not individual emails. With clean, minimal UI. Never get distracted again.
              </p>
            </div>

            {/* Another Isometric Mockup */}
            <div className="relative w-full lg:w-2/3 h-[400px] lg:h-[600px] flex justify-center items-center lg:order-1">
               <div 
                 className="absolute left-0 lg:-translate-x-[20%] w-[600px] md:w-[800px] rounded-xl border border-zinc-800/50 bg-[#0a0a0a] shadow-[0_0_100px_rgba(0,0,0,1)] p-1 flex flex-col"
                 style={{ 
                 transform: "perspective(1200px) rotateX(25deg) rotateY(15deg) rotateZ(-10deg)",
                 transformStyle: "preserve-3d"
               }}
             >
               <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/50">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
               </div>
               <div className="p-6 bg-[#050505] flex-1">
                 <div className="space-y-4 max-w-md mx-auto pt-4">
                   <div className="w-full bg-[#0a0a0a] rounded-lg border border-[#ef4444]/30 p-4">
                     <div className="flex items-center gap-2 mb-2">
                       <div className="h-2 w-2 rounded-full bg-[#ef4444]" />
                       <span className="text-[10px] text-zinc-500 font-mono">Just now</span>
                     </div>
                     <p className="text-sm font-bold text-white mb-1">Alert: marketing-site.com is DOWN</p>
                     <p className="text-xs text-zinc-500">HTTP 500 Internal Server Error received.</p>
                   </div>
                   <div className="w-full bg-[#0a0a0a] rounded-lg border border-zinc-800/50 p-4 opacity-50">
                     <div className="flex items-center gap-2 mb-2">
                       <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
                       <span className="text-[10px] text-zinc-500 font-mono">2 hours ago</span>
                     </div>
                     <p className="text-sm font-bold text-white mb-1">Resolved: api.startup.com is UP</p>
                     <p className="text-xs text-zinc-500">Service has recovered successfully.</p>
                   </div>
                 </div>
               </div>
             </div>
            </div>
          </div>
        </div>

        {/* Section: Pricing & Footer */}
        <div id="pricing" className="mt-20 mb-20 text-center">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Free forever</h2>
          <p className="text-zinc-400 text-base mb-12">Monitor up to 10 websites with unlimited alerts at no cost.</p>

          <div className="max-w-md mx-auto bg-[#050505] border-2 border-zinc-800 rounded-2xl p-8 relative shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="flex items-baseline gap-2 mb-8 justify-center">
              <span className="text-5xl font-bold tracking-tight">$0</span>
              <span className="text-zinc-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-zinc-400">
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

        <div className="flex flex-col items-center text-center pb-24 border-b border-zinc-900">
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
          <p className="text-zinc-400 text-sm mb-8">
            Need help setting up monitoring or have feedback?<br/>
            Send us a message and we&apos;ll get back to you.
          </p>

          <form action="https://directform.vercel.app/f/ab4d95b9-dcd2-4a28-a5ed-825590885cd5" method="POST" className="flex flex-col gap-4 text-left bg-[#050505] border border-zinc-900/80 p-8 rounded-2xl shadow-2xl">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-1">Email address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="you@example.com"
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-zinc-400 mb-1">Message</label>
              <textarea 
                id="message" 
                name="message" 
                required 
                rows={4}
                placeholder="How can we help?"
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors resize-none"
              ></textarea>
            </div>
            <button type="submit" className="mt-2 w-full bg-white text-black font-bold text-sm py-2.5 rounded-lg hover:bg-zinc-200 transition-colors">
              Send Message
            </button>
          </form>
        </div>

        <footer className="mt-12 flex justify-center gap-8 text-zinc-600">
          <Globe className="h-5 w-5 hover:text-white transition-colors cursor-pointer" />
          <Globe className="h-5 w-5 hover:text-white transition-colors cursor-pointer" />
          <Globe className="h-5 w-5 hover:text-white transition-colors cursor-pointer" />
        </footer>
      </div>
    </div>
  );
}
