"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Info, Mail, Loader2 } from "lucide-react";
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
import {
  updateProfile,
  saveSmtpSettings,
  sendTestEmail,
  deleteAccount,
} from "@/lib/actions/settings";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoadingData, setIsLoadingData] = useState(true);

  // Profile Form State
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // SMTP Form State
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpFromName, setSmtpFromName] = useState("");
  const [smtpFromEmail, setSmtpFromEmail] = useState("");
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Danger Zone State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch Profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfileName(profile.name || "");
        setProfileEmail(profile.email || "");
      }

      // Fetch SMTP
      const { data: smtp } = await supabase
        .from("smtp_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (smtp) {
        setSmtpHost(smtp.host || "");
        setSmtpPort(smtp.port?.toString() || "");
        setSmtpUser(smtp.username || "");
        setSmtpPass(smtp.password || "");
        setSmtpFromName(smtp.from_name || "");
        setSmtpFromEmail(smtp.from_email || "");
      }

      setIsLoadingData(false);
    }

    fetchData();
  }, [router, supabase]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingProfile(true);

    const formData = new FormData();
    formData.set("name", profileName);

    const result = await updateProfile(formData);
    setIsSavingProfile(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated");
    }
  }

  async function handleSmtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingSmtp(true);

    const formData = new FormData();
    formData.set("host", smtpHost);
    formData.set("port", smtpPort);
    formData.set("username", smtpUser);
    formData.set("password", smtpPass);
    formData.set("from_name", smtpFromName);
    formData.set("from_email", smtpFromEmail);

    const result = await saveSmtpSettings(formData);
    setIsSavingSmtp(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("SMTP settings saved");
    }
  }

  async function handleTestEmail() {
    setIsSendingTest(true);
    const result = await sendTestEmail();
    setIsSendingTest(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Test email sent");
    }
  }

  async function handleDeleteAccount() {
    setIsDeletingAccount(true);
    const result = await deleteAccount();
    // If it succeeds, it redirects, otherwise we show an error.
    if (result?.error) {
      toast.error(result.error);
      setIsDeletingAccount(false);
      setShowDeleteDialog(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[640px]">
      <PageHeader
        title="Settings"
        description="Manage your account and notification preferences"
      />

      <div className="flex flex-col gap-8">
        {/* Profile Section */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Profile</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Update your account information
            </p>
          </div>
          <hr className="my-4 border-[var(--border)]" />

          <form onSubmit={handleProfileSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm text-[var(--text-muted)]">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus-visible:ring-[var(--text-subtle)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm text-[var(--text-muted)]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileEmail}
                  disabled
                  className="cursor-not-allowed border-[var(--border)] bg-[var(--border)]/50 text-[var(--text-subtle)]"
                />
                <p className="text-xs text-[var(--text-subtle)]">Email cannot be changed</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="submit"
                disabled={isSavingProfile}
                className="bg-white text-black hover:bg-zinc-200"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* SMTP Settings Section */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Email Notifications
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Configure your SMTP server to receive downtime alerts
            </p>
          </div>
          <hr className="my-4 border-[var(--border)]" />

          <div className="mb-5 mt-4 flex items-start gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] p-3">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[var(--text-muted)]" />
            <p className="text-xs text-[var(--text-muted)]">
              Alerts are sent using your own SMTP credentials. We never store
              your emails on our servers.
            </p>
          </div>

          <form onSubmit={handleSmtpSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <Label htmlFor="host" className="text-sm text-[var(--text-muted)]">
                    SMTP Host
                  </Label>
                  <Input
                    id="host"
                    type="text"
                    placeholder="smtp.gmail.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
                  />
                </div>
                <div className="sm:col-span-1 flex flex-col gap-2">
                  <Label htmlFor="port" className="text-sm text-[var(--text-muted)]">
                    SMTP Port
                  </Label>
                  <Input
                    id="port"
                    type="number"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm text-[var(--text-muted)]">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="you@gmail.com"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm text-[var(--text-muted)]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
                />
                <p className="text-xs text-[var(--text-muted)]">
                  Use an app password if using Gmail
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="from_name" className="text-sm text-[var(--text-muted)]">
                  From Name
                </Label>
                <Input
                  id="from_name"
                  type="text"
                  placeholder="UptimeGuard Alerts"
                  value={smtpFromName}
                  onChange={(e) => setSmtpFromName(e.target.value)}
                  className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="from_email" className="text-sm text-[var(--text-muted)]">
                  From Email
                </Label>
                <Input
                  id="from_email"
                  type="email"
                  placeholder="alerts@yourdomain.com"
                  value={smtpFromEmail}
                  onChange={(e) => setSmtpFromEmail(e.target.value)}
                  className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus-visible:ring-[var(--text-subtle)]"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestEmail}
                disabled={isSendingTest}
                className="w-full sm:w-auto border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)]/30 hover:text-[var(--text-primary)]"
              >
                {isSendingTest ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
              <Button
                type="submit"
                disabled={isSavingSmtp}
                className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200"
              >
                {isSavingSmtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save SMTP Settings"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Danger Zone Section */}
        <div className="rounded-lg border border-red-900 bg-[var(--surface)] p-6">
          <div>
            <h2 className="text-base font-semibold text-red-400">
              Danger Zone
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Irreversible actions — proceed with caution
            </p>
          </div>
          <hr className="my-4 border-[var(--border)]" />

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Delete Account</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                Permanently delete your account and all monitoring data
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmText("");
                setShowDeleteDialog(true);
              }}
              className="w-full sm:w-auto border-red-800 text-red-400 hover:bg-red-950 hover:text-red-400"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="border-[var(--border)] bg-[var(--surface)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-primary)]">Delete Account</DialogTitle>
            <DialogDescription className="text-[var(--text-muted)]">
              This will permanently delete your account, all websites,
              monitoring logs, and incidents. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 flex flex-col gap-2">
            <Label className="text-xs text-[var(--text-muted)]">
              Type <span className="font-bold text-[var(--text-primary)]">DELETE</span> to
              confirm
            </Label>
            <Input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus-visible:ring-[var(--text-subtle)]"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)]/30 hover:text-[var(--text-primary)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || isDeletingAccount}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Permanently Delete"
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
