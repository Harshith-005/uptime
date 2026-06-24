import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatDateTime, formatDuration } from "@/lib/utils/time";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { data: website } = await supabaseAdmin
    .from("websites")
    .select("name")
    .eq("slug", params.slug)
    .single();

  if (!website) {
    return {
      title: "Not Found | UptimeGuard",
    };
  }

  return {
    title: `${website.name} Status | UptimeGuard`,
    description: `Real-time status and uptime history for ${website.name}`,
  };
}

export default async function StatusPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // 1. Fetch website by slug
  const { data: website } = await supabaseAdmin
    .from("websites")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!website) {
    notFound();
  }

  // 2. Fetch incidents limit 20
  const { data: incidentsData } = await supabaseAdmin
    .from("incidents")
    .select("*")
    .eq("website_id", website.id)
    .order("started_at", { ascending: false })
    .limit(20);

  const incidents = incidentsData || [];

  // 3. Fetch logs for the last 90 days
  const now = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(now.getDate() - 90);

  const { data: logsData } = await supabaseAdmin
    .from("monitoring_logs")
    .select("status, response_time, checked_at")
    .eq("website_id", website.id)
    .gte("checked_at", ninetyDaysAgo.toISOString())
    .limit(50000);

  const logs = logsData || [];

  // Calculate 30-day stats
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const logs30d = logs.filter(
    (log) => new Date(log.checked_at) >= thirtyDaysAgo
  );

  const totalChecks30d = logs30d.length;
  const upChecks30d = logs30d.filter((log) => log.status === "UP").length;
  const uptime30d =
    totalChecks30d > 0 ? (upChecks30d / totalChecks30d) * 100 : 100;

  const responseTimes30d = logs30d
    .map((l) => l.response_time)
    .filter((rt): rt is number => rt != null);
  const avgResponse30d =
    responseTimes30d.length > 0
      ? Math.round(
          responseTimes30d.reduce((sum, rt) => sum + rt, 0) /
            responseTimes30d.length
        )
      : null;

  // Calculate 90-day daily uptime bars
  // Create an array of exactly 90 days ending today
  const dailyBars = [];
  for (let i = 89; i >= 0; i--) {
    const startOfDay = new Date();
    startOfDay.setDate(now.getDate() - i);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const dayLogs = logs.filter((log) => {
      const d = new Date(log.checked_at);
      return d >= startOfDay && d <= endOfDay;
    });

    let uptime = null;
    if (dayLogs.length > 0) {
      const up = dayLogs.filter((log) => log.status === "UP").length;
      uptime = (up / dayLogs.length) * 100;
    }

    // Determine color
    let bgColor = "bg-zinc-800"; // No data
    if (uptime !== null) {
      if (uptime === 100) bgColor = "bg-[#22c55e]";
      else if (uptime >= 99) bgColor = "bg-[#16a34a]";
      else if (uptime >= 95) bgColor = "bg-[#eab308]";
      else bgColor = "bg-[#ef4444]";
    }

    // Format date string for tooltip
    const mon = startOfDay.toLocaleString("en-US", { month: "short" });
    const day = startOfDay.getDate();
    const tooltipText =
      uptime !== null
        ? `${mon} ${day} — ${uptime.toFixed(1)}% uptime`
        : `${mon} ${day} — No data`;

    dailyBars.push({
      id: i,
      bgColor,
      tooltipText,
    });
  }

  // Active Incident
  const openIncident = incidents.find((inc) => inc.status === "OPEN");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-white" />
          <span className="text-sm font-semibold text-white">
            UptimeGuard
          </span>
        </div>
        <Link
          href="/"
          className="text-xs text-zinc-400 transition-colors hover:text-white"
        >
          Monitor your own site &rarr;
        </Link>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[720px] px-6 py-12">
        {/* SECTION A: Hero */}
        <div className="mb-12 text-center">
          {website.status === "UP" && (
            <>
              <div className="inline-block h-3 w-3 animate-pulse rounded-full bg-[#22c55e]" />
              <h1 className="mt-4 text-3xl font-semibold text-white">
                All Systems Operational
              </h1>
              <p className="mt-2 text-base text-zinc-400">
                {website.name} is up and running
              </p>
            </>
          )}

          {website.status === "DOWN" && (
            <>
              <div className="inline-block h-3 w-3 animate-pulse rounded-full bg-[#ef4444]" />
              <h1 className="mt-4 text-3xl font-semibold text-white">
                Service Disruption Detected
              </h1>
              <p className="mt-2 text-base text-zinc-400">
                {website.name} is currently experiencing issues
              </p>
            </>
          )}

          {website.status === "PENDING" && (
            <>
              <div className="inline-block h-3 w-3 rounded-full bg-zinc-500" />
              <h1 className="mt-4 text-3xl font-semibold text-white">
                Monitoring Starting
              </h1>
              <p className="mt-2 text-base text-zinc-400">
                First check hasn&apos;t run yet
              </p>
            </>
          )}
        </div>

        {/* SECTION D: Active Incident Banner */}
        {website.status === "DOWN" && openIncident && (
          <div className="mb-8 rounded-lg border border-red-800 bg-red-950 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                Active Incident
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-300">
              We are currently investigating issues with this service.
            </p>
            <p
              className="mt-2 text-xs text-zinc-400"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Started at: {formatDateTime(openIncident.started_at)}
            </p>
          </div>
        )}

        {/* SECTION B: Stats row */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-800 bg-[#18181b] p-5 text-center">
            <p
              className="text-2xl font-semibold text-white"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {uptime30d.toFixed(2)}%
            </p>
            <p className="mt-1 text-sm text-zinc-500">Uptime (30d)</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#18181b] p-5 text-center">
            <p
              className="text-2xl font-semibold text-white"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {totalChecks30d}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Total Checks</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-[#18181b] p-5 text-center">
            <p
              className="text-2xl font-semibold text-white"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {avgResponse30d !== null ? `${avgResponse30d}ms` : "—"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">Avg Response</p>
          </div>
        </div>

        {/* SECTION C: 90-day uptime grid */}
        <div className="mb-12">
          <h2 className="mb-3 text-base font-semibold text-white">
            Last 90 Days
          </h2>
          <div className="flex flex-nowrap gap-1 overflow-hidden">
            {dailyBars.map((bar) => (
              <div
                key={bar.id}
                title={bar.tooltipText}
                className={`h-8 flex-1 rounded-sm ${bar.bgColor}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-zinc-600">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* SECTION E: Incident history */}
        <div className="mb-12">
          <h2 className="mb-4 text-base font-semibold text-white">
            Incident History
          </h2>

          {incidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#18181b] py-8">
              <CheckCircle className="mb-2 h-6 w-6 text-green-500" />
              <p className="text-sm text-zinc-400">
                No incidents in the last 90 days
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {incidents.map((incident) => {
                const isOpen = incident.status === "OPEN";
                const dotColor = isOpen ? "bg-[#ef4444]" : "bg-zinc-500";

                return (
                  <div
                    key={incident.id}
                    className="border-b border-zinc-800 py-4 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 flex-shrink-0 rounded-full ${dotColor}`}
                        />
                        <span className="text-sm font-medium text-white">
                          {isOpen ? "Active Incident" : "Resolved Incident"}
                        </span>
                        {!isOpen && (
                          <CheckCircle className="ml-1 h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <span
                        className="text-xs text-zinc-500"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        {isOpen && "Ongoing"}
                        {!isOpen && incident.duration != null
                          ? formatDuration(incident.duration)
                          : ""}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-col gap-1 pl-4 sm:flex-row sm:items-center sm:gap-4">
                      <span
                        className="text-sm text-zinc-400"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        Started: {formatDateTime(incident.started_at)}
                      </span>
                      {incident.resolved_at && (
                        <span
                          className="text-sm text-zinc-400"
                          style={{ fontFamily: "var(--font-geist-mono)" }}
                        >
                          Resolved: {formatDateTime(incident.resolved_at)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION F: Footer */}
        <footer className="mt-16 border-t border-zinc-800 pt-6 text-center">
          <p className="text-xs text-zinc-600">Powered by UptimeGuard</p>
          <Link
            href="/"
            className="mt-1 inline-block text-sm text-zinc-500 transition-colors hover:text-white"
          >
            Create your own status page
          </Link>
        </footer>
      </main>
    </div>
  );
}
