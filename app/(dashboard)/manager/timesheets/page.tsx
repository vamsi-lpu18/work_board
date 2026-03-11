import { requireManager } from "@/lib/guards";
import { getPendingTimesheets } from "@/lib/manager-helpers";
import { TimesheetApprovalCard } from "@/components/manager/TimesheetApprovalCard";

export const metadata = {
  title: "Timesheets | Manager Dashboard",
};

export default async function ManagerTimesheetsPage() {
  const session = await requireManager();
  const timesheets = await getPendingTimesheets(session.user.id);

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Timesheets
            </h1>
            <p className="mt-1 text-muted-foreground">
              Review and approve timesheets from your team
            </p>
          </div>
        </div>

        {/* Pending Timesheets */}
        <div className="rounded-lg border border-border hover:bg-accent transition-colors overflow-hidden">
          <div className="border-b border-border bg-muted px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">
              Pending Timesheets ({timesheets.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {timesheets.map((timesheet) => (
              <TimesheetApprovalCard key={timesheet.id} timesheet={timesheet} />
            ))}
            {timesheets.length === 0 && (
              <div className="px-6 py-12 text-center text-muted-foreground">
                No pending timesheets to review
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

