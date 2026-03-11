"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface AnalyticsData {
  summary: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalProjects: number;
    completedProjects: number;
    ongoingProjects: number;
    totalAppraisals: number;
    averageRating: number;
  };
  usersByRole: Array<{ role: string; count: number }>;
  projectsByStatus: Array<{ status: string; count: number }>;
  ptoStats: Array<{ status: string; count: number }>;
  timesheetStats: Array<{ status: string; count: number; totalHours: number }>;
}

// Premium Animated Counter Component
function AnimatedCounter({
  value,
  duration = 1200,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(value * easeOut));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

// Animated Progress Bar with Premium Effects
function AnimatedProgressBar({
  percentage,
  color = "bg-foreground",
}: {
  percentage: number;
  color?: string;
}) {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercentage(percentage);
    }, 150);

    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full bg-muted rounded-full h-3 overflow-hidden ">
      <div
        className={`${color} h-3 rounded-full transition-all duration-1200 ease-out `}
        style={{
          width: `${displayPercentage}%`,
        }}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <p className="text-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  const engagementPercentage =
    analytics.summary.totalUsers > 0
      ? Math.round(
          (analytics.summary.activeUsers / analytics.summary.totalUsers) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Analytics Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Real-time organization performance metrics
        </p>
      </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Users Card */}
          <Card className="border border-border hover:bg-accent transition-colors">
            <div className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              </div>
              <div className="text-lg font-semibold text-foreground">
                <AnimatedCounter
                  value={analytics.summary.totalUsers}
                  duration={1200}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active: {analytics.summary.activeUsers}
              </p>
            </div>
          </Card>

          {/* Projects Card */}
          <Card className="border border-border hover:bg-accent transition-colors">
            <div className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
              </div>
              <div className="text-lg font-semibold text-foreground">
                <AnimatedCounter
                  value={analytics.summary.totalProjects}
                  duration={1200}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed: {analytics.summary.completedProjects}
              </p>
            </div>
          </Card>

          {/* Appraisals Card */}
          <Card className="border border-border hover:bg-accent transition-colors">
            <div className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Appraisals</p>
              </div>
              <div className="text-lg font-semibold text-foreground">
                <AnimatedCounter
                  value={analytics.summary.totalAppraisals}
                  duration={1200}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg Rating: {analytics.summary.averageRating.toFixed(1)}
              </p>
            </div>
          </Card>

          {/* Engagement Card */}
          <Card className="border border-border hover:bg-accent transition-colors">
            <div className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">Engagement</p>
              </div>
              <div className="text-lg font-semibold text-foreground">
                <AnimatedCounter
                  value={Math.round(
                    (analytics.summary.activeUsers /
                      analytics.summary.totalUsers) *
                      100
                    )}
                    duration={1200}
                  />
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-1">Active participation</p>
            </div>
          </Card>
        </div>

        {/* Users by Role & Projects by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Role */}
          <Card className="p-6 border border-border hover:bg-accent transition-colors h-full">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-lg font-semibold text-foreground">Users by Role</h3>
            </div>
            <div className="space-y-4">
              {analytics.usersByRole.map((item, idx) => (
                <div key={item.role} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {item.role}
                    </span>
                    <span className="text-sm font-black text-muted-foreground">
                      {item.count} users
                    </span>
                  </div>
                  <AnimatedProgressBar
                    percentage={
                      analytics.summary.totalUsers > 0
                        ? (item.count / analytics.summary.totalUsers) * 100
                        : 0
                    }
                    color="bg-foreground"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Projects by Status */}
          <Card className="p-6 border border-border hover:bg-accent transition-colors h-full">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Projects by Status</h3>
              </div>
              <div className="space-y-4">
                {analytics.projectsByStatus.map((item) => (
                  <div key={item.status}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {item.status}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">
                        {item.count} projects
                      </span>
                    </div>
                    <AnimatedProgressBar
                      percentage={
                        analytics.summary.totalProjects > 0
                          ? (item.count / analytics.summary.totalProjects) * 100
                          : 0
                      }
                      color="bg-foreground"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

        {/* PTO Statistics */}
        <div className="mb-12">
          <Card className="p-6 border border-border hover:bg-accent transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-lg font-semibold text-foreground">PTO Requests</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.ptoStats.map((item) => (
                <Card
                  key={item.status}
                  className="border border-border hover:bg-accent transition-colors"
                >
                  <div className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <p className="text-sm font-medium text-muted-foreground">{item.status}</p>
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      <AnimatedCounter value={item.count} duration={1200} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      requests
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Timesheet Statistics */}
        <div>
          <Card className="p-6 border border-border hover:bg-accent transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-lg font-semibold text-foreground">Timesheet Status</h3>
            </div>
            <div className="space-y-4">
              {analytics.timesheetStats.map((item) => (
                <Card
                  key={item.status}
                  className="border border-border hover:bg-accent transition-colors"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-bold text-foreground">{item.status}</p>
                        <p className="text-sm text-muted-foreground">
                          <span className="text-muted-foreground font-bold">
                            <AnimatedCounter value={item.count} duration={1200} />
                          </span>{" "}
                          submitted
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Hours</p>
                      <p className="text-lg font-semibold text-foreground">
                        {item.totalHours}h
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
    </div>
  );
}

