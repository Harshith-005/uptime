"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ExternalLink,
  BarChart2,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteWebsite } from "@/lib/actions/website";
import { getRelativeTime } from "@/lib/utils/time";
import type { Website } from "@/types";

interface WebsiteTableProps {
  websites: Website[];
  latestResponseTimes: Record<string, number | null>;
}

const statusColors: Record<string, string> = {
  UP: "#22c55e",
  DOWN: "#ef4444",
  PENDING: "#71717a",
};

export function WebsiteTable({
  websites,
  latestResponseTimes,
}: WebsiteTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Website | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const result = await deleteWebsite(deleteTarget.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Website deleted");
    }

    setIsDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--border)] hover:bg-transparent">
              <TableHead className="text-[var(--text-muted)]">Name</TableHead>
              <TableHead className="text-[var(--text-muted)]">Status</TableHead>
              <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Uptime</TableHead>
              <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Response Time</TableHead>
              <TableHead className="hidden sm:table-cell text-[var(--text-muted)]">Last Checked</TableHead>
              <TableHead className="text-right text-[var(--text-muted)]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websites.map((website) => {
              const color = statusColors[website.status] || "#71717a";
              const responseTime = latestResponseTimes[website.id];

              return (
                <TableRow
                  key={website.id}
                  className="border-[var(--border)] hover:bg-[var(--border)]/30"
                >
                  {/* Name */}
                  <TableCell>
                    <Link
                      href={`/websites/${website.id}`}
                      className="block transition-opacity hover:opacity-80"
                    >
                      <p className="font-medium text-[var(--text-primary)]">{website.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{website.url}</p>
                    </Link>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium"
                      style={{
                        borderColor: color,
                        color: color,
                        backgroundColor: "transparent",
                      }}
                    >
                      {website.status}
                    </Badge>
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

                  {/* Response Time — hidden on mobile */}
                  <TableCell className="hidden sm:table-cell">
                    <span
                      className="text-[var(--text-muted)]"
                      style={{ fontFamily: "var(--font-geist-mono)" }}
                    >
                      {responseTime != null ? `${responseTime}ms` : "—"}
                    </span>
                  </TableCell>

                  {/* Last Checked — hidden on mobile */}
                  <TableCell className="hidden sm:table-cell">
                    {website.last_checked_at ? (
                      <span className="text-sm text-[var(--text-muted)]">
                        {getRelativeTime(website.last_checked_at)}
                      </span>
                    ) : (
                      <span className="text-sm text-[var(--text-subtle)]">Pending</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>Visit site</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/websites/${website.id}`}
                            className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            <BarChart2 className="h-4 w-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>View details</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/websites/${website.id}/edit`}
                            className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setDeleteTarget(website)}
                            className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-primary)]">Delete Website</DialogTitle>
            <DialogDescription className="text-[var(--text-muted)]">
              This will permanently delete{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {deleteTarget?.name}
              </span>{" "}
              and all its monitoring history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)]/30 hover:text-[var(--text-primary)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
