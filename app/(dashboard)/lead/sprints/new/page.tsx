"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { createSprint } from "@/app/actions/lead-tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const sprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required"),
  goal: z.string().min(1, "Sprint goal is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  capacityHours: z.coerce.number().min(1, "Capacity must be at least 1 hour"),
});

type SprintFormData = z.infer<typeof sprintSchema>;

export default function NewSprintPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      capacityHours: 320, // Default 2-week sprint with 4 people at 40h/week
    },
  });

  const onSubmit = (data: SprintFormData) => {
    startTransition(async () => {
      const result = await createSprint({
        name: data.name,
        goal: data.goal,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        capacityHours: data.capacityHours,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Sprint created successfully");
      router.push("/lead/sprints");
    });
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/lead/sprints"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Back to Sprints
            </Link>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-full w-fit mb-3">
            <span className="text-sm font-semibold">New Sprint</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Create New Sprint</h1>
          <p className="text-muted-foreground mt-2">Set up a new sprint for your team</p>
        </div>

        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Sprint Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Sprint Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Sprint 15 - Q1 2025"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-muted-foreground">{errors.name.message}</p>
              )}
            </div>

            {/* Sprint Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal">Sprint Goal *</Label>
              <textarea
                id="goal"
                rows={3}
                className="w-full px-3 py-2 border border-border hover:bg-accent rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-border/20 focus:border-foreground transition-colors"
                placeholder="e.g., Complete user authentication and dashboard redesign"
                {...register("goal")}
              />
              {errors.goal && (
                <p className="text-sm text-muted-foreground">{errors.goal.message}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-sm text-muted-foreground">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input id="endDate" type="date" {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-sm text-muted-foreground">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <Label htmlFor="capacityHours">Team Capacity (hours) *</Label>
              <Input
                id="capacityHours"
                type="number"
                min="1"
                placeholder="320"
                {...register("capacityHours")}
              />
              {errors.capacityHours && (
                <p className="text-sm text-muted-foreground">
                  {errors.capacityHours.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Estimate total available hours for the sprint (e.g., 4 people ×
                40h/week × 2 weeks = 320h)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-foreground hover:bg-foreground/90 hover:transition-colors"
              >
                {isPending ? "Creating..." : "Create Sprint"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/lead/sprints")}
                disabled={isPending}
                className="border-foreground/50 hover:bg-muted transition-colors"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 border border-border rounded-lg p-5 hover:bg-accent transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-foreground">
              Sprint Planning Tips
            </h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground font-bold">•</span>
              <span>
                Keep sprints between 1-4 weeks (2 weeks is most common)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground font-bold">•</span>
              <span>
                Set a clear, achievable goal that the team can rally around
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground font-bold">•</span>
              <span>
                Account for holidays, meetings, and buffer time in capacity
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground font-bold">•</span>
              <span>Review velocity from past sprints to guide planning</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

