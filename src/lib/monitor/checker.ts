import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendDownAlert, sendRecoveryAlert } from "@/lib/email/alerts";
import type { Website } from "@/types";

export async function checkWebsite(website: Website) {
  const now = new Date();
  const startTime = Date.now();
  let success = false;
  let responseTime: number | null = null;
  let errorMessage: string | null = null;

  // Step 1: HTTP Check
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(website.url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    responseTime = Date.now() - startTime;

    if (response.ok || (response.status >= 300 && response.status < 400)) {
      success = true;
    } else {
      errorMessage = `HTTP ${response.status} ${response.statusText}`;
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      errorMessage = "Connection timeout (10s)";
    } else {
      errorMessage = error instanceof Error ? error.message : "Network or DNS error";
    }
  }

  // Step 2: Update consecutive_failures
  const newCount = success ? 0 : (website.consecutive_failures || 0) + 1;

  // Step 3: Determine new status
  let newStatus = website.status;
  if (success) {
    newStatus = "UP";
  } else if (newCount >= 3) {
    newStatus = "DOWN";
  }
  // If failure but count < 3, keep current status (grace period)

  // Step 4: Log to monitoring_logs
  await supabaseAdmin.from("monitoring_logs").insert({
    website_id: website.id,
    status: success ? "UP" : "DOWN",
    response_time: success ? responseTime : null,
    error_message: success ? null : errorMessage,
    checked_at: now.toISOString(),
  });

  // Step 5: Handle DOWN transition
  if (newStatus === "DOWN" && website.status !== "DOWN") {
    // Create new incident
    const { data: incident } = await supabaseAdmin
      .from("incidents")
      .insert({
        website_id: website.id,
        started_at: now.toISOString(),
        status: "OPEN",
        notified: false,
      })
      .select()
      .single();

    // Send alert
    await sendDownAlert(website);

    // Update notified status
    if (incident) {
      await supabaseAdmin
        .from("incidents")
        .update({ notified: true })
        .eq("id", incident.id);
    }
  }

  // Step 6: Handle UP transition (recovery)
  if (newStatus === "UP" && website.status === "DOWN") {
    // Find open incident
    const { data: incident } = await supabaseAdmin
      .from("incidents")
      .select("*")
      .eq("website_id", website.id)
      .eq("status", "OPEN")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (incident) {
      const startedAt = new Date(incident.started_at);
      const durationSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);

      // Update incident
      await supabaseAdmin
        .from("incidents")
        .update({
          status: "RESOLVED",
          resolved_at: now.toISOString(),
          duration: durationSeconds,
        })
        .eq("id", incident.id);

      // Send recovery alert
      await sendRecoveryAlert(website, durationSeconds);
    }
  }

  // Step 7: Update website record
  await supabaseAdmin
    .from("websites")
    .update({
      status: newStatus,
      consecutive_failures: newCount,
      last_checked_at: now.toISOString(),
    })
    .eq("id", website.id);

  // Step 8: Recalculate uptime_percentage
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: totalCount } = await supabaseAdmin
    .from("monitoring_logs")
    .select("*", { count: "exact", head: true })
    .eq("website_id", website.id)
    .gte("checked_at", thirtyDaysAgo.toISOString());

  const { count: upCount } = await supabaseAdmin
    .from("monitoring_logs")
    .select("*", { count: "exact", head: true })
    .eq("website_id", website.id)
    .eq("status", "UP")
    .gte("checked_at", thirtyDaysAgo.toISOString());

  if (totalCount !== null && upCount !== null && totalCount > 0) {
    const uptimePercentage = (upCount / totalCount) * 100;
    await supabaseAdmin
      .from("websites")
      .update({ uptime_percentage: uptimePercentage })
      .eq("id", website.id);
  }
}
