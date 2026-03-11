import { requireManager } from "@/lib/guards";
import { getTeamCapacity, getTeamCalendar } from "@/lib/manager-helpers";

export const metadata = {
  title: "Team Capacity | Manager Dashboard",
};

export default async function ManagerCapacityPage() {
  const session = await requireManager();

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  const [capacity, calendar] = await Promise.all([
    getTeamCapacity(session.user.id),
    getTeamCalendar(session.user.id, startDate, endDate),
  ]);

  const avgUtilization =
    capacity.length > 0
      ? capacity.reduce((sum, m) => sum + m.utilization, 0) / capacity.length
      : 0;

  const overUtilized = capacity.filter((m) => m.utilization > 1).length;
  const underUtilized = capacity.filter((m) => m.utilization < 0.7).length;

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Capacity
            </h1>
            <p className="mt-1 text-muted-foreground">
              Monitor workload and resource allocation across your team
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div className="rounded-lg border border-border hover:bg-accent transition-colors p-6 hover:">
            <div className="text-sm font-medium text-muted-foreground">
              Avg Utilization
            </div>
            <div className="mt-2 text-lg font-semibold text-foreground">
              {(avgUtilization * 100).toFixed(0)}%
            </div>
          </div>
          <div className="rounded-lg border border-border hover:bg-accent transition-colors p-6 hover:">
            <div className="text-sm font-medium text-muted-foreground">Team Size</div>
            <div className="mt-2 text-lg font-semibold text-foreground">
              {capacity.length}
            </div>
          </div>
          <div className="rounded-lg border border-border hover:bg-accent transition-colors p-6 hover:">
            <div className="text-sm font-medium text-muted-foreground">
              Over-utilized
            </div>
            <div className="mt-2 text-lg font-semibold text-foreground">
              {overUtilized}
            </div>
          </div>
          <div className="rounded-lg border border-border hover:bg-accent transition-colors p-6 hover:">
            <div className="text-sm font-medium text-muted-foreground">
              Under-utilized
            </div>
            <div className="mt-2 text-lg font-semibold text-foreground">
              {underUtilized}
            </div>
          </div>
        </div>

        {/* Team Capacity Details */}
        <div className="rounded-lg border border-border hover:bg-accent transition-colors overflow-hidden">
          <div className="border-b border-border bg-muted px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">
              Team Workload
            </h3>
          </div>
          <div className="divide-y divide-border">
            {capacity.map((member) => (
              <div
                key={member.user.id}
                className="px-6 py-4 transition-all hover:bg-muted"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                    {member.user.firstName?.[0]}
                    {member.user.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">
                      {member.user.firstName} {member.user.lastName}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {member.activeProjects} projects •{" "}
                      {member.avgWeeklyHours.toFixed(1)}h/week
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-48 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all ${
                          member.utilization > 1
                            ? "bg-foreground"
                            : member.utilization > 0.8
                            ? "bg-primary/70"
                            : "bg-foreground"
                        }`}
                        style={{
                          width: `${Math.min(member.utilization * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          member.utilization > 1
                            ? "text-muted-foreground"
                            : member.utilization > 0.8
                            ? "text-muted-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {(member.utilization * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                {member.utilization > 1 && (
                  <div className="mt-3 rounded-lg px-3 py-2 text-sm text-muted-foreground>
                    ⚠️ Over-utilized: Consider redistributing workload or
                    extending deadlines
                  </div>
                )}
                {member.utilization < 0.5 && (
                  <div className="mt-3 rounded-lg px-3 py-2 text-sm text-muted-foreground>
                    💡 Under-utilized: Available capacity for new projects
                  </div>
                )}
              </div>
            ))}
            {capacity.length === 0 && (
              <div className="px-6 py-12 text-center text-muted-foreground">
                No team capacity data available
              </div>
            )}
          </div>
        </div>
        {/* Upcoming PTO */}
        <div className="rounded-lg border border-border hover:bg-accent transition-colors overflow-hidden">
          <div className="border-b border-border bg-muted px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">
              Upcoming Time Off (Next 30 Days)
            </h3>
          </div>
          <div className="divide-y divide-border">
            {calendar.ptoRequests.map((pto) => (
              <div
                key={pto.id}
                className="px-6 py-4 transition-all hover:bg-muted"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">
                      {pto.user.firstName} {pto.user.lastName}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {new Date(pto.startDate).toLocaleDateString()} -{" "}
                      {new Date(pto.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {pto.days} days
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pto.type.replace("_", " ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {calendar.ptoRequests.length === 0 && (
              <div className="px-6 py-12 text-center text-muted-foreground">
                No upcoming time off scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

