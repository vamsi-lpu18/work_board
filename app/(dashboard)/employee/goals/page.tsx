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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiFlag,
  HiArrowTrendingUp,
  HiSparkles,
} from "react-icons/hi2";
import { ImSpinner2 } from "react-icons/im";
import {
  getMyGoals,
  createGoal,
  updateGoal,
  updateGoalProgress,
  deleteGoal,
  getGoalStats,
} from "@/app/actions/employee-goals";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  targetDate: Date | null;
  progress: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GoalStats {
  total: number;
  active: number;
  completed: number;
  avgProgress: number;
}

export default function MyGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<GoalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
    progress: 0,
  });

  useEffect(() => {
    loadGoals();
    loadStats();
  }, []);

  async function loadGoals() {
    setLoading(true);
    const result = await getMyGoals();
    if (result.success && result.data) {
      setGoals(result.data);
    }
    setLoading(false);
  }

  async function loadStats() {
    const result = await getGoalStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
  }

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a goal title");
      return;
    }

    const result = await createGoal({
      title: formData.title,
      description: formData.description || undefined,
      targetDate: formData.targetDate || undefined,
    });

    if (result.success) {
      alert("Goal created successfully!");
      setFormData({ title: "", description: "", targetDate: "", progress: 0 });
      setShowCreateDialog(false);
      loadGoals();
      loadStats();
    } else {
      alert(result.error || "Failed to create goal");
    }
  }

  async function handleUpdateGoal(e: React.FormEvent) {
    e.preventDefault();

    if (!editingGoal) return;

    const result = await updateGoal(editingGoal.id, {
      title: formData.title,
      description: formData.description || undefined,
      targetDate: formData.targetDate || undefined,
      progress: formData.progress,
    });

    if (result.success) {
      alert("Goal updated successfully!");
      setEditingGoal(null);
      setFormData({ title: "", description: "", targetDate: "", progress: 0 });
      loadGoals();
      loadStats();
    } else {
      alert(result.error || "Failed to update goal");
    }
  }

  async function handleUpdateProgress(goalId: string, progress: number) {
    const result = await updateGoalProgress(goalId, progress);
    if (result.success) {
      loadGoals();
      loadStats();
    } else {
      alert(result.error || "Failed to update progress");
    }
  }

  async function handleDeleteGoal(goalId: string) {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    const result = await deleteGoal(goalId);
    if (result.success) {
      alert("Goal deleted successfully!");
      loadGoals();
      loadStats();
    } else {
      alert(result.error || "Failed to delete goal");
    }
  }

  function startEditGoal(goal: Goal) {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
      targetDate: goal.targetDate
        ? new Date(goal.targetDate).toISOString().split("T")[0]
        : "",
      progress: goal.progress,
    });
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-muted text-muted-foreground dark:bg-muted";
      case "completed":
        return "bg-muted text-muted-foreground dark:bg-muted";
      case "on_hold":
        return "bg-muted text-muted-foreground dark:bg-muted";
      case "cancelled":
        return "bg-muted text-foreground dark:bg-destructive/20";
      default:
        return "bg-muted text-foreground";
    }
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
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">My Goals</h1>
              <p className="text-foreground mt-1">
                Track and manage your professional goals
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-foreground hover:bg-foreground/90 hover:transition-colors"
          >
            <HiPlus className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="font-medium text-muted-foreground">
                  Total Goals
                </CardDescription>
                <CardTitle className="text-3xl text-foreground">
                  {stats.total}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="font-medium text-muted-foreground">
                  Active Goals
                </CardDescription>
                <CardTitle className="text-3xl text-foreground">
                  {stats.active}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="font-medium text-muted-foreground">
                  Completed
                </CardDescription>
                <CardTitle className="text-3xl text-foreground">
                  {stats.completed}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors">
              <CardHeader className="pb-2">
                <CardDescription className="font-medium text-muted-foreground">
                  Average Progress
                </CardDescription>
                <CardTitle className="text-3xl text-foreground">
                  {stats.avgProgress}%
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Create/Edit Goal Dialog */}
        {(showCreateDialog || editingGoal) && (
          <Card className="border-2  border-foreground/50 bg-muted ">
            <CardHeader>
              <CardTitle>
                {editingGoal ? "Edit Goal" : "Create New Goal"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title">Goal Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Learn TypeScript"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    placeholder="Describe your goal..."
                  />
                </div>

                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) =>
                      setFormData({ ...formData, targetDate: e.target.value })
                    }
                  />
                </div>

                {editingGoal && (
                  <div>
                    <Label htmlFor="progress">
                      Progress: {formData.progress}%
                    </Label>
                    <input
                      id="progress"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          progress: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingGoal ? "Update Goal" : "Create Goal"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateDialog(false);
                      setEditingGoal(null);
                      setFormData({
                        title: "",
                        description: "",
                        targetDate: "",
                        progress: 0,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <Card className="border-border ">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <HiFlag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No goals yet. Create your first goal to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card
                key={goal.id}
                className="border-border hover:bg-accent cursor-pointer hover:hover:-translate-y-1 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{goal.title}</CardTitle>
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {goal.description && (
                        <CardDescription className="mt-2">
                          {goal.description}
                        </CardDescription>
                      )}
                      {goal.targetDate && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Target:{" "}
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditGoal(goal)}
                      >
                        <HiPencilSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <HiTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Progress</span>
                      <span className="font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-foreground h-2 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateProgress(
                            goal.id,
                            Math.max(0, goal.progress - 10)
                          )
                        }
                        disabled={goal.progress === 0}
                      >
                        -10%
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateProgress(
                            goal.id,
                            Math.min(100, goal.progress + 10)
                          )
                        }
                        disabled={goal.progress === 100}
                      >
                        +10%
                      </Button>
                      {goal.progress === 100 && goal.status === "active" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            updateGoal(goal.id, { status: "completed" }).then(
                              () => {
                                loadGoals();
                                loadStats();
                              }
                            )
                          }
                        >
                          <HiArrowTrendingUp className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
