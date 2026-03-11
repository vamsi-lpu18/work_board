"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiSparkles,
} from "react-icons/hi2";
import { ImSpinner2 } from "react-icons/im";
import {
  getMyAppraisals,
  getCurrentAppraisal,
  getAppraisalStats,
  updateSelfReview,
  submitAppraisal,
} from "@/app/actions/employee-appraisal";

export default function AppraisalPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentAppraisal, setCurrentAppraisal] = useState<any>(null);
  const [pastAppraisals, setPastAppraisals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    inProgress: 0,
    completed: 0,
    avgRating: 0,
  });

  // Form state
  const [selfReview, setSelfReview] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [currentRes, appraisalsRes, statsRes] = await Promise.all([
        getCurrentAppraisal(),
        getMyAppraisals(),
        getAppraisalStats(),
      ]);

      if (currentRes.success && currentRes.data) {
        setCurrentAppraisal(currentRes.data);
        setSelfReview(currentRes.data.selfReview || "");
        setRating(currentRes.data.rating || undefined);
      }

      if (appraisalsRes.success && appraisalsRes.data) {
        setPastAppraisals(appraisalsRes.data);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error loading appraisal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentAppraisal) return;

    setSaving(true);
    try {
      const result = await updateSelfReview(
        currentAppraisal.id,
        selfReview,
        rating
      );
      if (result.success) {
        alert("Draft saved successfully!");
        loadData();
      } else {
        alert(result.error || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentAppraisal) return;

    if (!selfReview.trim()) {
      alert("Please complete your self-review before submitting");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitAppraisal(currentAppraisal.id);
      if (result.success) {
        alert("Appraisal submitted successfully!");
        loadData();
      } else {
        alert(result.error || "Failed to submit appraisal");
      }
    } catch (error) {
      console.error("Error submitting appraisal:", error);
      alert("Failed to submit appraisal");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      DRAFT: { variant: "secondary" as const, label: "Draft", icon: HiDocumentText },
      IN_PROGRESS: {
        variant: "default" as const,
        label: "In Progress",
        icon: HiClock,
      },
      UNDER_REVIEW: {
        variant: "default" as const,
        label: "Under Review",
        icon: HiExclamationCircle,
      },
      COMPLETED: {
        variant: "default" as const,
        label: "Completed",
        icon: HiCheckCircle,
      },
    };
    return config[status as keyof typeof config] || config.DRAFT;
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
        <div className="flex items-center gap-3">
          
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Performance Appraisals
            </h1>
            <p className="text-muted-foreground">
              Manage your performance reviews and development plans
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors p-6">
            <div className="flex items-center gap-3">
             
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Reviews</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.total}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors p-6">
            <div className="flex items-center gap-3">
          
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.draft + stats.inProgress}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors p-6">
            <div className="flex items-center gap-3">
          
              <div>
                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.completed}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-border hover:bg-accent hover:hover:-translate-y-1 transition-colors p-6">
            <div className="flex items-center gap-3">
          
              <div>
                <p className="text-sm text-muted-foreground font-medium">Avg Rating</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Current Appraisal */}
        {currentAppraisal && (
          <Card className="border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-xl text-foreground">
              Current Appraisal - {currentAppraisal.cycle?.name}
            </h3>
            <Badge variant={getStatusBadge(currentAppraisal.status).variant}>
              {getStatusBadge(currentAppraisal.status).label}
            </Badge>
          </div>

          {currentAppraisal.status === "DRAFT" ? (
            <div className="space-y-6">
              {/* Self-Assessment */}
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Self-Review</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Self-Assessment</Label>
                    <textarea
                      className="w-full p-3 border rounded min-h-48 mt-2"
                      placeholder="Describe your achievements, challenges faced, areas for development, and career goals..."
                      value={selfReview}
                      onChange={(e) => setSelfReview(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Overall Rating */}
              <div>
                <Label>Overall Self-Rating</Label>
                <div className="flex items-center gap-4 mt-2">
                  <select
                    className="p-2 border border-border hover:bg-accent transition-colors rounded"
                    value={rating || ""}
                    onChange={(e) =>
                      setRating(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  >
                    <option value="">Select rating...</option>
                    <option value="5">5 - Outstanding</option>
                    <option value="4">4 - Exceeds Expectations</option>
                    <option value="3">3 - Meets Expectations</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSaveDraft} disabled={saving}>
                  {saving ? (
                    <>
                      <ImSpinner2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Draft"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSubmit}
                  disabled={submitting || !selfReview.trim()}
                >
                  {submitting ? (
                    <>
                      <ImSpinner2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Your Self-Review</h4>
                <p className="text-foreground whitespace-pre-wrap">
                  {currentAppraisal.selfReview || "No self-review submitted"}
                </p>
              </div>

              {currentAppraisal.rating && (
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Your Self-Rating</h4>
                  <p className="text-lg font-semibold text-foreground">
                    {currentAppraisal.rating}/5
                  </p>
                </div>
              )}

              {currentAppraisal.managerFeedback && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2 text-foreground">Manager Feedback</h4>
                  <p className="text-foreground whitespace-pre-wrap">
                    {currentAppraisal.managerFeedback}
                  </p>
                </div>
              )}

              {currentAppraisal.finalRating && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-foreground">Final Rating</h4>
                  <p className="text-lg font-semibold text-foreground">
                    {currentAppraisal.finalRating}/5
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

        {!currentAppraisal && (
          <Card className="border-border p-6">
          <div className="text-center py-12">
            <HiDocumentText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2 text-foreground">
              No Active Appraisal Cycle
            </h3>
            <p className="text-muted-foreground">
              There is no active appraisal cycle at the moment. Check back
              later.
            </p>
          </div>
        </Card>
      )}

        {/* Past Appraisals */}
        <Card className="border-border   p-6">
          <h3 className="font-semibold text-lg mb-4 text-muted-foreground">Appraisal History</h3>
          {pastAppraisals.length > 0 ? (
            <div className="space-y-3">
              {pastAppraisals.map((appraisal) => {
                const StatusIcon = getStatusBadge(appraisal.status).icon;
                return (
                  <div
                    key={appraisal.id}
                    className="p-4 border border-border hover:bg-accent rounded-lg/50 hover:hover:-translate-y-0.5 transition-colors"
                  >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">
                          {appraisal.cycle?.name}
                        </h4>
                        <Badge
                          variant={getStatusBadge(appraisal.status).variant}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {getStatusBadge(appraisal.status).label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-primary/80">
                        {appraisal.rating && (
                          <div>
                            <span className="font-medium text-foreground">Self Rating:</span>{" "}
                            {appraisal.rating}/5
                          </div>
                        )}
                        {appraisal.finalRating && (
                          <div>
                            <span className="font-medium text-foreground">Final Rating:</span>{" "}
                            {appraisal.finalRating}/5
                          </div>
                        )}
                        {appraisal.submittedAt && (
                          <div>
                            <span className="font-medium text-foreground">Submitted:</span>{" "}
                            {new Date(
                              appraisal.submittedAt
                            ).toLocaleDateString()}
                          </div>
                        )}
                        {appraisal.completedAt && (
                          <div>
                            <span className="font-medium text-foreground">Completed:</span>{" "}
                            {new Date(
                              appraisal.completedAt
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      {appraisal.selfReview && (
                        <div className="mt-3 pt-3  border-t">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {appraisal.selfReview}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No appraisal history found
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

