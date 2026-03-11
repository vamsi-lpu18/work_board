"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ListTodo,
  MessageSquare,
  BarChart,
  FileText,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { TaskPrioritization } from "@/components/lead/TaskPrioritization";
import { StandupSummary } from "@/components/lead/StandupSummary";
import { SprintRetrospective } from "@/components/lead/SprintRetrospective";
import { ReportGeneration } from "@/components/shared/ReportGeneration";

type AIFeature =
  | "task-prioritization"
  | "standup-summary"
  | "retrospective"
  | "report-generation"
  | null;

export default function LeadAIFeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<AIFeature>(null);

  const features = [
    {
      id: "task-prioritization" as const,
      title: "Smart Task Prioritization",
      description:
        "Auto-prioritize backlog, suggest assignments, and identify dependencies",
      icon: ListTodo,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
    },
    {
      id: "standup-summary" as const,
      title: "Daily Standup Summary",
      description:
        "Analyze team updates, identify blockers, and generate action items",
      icon: MessageSquare,
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50",
    },
    {
      id: "retrospective" as const,
      title: "Sprint Retrospective Assistant",
      description:
        "Analyze sprint metrics and generate improvement suggestions",
      icon: BarChart,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
    },
    {
      id: "report-generation" as const,
      title: "Smart Report Generator",
      description: "Generate comprehensive project reports with insights",
      icon: FileText,
      gradient: "from-orange-500 to-rose-500",
      bgGradient: "from-orange-50 to-rose-50",
    },
  ];

  const renderFeature = () => {
    switch (activeFeature) {
      case "task-prioritization":
        return <TaskPrioritization />;
      case "standup-summary":
        return <StandupSummary />;
      case "retrospective":
        return <SprintRetrospective />;
      case "report-generation":
        return <ReportGeneration />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Features</h1>
        <p className="text-sm text-muted-foreground">
          AI-powered tools to enhance team leadership and sprint management
        </p>
      </div>

      {!activeFeature ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="p-5 cursor-pointer border border-border hover:bg-accent transition-colors"
              onClick={() => setActiveFeature(feature.id)}
            >
              <h3 className="font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Features
          </Button>
          <Card className="p-6 border border-border">
            {renderFeature()}
          </Card>
        </div>
      )}
    </div>
  );
}
