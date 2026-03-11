"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiFlag,
  HiClock,
  HiCheckCircle,
  HiSparkles,
} from "react-icons/hi2";
import { ImSpinner2 } from "react-icons/im";
import {
  getMyPerformanceMetrics,
  getTaskCompletionStats,
  getTimeEstimationAccuracy,
  getMonthlyPerformanceTrend,
  getProjectPerformance,
} from "@/app/actions/employee-performance";

interface PerformanceMetric {
  id: string;
  metric: string;
  metricType?: string;
  value: number;
  period: string;
  recordedAt: Date;
  project: {
    id: string;
    name: string;
  } | null;
}

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  onTimeTasks: number;
  completionRate: number;
  onTimeRate: number;
}

interface TimeAccuracy {
  totalEstimated: number;
  totalActual: number;
  accuracy: number;
  variance: number;
}

interface CodeQuality {
  totalReviews: number;
  averageScore: number;
  issuesFound: number;
  issuesResolved: number;
}

interface ProductivityTrend {
  period: string;
  tasksCompleted: number;
  hoursLogged: number;
  averageTaskTime: number;
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [timeAccuracy, setTimeAccuracy] = useState<TimeAccuracy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);

    const [metricsRes, taskRes, timeRes] = await Promise.all([
      getMyPerformanceMetrics(),
      getTaskCompletionStats(),
      getTimeEstimationAccuracy(),
    ]);

    if (metricsRes.success && metricsRes.data) {
      setMetrics(metricsRes.data);
    }
    if (taskRes.success && taskRes.data) {
      setTaskStats(taskRes.data);
    }
    if (timeRes.success && timeRes.data) {
      setTimeAccuracy(timeRes.data);
    }

    setLoading(false);
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "text-muted-foreground";
    if (score >= 60) return "text-muted-foreground";
    return "text-muted-foreground";
  }

  function getScoreBadge(score: number) {
    if (score >= 80) return "bg-muted text-muted-foreground dark:bg-muted";
    if (score >= 60) return "bg-muted text-muted-foreground dark:bg-muted";
    return "bg-muted text-foreground dark:bg-destructive/20";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ImSpinner2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
      
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              My Performance
            </h1>
            <p className="text-foreground mt-1">
              Track your performance metrics and productivity
            </p>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {taskStats && (
            <>
              <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="font-medium text-muted-foreground">Task Completion</CardDescription>
                 
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-foreground">
                    {taskStats.completionRate}%
                  </div>
                <p className="text-xs text-primary/80 mt-1">
                  {taskStats.completedTasks} of {taskStats.totalTasks} tasks
                </p>
              </CardContent>
            </Card>

              <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="font-medium text-muted-foreground">On-Time Delivery</CardDescription>
              
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-foreground">
                    {taskStats.onTimeRate}%
                  </div>
                <p className="text-xs text-primary/80 mt-1">
                  {taskStats.onTimeTasks} tasks delivered on time
                </p>
              </CardContent>
            </Card>
          </>
        )}

          {timeAccuracy && (
            <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="font-medium text-muted-foreground">Estimation Accuracy</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-foreground">
                  {Math.round(timeAccuracy.accuracy)}%
                </div>
              <p className="text-xs text-primary/80 mt-1">
                {timeAccuracy.variance > 0 ? "+" : ""}
                {Math.round(timeAccuracy.variance)}% variance
              </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Time Estimation Details */}
        {timeAccuracy && (
          <Card className="border-border ">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Time Estimation Analysis</CardTitle>
            <CardDescription className="text-foreground">
              How accurately you estimate task durations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Total Estimated Hours
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {timeAccuracy.totalEstimated.toFixed(1)}h
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Total Actual Hours
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {timeAccuracy.totalActual.toFixed(1)}h
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                {timeAccuracy.variance > 0 ? (
                  <HiArrowTrendingUp className="h-5 w-5 text-foreground" />
                ) : (
                  <HiArrowTrendingDown className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm text-foreground">
                  {timeAccuracy.variance > 0
                    ? "Over-estimated by"
                    : "Under-estimated by"}{" "}
                  {Math.abs(Math.round(timeAccuracy.variance))}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

        {/* Recent Performance Metrics */}
        {metrics.length > 0 && (
          <Card className="border-border ">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Recent Metrics</CardTitle>
            <CardDescription>
              Detailed performance metrics by project
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="flex items-center justify-between p-3 border border-border hover:bg-accent rounded-lg/50 hover:hover:-translate-y-0.5 transition-colors"
                  >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {(metric.metricType || metric.metric).replace("_", " ")}
                      </p>
                      {metric.project && (
                        <Badge variant="outline" className="text-muted-foreground">{metric.project.name}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-primary/80 mt-1">
                      {new Date(metric.recordedAt).toLocaleDateString()} ·{" "}
                      {metric.period}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getScoreBadge(metric.value)}>
                      {metric.value}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

        {metrics.length === 0 && taskStats?.totalTasks === 0 && (
          <Card className="border-border ">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HiArrowTrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No performance data available yet. Complete tasks to see your
              metrics!
            </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
