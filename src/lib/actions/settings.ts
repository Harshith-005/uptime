"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  const name = formData.get("name") as string;

  if (!name || !name.trim()) {
    return { error: "Name is required" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ name: name.trim() })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function saveSmtpSettings(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  const host = formData.get("host") as string;
  const portStr = formData.get("port") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const from_name = formData.get("from_name") as string;
  const from_email = formData.get("from_email") as string;

  if (
    !host.trim() ||
    !portStr ||
    !username.trim() ||
    !password.trim() ||
    !from_name.trim() ||
    !from_email.trim()
  ) {
    return { error: "All SMTP fields are required" };
  }

  const port = parseInt(portStr, 10);
  if (isNaN(port)) {
    return { error: "Port must be a valid number" };
  }

  // Upsert the settings
  const { error } = await supabase.from("smtp_settings").upsert(
    {
      user_id: user.id,
      host: host.trim(),
      port,
      username: username.trim(),
      password: password.trim(),
      from_name: from_name.trim(),
      from_email: from_email.trim(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function sendTestEmail() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  // Fetch the user's SMTP config
  const { data: smtp } = await supabase
    .from("smtp_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!smtp) {
    return { error: "No SMTP settings configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465, // true for 465, false for other ports like 587
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    });

    const mailOptions = {
      from: `"${smtp.from_name}" <${smtp.from_email}>`,
      to: user.email,
      subject: "UptimeGuard — Test Email",
      text: "This is a test email from UptimeGuard.\nYour SMTP settings are configured correctly.\nYou will receive downtime alerts at this address.",
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: unknown) {
    console.error("Test email error:", error);
    return { error: error instanceof Error ? error.message : "Failed to send test email" };
  }
}

export async function deleteAccount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in" };
  }

  // Using the service role key to delete the user entirely from auth.users.
  // The DB has `ON DELETE CASCADE` from auth.users to profiles, websites, etc.
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    return { error: error.message };
  }

  // Sign out the current session
  await supabase.auth.signOut();
  
  redirect("/login");
}
