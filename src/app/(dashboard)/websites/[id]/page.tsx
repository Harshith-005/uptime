import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  TrendingUp,
  BarChart2,
  Zap,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ResponseTimeChart } from "@/components/shared/response-time-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatDuration } from "@/lib/utils/time";
import type { Website, MonitoringLog, Incident } from "@/types";

interface Props {
  params: { id: string };
}

export default async function WebsiteDetailPage({ params }: Props) {
  const { id } = params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch website — verify ownership
  const { data: website } = await supabase
    .from("websites")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!website) {
    redirect("/websites");
  }

  const site = website as Website;

  // Fetch last 50 monitoring logs
  const { data: logsData } = await supabase
    .from("monitoring_logs")
    .select("*")
    .eq("website_id", id)
    .order("checked_at", { ascending: false })
    .limit(50);

  const logs = (logsData || []) as MonitoringLog[];

  // Fetch all incidents
  const { data: incidentsData } = await supabase
    .from("incidents")
    .select("*")
    .eq("website_id", id)
    .order("started_at", { ascending: false });

  const incidents = (incidentsData || []) as Incident[];

  // Uptime stats: count UP vs DOWN in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: upCount } = await supabase
    .from("monitoring_logs")
    .select("*", { count: "exact", head: true })
    .eq("website_id", id)
    .eq("status", "UP")
    .gte("checked_at", thirtyDaysAgo.toISOString());

  const { count: downCount } = await supabase
    .from("monitoring_logs")
    .select("*", { count: "exact", head: true })
    .eq("website_id", id)
    .eq("status", "DOWN")
    .gte("checked_at", thirtyDaysAgo.toISOString());

  const totalChecks30d = (upCount || 0) + (downCount || 0);
  const uptime30d =
    totalChecks30d > 0 ? ((upCount || 0) / totalChecks30d) * 100 : 100;

  // Average response time
  const responseTimes = logs
    .map((l) => l.response_time)
    .filter((rt): rt is number => rt != null);
  const avgResponse =
    responseTimes.length > 0
      ? Math.round(
          responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length
        )
      : null;

  // Status color mapping
  const statusColorMap: Record<string, string> = {
    UP: "#22c55e",
    DOWN: "#ef4444",
    PENDING: "#71717a",
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div>
      <PageHeader
        title={site.name}
        description={
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            {site.url}
          </a>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="border-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
            >
              <Link href={`/websites/${id}/edit`}>Edit</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
            >
              <a href={site.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Visit Site
              </a>
            </Button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <StatCard
          title="Current Status"
          value={site.status}
          icon={<Activity className="h-4 w-4" />}
          valueColor={statusColorMap[site.status] || "#71717a"}
        />
        <StatCard
          title="Uptime (30d)"
          value={`${uptime30d.toFixed(2)}%`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Total Checks"
          value={logs.length}
          icon={<BarChart2 className="h-4 w-4" />}
          description={
            totalChecks30d > 0 ? `${totalChecks30d} in last 30 days` : undefined
          }
        />
        <StatCard
          title="Avg Response"
          value={avgResponse != null ? `${avgResponse}ms` : "—"}
          icon={<Zap className="h-4 w-4" />}
        />
      </div>

      {/* Response Time Chart */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Response Time</h2>
        <div className="rounded-lg border border-zinc-800 bg-[#18181b] p-5">
          <ResponseTimeChart logs={logs} status={site.status} />
        </div>
      </div>

      {/* Recent Checks Table */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Checks</h2>

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#18181b] py-8">
            <p className="text-sm text-zinc-500">No checks recorded yet</p>
            <p className="mt-1 text-xs text-zinc-600">
              Monitoring runs every 5 minutes via GitHub Actions
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-[#18181b]">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-500">Time</TableHead>
                  <TableHead className="text-zinc-500">Status</TableHead>
                  <TableHead className="text-zinc-500">Response Time</TableHead>
                  <TableHead className="text-zinc-500">Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const statusColor =
                    log.status === "UP" ? "#22c55e" : "#ef4444";
                  return (
                    <TableRow
                      key={log.id}
                      className="border-zinc-800 hover:bg-zinc-900/50"
                    >
                      <TableCell>
                        <span
                          className="text-sm text-zinc-400"
                          style={{ fontFamily: "var(--font-geist-mono)" }}
                        >
                          {formatDateTime(log.checked_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium"
                          style={{
                            borderColor: statusColor,
                            color: statusColor,
                            backgroundColor: "transparent",
                          }}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-zinc-400"
                          style={{ fontFamily: "var(--font-geist-mono)" }}
                        >
                          {log.response_time != null
                            ? `${log.response_time}ms`
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {log.error_message ? (
                          <span
                            className="text-xs text-zinc-500"
                            title={log.error_message}
                          >
                            {log.error_message.length > 60
                              ? `${log.error_message.slice(0, 60)}…`
                              : log.error_message}
                          </span>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Incidents Timeline */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white">Incidents</h2>

        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#18181b] py-8">
            <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
            <p className="font-medium text-white">No incidents recorded</p>
            <p className="mt-1 text-sm text-zinc-500">
              This website has been running smoothly
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {incidents.map((incident) => {
              const isOpen = incident.status === "OPEN";
              const dotColor = isOpen ? "bg-red-500" : "bg-zinc-500";
              const badgeColor = isOpen ? "#ef4444" : "#71717a";

              return (
                <div
                  key={incident.id}
                  className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-[#18181b] px-4 py-4"
                >
                  {/* Dot */}
                  <div
                    className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColor}`}
                  />

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">Incident</p>
                    <p
                      className="text-xs text-zinc-400"
                      style={{ fontFamily: "var(--font-geist-mono)" }}
                    >
                      {formatDateTime(incident.started_at)}
                    </p>
                  </div>

                  {/* Status badge */}
                  <Badge
                    variant="outline"
                    className="text-xs font-medium"
                    style={{
                      borderColor: badgeColor,
                      color: badgeColor,
                      backgroundColor: "transparent",
                    }}
                  >
                    {incident.status}
                  </Badge>

                  {/* Duration */}
                  <span
                    className="w-24 flex-shrink-0 text-right text-sm text-zinc-400"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {incident.status === "RESOLVED" && incident.duration != null
                      ? formatDuration(incident.duration)
                      : "Ongoing"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Public Status Page Link */}
      <div className="rounded-lg border border-zinc-800 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Public status page</p>
            <a
              href={`/status/${site.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-white"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              <span className="text-sm">
                {appUrl}/status/{site.slug}
              </span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
