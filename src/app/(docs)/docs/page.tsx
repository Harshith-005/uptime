export default function DocsIntroductionPage() {
  return (
    <div className="prose prose-invert prose-zinc max-w-none">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Introduction</h1>
      
      <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
        Welcome to the UptimeGuard documentation! Here you will find everything you need to set up your website monitoring, configure alerts, and build beautiful public status pages.
      </p>

      <hr className="border-zinc-800 my-10" />

      <h2 className="text-2xl font-semibold text-white mb-4">What is UptimeGuard?</h2>
      <p className="text-zinc-400 leading-relaxed mb-6">
        UptimeGuard is an incredibly fast, secure, and reliable service that monitors your internet-facing infrastructure (like web apps, APIs, and databases). If your service goes down, UptimeGuard instantly alerts you so you can fix the issue before your users notice.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 not-prose">
        <div className="rounded-xl border border-zinc-800/80 bg-[#0a0a0a] p-6 shadow-xl">
          <h3 className="font-semibold text-white mb-2">1. Add a Monitor</h3>
          <p className="text-sm text-zinc-400">Tell UptimeGuard which URLs or IP addresses to keep an eye on.</p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-[#0a0a0a] p-6 shadow-xl">
          <h3 className="font-semibold text-white mb-2">2. Get Alerted</h3>
          <p className="text-sm text-zinc-400">Receive instant email notifications the second a site drops connection.</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
      <p className="text-zinc-400 leading-relaxed mb-4">
        Our global ping network checks your assigned URLs every 5 minutes. To ensure there is no unnecessary noise, <strong>UptimeGuard requires 3 consecutive failures</strong> before officially marking a service as DOWN and sending an alert.
      </p>
      <p className="text-zinc-400 leading-relaxed mb-6">
        This approach completely eliminates false positives caused by momentary network latency or minor ISP blips.
      </p>
    </div>
  );
}
