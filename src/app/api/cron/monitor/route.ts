import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkWebsite } from "@/lib/monitor/checker";
import type { Website } from "@/types";

// Force Node.js runtime instead of Edge, as we use native modules for email (nodemailer)
export const runtime = "nodejs";
// Disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("[Monitor] CRON_SECRET is not configured");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[Monitor] Unauthorized attempt to trigger monitor API");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch ALL websites
    const { data: websites, error } = await supabaseAdmin
      .from("websites")
      .select("*");

    if (error) {
      throw new Error(`Failed to fetch websites: ${error.message}`);
    }

    if (!websites || websites.length === 0) {
      const timestamp = new Date().toISOString();
      console.log(`[Monitor] Checked 0 websites at ${timestamp}`);
      return NextResponse.json(
        { success: true, checked: 0, timestamp },
        { status: 200 }
      );
    }

    // Process all websites in parallel
    await Promise.allSettled(
      (websites as Website[]).map(async (site) => {
        try {
          await checkWebsite(site);
          return { websiteId: site.id, success: true };
        } catch (err: unknown) {
          console.error(`[Monitor] Unhandled error checking website ${site.id}:`, err);
          return { websiteId: site.id, success: false, error: err instanceof Error ? err.message : String(err) };
        }
      })
    );

    // After all checks, let's briefly fetch the new statuses to log a summary
    const { data: updatedWebsites } = await supabaseAdmin
      .from("websites")
      .select("status");

    let upCount = 0;
    let downCount = 0;

    if (updatedWebsites) {
      upCount = updatedWebsites.filter((w) => w.status === "UP").length;
      downCount = updatedWebsites.filter((w) => w.status === "DOWN").length;
    }

    const timestamp = new Date().toISOString();
    console.log(`[Monitor] Checked ${websites.length} websites at ${timestamp}`);
    console.log(`[Monitor] UP: ${upCount} DOWN: ${downCount}`);

    return NextResponse.json(
      {
        success: true,
        checked: websites.length,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Monitor] API Route Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
