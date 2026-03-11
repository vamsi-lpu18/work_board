"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AITaskAssistant } from "@/components/admin/AITaskAssistant";
import { AIRiskAssessment } from "@/components/admin/AIRiskAssessment";
import { AIPerformanceReview } from "@/components/admin/AIPerformanceReview";
import { AIMeetingSummary } from "@/components/admin/AIMeetingSummary";
import { AISprintPlanning } from "@/components/admin/AISprintPlanning";

type AIFeature =
  | "task-assistant"
  | "risk-assessment"
  | "performance-review"
  | "meeting-summary"
  | "sprint-planning"
  | null;

export default function AIFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<AIFeature>(null);

  const features = [
    {
      id: "task-assistant" as const,
      title: "AI Task Assistant",
      description:
        "Break down tasks, estimate timelines, and generate test cases",
      gradient: "from-primary to-primary",
    },
    {
      id: "risk-assessment" as const,
      title: "Smart Risk Assessment",
      description:
        "Identify bottlenecks and get resource allocation suggestions",
      gradient: "from-primary to-primary",
    },
    {
      id: "performance-review" as const,
      title: "Performance Review Assistant",
      description:
        "Generate comprehensive performance reviews for team members",
      gradient: "from-primary to-primary",
    },
    {
      id: "meeting-summary" as const,
      title: "Meeting Summary Generator",
      description: "Transform meeting transcripts into actionable summaries",
      gradient: "from-primary to-primary",
    },
    {
      id: "sprint-planning" as const,
      title: "Smart Sprint Planning",
      description: "AI-powered sprint planning with capacity analysis",
      gradient: "from-primary to-primary",
    },
  ];

  const renderFeature = () => {
    switch (activeFeature) {
      case "task-assistant":
        return <AITaskAssistant />;
      case "risk-assessment":
        return <AIRiskAssessment />;
      case "performance-review":
        return <AIPerformanceReview />;
      case "meeting-summary":
        return <AIMeetingSummary />;
      case "sprint-planning":
        return <AISprintPlanning />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          AI-Powered Features
        </h1>
        <p className="text-sm text-muted-foreground">
          Leverage artificial intelligence to enhance project management efficiency
        </p>
      </div>

        {!activeFeature ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="p-5 cursor-pointer border border-border hover:bg-accent transition-colors"
                onClick={() => setActiveFeature(feature.id)}
              >
                <h3 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
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
            <Card className="p-6 border border-border">
              {renderFeature()}
            </Card>
          </div>
        )}
    </div>
  );
}
