"use client";

import { useState } from "react";
import {
  approveTimesheet,
  rejectTimesheet,
  requestTimesheetCorrection,
} from "@/app/actions/manager-approvals";

type TimesheetEntry = {
  id: string;
  date: Date;
  hours: number;
  description: string | null;
  billable: boolean;
  project: {
    id: string;
    name: string;
  } | null;
};

type Timesheet = {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  totalHours: number;
  comments: string | null;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  entries: TimesheetEntry[];
};

export function TimesheetApprovalCard({ timesheet }: { timesheet: Timesheet }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState<"reject" | "correction" | null>(
    null
  );
  const [comments, setComments] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    const result = await approveTimesheet(timesheet.id);
    if (!result.success) {
      alert(result.error || "Failed to approve timesheet");
    }
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      alert("Please provide comments for rejection");
      return;
    }
    setIsProcessing(true);
    const result = await rejectTimesheet(timesheet.id, comments);
    if (result.success) {
      setShowDialog(null);
      setComments("");
    } else {
      alert(result.error || "Failed to reject timesheet");
    }
    setIsProcessing(false);
  };

  const handleRequestCorrection = async () => {
    if (!comments.trim()) {
      alert("Please provide comments for correction request");
      return;
    }
    setIsProcessing(true);
    const result = await requestTimesheetCorrection(timesheet.id, comments);
    if (result.success) {
      setShowDialog(null);
      setComments("");
    } else {
      alert(result.error || "Failed to request correction");
    }
    setIsProcessing(false);
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">
                {timesheet.user.firstName} {timesheet.user.lastName}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Week of {new Date(timesheet.weekStart).toLocaleDateString()} -{" "}
                {new Date(timesheet.weekEnd).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-foreground">
                {timesheet.totalHours}h
              </div>
              <div className="text-sm text-muted-foreground">
                {timesheet.entries.length} entries
              </div>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm font-medium text-muted-foreground hover:text-foreground/80 transition-colors bg-transparent border-none cursor-pointer"
          >
            {expanded ? "Hide" : "Show"} details
          </button>

          {expanded && (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium text-foreground">
                Time Entries:
              </div>
              {timesheet.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground">
                      {entry.project?.name || "No project"} •{" "}
                      {entry.description || "No description"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {entry.billable && (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        Billable
                      </span>
                    )}
                    <div className="font-medium text-foreground">
                      {entry.hours}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {timesheet.comments && (
            <div className="mt-3 rounded-lg bg-muted p-3 text-sm text-foreground">
              <div className="mb-1 font-medium text-muted-foreground">Comments:</div>
              {timesheet.comments}
            </div>
          )}
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => setShowDialog("correction")}
            disabled={isProcessing}
            className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Request Changes
          </button>
          <button
            onClick={() => setShowDialog("reject")}
            disabled={isProcessing}
            className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 ">
          <div className="w-full max-w-md rounded-lg border border-border p-6 ">
            <h3 className="text-lg font-semibold text-foreground">
              {showDialog === "reject"
                ? "Reject Timesheet"
                : "Request Correction"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {showDialog === "reject"
                ? "Please provide a reason for rejecting this timesheet"
                : "Specify what needs to be corrected"}
            </p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={4}
              placeholder="Enter comments..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDialog(null);
                  setComments("");
                }}
                disabled={isProcessing}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={
                  showDialog === "reject"
                    ? handleReject
                    : handleRequestCorrection
                }
                disabled={isProcessing}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-background ${
                  showDialog === "reject"
                    ? "bg-destructive hover:bg-destructive/90"
                    : "bg-foreground hover:bg-foreground/90"
                }`}
              >
                {showDialog === "reject" ? "Reject" : "Request Correction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
