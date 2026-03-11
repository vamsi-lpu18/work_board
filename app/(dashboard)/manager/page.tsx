import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getDirectReports,
  getTeamCapacity,
  getPendingPTORequests,
  getPendingTimesheets,
} from "@/lib/manager-helpers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Manager Dashboard | WorkBoard",
};

export default async function ManagerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const [directReports, pendingPTO, pendingTimesheets, teamCapacity] =
    await Promise.all([
      getDirectReports(session.user.id),
      getPendingPTORequests(session.user.id),
      getPendingTimesheets(session.user.id),
      getTeamCapacity(session.user.id),
    ]);

  const avgUtilization =
    teamCapacity.length > 0
      ? teamCapacity.reduce((sum, m) => sum + m.utilization, 0) /
        teamCapacity.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Welcome, {session.user.name || "Manager"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your team
        </p>
      </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {directReports.length}
              </div>
              <Link
                href="/manager/team"
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                View team
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending PTO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {pendingPTO.length}
              </div>
              <Link
                href="/manager/pto"
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                Review requests
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Timesheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {pendingTimesheets.length}
              </div>
              <Link
                href="/manager/timesheets"
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                Review timesheets
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Team Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(avgUtilization * 100).toFixed(0)}%
              </div>
              <Link
                href="/manager/capacity"
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                View capacity
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent PTO Requests */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Recent PTO Requests
                </CardTitle>
                <Link
                  href="/manager/pto"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Pending time-off approvals
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPTO.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">
                        {request.user.firstName} {request.user.lastName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{request.type.replace("_", " ")}</span>
                        <span>&middot;</span>
                        <span>{request.days} days</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {new Date(request.startDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {pendingPTO.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No pending PTO requests
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Timesheets */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Pending Timesheets
                </CardTitle>
                <Link
                  href="/manager/timesheets"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                Awaiting your review
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTimesheets.slice(0, 5).map((timesheet) => (
                  <div
                    key={timesheet.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">
                        {timesheet.user.firstName} {timesheet.user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Week of{" "}
                        {new Date(timesheet.weekStart).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {timesheet.totalHours}h
                    </div>
                  </div>
                ))}
                {pendingTimesheets.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No pending timesheets
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Capacity Overview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Team Capacity
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Current workload and utilization metrics
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamCapacity.map((member) => (
                <div
                  key={member.user.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {member.user.firstName} {member.user.lastName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{member.activeProjects} active projects</span>
                      <span>&middot;</span>
                      <span>{member.avgWeeklyHours.toFixed(1)}h/week avg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all ${
                          member.utilization > 1
                            ? "bg-destructive"
                            : member.utilization > 0.8
                            ? "bg-orange-500"
                            : "bg-foreground"
                        }`}
                        style={{
                          width: `${Math.min(member.utilization * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="text-sm font-semibold text-foreground">
                        {(member.utilization * 100).toFixed(0)}%
                      </span>
                      {member.utilization > 1 && (
                        <span className="text-foreground text-sm">!</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {teamCapacity.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No team members assigned
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

