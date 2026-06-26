"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { updateWebsite, deleteWebsite } from "@/lib/actions/website";
import type { Website } from "@/types";

export default function EditWebsitePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  const { id } = params;

  const [website, setWebsite] = useState<Website | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    async function fetchWebsite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/websites");
        return;
      }

      const { data, error } = await supabase
        .from("websites")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data || data.user_id !== user.id) {
        toast.error("Website not found or access denied");
        router.push("/websites");
        return;
      }

      setWebsite(data as Website);
      setName(data.name);
      setUrl(data.url);
      setSlug(data.slug);
      setIsFetching(false);
    }

    fetchWebsite();
  }, [id, router, supabase]);

  function handleUrlBlur() {
    if (url && !slugEdited) {
      setSlug(generateSlug(url));
    }
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
    );
  }

  function generateSlug(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.hostname
        .replace(/^www\./, "")
        .replace(/\./g, "-")
        .replace(/[^a-z0-9-]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
    } catch {
      return url
        .replace(/https?:\/\//, "")
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Website name is required");
      return;
    }

    if (!url.startsWith("https://")) {
      toast.error("URL must start with https://");
      return;
    }

    if (!slug.trim()) {
      toast.error("Status page slug is required");
      return;
    }

    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug)) {
      toast.error(
        "Slug must start and end with a letter or number, and contain only lowercase letters, numbers, and hyphens"
      );
      return;
    }

    setIsUpdating(true);

    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("url", url.trim());
    formData.set("slug", slug.trim());

    const result = await updateWebsite(id, formData);

    if (result.error) {
      toast.error(result.error);
      setIsUpdating(false);
      return;
    }

    toast.success("Website updated");
    router.push(`/websites/${id}`);
    router.refresh();
  }

  async function handleDelete() {
    setIsDeleting(true);

    const result = await deleteWebsite(id);

    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
      return;
    }

    toast.success("Website deleted");
    setShowDeleteDialog(false);
    router.push("/websites");
    router.refresh();
  }

  if (isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Website"
        description="Update your monitoring settings"
      />

      <form onSubmit={handleSubmit} className="w-full max-w-[560px]">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-col gap-5">
            {/* Website Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm text-[var(--text-muted)]">
                Website Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="My Portfolio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
              />
            </div>

            {/* URL */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="url" className="text-sm text-[var(--text-muted)]">
                URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                required
                className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug" className="text-sm text-[var(--text-muted)]">
                Status Page Slug
              </Label>
              <Input
                id="slug"
                type="text"
                placeholder="example-com"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                required
                className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
              />
              {slug && (
                <p className="text-xs text-[var(--text-muted)]">
                  /status/
                  <span
                    className="text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {slug}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Delete Website
            </Button>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                asChild
                className="flex-1 sm:flex-none border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)]/30 hover:text-[var(--text-primary)]"
              >
                <Link href={`/websites/${id}`}>Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="flex-1 sm:flex-none bg-white text-black hover:bg-zinc-200"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <DialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-primary)]">Delete Website</DialogTitle>
            <DialogDescription className="text-[var(--text-muted)]">
              This will permanently delete{" "}
              <span className="font-medium text-[var(--text-primary)]">{website?.name}</span>{" "}
              and all monitoring history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
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
