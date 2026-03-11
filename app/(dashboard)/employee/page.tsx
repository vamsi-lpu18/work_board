"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiCalendar,
  HiFlag,
  HiDocumentText,
  HiArrowTopRightOnSquare,
  HiChartBarSquare,
  HiListBullet,
} from "react-icons/hi2";
import Link from "next/link";

export default function EmployeeDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          My Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your tasks, performance, and goals
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <HiListBullet className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
            </div>
            <p className="text-2xl font-bold text-foreground">12</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <HiClock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Due This Week</p>
            </div>
            <p className="text-2xl font-bold text-foreground">5</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <HiExclamationCircle className="h-4 w-4 text-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
            </div>
            <p className="text-2xl font-bold text-foreground">2</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:bg-accent transition-colors">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted">
                <HiCheckCircle className="h-4 w-4 text-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
            </div>
            <p className="text-2xl font-bold text-foreground">45</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/employee/my-work">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <HiCheckCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <HiArrowTopRightOnSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  My Tasks
                </h3>
                <p className="text-xs text-muted-foreground">
                  View and manage your assigned tasks
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/employee/timesheet">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <HiClock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <HiArrowTopRightOnSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Timesheet
                </h3>
                <p className="text-xs text-muted-foreground">
                  Log and track your hours
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/employee/performance">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <HiChartBarSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <HiArrowTopRightOnSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Performance
                </h3>
                <p className="text-xs text-muted-foreground">
                  View your metrics and progress
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/employee/goals">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <HiFlag className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <HiArrowTopRightOnSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  My Goals
                </h3>
                <p className="text-xs text-muted-foreground">
                  Track your goals and objectives
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/employee/calendar">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <HiCalendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <HiArrowTopRightOnSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Calendar
                </h3>
                <p className="text-xs text-muted-foreground">
                  View deadlines and milestones
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/employee/appraisal">
            <Card className="group border-border hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <HiDocumentText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <HiArrowTopRightOnSquare className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                  Appraisals
                </h3>
                <p className="text-xs text-muted-foreground">
                  Self-appraisal and feedback
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Today's Tasks */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            {"Today's Tasks"}
          </CardTitle>
          <CardDescription>
            Your priority tasks for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Update user dashboard UI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Project Alpha &middot; Due today
                  </p>
                </div>
              </div>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted border-0 text-xs">
                In Progress
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Code review for PR #123
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Project Beta &middot; Due today
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">To Do</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Fix critical bug in payment module
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Project Gamma &middot; Overdue
                  </p>
                </div>
              </div>
              <Badge variant="destructive" className="text-xs">Overdue</Badge>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <Link
              href="/employee/my-work"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all tasks
              <HiArrowTopRightOnSquare className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

