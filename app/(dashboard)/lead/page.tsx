import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getTeamTasks,
  getTeamSprints,
  getBlockedTasks,
  getTeamWorkload,
  getSprintVelocity,
} from "@/lib/lead-helpers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  HiPlus,
  HiRocketLaunch,
  HiChartBar,
} from "react-icons/hi2";

export default async function LeadOverviewPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          _count: {
            select: { users: true },
          },
        },
      },
    },
  });

  if (!user?.team) {
    return (
      <div className="flex items-center justify-center p-12">
        <Card className="max-w-md w-full border-border">
          <CardContent className="pt-10 pb-10 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">
              No Team Assigned
            </h2>
            <p className="text-sm text-muted-foreground">
              Please contact your administrator to assign you to a team.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const teamId = user.team.id;

  const [allTasks, activeSprints, blockedTasks, workload, velocityData] =
    await Promise.all([
      getTeamTasks(teamId),
      getTeamSprints(teamId, false),
      getBlockedTasks(teamId),
      getTeamWorkload(teamId),
      getSprintVelocity(teamId, 5),
    ]);

  const tasksByStatus = {
    todo: allTasks.filter((t) => t.status === "TODO").length,
    inProgress: allTasks.filter((t) => t.status === "IN_PROGRESS").length,
    inReview: allTasks.filter((t) => t.status === "IN_REVIEW").length,
    done: allTasks.filter((t) => t.status === "DONE").length,
    blocked: blockedTasks.length,
  };

  const currentSprint = activeSprints.find((s) => s.status === "ACTIVE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {user.team.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {user.team._count.users} team members &middot; {allTasks.length} total tasks
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">To Do</p>
            <p className="text-2xl font-bold text-foreground">
              {tasksByStatus.todo}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">In Progress</p>
            <p className="text-lg font-semibold text-foreground">
              {tasksByStatus.inProgress}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">In Review</p>
            <p className="text-2xl font-bold text-foreground">
              {tasksByStatus.inReview}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Done</p>
            <p className="text-2xl font-bold text-foreground">
              {tasksByStatus.done}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Blocked</p>
            <p className="text-2xl font-bold text-foreground">
              {tasksByStatus.blocked}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Sprint */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Current Sprint
            </CardTitle>
          </CardHeader>
          <CardContent>
              {currentSprint ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {currentSprint.name}
                      </h4>
                      {currentSprint.goal && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentSprint.goal}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/lead/sprints"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                  <div className="space-y-3 p-4 rounded-lg bg-muted">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-semibold text-foreground">
                          {currentSprint.progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-foreground h-2 rounded-full transition-colors"
                          style={{ width: `${currentSprint.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-background border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Tasks</p>
                        <p className="text-lg font-bold text-foreground">
                          {currentSprint.completedTasks}
                          <span className="text-sm text-muted-foreground">/{currentSprint.totalTasks}</span>
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-background border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Points</p>
                        <p className="text-lg font-bold text-foreground">
                          {currentSprint.completedPoints}
                          <span className="text-sm text-muted-foreground">/{currentSprint.totalPoints}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ends: {new Date(currentSprint.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No active sprint</p>
                  <Link
                    href="/lead/sprints"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
                  >
                    Plan Sprint
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sprint Velocity */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Sprint Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {velocityData.velocities.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      Average Velocity
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {velocityData.avgVelocity.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      points per sprint
                    </p>
                  </div>
                  <div className="space-y-2">
                    {velocityData.velocities.slice(0, 3).map((v, idx) => (
                      <div
                        key={v.sprintId}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {v.sprintName}
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {v.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No completed sprints yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Blocked Tasks */}
        {blockedTasks.length > 0 && (
          <Card className="border-destructive/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Blocked Tasks
                </CardTitle>
                <Link
                  href="/lead/team-board?filter=blocked"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {blockedTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <h4 className="font-medium text-foreground mb-1">
                      {task.title}
                    </h4>
                    {task.blockedReason && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {task.blockedReason}
                      </p>
                    )}
                    {task.project && (
                      <p className="text-xs text-muted-foreground">
                        {task.project.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Workload */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">
                Team Workload
              </CardTitle>
              <Link
                href="/lead/team-board"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Manage
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workload.slice(0, 5).map((member) => (
                <div
                  key={member.userId}
                  className="p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">
                      {member.userName}
                    </span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">
                        {member.taskCount} tasks
                      </span>
                      <span className="font-semibold text-foreground">
                        {member.storyPoints} pts
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-foreground h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (member.storyPoints /
                              Math.max(...workload.map((w) => w.storyPoints))) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                    {member.blocked > 0 && (
                      <span className="text-xs text-foreground font-medium whitespace-nowrap">
                        {member.blocked} blocked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/lead/team-board?action=create-task">
              <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <HiPlus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-foreground transition-colors">
                      Create Task
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add a new task to the board
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/lead/sprints?action=create-sprint">
              <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <HiRocketLaunch className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-foreground transition-colors">
                      Plan Sprint
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create and plan a new sprint
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/lead/metrics">
              <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <HiChartBar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-foreground transition-colors">
                      View Metrics
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track team technical metrics
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
  );
}

