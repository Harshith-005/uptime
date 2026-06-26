import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { WebsiteTable } from "@/components/shared/website-table";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import type { Website } from "@/types";

export default async function WebsitesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all websites
  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const allWebsites = (websites || []) as Website[];

  // Fetch latest response time per website
  const websiteIds = allWebsites.map((w) => w.id);
  const latestResponseTimes: Record<string, number | null> = {};

  if (websiteIds.length > 0) {
    const { data: logs } = await supabase
      .from("monitoring_logs")
      .select("website_id, response_time, checked_at")
      .in("website_id", websiteIds)
      .order("checked_at", { ascending: false });

    if (logs) {
      for (const log of logs) {
        if (!(log.website_id in latestResponseTimes)) {
          latestResponseTimes[log.website_id] = log.response_time;
        }
      }
    }
  }

  return (
    <div>
      <PageHeader
        title="Websites"
        description="Manage your monitored websites"
        action={
          <Button asChild className="bg-white text-black hover:bg-zinc-200">
            <Link href="/websites/new">
              <Plus className="h-4 w-4" />
              Add Website
            </Link>
          </Button>
        }
      />

      {allWebsites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] py-16">
          <Globe className="mb-3 h-10 w-10 text-[var(--text-subtle)]" />
          <p className="text-base font-medium text-[var(--text-primary)]">
            No websites added yet
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Start monitoring by adding your first website
          </p>
          <Button
            asChild
            className="mt-4 bg-white text-black hover:bg-zinc-200"
          >
            <Link href="/websites/new">
              <Plus className="h-4 w-4" />
              Add Website
            </Link>
          </Button>
        </div>
      ) : (
        <WebsiteTable
          websites={allWebsites}
          latestResponseTimes={latestResponseTimes}
        />
      )}

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          },
        }}
      />
    </div>
  );
}
