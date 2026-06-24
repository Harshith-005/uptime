"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createWebsite(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a website." };
  }

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  let slug = formData.get("slug") as string;

  // Validation
  if (!name || !name.trim()) {
    return { error: "Website name is required." };
  }

  if (!url || !url.startsWith("https://")) {
    return { error: "URL must start with https://" };
  }

  if (!slug || !slug.trim()) {
    return { error: "Status page slug is required." };
  }

  // Sanitize slug
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    return { error: "Slug must contain at least one alphanumeric character." };
  }

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("websites")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    // Append random suffix
    const suffix = Math.random().toString(36).substring(2, 6);
    slug = `${slug}-${suffix}`;
  }

  // Insert
  const { data, error } = await supabase
    .from("websites")
    .insert({
      user_id: user.id,
      name: name.trim(),
      url: url.trim(),
      slug,
      status: "PENDING",
      consecutive_failures: 0,
      uptime_percentage: 100,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/websites");
  revalidatePath("/dashboard");

  return { success: true, id: data.id };
}

export async function deleteWebsite(websiteId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  // Verify ownership
  const { data: website } = await supabase
    .from("websites")
    .select("id, user_id")
    .eq("id", websiteId)
    .single();

  if (!website) {
    return { error: "Website not found." };
  }

  if (website.user_id !== user.id) {
    return { error: "You do not have permission to delete this website." };
  }

  // Delete (cascades to monitoring_logs, incidents, notifications)
  const { error } = await supabase
    .from("websites")
    .delete()
    .eq("id", websiteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/websites");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateWebsite(websiteId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a website." };
  }

  // Verify ownership
  const { data: website } = await supabase
    .from("websites")
    .select("id, user_id")
    .eq("id", websiteId)
    .single();

  if (!website) {
    return { error: "Website not found." };
  }

  if (website.user_id !== user.id) {
    return { error: "You do not have permission to update this website." };
  }

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  let slug = formData.get("slug") as string;

  // Validation
  if (!name || !name.trim()) {
    return { error: "Website name is required." };
  }

  if (!url || !url.startsWith("https://")) {
    return { error: "URL must start with https://" };
  }

  if (!slug || !slug.trim()) {
    return { error: "Status page slug is required." };
  }

  // Sanitize slug
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    return { error: "Slug must contain at least one alphanumeric character." };
  }

  // Check slug uniqueness (excluding current website)
  const { data: existing } = await supabase
    .from("websites")
    .select("id")
    .eq("slug", slug)
    .neq("id", websiteId)
    .maybeSingle();

  if (existing) {
    // Append random suffix
    const suffix = Math.random().toString(36).substring(2, 6);
    slug = `${slug}-${suffix}`;
  }

  // Update
  const { error } = await supabase
    .from("websites")
    .update({
      name: name.trim(),
      url: url.trim(),
      slug,
    })
    .eq("id", websiteId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/websites");
  revalidatePath(`/websites/${websiteId}`);
  revalidatePath("/dashboard");

  return { success: true };
}
