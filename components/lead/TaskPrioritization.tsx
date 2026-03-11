"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Trash2, AlertTriangle } from "lucide-react";

interface Task {
  name: string;
  urgency: string;
  impact: string;
  effort: string;
  dependencies: string;
}

interface FormData {
  tasks: Task[];
  teamCapacity: string;
  sprintGoals: string;
}

interface PrioritizationResult {
  prioritizedTasks: Array<{
    name: string;
    priority: number;
    reasoning: string;
    recommendedOrder: number;
  }>;
  dependencies: string[];
  risks: Array<{
    task: string;
    risk: string;
    severity: "high" | "medium" | "low";
  }>;
  sprintRecommendation: string;
}

export function TaskPrioritization() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrioritizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    tasks: [
      { name: "", urgency: "", impact: "", effort: "", dependencies: "" },
    ],
    teamCapacity: "",
    sprintGoals: "",
  });

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        { name: "", urgency: "", impact: "", effort: "", dependencies: "" },
      ],
    });
  };

  const removeTask = (index: number) => {
    const newTasks = formData.tasks.filter((_, i) => i !== index);
    setFormData({ ...formData, tasks: newTasks });
  };

  const updateTask = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...formData.tasks];
    newTasks[index][field] = value;
    setFormData({ ...formData, tasks: newTasks });
  };

  const handlePrioritize = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/ai/lead/task-prioritization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to prioritize tasks");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Task Prioritization</h2>
        <p className="text-muted-foreground mb-6">
          AI-powered task prioritization based on urgency, impact, and
          dependencies
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="teamCapacity">Team Capacity (hours/week)</Label>
            <Input
              id="teamCapacity"
              type="number"
              value={formData.teamCapacity}
              onChange={(e) =>
                setFormData({ ...formData, teamCapacity: e.target.value })
              }
              placeholder="e.g., 160"
            />
          </div>
          <div>
            <Label htmlFor="sprintGoals">Sprint Goals</Label>
            <Input
              id="sprintGoals"
              value={formData.sprintGoals}
              onChange={(e) =>
                setFormData({ ...formData, sprintGoals: e.target.value })
              }
              placeholder="e.g., Complete user dashboard"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-lg">Tasks</Label>
            <Button onClick={addTask} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {formData.tasks.map((task, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-foreground">
                  Task {index + 1}
                </span>
                {formData.tasks.length > 1 && (
                  <Button
                    onClick={() => removeTask(index)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Task Name</Label>
                  <Input
                    value={task.name}
                    onChange={(e) => updateTask(index, "name", e.target.value)}
                    placeholder="Task description"
                  />
                </div>
                <div>
                  <Label>Urgency (1-10)</Label>
                  <Input
                    type="number"
                    value={task.urgency}
                    onChange={(e) =>
                      updateTask(index, "urgency", e.target.value)
                    }
                    placeholder="1-10"
                  />
                </div>
                <div>
                  <Label>Impact (1-10)</Label>
                  <Input
                    type="number"
                    value={task.impact}
                    onChange={(e) =>
                      updateTask(index, "impact", e.target.value)
                    }
                    placeholder="1-10"
                  />
                </div>
                <div>
                  <Label>Effort (hours)</Label>
                  <Input
                    type="number"
                    value={task.effort}
                    onChange={(e) =>
                      updateTask(index, "effort", e.target.value)
                    }
                    placeholder="e.g., 8"
                  />
                </div>
                <div>
                  <Label>Dependencies</Label>
                  <Input
                    value={task.dependencies}
                    onChange={(e) =>
                      updateTask(index, "dependencies", e.target.value)
                    }
                    placeholder="e.g., Task 1, Task 3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handlePrioritize}
          disabled={loading || formData.tasks.some((t) => !t.name)}
          className="w-full"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Prioritize Tasks
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 border-t pt-6">
          <h3 className="text-xl font-bold">Prioritization Results</h3>

          {/* Prioritized Tasks */}
          <div>
            <h4 className="font-semibold mb-3">Recommended Task Order</h4>
            <div className="space-y-3">
              {result.prioritizedTasks
                .sort((a, b) => a.recommendedOrder - b.recommendedOrder)
                .map((task, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="text-lg">
                          #{task.recommendedOrder}
                        </Badge>
                        <p className="font-medium">{task.name}</p>
                      </div>
                      <Badge
                        variant={
                          task.priority >= 80
                            ? "destructive"
                            : task.priority >= 60
                            ? "secondary"
                            : "outline"
                        }
                      >
                        Priority: {task.priority}/100
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {task.reasoning}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Dependencies */}
          {result.dependencies.length > 0 && (
            <div className="p-4 bg-muted border border-primary/30 rounded-lg">
              <h4 className="font-semibold mb-2">Key Dependencies</h4>
              <ul className="space-y-1">
                {result.dependencies.map((dep, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {dep}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {result.risks.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Identified Risks
              </h4>
              <div className="space-y-2">
                {result.risks.map((risk, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      risk.severity === "high"
                        ? "bg-destructive/10 border-destructive/30"
                        : risk.severity === "medium"
                        ? "bg-destructive/5 border-destructive/20"
                        : "bg-muted border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{risk.task}</p>
                        <p className="text-sm text-muted-foreground mt-1">{risk.risk}</p>
                      </div>
                      <Badge
                        variant={
                          risk.severity === "high" ? "destructive" : "secondary"
                        }
                      >
                        {risk.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sprint Recommendation */}
          <div className="p-5 bg-muted border border-primary/30 rounded-lg">
            <h4 className="font-semibold mb-2">Sprint Recommendation</h4>
            <p className="text-foreground">{result.sprintRecommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
