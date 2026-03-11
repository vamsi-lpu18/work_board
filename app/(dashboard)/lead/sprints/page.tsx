import { requireLead } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getTeamSprints, getSprintBurndown } from "@/lib/lead-helpers";
import { format } from "date-fns";
import Link from "next/link";

export default async function LeadSprintsPage() {
  const session = await requireLead();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        select: { id: true, name: true },
      },
    },
  });

  if (!user?.team) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="border-border rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-2">No Team Assigned</h2>
            <p className="text-muted-foreground">Please contact your administrator to assign you to a team.</p>
          </div>
        </div>
      </div>
    );
  }

  const sprints = await getTeamSprints(user.team.id, true);
  const activeSprint = sprints.find((s) => s.status === "ACTIVE");
  const planningSprint = sprints.find((s) => s.status === "PLANNING");
  const completedSprints = sprints.filter((s) => s.status === "COMPLETED").slice(0, 5);

  let burndownData = null;
  if (activeSprint) {
    burndownData = await getSprintBurndown(activeSprint.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-full w-fit mb-3">
            <span className="text-sm font-semibold">Sprint Management</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Sprint Planning
          </h1>
          <p className="text-muted-foreground mt-2">Manage sprints and track team velocity</p>
        </div>
        <Link
          href="/lead/sprints/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-lg hover:bg-foreground/90 hover:transition-colors font-medium"
        >
          Create Sprint
        </Link>
      </div>

      {/* Active Sprint */}
      {activeSprint && (
        <div className="border border-border rounded-lg hover:bg-accent transition-colors">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-foreground text-background text-xs font-semibold rounded-full ">
                    ACTIVE
                  </span>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {activeSprint.name}
                  </h2>
                </div>
                <p className="text-muted-foreground">{activeSprint.goal}</p>
              </div>
              <Link
                href={`/lead/sprints/${activeSprint.id}`}
                className="text-muted-foreground hover:text-foreground font-medium transition-all"
              >
                View Details 
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-muted rounded-lg p-4 border border-border hover:bg-accent transition-colors">
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="text-lg font-semibold text-foreground">
                  {format(new Date(activeSprint.startDate), "MMM d")} -{" "}
                  {format(new Date(activeSprint.endDate), "MMM d")}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4 border border-border hover:bg-accent transition-colors">
                <p className="text-sm text-muted-foreground mb-1">Story Points</p>
                <p className="text-lg font-semibold text-foreground">
                  {activeSprint.totalTasks || 0} tasks
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4 border border-border hover:bg-accent transition-colors">
                <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                <p className="text-lg font-semibold text-foreground">
                  {activeSprint.capacityHours}h
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4 border border-border hover:bg-accent transition-colors">
                <p className="text-sm text-muted-foreground mb-1">Velocity</p>
                <p className="text-lg font-semibold text-foreground">
                  {activeSprint.velocity || "-"} pts
                </p>
              </div>
            </div>

            {/* Burndown Chart Placeholder */}
            {burndownData && burndownData.idealBurndown && burndownData.actualBurndown && (
              <div className="mt-6 p-4 bg-muted rounded-lg border border-border hover:bg-accent transition-colors">
                <h3 className="text-sm font-semibold text-foreground mb-3">Sprint Burndown</h3>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-foreground/30 rounded-lg/50">
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">Ideal: {burndownData.idealBurndown.map(d => d.ideal.toFixed(0)).join(", ")}</p>
                    <p className="text-sm mt-1">Actual: {burndownData.actualBurndown.map(d => d.actual.toFixed(0)).join(", ")}</p>
                    <p className="text-xs mt-2 text-muted-foreground">Chart visualization to be implemented</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Planning Sprint */}
      {planningSprint && (
        <div className="border-border rounded-lg hover:transition-colors">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-foreground text-background text-xs font-semibold rounded-full ">
                    PLANNING
                  </span>
                  <h2 className="text-xl font-bold text-muted-foreground">
                    {planningSprint.name}
                  </h2>
                </div>
                <p className="text-muted-foreground">{planningSprint.goal}</p>
              </div>
              <Link
                href={`/lead/sprints/${planningSprint.id}`}
                className="text-muted-foreground hover:text-foreground font-medium transition-all"
              >
                Plan Sprint →
              </Link>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="bg-muted rounded-lg p-3 flex-1 border border-border hover:bg-accent transition-colors">
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <p className="font-semibold text-foreground">
                  {format(new Date(planningSprint.startDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3 flex-1 border border-border hover:bg-accent transition-colors">
                <p className="text-sm text-muted-foreground mb-1">End Date</p>
                <p className="font-semibold text-foreground">
                  {format(new Date(planningSprint.endDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3 flex-1 border border-border hover:bg-accent transition-colors">
                <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                <p className="font-semibold text-foreground">{planningSprint.capacityHours}h</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Sprints */}
      {completedSprints.length > 0 && (
        <div className="border-border rounded-lg hover:transition-colors">
          <div className="p-6">
            <h2 className="text-xl font-bold text-muted-foreground mb-4">
              Recent Sprints
            </h2>
            <div className="space-y-3">
              {completedSprints.map((sprint) => (
                <div
                  key={sprint.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border hover:bg-accent transition-colors hover:scale-[1.01]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full ">
                        COMPLETED
                      </span>
                      <h3 className="font-semibold text-foreground">{sprint.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{sprint.goal}</p>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Velocity</p>
                      <p className="text-lg font-bold text-foreground">{sprint.velocity || "-"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Tasks</p>
                      <p className="text-lg font-bold text-foreground">{sprint.totalTasks || 0}</p>
                    </div>
                    <Link
                      href={`/lead/sprints/${sprint.id}`}
                      className="text-muted-foreground hover:text-foreground font-medium text-sm transition-all"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!activeSprint && !planningSprint && completedSprints.length === 0 && (
        <div className="border-border rounded-lg p-12 text-center hover:transition-colors">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 ">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Sprints Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Create your first sprint to start planning and tracking team work.
            </p>
            <Link
              href="/lead/sprints/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 hover:transition-colors font-medium"
            >
              Create First Sprint
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}



