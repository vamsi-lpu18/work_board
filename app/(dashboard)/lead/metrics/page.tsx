import { requireLead } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getTeamTechnicalMetrics, getTaskMetrics } from "@/lib/lead-helpers";
import { subDays } from "date-fns";

export default async function LeadMetricsPage() {
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
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Team Assigned
            </h2>
            <p className="text-muted-foreground">
              Please contact your administrator to assign you to a team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const weekAgo = subDays(new Date(), 7);
  const monthAgo = subDays(new Date(), 30);

  const [weeklyMetricsRaw, monthlyMetricsRaw, taskMetrics] = await Promise.all([
    getTeamTechnicalMetrics(user.team.id, weekAgo, new Date()),
    getTeamTechnicalMetrics(user.team.id, monthAgo, new Date()),
    getTaskMetrics(user.team.id),
  ]);

  // Flatten grouped metrics to array format
  const weeklyMetrics = Object.values(weeklyMetricsRaw).flat();
  const monthlyMetrics = Object.values(monthlyMetricsRaw).flat();

  const getMetricValue = (metrics: any[], type: string) => {
    if (!metrics || !Array.isArray(metrics)) return "-";
    const metric = metrics.find((m) => m.metricType === type);
    return metric
      ? `${metric.value}${
          metric.unit === "hours" ? "h" : metric.unit === "minutes" ? "m" : ""
        }`
      : "-";
  };

  const getMetricNumber = (metrics: any[], type: string) => {
    if (!metrics || !Array.isArray(metrics)) return 0;
    const metric = metrics.find((m) => m.metricType === type);
    return metric?.value || 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-full w-fit mb-3">
          <span className="text-sm font-semibold">Team Metrics</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Technical Metrics</h1>
        <p className="text-muted-foreground mt-2">
          Monitor code quality and team performance
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">PR Merge Time</p>
            <span className="text-xs text-muted-foreground font-medium">Weekly Avg</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {getMetricValue(weeklyMetrics, "pr_merge_time")}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Target: &lt;24h</p>
        </div>

        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Code Review Time</p>
            <span className="text-xs text-muted-foreground font-medium">Weekly Avg</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {getMetricValue(weeklyMetrics, "code_review_time")}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Target: &lt;4h</p>
        </div>

        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Build Time</p>
            <span className="text-xs text-muted-foreground font-medium">Latest</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {getMetricValue(weeklyMetrics, "build_time")}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Target: &lt;5m</p>
        </div>

        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Deployment Freq</p>
            <span className="text-xs text-muted-foreground font-medium">This Week</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            {getMetricNumber(weeklyMetrics, "deployment_frequency")}
          </p>
          <p className="text-xs text-muted-foreground mt-2">deploys/week</p>
        </div>
      </div>

      {/* Task Cycle Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Average Cycle Time
          </p>
          <p className="text-lg font-semibold text-foreground">
            {taskMetrics.avgCycleTime
              ? `${taskMetrics.avgCycleTime.toFixed(1)}d`
              : "-"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Time from start to completion
          </p>
        </div>

        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Average Lead Time
          </p>
          <p className="text-lg font-semibold text-foreground">
            {taskMetrics.avgLeadTime
              ? `${taskMetrics.avgLeadTime.toFixed(1)}d`
              : "-"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Time from creation to completion
          </p>
        </div>

        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Tasks Completed
          </p>
          <p className="text-lg font-semibold text-foreground">
            {taskMetrics.completedTasks || 0}
          </p>
          <p className="text-xs text-muted-foreground mt-2">This sprint</p>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="border border-border rounded-lg hover:bg-accent transition-colors">
        <div className="p-6">
          <h2 className="text-xl font-bold text-muted-foreground mb-4">
            Quality Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted rounded-lg p-4 border border-border hover:bg-accent transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Bug Count</p>
                <span className="text-xs text-muted-foreground font-medium">
                  This Sprint
                </span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {getMetricNumber(weeklyMetrics, "bug_count")}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                Target: &lt;10 per sprint
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border hover:bg-accent transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Test Coverage
                </p>
                <span className="text-xs text-muted-foreground font-medium">
                  Current
                </span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {getMetricNumber(weeklyMetrics, "test_coverage")}%
              </p>
              <div className="mt-2 text-xs text-muted-foreground">Target: &gt;80%</div>
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border hover:bg-accent transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  API Response Time
                </p>
                <span className="text-xs text-muted-foreground font-medium">
                  Avg P95
                </span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {getMetricValue(weeklyMetrics, "api_response_time")}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">Target: &lt;200ms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis Placeholder */}
      <div className="border border-border rounded-lg hover:bg-accent transition-colors">
        <div className="p-6">
          <h2 className="text-xl font-bold text-muted-foreground mb-4">30-Day Trend</h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-foreground/30 rounded-lg bg-muted">
            <div className="text-center text-muted-foreground">
              <svg
                className="w-12 h-12 mx-auto mb-2 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-sm font-medium">Trend Chart Visualization</p>
              <p className="text-xs mt-1">
                Chart library integration coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="border border-border rounded-lg hover:bg-accent transition-colors">
        <div className="p-6">
          <h2 className="text-xl font-bold text-muted-foreground mb-4">
            Monthly Summary
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:bg-accent transition-colors">
              <span className="text-sm font-medium text-muted-foreground">
                Total PRs Merged
              </span>
              <span className="text-lg font-bold text-muted-foreground">
                {getMetricNumber(monthlyMetrics, "pr_merged_count") || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:bg-accent transition-colors">
              <span className="text-sm font-medium text-muted-foreground">
                Total Deployments
              </span>
              <span className="text-lg font-bold text-muted-foreground">
                {getMetricNumber(monthlyMetrics, "deployment_frequency") || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:bg-accent transition-colors">
              <span className="text-sm font-medium text-muted-foreground">
                Total Bugs Fixed
              </span>
              <span className="text-lg font-bold text-muted-foreground">
                {getMetricNumber(monthlyMetrics, "bugs_fixed") || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


