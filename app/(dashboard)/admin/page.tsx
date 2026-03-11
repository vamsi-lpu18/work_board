import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // TODO: Check if user has admin role once migrations are run
  // if (session.user.role !== "ADMIN") {
  //   redirect("/dashboard");
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          System Administration
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your organization, users, and platform settings
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border hover:bg-accent transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active across organization
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              With teams and members
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              On track and in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Organization average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/users">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer h-full">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  User Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage users, roles, and permissions
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/departments">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer h-full">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Organization
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage departments, teams, and structure
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/projects">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer h-full">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Projects
                </h3>
                <p className="text-sm text-muted-foreground">
                  Overview of all projects and status
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer h-full">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Performance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Analytics, KPIs, and appraisals
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/audit">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer h-full">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Security & Audit
                </h3>
                <p className="text-sm text-muted-foreground">
                  Audit logs and security settings
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer h-full">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Integrations & Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure integrations and AI features
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
