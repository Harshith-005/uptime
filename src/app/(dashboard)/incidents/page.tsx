import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime, formatDuration } from "@/lib/utils/time";
import type { Incident } from "@/types";

interface IncidentWithWebsite extends Incident {
  website: {
    name: string;
    url: string;
  };
}

export default async function IncidentsPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user websites
  const { data: userWebsites } = await supabase
    .from("websites")
    .select("id")
    .eq("user_id", user.id);

  const websiteIds = userWebsites?.map((w) => w.id) || [];

  let incidents: IncidentWithWebsite[] = [];

  if (websiteIds.length > 0) {
    // Fetch incidents joined with websites
    const { data: incidentsData } = await supabase
      .from("incidents")
      .select(`
        *,
        website:websites(name, url)
      `)
      .in("website_id", websiteIds)
      .order("started_at", { ascending: false });

    if (incidentsData) {
      // Massage the data since PostgREST returns a joined record/array
      incidents = incidentsData.map((incident: { website: unknown; [key: string]: unknown }) => ({
        ...incident,
        website: Array.isArray(incident.website)
          ? incident.website[0]
          : incident.website,
      })) as IncidentWithWebsite[];
    }
  }

  const openIncidents = incidents.filter((i) => i.status === "OPEN");
  const resolvedIncidents = incidents.filter((i) => i.status === "RESOLVED");

  // Calculate Average Duration for resolved incidents
  const resolvedWithDuration = resolvedIncidents.filter(
    (i) => i.duration != null
  );
  const avgDuration =
    resolvedWithDuration.length > 0
      ? Math.round(
          resolvedWithDuration.reduce(
            (sum, i) => sum + (i.duration || 0),
            0
          ) / resolvedWithDuration.length
        )
      : null;

  return (
    <div>
      <PageHeader
        title="Incidents"
        description="History of all downtime events across your monitors"
      />

      {/* Summary Row */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="Total Incidents"
          value={incidents.length}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          title="Open Incidents"
          value={openIncidents.length}
          icon={<XCircle className="h-4 w-4" />}
          valueColor={openIncidents.length > 0 ? "#ef4444" : undefined}
        />
        <StatCard
          title="Avg Duration"
          value={avgDuration != null ? formatDuration(avgDuration) : "—"}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {incidents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] py-16 mt-8">
          <CheckCircle className="mb-4 h-10 w-10 text-green-500" />
          <p className="text-base font-medium text-[var(--text-primary)]">
            No incidents recorded
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            All your monitors have been running smoothly
          </p>
        </div>
      ) : (
        <>
          {/* Open Incidents */}
          {openIncidents.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
                Open Incidents
              </h2>
              <div className="flex flex-col gap-2">
                {openIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center gap-4 rounded-lg border border-[var(--border)] border-l-red-500 border-l-2 bg-[var(--surface)] p-4"
                  >
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-red-500" />
                        <span className="font-medium text-[var(--text-primary)]">
                          {incident.website.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium"
                          style={{
                            borderColor: "#ef4444",
                            color: "#ef4444",
                            backgroundColor: "transparent",
                          }}
                        >
                          OPEN
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {incident.website.url}
                      </p>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-[var(--text-muted)]">Started</span>
                        <span
                          className="text-sm text-[var(--text-muted)]"
                          style={{ fontFamily: "var(--font-geist-mono)" }}
                        >
                          {formatDateTime(incident.started_at)}
                        </span>
                        <span className="rounded-full bg-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                          Ongoing
                        </span>
                      </div>
                    </div>

                    {/* Right: Action */}
                    <Link
                      href={`/websites/${incident.website_id}`}
                      className="rounded-md p-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                      title="View Website"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incident History Table */}
          <div>
            <h2 className="mb-4 mt-8 text-lg font-semibold text-[var(--text-primary)]">
              Incident History
            </h2>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-[var(--border)] hover:bg-transparent">
                    <TableHead className="text-[var(--text-muted)]">Website</TableHead>
                    <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Started</TableHead>
                    <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Resolved</TableHead>
                    <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Duration</TableHead>
                    <TableHead className="text-[var(--text-muted)]">Status</TableHead>
                    <TableHead className="text-right text-[var(--text-muted)]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => {
                    const isOpen = incident.status === "OPEN";
                    const statusColor = isOpen ? "#ef4444" : "#71717a";

                    return (
                      <TableRow
                        key={incident.id}
                        className="border-[var(--border)] hover:bg-[var(--border)]/30"
                      >
                        {/* Website */}
                        <TableCell>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {incident.website.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {incident.website.url}
                          </p>
                        </TableCell>

                        {/* Started — hidden on mobile */}
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className="text-sm text-[var(--text-muted)]"
                            style={{ fontFamily: "var(--font-geist-mono)" }}
                          >
                            {formatDateTime(incident.started_at)}
                          </span>
                        </TableCell>

                        {/* Resolved — hidden on mobile */}
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className="text-sm text-[var(--text-muted)]"
                            style={{ fontFamily: "var(--font-geist-mono)" }}
                          >
                            {incident.resolved_at
                              ? formatDateTime(incident.resolved_at)
                              : "—"}
                          </span>
                        </TableCell>

                        {/* Duration — hidden on mobile */}
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className="text-sm text-[var(--text-muted)]"
                            style={{ fontFamily: "var(--font-geist-mono)" }}
                          >
                            {incident.status === "RESOLVED" &&
                            incident.duration != null
                              ? formatDuration(incident.duration)
                              : "Ongoing"}
                          </span>
                        </TableCell>

                        {/* Status */}
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
                            {incident.status}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <Link
                            href={`/websites/${incident.website_id}`}
                            className="inline-flex rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
