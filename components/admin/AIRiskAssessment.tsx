"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { HiShieldCheck, HiExclamationTriangle } from "react-icons/hi2";
export function AIRiskAssessment() {
  const [projectName, setProjectName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState("");
  const [totalTasks, setTotalTasks] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAssess = async () => {
    if (!projectName.trim() || !teamSize || !tasksCompleted || !totalTasks) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/risk-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          deadline: deadline || undefined,
          teamSize: parseInt(teamSize),
          tasksCompleted: parseInt(tasksCompleted),
          totalTasks: parseInt(totalTasks),
        }),
      });

      if (!response.ok) throw new Error("Failed to assess risk");

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      alert(error.message || "Failed to assess risk");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-destructive bg-destructive/10";
      case "high":
        return "text-accent-foreground bg-accent/10";
      case "medium":
        return "text-muted-foreground bg-muted";
      case "low":
        return "text-muted-foreground bg-muted";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <HiShieldCheck className="h-6 w-6 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Smart Risk Assessment</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Project Name *
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project name"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Team Size *</label>
          <input
            type="number"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Number of team members"
            min="1"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tasks Progress *
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Completed"
              min="0"
              disabled={loading}
            />
            <span className="self-center">/</span>
            <input
              type="number"
              value={totalTasks}
              onChange={(e) => setTotalTasks(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Total"
              min="1"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleAssess}
        disabled={loading}
        className="w-full md:w-auto"
      >
        {loading && <Spinner  className="mr-2 h-4 w-4" />}
        Assess Risk
      </Button>

      {result && (
        <div className="space-y-4 mt-6">
          <Card className="p-4 bg-muted">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <HiExclamationTriangle className="h-5 w-5 text-orange-600" />
              Risk Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded">
                <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {result.riskScore}/10
                </p>
              </div>
              <div className="bg-card p-4 rounded">
                <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                <span
                  className={`inline-block px-3 py-1 rounded font-semibold ${getRiskColor(
                    result.riskLevel
                  )}`}
                >
                  {result.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </Card>

          {result.bottlenecks && result.bottlenecks.length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Identified Bottlenecks</h4>
              <div className="space-y-3">
                {result.bottlenecks.map((bottleneck: any, idx: number) => (
                  <div
                    key={idx}
                    className="border-l-4 border-orange-400 bg-orange-50 p-3 rounded"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{bottleneck.area}</h5>
                      <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded">
                        {bottleneck.severity}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      <strong>Impact:</strong> {bottleneck.impact}
                    </p>
                    <p className="text-sm text-foreground">
                      <strong>Mitigation:</strong> {bottleneck.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {result.resourceSuggestions &&
            result.resourceSuggestions.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  Resource Allocation Suggestions
                </h4>
                <div className="space-y-3">
                  {result.resourceSuggestions.map(
                    (suggestion: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-muted p-3 rounded border border-primary/20"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-foreground">
                            {suggestion.role}
                          </h5>
                          <span className="text-sm font-semibold text-muted-foreground">
                            {suggestion.hours}h
                          </span>
                        </div>
                        <p className="text-sm text-foreground">
                          {suggestion.reasoning}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}
        </div>
      )}
    </div>
  );
}
