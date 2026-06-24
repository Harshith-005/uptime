import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatDuration } from "@/lib/utils/time";
import type { Website } from "@/types";

export async function sendDownAlert(website: Website) {
  try {
    // Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", website.user_id)
      .single();

    if (!profile?.email) return;

    // Fetch SMTP settings
    const { data: smtp } = await supabaseAdmin
      .from("smtp_settings")
      .select("*")
      .eq("user_id", website.user_id)
      .single();

    if (!smtp) {
      console.warn(`[Alerts] No SMTP settings configured for user ${website.user_id}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    });

    const timestamp = new Date().toLocaleString();

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <div style="width: 16px; height: 16px; border-radius: 50%; background-color: #ef4444;"></div>
          <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff;">Website Down</h2>
        </div>
        
        <h3 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">${website.name}</h3>
        <a href="${website.url}" style="color: #a1a1aa; text-decoration: none; font-size: 14px;">${website.url}</a>
        
        <div style="margin: 32px 0; padding: 16px; background-color: #18181b; border: 1px solid #27272a; border-radius: 6px;">
          <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 14px;">Detected at: <span style="color: #ffffff; font-family: monospace;">${timestamp}</span></p>
          <p style="margin: 0; color: #a1a1aa; font-size: 14px;">We'll notify you when it recovers.</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;" />
        <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">UptimeGuard Monitoring</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${smtp.from_name}" <${smtp.from_email}>`,
      to: profile.email,
      subject: `🔴 [UptimeGuard] ${website.name} is DOWN`,
      html: htmlBody,
    });

    console.log(`[Alerts] Sent DOWN alert for ${website.url} to ${profile.email}`);
  } catch (error) {
    console.error(`[Alerts] Failed to send DOWN alert for ${website.url}:`, error);
  }
}

export async function sendRecoveryAlert(website: Website, durationSeconds: number) {
  try {
    // Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", website.user_id)
      .single();

    if (!profile?.email) return;

    // Fetch SMTP settings
    const { data: smtp } = await supabaseAdmin
      .from("smtp_settings")
      .select("*")
      .eq("user_id", website.user_id)
      .single();

    if (!smtp) {
      console.warn(`[Alerts] No SMTP settings configured for user ${website.user_id}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    });

    const timestamp = new Date().toLocaleString();
    const durationStr = formatDuration(durationSeconds);

    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 32px; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <div style="width: 16px; height: 16px; border-radius: 50%; background-color: #22c55e;"></div>
          <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff;">Website Recovered</h2>
        </div>
        
        <h3 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">${website.name}</h3>
        <a href="${website.url}" style="color: #a1a1aa; text-decoration: none; font-size: 14px;">${website.url}</a>
        
        <div style="margin: 32px 0; padding: 16px; background-color: #18181b; border: 1px solid #27272a; border-radius: 6px;">
          <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 14px;">Downtime duration: <span style="color: #ffffff; font-family: monospace;">${durationStr}</span></p>
          <p style="margin: 0; color: #a1a1aa; font-size: 14px;">Recovered at: <span style="color: #ffffff; font-family: monospace;">${timestamp}</span></p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;" />
        <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">UptimeGuard Monitoring</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${smtp.from_name}" <${smtp.from_email}>`,
      to: profile.email,
      subject: `✅ [UptimeGuard] ${website.name} is back UP`,
      html: htmlBody,
    });

    console.log(`[Alerts] Sent RECOVERY alert for ${website.url} to ${profile.email}`);
  } catch (error) {
    console.error(`[Alerts] Failed to send RECOVERY alert for ${website.url}:`, error);
  }
}
