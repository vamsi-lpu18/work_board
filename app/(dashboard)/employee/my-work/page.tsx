"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiMagnifyingGlass,
  HiXMark,
  HiPlus,
  HiSparkles,
} from "react-icons/hi2";
import { ImSpinner2 } from "react-icons/im";
import {
  getMyTasks,
  getMyTaskStats,
  updateTaskStatus,
  logTaskHours,
  getFilteredTasks,
  createTask,
  type Task,
} from "@/app/actions/employee-tasks";
import { getAvailableProjects } from "@/app/actions/employee-timesheet";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "DONE";
type FilterType = "all" | "today" | "week" | "overdue" | "blocked";

interface TaskStats {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export default function MyWorkPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Log Time Dialog State
  const [logTimeDialog, setLogTimeDialog] = useState<{
    open: boolean;
    taskId: string | null;
  }>({
    open: false,
    taskId: null,
  });
  const [hoursToLog, setHoursToLog] = useState("");

  // Create Task Dialog State
  const [createTaskDialog, setCreateTaskDialog] = useState(false);
  const [availableProjects, setAvailableProjects] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    projectId: "",
    dueDate: "",
    estimatedHours: "",
  });

  useEffect(() => {
    loadTasks();
    loadStats();
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    try {
      const result = await getAvailableProjects();
      if (result.success && result.data) {
        setAvailableProjects(result.data);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const result =
        filter === "all" ? await getMyTasks() : await getFilteredTasks(filter);

      if (result.success && result.data) {
        setTasks(result.data);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getMyTaskStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setActionLoading(taskId);
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      if (result.success) {
        await loadTasks();
        await loadStats();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogTime = async () => {
    if (!logTimeDialog.taskId || !hoursToLog) return;

    setActionLoading(logTimeDialog.taskId);
    try {
      const hours = parseFloat(hoursToLog);
      if (isNaN(hours) || hours <= 0) {
        alert("Please enter a valid number of hours");
        return;
      }

      const result = await logTaskHours(logTimeDialog.taskId, hours);
      if (result.success) {
        await loadTasks();
        setLogTimeDialog({ open: false, taskId: null });
        setHoursToLog("");
      }
    } catch (error) {
      console.error("Error logging time:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      alert("Task title is required");
      return;
    }

    setActionLoading("create");
    try {
      const result = await createTask({
        title: newTask.title,
        description: newTask.description || undefined,
        priority: newTask.priority,
        projectId: newTask.projectId || undefined,
        dueDate: newTask.dueDate || undefined,
        estimatedHours: newTask.estimatedHours
          ? parseFloat(newTask.estimatedHours)
          : undefined,
      });

      if (result.success) {
        await loadTasks();
        await loadStats();
        setCreateTaskDialog(false);
        setNewTask({
          title: "",
          description: "",
          priority: "MEDIUM",
          projectId: "",
          dueDate: "",
          estimatedHours: "",
        });
      } else {
        alert(result.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "outline" | "destructive";
      }
    > = {
      TODO: { label: "To Do", variant: "secondary" },
      IN_PROGRESS: { label: "In Progress", variant: "default" },
      IN_REVIEW: { label: "In Review", variant: "outline" },
      BLOCKED: { label: "Blocked", variant: "destructive" },
      DONE: { label: "Done", variant: "default" },
    };
    return statusConfig[status] || statusConfig["TODO"];
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { label: string; className: string }> =
      {
        LOW: { label: "Low", className: "bg-muted text-muted-foreground" },
        MEDIUM: { label: "Medium", className: "bg-muted text-muted-foreground" },
        HIGH: { label: "High", className: "bg-muted text-muted-foreground" },
        URGENT: {
          label: "Urgent",
          className:
            "bg-destructive/20 text-foreground dark:bg-destructive/30",
        },
      };
    return priorityConfig[priority] || priorityConfig["MEDIUM"];
  };

  const isOverdue = (dueDate: Date | null | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "No deadline";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery) return true;
    return (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage your assigned tasks and track progress
          </p>
        </div>
        <Button
          onClick={() => setCreateTaskDialog(true)}
          className="bg-foreground hover:bg-foreground/90 text-background"
        >
          <HiPlus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(
              ["all", "today", "week", "overdue", "blocked"] as FilterType[]
            ).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors border-2 ${
                  filter === f
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground hover:text-foreground border-border hover:bg-accent"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-lg border border-border hover:bg-accent transition-colors p-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground font-medium">In Progress</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats?.inProgress || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-lg border border-border hover:bg-accent transition-colors p-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Tasks</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats?.total || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-lg border border-border hover:bg-accent transition-colors p-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Overdue</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats?.overdue || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-lg border border-border hover:bg-accent transition-colors p-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats?.completed || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tasks List */}
        <Card className="border-border p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12"></div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border-2 border-border rounded-lg/50 hover:bg-accent hover:hover:-translate-y-0.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        {isOverdue(task.dueDate) && task.status !== "DONE" && (
                          <Badge variant="secondary" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.project?.name || "No project"}
                      </p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Due: {formatDate(task.dueDate)}</span>
                        <span>
                          Time: {task.actualHours || 0}h /{" "}
                          {task.estimatedHours || 0}h
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant={getStatusBadge(task.status).variant}>
                        {getStatusBadge(task.status).label}
                      </Badge>
                      <Badge
                        className={getPriorityBadge(task.priority).className}
                      >
                        {getPriorityBadge(task.priority).label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setLogTimeDialog({ open: true, taskId: task.id })
                      }
                      disabled={actionLoading === task.id}
                    >
                      {actionLoading === task.id ? (
                        <ImSpinner2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Log Time
                    </Button>
                    <select
                      className="px-3 py-1 border border-border hover:bg-accent transition-colors rounded text-sm"
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task.id,
                          e.target.value as TaskStatus
                        )
                      }
                      disabled={actionLoading === task.id}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="BLOCKED">Blocked</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Log Time Dialog */}
        {logTimeDialog.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6 border-border animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Log Time</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLogTimeDialog({ open: false, taskId: null });
                    setHoursToLog("");
                  }}
                >
                  <HiXMark className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="hours">Hours worked</Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Enter hours (e.g., 2.5)"
                    value={hoursToLog}
                    onChange={(e) => setHoursToLog(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleLogTime}
                    disabled={
                      !hoursToLog || actionLoading === logTimeDialog.taskId
                    }
                    className="flex-1"
                  >
                    {actionLoading === logTimeDialog.taskId ? (
                      <ImSpinner2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Log Time
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setLogTimeDialog({ open: false, taskId: null });
                      setHoursToLog("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Create Task Dialog */}
        {createTaskDialog && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto border-border animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Task</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCreateTaskDialog(false);
                    setNewTask({
                      title: "",
                      description: "",
                      priority: "MEDIUM",
                      projectId: "",
                      dueDate: "",
                      estimatedHours: "",
                    });
                  }}
                >
                  <HiXMark className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-title">Title *</Label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="task-description">Description</Label>
                  <textarea
                    id="task-description"
                    className="w-full p-2 border rounded min-h-24"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-priority">Priority</Label>
                    <select
                      id="task-priority"
                      className="w-full p-2 border border-border hover:bg-accent transition-colors rounded"
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          priority: e.target.value as any,
                        })
                      }
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="task-project">Project (Optional)</Label>
                    <select
                      id="task-project"
                      className="w-full p-2 border border-border hover:bg-accent transition-colors rounded"
                      value={newTask.projectId}
                      onChange={(e) =>
                        setNewTask({ ...newTask, projectId: e.target.value })
                      }
                    >
                      <option value="">No Project</option>
                      {availableProjects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="task-duedate">Due Date (Optional)</Label>
                    <Input
                      id="task-duedate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="task-estimated">
                      Estimated Hours (Optional)
                    </Label>
                    <Input
                      id="task-estimated"
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="e.g., 8"
                      value={newTask.estimatedHours}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          estimatedHours: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreateTask}
                    disabled={
                      !newTask.title.trim() || actionLoading === "create"
                    }
                    className="flex-1"
                  >
                    {actionLoading === "create" ? (
                      <ImSpinner2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Create Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCreateTaskDialog(false);
                      setNewTask({
                        title: "",
                        description: "",
                        priority: "MEDIUM",
                        projectId: "",
                        dueDate: "",
                        estimatedHours: "",
                      });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
    </div>
  );
}
