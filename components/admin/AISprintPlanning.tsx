"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function AISprintPlanning() {
  const [sprintDuration, setSprintDuration] = useState("14");
  const [teamMembers, setTeamMembers] = useState<
    Array<{ name: string; capacity: number }>
  >([{ name: "", capacity: 40 }]);
  const [tasks, setTasks] = useState<
    Array<{ name: string; estimatedHours: number; priority: number }>
  >([{ name: "", estimatedHours: 0, priority: 1 }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", capacity: 40 }]);
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      { name: "", estimatedHours: 0, priority: tasks.length + 1 },
    ]);
  };

  const handlePlan = async () => {
    const validTeamMembers = teamMembers.filter((m) => m.name.trim());
    const validTasks = tasks.filter(
      (t) => t.name.trim() && t.estimatedHours > 0
    );

    if (validTeamMembers.length === 0 || validTasks.length === 0) {
      alert("Please add at least one team member and one task");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/sprint-planning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sprintDuration: parseInt(sprintDuration),
          teamMembers: validTeamMembers,
          tasks: validTasks,
        }),
      });

      if (!response.ok) throw new Error("Failed to plan sprint");

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      alert(error.message || "Failed to plan sprint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Smart Sprint Planning</h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Sprint Duration (days)
        </label>
        <input
          type="number"
          value={sprintDuration}
          onChange={(e) => setSprintDuration(e.target.value)}
          className="w-full md:w-48 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          min="1"
          max="30"
          disabled={loading}
        />
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold flex items-center gap-2">
            Team Members
          </h5>
          <Button
            size="sm"
            onClick={addTeamMember}
            disabled={loading}
            variant="outline"
          >
            + Add Member
          </Button>
        </div>
        <div className="space-y-2">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={member.name}
                onChange={(e) => {
                  const newMembers = [...teamMembers];
                  newMembers[idx].name = e.target.value;
                  setTeamMembers(newMembers);
                }}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Member name"
                disabled={loading}
              />
              <input
                type="number"
                value={member.capacity}
                onChange={(e) => {
                  const newMembers = [...teamMembers];
                  newMembers[idx].capacity = parseInt(e.target.value) || 0;
                  setTeamMembers(newMembers);
                }}
                className="w-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Hours"
                min="0"
                disabled={loading}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold">Tasks</h5>
          <Button
            size="sm"
            onClick={addTask}
            disabled={loading}
            variant="outline"
          >
            + Add Task
          </Button>
        </div>
        <div className="space-y-2">
          {tasks.map((task, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={task.name}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[idx].name = e.target.value;
                  setTasks(newTasks);
                }}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Task name"
                disabled={loading}
              />
              <input
                type="number"
                value={task.estimatedHours}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[idx].estimatedHours = parseInt(e.target.value) || 0;
                  setTasks(newTasks);
                }}
                className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Hrs"
                min="0"
                disabled={loading}
              />
              <input
                type="number"
                value={task.priority}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[idx].priority = parseInt(e.target.value) || 1;
                  setTasks(newTasks);
                }}
                className="w-16 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="P"
                min="1"
                disabled={loading}
              />
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={handlePlan} disabled={loading}>
        {loading && <Spinner  className="mr-2 h-4 w-4" />}
        Generate Sprint Plan
      </Button>

      {result && (
        <div className="space-y-4 mt-6">
          <Card className="p-4 bg-muted border-primary/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span className="text-lg"></span>
              Sprint Goal
            </h4>
            <p className="text-sm p-3 rounded">{result.sprintGoal}</p>
          </Card>

          <Card className="p-4">
            <h5 className="font-semibold mb-3">Capacity Analysis</h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {result.capacity?.totalHours}h
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Allocated</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {result.capacity?.allocatedHours}h
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Buffer</p>
                <p className="text-2xl font-bold text-orange-600">
                  {result.capacity?.bufferHours}h
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h5 className="font-semibold mb-3">Task Allocation</h5>
            <div className="space-y-2">
              {result.taskAllocation?.map((allocation: any, idx: number) => (
                <div key={idx} className="bg-muted p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{allocation.taskName}</p>
                      <p className="text-sm text-muted-foreground">
                        Assignee: {allocation.assignee}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {allocation.estimatedHours}h
                      </p>
                      <p className="text-xs text-muted-foreground">
                        P{allocation.priority}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {result.risks && result.risks.length > 0 && (
            <Card className="p-4 bg-destructive/10">
              <h5 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                <span>⚠️</span>
                Identified Risks
              </h5>
              <ul className="space-y-1">
                {result.risks.map((risk: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-destructive mt-1">!</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {result.recommendations && result.recommendations.length > 0 && (
            <Card className="p-4">
              <h5 className="font-semibold mb-2">Recommendations</h5>
              <ul className="space-y-1">
                {result.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
