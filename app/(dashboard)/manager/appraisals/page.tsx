import { requireManager } from "@/lib/guards";
import { getTeamAppraisals } from "@/lib/manager-helpers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Appraisals | Manager Dashboard",
};

export default async function ManagerAppraisalsPage() {
  const session = await requireManager();

  const [cycles, teamAppraisals] = await Promise.all([
    prisma.appraisalCycle.findMany({
      orderBy: { startDate: "desc" },
      take: 5,
    }),
    getTeamAppraisals(session.user.id),
  ]);

  const activeCycle = cycles.find((c) => c.status === "IN_PROGRESS");
  const draft = teamAppraisals.filter((a) => a.status === "DRAFT");
  const inProgress = teamAppraisals.filter((a) => a.status === "IN_PROGRESS");
  const completed = teamAppraisals.filter((a) => a.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Appraisals
            </h1>
            <p className="mt-1 text-muted-foreground">
              Conduct performance reviews and manage team appraisals
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border hover:bg-accent transition-colors p-6 hover:">
            <div className="text-sm font-medium text-muted-foreground">Draft</div>
            <div className="mt-2 text-lg font-semibold text-foreground">
              {draft.length}
            </div>
          </div>
          <div className="rounded-lg border border-border hover:bg-accent transition-colors p-6 hover:">
            <div className="text-sm font-medium text-muted-foreground">In Progress</div>
            <div className="mt-2 text-lg font-semibold text-foreground">
              {inProgress.length}
            </div>
          </div>
          <div className="rounded-lg border border-border hover:bg-accent transition-colors p-6 hover:">
            <div className="text-sm font-medium text-muted-foreground">Completed</div>
            <div className="mt-2 text-lg font-semibold text-foreground">
              {completed.length}
            </div>
          </div>
        </div>

        {/* Active Cycle */}
        {activeCycle && (
          <div className="rounded-lg border border-border hover:bg-accent transition-colors p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {activeCycle.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activeCycle.description}
                </p>
                <div className="mt-2 text-sm text-muted-foreground">
                  {new Date(activeCycle.startDate).toLocaleDateString()} -{" "}
                  {new Date(activeCycle.endDate).toLocaleDateString()}
                </div>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                Active Cycle
              </span>
            </div>
          </div>
        )}

        {/* In Progress Reviews */}
        {inProgress.length > 0 && (
          <div className="rounded-lg border border-border hover:bg-accent transition-colors overflow-hidden">
            <div className="border-b border-border bg-muted px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">
                In Progress ({inProgress.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {inProgress.map((review) => (
                <div
                  key={review.id}
                  className="px-6 py-4 transition-all hover:bg-muted"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {review.user.position} • {review.cycle.name}
                      </div>
                      {review.selfReview && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold text-foreground">
                            Self-review submitted
                          </span>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/manager/appraisals/${review.id}`}
                      className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90  hover:transition-all"
                    >
                      Conduct Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Draft Reviews */}
        {draft.length > 0 && (
          <div className="rounded-lg border border-border hover:bg-accent transition-colors overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">
                Draft ({draft.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {draft.map((review) => (
                <div
                  key={review.id}
                  className="px-6 py-4 transition-all hover:bg-muted"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {review.user.position} • {review.cycle.name}
                      </div>
                    </div>
                    <Link
                      href={`/manager/appraisals/${review.id}`}
                      className="rounded-lg border border-border hover:bg-accent transition-colors px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      Start Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Reviews */}
        {completed.length > 0 && (
          <div className="rounded-lg border border-border overflow-hidden hover:bg-accent transition-colors">
            <div className="border-b border-border bg-muted px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">
                Completed ({completed.length})
              </h3>
            </div>
            <div className="divide-y divide-border">
              {completed.slice(0, 10).map((review) => (
                <div
                  key={review.id}
                  className="px-6 py-4 transition-all hover:bg-muted"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {review.user.position} • {review.cycle.name}
                      </div>
                      {review.finalRating && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Final Rating:</span>{" "}
                          <span className="font-semibold text-foreground">
                            {review.finalRating.toFixed(1)}/5.0
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/manager/appraisals/${review.id}`}
                        className="rounded-lg border border-border hover:bg-accent transition-colors px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {teamAppraisals.length === 0 && (
          <div className="rounded-lg border border-border px-6 py-12 text-center text-muted-foreground hover:bg-accent transition-colors">
            No appraisals available
          </div>
        )}
      </div>
    </div>
  );
}

