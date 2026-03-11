import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getOrganizationSettings } from "@/app/actions/admin-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const settings = await getOrganizationSettings();

  if (!settings) {
    return <div>Failed to load settings</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header with gradient badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-foreground ">
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">
              Organization Settings
            </h2>
            <p className="text-muted-foreground mt-1">
              Configure global settings for your organization
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border border-border hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Time & Location
              </CardTitle>
              <CardDescription>
                Timezone and working hours configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Timezone</span>
                <Badge variant="outline" className="border-foreground text-muted-foreground">
                  {settings.timeZone}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Work Week</span>
                <Badge variant="outline" className="border-foreground text-muted-foreground">
                  {settings.workWeek}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Working Hours</span>
                <Badge variant="outline" className="border-foreground text-muted-foreground">
                  {settings.workHoursStart} - {settings.workHoursEnd}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span></span>
                AI Features
              </CardTitle>
              <CardDescription>
                Artificial intelligence and automation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">AI Enabled</span>
                <Badge 
                  variant={settings.aiEnabled ? "default" : "secondary"}
                  className={settings.aiEnabled ? "bg-foreground text-background" : ""}
                >
                  {settings.aiEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">AI Threshold</span>
                <Badge variant="outline" className="border-foreground text-muted-foreground">
                  {(settings.aiThreshold * 100).toFixed(0)}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span></span>
                Holidays
              </CardTitle>
              <CardDescription>
                Organizational holidays and time-off days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {settings.holidays || "No holidays configured"}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span></span>
                System Info
              </CardTitle>
              <CardDescription>
                System configuration and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(settings.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
