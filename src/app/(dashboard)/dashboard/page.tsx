import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Globe,
  CheckCircle,
  XCircle,
  Activity,
  ExternalLink,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
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
import { getRelativeTime, formatDuration } from "@/lib/utils/time";
import type { Website, Incident } from "@/types";

interface IncidentWithWebsite extends Incident {
  websites: {
    name: string;
    url: string;
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all websites for the user
  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const allWebsites = (websites || []) as Website[];

  // Compute stats
  const totalMonitors = allWebsites.length;
  const monitorsUp = allWebsites.filter((w) => w.status === "UP").length;
  const monitorsDown = allWebsites.filter((w) => w.status === "DOWN").length;
  const avgUptime =
    totalMonitors > 0
      ? allWebsites.reduce((sum, w) => sum + (w.uptime_percentage ?? 100), 0) /
        totalMonitors
      : 0;

  // Fetch the latest monitoring log for each website (for response time)
  const websiteIds = allWebsites.map((w) => w.id);
  const latestLogs: Record<string, number | null> = {};

  if (websiteIds.length > 0) {
    const { data: logs } = await supabase
      .from("monitoring_logs")
      .select("website_id, response_time, checked_at")
      .in("website_id", websiteIds)
      .order("checked_at", { ascending: false });

    if (logs) {
      // Take only the first (most recent) log per website
      for (const log of logs) {
        if (!(log.website_id in latestLogs)) {
          latestLogs[log.website_id] = log.response_time;
        }
      }
    }
  }

  // Fetch recent incidents with website info
  const { data: incidents } = await supabase
    .from("incidents")
    .select("*, websites(name, url)")
    .in("website_id", websiteIds.length > 0 ? websiteIds : ["__none__"])
    .order("started_at", { ascending: false })
    .limit(5);

  const recentIncidents = (incidents || []) as IncidentWithWebsite[];

  // Count open incidents
  const openIncidentCount = recentIncidents.filter(
    (i) => i.status === "OPEN"
  ).length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of all your monitors"
      />

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Monitors"
          value={totalMonitors}
          icon={<Globe className="h-4 w-4" />}
          description={
            totalMonitors === 1 ? "1 website" : `${totalMonitors} websites`
          }
        />
        <StatCard
          title="Monitors Up"
          value={monitorsUp}
          icon={<CheckCircle className="h-4 w-4" />}
          valueColor={monitorsUp > 0 ? "#22c55e" : undefined}
        />
        <StatCard
          title="Monitors Down"
          value={monitorsDown}
          icon={<XCircle className="h-4 w-4" />}
          valueColor={monitorsDown > 0 ? "#ef4444" : undefined}
          description={
            openIncidentCount > 0
              ? `${openIncidentCount} open incident${openIncidentCount === 1 ? "" : "s"}`
              : undefined
          }
        />
        <StatCard
          title="Avg Uptime"
          value={`${avgUptime.toFixed(2)}%`}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      {/* All Monitors Table */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">All Monitors</h2>

        {allWebsites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] py-16">
            <Globe className="mb-3 h-10 w-10 text-[var(--text-subtle)]" />
            <p className="text-base font-medium text-[var(--text-primary)]">No monitors yet</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Add your first website to start monitoring
            </p>
            <Button
              asChild
              className="mt-4 bg-white text-black hover:bg-zinc-200"
            >
              <Link href="/websites/new">Add Website</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--border)] hover:bg-transparent">
                  <TableHead className="text-[var(--text-muted)]">Name</TableHead>
                  <TableHead className="text-[var(--text-muted)]">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Uptime</TableHead>
                  <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Last Checked</TableHead>
                  <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Response Time</TableHead>
                  <TableHead className="text-right text-[var(--text-muted)]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allWebsites.map((website) => (
                  <TableRow
                    key={website.id}
                    className="border-[var(--border)] hover:bg-[var(--border)]/30"
                  >
                    {/* Name */}
                    <TableCell>
                      <Link
                        href={`/websites/${website.id}`}
                        className="block transition-colors hover:opacity-80"
                      >
                        <p className="font-medium text-[var(--text-primary)]">{website.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{website.url}</p>
                      </Link>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={website.status} />
                    </TableCell>

                    {/* Uptime — hidden on mobile */}
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className="text-[var(--text-muted)]"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        {website.uptime_percentage != null
                          ? `${website.uptime_percentage.toFixed(2)}%`
                          : "—"}
                      </span>
                    </TableCell>

                    {/* Last Checked — hidden on mobile */}
                    <TableCell className="hidden sm:table-cell">
                      {website.last_checked_at ? (
                        <span className="text-sm text-[var(--text-muted)]">
                          {getRelativeTime(website.last_checked_at)}
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--text-subtle)]">
                          Not yet checked
                        </span>
                      )}
                    </TableCell>

                    {/* Response Time — hidden on mobile */}
                    <TableCell className="hidden sm:table-cell">
                      <span
                        className="text-[var(--text-muted)]"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        {latestLogs[website.id] != null
                          ? `${latestLogs[website.id]}ms`
                          : "—"}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                          aria-label={`Visit ${website.name}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Link
                          href={`/websites/${website.id}/edit`}
                          className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                          aria-label={`Edit ${website.name}`}
                        >
                          <Settings className="h-4 w-4" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Recent Incidents */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
          Recent Incidents
        </h2>

        {recentIncidents.length === 0 ? (
          <div className="py-6 text-center text-sm text-[var(--text-muted)]">
            No incidents recorded
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
            {recentIncidents.map((incident, index) => (
              <div
                key={incident.id}
                className={cn(
                  "flex items-center gap-4 px-4 py-4",
                  index < recentIncidents.length - 1 && "border-b border-[var(--border)]"
                )}
              >
                {/* Icon */}
                <AlertTriangle
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    incident.status === "OPEN"
                      ? "text-red-500"
                      : "text-[var(--text-muted)]"
                  )}
                />

                {/* Website info */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {incident.websites?.name || "Unknown"}
                  </p>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {incident.websites?.url || ""}
                  </p>
                </div>

                {/* Started at */}
                <span className="hidden sm:inline flex-shrink-0 text-sm text-[var(--text-muted)]">
                  {getRelativeTime(incident.started_at)}
                </span>

                {/* Status badge */}
                <StatusBadge
                  status={incident.status === "OPEN" ? "DOWN" : "PENDING"}
                  label={incident.status}
                />

                {/* Duration */}
                <span
                  className="hidden sm:inline w-20 flex-shrink-0 text-right text-sm text-[var(--text-muted)]"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {incident.status === "RESOLVED" && incident.duration != null
                    ? formatDuration(incident.duration)
                    : "Ongoing"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status Badge helper                                                */
/* ------------------------------------------------------------------ */

function StatusBadge({
  status,
  label,
}: {
  status: "UP" | "DOWN" | "PENDING" | string;
  label?: string;
}) {
  const display = label || status;

  const colorMap: Record<string, string> = {
    UP: "#22c55e",
    DOWN: "#ef4444",
    OPEN: "#ef4444",
    PENDING: "#71717a",
    RESOLVED: "#71717a",
  };

  const color = colorMap[status] || "#71717a";

  return (
    <Badge
      variant="outline"
      className="text-xs font-medium"
      style={{
        borderColor: color,
        color: color,
        backgroundColor: "transparent",
      }}
    >
      {display}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* cn import (inline to keep this a server component)                 */
/* ------------------------------------------------------------------ */

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
