import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AppraisalsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Header with gradient badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">
                Appraisal Management
              </h2>
              <p className="text-muted-foreground mt-1">
                Create and manage performance appraisal cycles
              </p>
            </div>
          </div>
          <Button className="bg-foreground hover:bg-foreground/90 text-background hover:transition-colors">
            + New Appraisal Cycle
          </Button>
        </div>

        {/* Appraisal Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-border hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cycles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-foreground">0</div>
              <p className="text-xs text-muted-foreground">currently running</p>
            </CardContent>
          </Card>

          <Card className="border border-border hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-foreground">0</div>
              <p className="text-xs text-muted-foreground">awaiting completion</p>
            </CardContent>
          </Card>

          <Card className="border border-border hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-foreground">0%</div>
              <p className="text-xs text-muted-foreground">reviews completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Appraisal Cycles */}
        <Card className="border border-border hover:bg-accent transition-colors">
          <CardHeader>
            <CardTitle className="text-2xl">Appraisal Cycles</CardTitle>
            <CardDescription className="text-base">
              All performance review cycles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No appraisal cycles yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first appraisal cycle to start tracking performance
              </p>
              <Button className="bg-foreground hover:bg-foreground/90 text-background">
                + Create Appraisal Cycle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Appraisals */}
        <Card className="border border-border hover:bg-accent transition-colors">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Appraisals</CardTitle>
            <CardDescription className="text-base">
              Latest completed performance reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No completed appraisals yet
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
