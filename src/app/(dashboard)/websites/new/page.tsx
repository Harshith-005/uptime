"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWebsite } from "@/lib/actions/website";

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

export default function AddWebsitePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
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

    // Check slug is URL-safe
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug)) {
      toast.error(
        "Slug must start and end with a letter or number, and contain only lowercase letters, numbers, and hyphens"
      );
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("url", url.trim());
    formData.set("slug", slug.trim());

    const result = await createWebsite(formData);

    if (result.error) {
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/websites");
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="Add Website"
        description="Add a new website to monitor"
      />

      <form onSubmit={handleSubmit} className="max-w-[560px]">
        <div className="rounded-lg border border-zinc-800 bg-[#18181b] p-6">
          <div className="flex flex-col gap-5">
            {/* Website Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm text-zinc-400">
                Website Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="My Portfolio"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
              />
              <p className="text-xs text-zinc-500">
                A friendly name to identify this website
              </p>
            </div>

            {/* URL */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="url" className="text-sm text-zinc-400">
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
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
              />
              <p className="text-xs text-zinc-500">Must include https://</p>
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug" className="text-sm text-zinc-400">
                Status Page Slug
              </Label>
              <Input
                id="slug"
                type="text"
                placeholder="example-com"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                required
                className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
              />
              <p className="text-xs text-zinc-500">
                Your public status page will be at /status/{slug || "[slug]"}
              </p>
              {slug && (
                <p className="text-xs text-zinc-500">
                  status page →{" "}
                  <span
                    className="text-zinc-400"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    /status/{slug}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              asChild
              className="border-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
            >
              <Link href="/websites">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding…
                </>
              ) : (
                "Add Website"
              )}
            </Button>
          </div>
        </div>
      </form>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#18181b",
            border: "1px solid #27272a",
            color: "#ffffff",
          },
        }}
      />
    </div>
  );
}
