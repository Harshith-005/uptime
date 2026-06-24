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
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px]">
      <PageHeader
        title="Settings"
        description="Manage your account and notification preferences"
      />

      <div className="flex flex-col gap-8">
        {/* Profile Section */}
        <div className="rounded-lg border border-zinc-800 bg-[#18181b] p-6">
          <div>
            <h2 className="text-base font-semibold text-white">Profile</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Update your account information
            </p>
          </div>
          <hr className="my-4 border-zinc-800" />

          <form onSubmit={handleProfileSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm text-zinc-400">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="border-zinc-800 bg-zinc-900 text-white focus-visible:ring-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm text-zinc-400">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileEmail}
                  disabled
                  className="cursor-not-allowed border-zinc-800 bg-zinc-700 text-zinc-600"
                />
                <p className="text-xs text-zinc-600">Email cannot be changed</p>
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
        <div className="rounded-lg border border-zinc-800 bg-[#18181b] p-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              Email Notifications
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Configure your SMTP server to receive downtime alerts
            </p>
          </div>
          <hr className="my-4 border-zinc-800" />

          <div className="mb-5 mt-4 flex items-start gap-2 rounded-md border border-zinc-700 bg-zinc-900 p-3">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
            <p className="text-xs text-zinc-400">
              Alerts are sent using your own SMTP credentials. We never store
              your emails on our servers.
            </p>
          </div>

          <form onSubmit={handleSmtpSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 flex flex-col gap-2">
                  <Label htmlFor="host" className="text-sm text-zinc-400">
                    SMTP Host
                  </Label>
                  <Input
                    id="host"
                    type="text"
                    placeholder="smtp.gmail.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                  />
                </div>
                <div className="col-span-1 flex flex-col gap-2">
                  <Label htmlFor="port" className="text-sm text-zinc-400">
                    SMTP Port
                  </Label>
                  <Input
                    id="port"
                    type="number"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm text-zinc-400">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="you@gmail.com"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm text-zinc-400">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                />
                <p className="text-xs text-zinc-500">
                  Use an app password if using Gmail
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="from_name" className="text-sm text-zinc-400">
                  From Name
                </Label>
                <Input
                  id="from_name"
                  type="text"
                  placeholder="UptimeGuard Alerts"
                  value={smtpFromName}
                  onChange={(e) => setSmtpFromName(e.target.value)}
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="from_email" className="text-sm text-zinc-400">
                  From Email
                </Label>
                <Input
                  id="from_email"
                  type="email"
                  placeholder="alerts@yourdomain.com"
                  value={smtpFromEmail}
                  onChange={(e) => setSmtpFromEmail(e.target.value)}
                  className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestEmail}
                disabled={isSendingTest}
                className="border-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
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
                className="bg-white text-black hover:bg-zinc-200"
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
        <div className="rounded-lg border border-red-900 bg-[#18181b] p-6">
          <div>
            <h2 className="text-base font-semibold text-red-400">
              Danger Zone
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Irreversible actions — proceed with caution
            </p>
          </div>
          <hr className="my-4 border-zinc-800" />

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Delete Account</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Permanently delete your account and all monitoring data
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmText("");
                setShowDeleteDialog(true);
              }}
              className="border-red-800 text-red-400 hover:bg-red-950 hover:text-red-400"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="border-zinc-800 bg-[#18181b]">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Account</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will permanently delete your account, all websites,
              monitoring logs, and incidents. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 flex flex-col gap-2">
            <Label className="text-xs text-zinc-400">
              Type <span className="font-bold text-white">DELETE</span> to
              confirm
            </Label>
            <Input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="border-zinc-800 bg-zinc-900 text-white focus-visible:ring-zinc-600"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
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
            background: "#18181b",
            border: "1px solid #27272a",
            color: "#ffffff",
          },
        }}
      />
    </div>
  );
}
