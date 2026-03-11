"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  HiCalendar,
  HiClock,
  HiPlus,
  HiPencil,
  HiTrash,
  HiPaperAirplane,
  HiSparkles,
} from "react-icons/hi2";
import { ImSpinner2 } from "react-icons/im";
import {
  getCurrentTimesheet,
  addTimesheetEntry,
  updateTimesheetEntry,
  deleteTimesheetEntry,
  submitTimesheet,
  getTimesheetStats,
  getAvailableProjects,
} from "@/app/actions/employee-timesheet";

export default function TimesheetPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timesheet, setTimesheet] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalHours: 0,
    billableHours: 0,
    nonBillableHours: 0,
  });

  // Form state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    projectId: "",
    taskId: "",
    hours: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [timesheetRes, projectsRes, statsRes] = await Promise.all([
        getCurrentTimesheet(),
        getAvailableProjects(),
        getTimesheetStats(),
      ]);

      if (timesheetRes.success && timesheetRes.data) {
        setTimesheet(timesheetRes.data);
      }

      if (projectsRes.success && projectsRes.data) {
        setProjects(projectsRes.data);
        console.log(
          "Loaded projects:",
          projectsRes.data.length,
          projectsRes.data
        );
      } else {
        console.log("Failed to load projects:", projectsRes.error);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error loading timesheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!formData.date) {
      alert("Please select a date");
      return;
    }
    if (!formData.projectId) {
      alert("Please select a project");
      return;
    }
    if (!formData.hours || Number(formData.hours) <= 0) {
      alert("Please enter valid hours (greater than 0)");
      return;
    }

    setSaving(true);
    try {
      const result = await addTimesheetEntry({
        date: formData.date,
        projectId: formData.projectId,
        hours: Number(formData.hours),
        description: formData.description,
        billable: true,
      });

      if (result.success) {
        alert("Time entry added successfully!");
        setFormData({
          date: new Date().toISOString().split("T")[0],
          projectId: "",
          taskId: "",
          hours: "",
          description: "",
        });
        setShowAddDialog(false);
        loadData();
      } else {
        alert(result.error || "Failed to add entry");
      }
    } catch (error) {
      console.error("Error adding entry:", error);
      alert(
        "Failed to add entry: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry || !formData.hours) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const result = await updateTimesheetEntry(
        editingEntry.id,
        {
          hours: Number(formData.hours),
          description: formData.description,
        }
      );

      if (result.success) {
        setEditingEntry(null);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          projectId: "",
          taskId: "",
          hours: "",
          description: "",
        });
        loadData();
      } else {
        alert(result.error || "Failed to update entry");
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const result = await deleteTimesheetEntry(entryId);
      if (result.success) {
        loadData();
      } else {
        alert(result.error || "Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry");
    }
  };

  const handleSubmit = async () => {
    if (!timesheet) return;

    if (
      !confirm("Are you sure you want to submit this timesheet for approval?")
    )
      return;

    setSubmitting(true);
    try {
      const result = await submitTimesheet(timesheet.id);
      if (result.success) {
        alert("Timesheet submitted successfully!");
        loadData();
      } else {
        alert(result.error || "Failed to submit timesheet");
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      alert("Failed to submit timesheet");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      date: new Date(entry.date).toISOString().split("T")[0],
      projectId: entry.projectId || "",
      taskId: entry.taskId || "",
      hours: entry.hours.toString(),
      description: entry.description || "",
    });
    setShowAddDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      DRAFT: { variant: "secondary" as const, label: "Draft" },
      SUBMITTED: { variant: "default" as const, label: "Submitted" },
      APPROVED: { variant: "default" as const, label: "Approved" },
      REJECTED: { variant: "destructive" as const, label: "Rejected" },
    };
    return config[status as keyof typeof config] || config.DRAFT;
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const formatDate = (dateString: string | Date): string => {
    try {
      const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <ImSpinner2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Timesheet</h1>
              <p className="text-foreground">Log and track your work hours</p>
            </div>
          </div>
          <div className="flex gap-2">
            {timesheet && (
              <Badge
                variant={getStatusBadge(timesheet.status).variant}
                className="text-lg px-4 py-2"
              >
                {getStatusBadge(timesheet.status).label}
              </Badge>
            )}
            <Button
              onClick={() => setShowAddDialog(true)}
              disabled={timesheet && timesheet.status !== "DRAFT"}
              className="bg-foreground hover:bg-foreground/90 hover:transition-colors"
            >
              <HiPlus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-border hover:bg-accent transition-colors p-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Hours</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.totalHours}h
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-border hover:bg-accent transition-colors p-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Billable Hours
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.billableHours}h
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-border hover:bg-accent transition-colors p-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Non-Billable Hours
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.nonBillableHours}h
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Current Week Info */}
        {timesheet && (
          <Card className="border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Week{" "}
                  {timesheet.weekNumber ||
                    getWeekNumber(new Date(timesheet.startDate))}
                  , {new Date(timesheet.startDate).getFullYear()}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(timesheet.startDate)} -{" "}
                  {formatDate(timesheet.endDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Hours This Week</p>
                <p className="text-3xl font-bold">
                  {timesheet.entries?.reduce(
                    (sum: number, e: any) => sum + e.hours,
                    0
                  ) || 0}
                  h
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Add/Edit Entry Dialog */}
        {showAddDialog && (
          <Card className="p-6 border-2 border-foreground/50 bg-muted ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                {editingEntry ? "Edit Time Entry" : "Add Time Entry"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingEntry(null);
                  setFormData({
                    date: new Date().toISOString().split("T")[0],
                    projectId: "",
                    taskId: "",
                    hours: "",
                    description: "",
                  });
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  disabled={!!editingEntry}
                />
              </div>
              <div>
                <Label htmlFor="hours">Hours *</Label>
                <Input
                  type="number"
                  id="hours"
                  placeholder="8"
                  step="0.5"
                  min="0"
                  max="24"
                  value={formData.hours}
                  onChange={(e) =>
                    setFormData({ ...formData, hours: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="project">Project *</Label>
                <select
                  id="project"
                  className="w-full p-2 border border-border hover:bg-accent transition-colors rounded"
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value })
                  }
                  disabled={!!editingEntry}
                >
                  <option value="">Select project...</option>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No projects available
                    </option>
                  )}
                </select>
                {projects.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No projects found. Please contact your manager.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="task">Task (Optional)</Label>
                <Input
                  id="task"
                  placeholder="Task ID or name"
                  value={formData.taskId}
                  onChange={(e) =>
                    setFormData({ ...formData, taskId: e.target.value })
                  }
                  disabled={!!editingEntry}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full p-2 border rounded min-h-20"
                  placeholder="What did you work on?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <ImSpinner2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingEntry ? (
                  "Update Entry"
                ) : (
                  "Save Entry"
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Time Entries List */}
        <Card className="border-border p-6">
          <h3 className="font-semibold text-lg mb-4">Time Entries</h3>
          {timesheet?.entries && timesheet.entries.length > 0 ? (
            <div className="space-y-3">
              {timesheet.entries.map((entry: any) => (
                <div
                  key={entry.id}
                  className="p-4 border border-border hover:bg-accent rounded-lg/50 flex items-center justify-between hover:hover:-translate-y-0.5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">
                        {formatDate(entry.date)}
                      </span>
                      <Badge variant="outline">
                        {entry.project?.name || "Unknown Project"}
                      </Badge>
                      {entry.task && (
                        <span className="text-sm text-muted-foreground">
                          Task: {entry.taskId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {entry.description || "No description"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-lg">{entry.hours}h</p>
                    </div>
                    {timesheet.status === "DRAFT" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(entry)}
                        >
                          <HiPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <HiTrash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <HiClock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p>No time entries for this week yet</p>
              <p className="text-sm mt-2">
                Click "Add Entry" to log your work hours
              </p>
            </div>
          )}

          {timesheet &&
            timesheet.status === "DRAFT" &&
            timesheet.entries?.length > 0 && (
              <div className="mt-6 pt-6 border-t flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {timesheet.entries.length} entries •{" "}
                  {timesheet.entries.reduce(
                    (sum: number, e: any) => sum + e.hours,
                    0
                  )}{" "}
                  total hours
                </p>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <ImSpinner2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HiPaperAirplane className="h-4 w-4 mr-2" />
                      Submit Timesheet
                    </>
                  )}
                </Button>
              </div>
            )}

          {timesheet && timesheet.status === "SUBMITTED" && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-muted-foreground">
                Timesheet submitted on{" "}
                {timesheet.submittedAt
                  ? formatDate(timesheet.submittedAt)
                  : "N/A"}
                . Awaiting manager approval.
              </p>
            </div>
          )}

          {timesheet && timesheet.status === "APPROVED" && (
            <div className="mt-6 pt-6 border-t">
              <div className="bg-muted border border-foreground rounded p-4">
                <p className="text-muted-foreground font-medium">
                  ✓ Timesheet approved on{" "}
                  {timesheet.approvedAt
                    ? formatDate(timesheet.approvedAt)
                    : "N/A"}
                </p>
              </div>
            </div>
          )}

          {timesheet && timesheet.status === "REJECTED" && (
            <div className="mt-6 pt-6 border-t">
              <div className="bg-muted border border-destructive/20 rounded p-4">
                <p className="text-foreground font-medium">
                  Timesheet rejected
                </p>
                {timesheet.rejectionReason && (
                  <p className="text-sm text-foreground/80 mt-2">
                    Reason: {timesheet.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

