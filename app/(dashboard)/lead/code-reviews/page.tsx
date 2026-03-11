import { requireLead } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { getTeamCodeReviews } from "@/lib/lead-helpers";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function LeadCodeReviewsPage() {
  const session = await requireLead();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        select: { id: true, name: true },
      },
    },
  });

  if (!user?.team) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="border border-border rounded-lg p-8 max-w-md mx-auto hover:bg-accent transition-colors">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Team Assigned
            </h2>
            <p className="text-muted-foreground">
              Please contact your administrator to assign you to a team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const codeReviews = await getTeamCodeReviews(user.team.id);

  const pendingReviews = codeReviews.filter((r) => r.status === "pending");
  const inProgressReviews = codeReviews.filter(
    (r) => r.status === "changes_requested"
  );
  const approvedReviews = codeReviews
    .filter((r) => r.status === "approved")
    .slice(0, 10);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-muted text-muted-foreground";
      case "approved":
        return "bg-muted text-muted-foreground";
      case "changes_requested":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "approved":
        return "Approved";
      case "changes_requested":
        return "Changes Requested";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-full w-fit mb-3">
          <span className="text-sm font-semibold">Code Quality</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Code Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve pull requests from your team
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Pending Review
              </p>
              <p className="text-lg font-semibold text-foreground">
                {pendingReviews.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center ">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Changes Requested
              </p>
              <p className="text-lg font-semibold text-foreground">
                {inProgressReviews.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center ">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Approved</p>
              <p className="text-lg font-semibold text-foreground">
                {approvedReviews.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center ">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="border border-border rounded-lg hover:bg-accent transition-colors">
          <div className="p-6">
            <h2 className="text-xl font-bold text-muted-foreground mb-4">
              Pending Your Review ({pendingReviews.length})
            </h2>
            <div className="space-y-3">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-border bg-muted rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(
                            review.status
                          )}`}
                        >
                          {getStatusLabel(review.status)}
                        </span>
                        <h3 className="font-semibold text-foreground">
                          {review.prTitle}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        by {review.author?.name || "Unknown"} •{" "}
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{review.filesChanged} files changed</span>
                        <span>{review.linesChanged} lines</span>
                        {review.comments != null && review.comments > 0 && (
                          <span>{review.comments} comments</span>
                        )}
                      </div>
                    </div>
                    <a
                      href={review.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-2 bg-foreground text-background rounded-lg hover:transition-colors text-sm font-medium"
                    >
                      Review PR →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Changes Requested */}
      {inProgressReviews.length > 0 && (
        <div className="border border-border rounded-lg hover:bg-accent transition-colors">
          <div className="p-6">
            <h2 className="text-xl font-bold text-muted-foreground mb-4">
              Changes Requested ({inProgressReviews.length})
            </h2>
            <div className="space-y-3">
              {inProgressReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-border bg-muted rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(
                            review.status
                          )}`}
                        >
                          {getStatusLabel(review.status)}
                        </span>
                        <h3 className="font-semibold text-foreground">
                          {review.prTitle}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        by {review.author?.name || "Unknown"} • Reviewed{" "}
                        {review.reviewedAt
                          ? formatDistanceToNow(new Date(review.reviewedAt), {
                              addSuffix: true,
                            })
                          : "recently"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{review.filesChanged} files</span>
                        <span>{review.linesChanged} lines</span>
                        {review.comments != null && (
                          <span>{review.comments} comments</span>
                        )}
                      </div>
                    </div>
                    <a
                      href={review.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 px-4 py-2 bg-foreground text-background rounded-lg hover:transition-colors text-sm font-medium"
                    >
                      View PR →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recently Approved */}
      {approvedReviews.length > 0 && (
        <div className="border border-border rounded-lg hover:bg-accent transition-colors">
          <div className="p-6">
            <h2 className="text-xl font-bold text-muted-foreground mb-4">
              Recently Approved
            </h2>
            <div className="space-y-3">
              {approvedReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-border bg-muted rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(
                            review.status
                          )}`}
                        >
                          {getStatusLabel(review.status)}
                        </span>
                        <h3 className="font-semibold text-foreground">
                          {review.prTitle}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        by {review.author?.name || "Unknown"} • Approved{" "}
                        {review.reviewedAt
                          ? formatDistanceToNow(new Date(review.reviewedAt), {
                              addSuffix: true,
                            })
                          : "recently"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{review.filesChanged} files</span>
                        <span>{review.linesChanged} lines</span>
                        {review.comments != null && review.comments > 0 && (
                          <span>{review.comments} comments</span>
                        )}
                      </div>
                    </div>
                    <a
                      href={review.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-muted-foreground hover:text-foreground font-medium text-sm transition-all"
                    >
                      View PR →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {codeReviews.length === 0 && (
        <div className="border border-border rounded-lg p-12 text-center hover:bg-accent transition-colors">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 ">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No Code Reviews Yet
            </h2>
            <p className="text-muted-foreground">
              Pull requests from your team will appear here for review.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

