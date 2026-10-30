import { Link } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight, X, Sparkles, Activity } from "lucide-react";
import type { HealthIssue } from "@/lib/types";

interface Props {
  health: {
    issues: HealthIssue[];
    criticalCount: number;
    warningCount: number;
    infoCount: number;
    status: "critical" | "warning" | "clean";
    overallSummary: string;
  };
  onNavigateStep?: (stepIndex: number, fieldName?: string) => void;
  onClose?: () => void;
  inline?: boolean;
}

export function ApplicationHealthCheckView({ health, onNavigateStep, onClose, inline = false }: Props) {
  const { issues, criticalCount, warningCount, status, overallSummary } = health;

  const content = (
    <div className="space-y-6">
      {/* Header Summary */}
      <div
        className={`rounded-2xl border p-6 text-card-foreground ${
          status === "critical"
            ? "border-rose-300 bg-rose-50/80"
            : status === "warning"
            ? "border-amber-300 bg-amber-50/80"
            : "border-emerald-300 bg-emerald-50/80"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                status === "critical"
                  ? "bg-rose-600 text-white"
                  : status === "warning"
                  ? "bg-amber-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {status === "clean" ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : status === "critical" ? (
                <AlertOctagon className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Diagnostic Audit
              </span>
              <h3 className="font-display text-2xl font-bold">
                {status === "clean"
                  ? "Application Health: Clean & Ready"
                  : status === "critical"
                  ? "Application Health: Issues Detected"
                  : "Application Health: Minor Warnings"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                {warningCount} Warnings
              </span>
            )}
            {status === "clean" && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                100% Passed
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed opacity-90">{overallSummary}</p>
      </div>

      {/* Issues List */}
      {issues.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-display text-lg font-semibold text-foreground">
            Detected Items Requiring Attention ({issues.length})
          </h4>

          <div className="space-y-2.5">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                  issue.severity === "critical"
                    ? "border-rose-200 bg-rose-50/40 hover:bg-rose-50/70"
                    : "border-amber-200 bg-amber-50/40 hover:bg-amber-50/70"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">
                    {issue.severity === "critical" ? (
                      <AlertOctagon className="h-5 w-5 text-rose-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{issue.title}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          issue.severity === "critical"
                            ? "bg-rose-200 text-rose-900"
                            : "bg-amber-200 text-amber-900"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{issue.description}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {onNavigateStep ? (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateStep(issue.fixStep, issue.field);
                        if (onClose) onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      {issue.fixActionLabel} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <Link
                      to="/apply"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      {issue.fixActionLabel} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h4 className="mt-3 font-display text-xl font-semibold text-foreground">Zero Validation Errors Found</h4>
          <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
            All required biographical inputs, passport parameters, 6-month validity buffers, and mandatory document scans are present and in order.
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="rounded-xl bg-secondary/80 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Important Submission Advisory</p>
        <p className="mt-1">
          Passing this health check guarantees conformance with standard e-Visa electronic validations. However, final approval is at the absolute discretion of the Ministry of Home Affairs and Indian Immigration officers at the port of entry.
        </p>
      </div>
    </div>
  );

  if (inline) {
    return <div className="card-elevated p-6">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {content}
      </div>
    </div>
  );
}
