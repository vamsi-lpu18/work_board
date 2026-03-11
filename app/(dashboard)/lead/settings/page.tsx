"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePreferences, updateNotifications, changePassword } from "@/app/actions/lead-settings";
import { getUserSettings } from "@/app/actions/get-user-settings";
import { useSettings } from "@/components/providers/settings-provider";

export default function LeadSettingsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"preferences" | "notifications" | "password">("preferences");
  const { preferences: globalPreferences, setPreferences: setGlobalPreferences, isLoading } = useSettings();

  // Local state for editing
  const [preferences, setPreferences] = useState(globalPreferences);

  // Sync with global preferences
  useEffect(() => {
    setPreferences(globalPreferences);
  }, [globalPreferences]);

  // Notifications state
  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    codeReviews: true,
    sprintUpdates: true,
    blockedTasks: true,
    weeklySummary: false,
  });

  // Load notification settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getUserSettings();
        setNotifications(settings.notificationSettings);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
    loadSettings();
  }, []);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSavePreferences = () => {
    startTransition(async () => {
      try {
        const result = await updatePreferences(preferences);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        
        // Update global preferences immediately for instant UI update
        setGlobalPreferences(preferences);
        
        toast.success(result.message || "Preferences saved successfully");
      } catch (error) {
        console.error("Error saving preferences:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handleSaveNotifications = () => {
    startTransition(async () => {
      try {
        const result = await updateNotifications(notifications);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success(result.message || "Notification settings saved");
      } catch (error) {
        console.error("Error saving notifications:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    startTransition(async () => {
      try {
        const result = await changePassword(passwordData);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success(result.message || "Password changed successfully");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } catch (error) {
        console.error("Error changing password:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border hover:bg-accent transition-colors">
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab("preferences")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "preferences"
                  ? "border-foreground text-muted-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "notifications"
                  ? "border-foreground text-muted-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "password"
                  ? "border-foreground text-muted-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              Password
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Display Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Compact View</p>
                      <p className="text-sm text-muted-foreground">Show more items per page</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.compactView}
                        onChange={(e) => setPreferences({ ...preferences, compactView: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-border/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-border hover:bg-accent transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-border"
                    >
                      <option>UTC (GMT+0:00)</option>
                      <option>Eastern Time (GMT-5:00)</option>
                      <option>Pacific Time (GMT-8:00)</option>
                      <option>Central European Time (GMT+1:00)</option>
                      <option>India Standard Time (GMT+5:30)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-3 py-2 border border-border hover:bg-accent transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-border"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Task Assignments</p>
                      <p className="text-sm text-muted-foreground">Get notified when tasks are assigned to you</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.taskAssignments}
                        onChange={(e) => setNotifications({ ...notifications, taskAssignments: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-border/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Code Review Requests</p>
                      <p className="text-sm text-muted-foreground">Get notified when PRs need your review</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.codeReviews}
                        onChange={(e) => setNotifications({ ...notifications, codeReviews: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-border/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Sprint Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified about sprint changes and completions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.sprintUpdates}
                        onChange={(e) => setNotifications({ ...notifications, sprintUpdates: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-border/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Blocked Tasks</p>
                      <p className="text-sm text-muted-foreground">Get notified when tasks become blocked</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.blockedTasks}
                        onChange={(e) => setNotifications({ ...notifications, blockedTasks: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-border/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Weekly Summary</p>
                      <p className="text-sm text-muted-foreground">Receive weekly team performance summary</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifications.weeklySummary}
                        onChange={(e) => setNotifications({ ...notifications, weeklySummary: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-border/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Notifications"}
                </Button>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters with uppercase, lowercase, and numbers
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleChangePassword}
                  disabled={isPending}
                >
                  {isPending ? "Changing..." : "Change Password"}
                </Button>
              </div>

              <div className="pt-6 border-t">
                <div className="bg-muted border border-destructive/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Danger Zone</h4>
                  <p className="text-sm text-foreground/80 mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="outline" className="border-destructive/30 text-foreground hover:bg-muted">
                    Request Account Deletion
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

