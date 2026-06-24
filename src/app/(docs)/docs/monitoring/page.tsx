import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DocsMonitoringPage() {
  return (
    <div className="prose prose-invert prose-zinc max-w-none">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Website Monitoring</h1>
      
      <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
        Learn how to add, configure, and manage uptime monitors for your services.
      </p>

      <hr className="border-zinc-800 my-10" />

      <h2 className="text-2xl font-semibold text-white mb-4">Adding a New Monitor</h2>
      <p className="text-zinc-400 leading-relaxed mb-6">
        Adding a new monitor takes less than 30 seconds. A monitor simply checks if a URL returns a successful `200 OK` status code.
      </p>

      <ol className="list-decimal list-inside space-y-4 text-zinc-400 mb-10 pl-4">
        <li>Log into your UptimeGuard dashboard.</li>
        <li>Click the <strong className="text-white">Add Website</strong> button in the top right corner.</li>
        <li>Enter a <strong className="text-white">Name</strong> (e.g., "Production API").</li>
        <li>Enter the full <strong className="text-white">URL</strong> (e.g., "https://api.company.com/health").</li>
        <li>Click <strong className="text-white">Save</strong>.</li>
      </ol>

      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 mb-12">
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <svg className="h-4 w-4 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pro Tip: Use Health Endpoints
        </h4>
        <p className="text-sm text-zinc-400 m-0 leading-relaxed">
          Instead of pointing UptimeGuard to your homepage (`/`), we recommend pointing it to a dedicated health endpoint (like `/api/health`). Your health endpoint should verify database connections and critical services before returning a 200 OK.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-4">Understanding Status Metrics</h2>
      <p className="text-zinc-400 leading-relaxed mb-6">
        Once a monitor is added, the dashboard will begin accumulating data. The key metrics tracked are:
      </p>

      <ul className="space-y-4 text-zinc-400 mb-12 pl-4">
        <li>
          <strong className="text-white block mb-1">Uptime Percentage</strong>
          The ratio of successful checks vs failed checks over the last 30 days. 99.99% is the industry standard goal.
        </li>
        <li>
          <strong className="text-white block mb-1">Average Response Time</strong>
          The average latency measured in milliseconds (`ms`). Anything under 300ms is excellent. Over 1000ms may indicate performance bottlenecks.
        </li>
        <li>
          <strong className="text-white block mb-1">Incident History</strong>
          A chronological log of exactly when the service went down, and how long it took to recover.
        </li>
      </ul>

      <div className="pt-8 border-t border-zinc-800 flex justify-between items-center not-prose">
        <Link href="/docs" className="text-sm text-zinc-500 hover:text-white transition-colors">
          Previous: Introduction
        </Link>
        <Link href="/docs" className="flex items-center gap-2 text-sm text-white hover:opacity-80 transition-opacity bg-zinc-900 px-4 py-2 rounded-lg">
          Next: Incident Alerts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
