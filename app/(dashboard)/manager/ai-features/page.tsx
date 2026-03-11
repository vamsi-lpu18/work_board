"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamPerformanceAnalytics } from "@/components/manager/TeamPerformanceAnalytics";
import { ResourceOptimization } from "@/components/manager/ResourceOptimization";
import { ApprovalAssistant } from "@/components/manager/ApprovalAssistant";
import { ReportGeneration } from "@/components/shared/ReportGeneration";

type AIFeature =
  | "team-performance"
  | "resource-optimization"
  | "approval-assistant"
  | "report-generation"
  | null;

export default function ManagerAIFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<AIFeature>(null);

  const features = [
    {
      id: "team-performance" as const,
      title: "Team Performance Analytics",
      description:
        "Analyze team productivity, identify trends, and detect burnout risks",
    },
    {
      id: "resource-optimization" as const,
      title: "Resource Optimization",
      description:
        "Optimize team allocation, identify conflicts, and predict hiring needs",
    },
    {
      id: "approval-assistant" as const,
      title: "Approval Assistant",
      description: "Get AI recommendations for timesheet and PTO approvals",
    },
    {
      id: "report-generation" as const,
      title: "Smart Report Generator",
      description: "Generate comprehensive project reports with insights",
    },
  ];

  const renderFeature = () => {
    switch (activeFeature) {
      case "team-performance":
        return <TeamPerformanceAnalytics />;
      case "resource-optimization":
        return <ResourceOptimization />;
      case "approval-assistant":
        return <ApprovalAssistant />;
      case "report-generation":
        return <ReportGeneration />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          AI Features
        </h1>
        <p className="text-sm text-muted-foreground">
          AI-powered tools to enhance team management and decision-making
        </p>
      </div>

      {!activeFeature ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-lg border border-border hover:bg-accent transition-colors p-5 cursor-pointer"
              onClick={() => setActiveFeature(feature.id)}
            >
              <h3 className="font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            onClick={() => setActiveFeature(null)}
            variant="outline"
            className="border-border"
          >
            ← Back to Features
          </Button>
          <div className="rounded-lg border border-border p-6">
            {renderFeature()}
          </div>
        </div>
      )}
    </div>
  );
}

