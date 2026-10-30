import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  FileCheck2,
  ClipboardList,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Download,
  RotateCcw,
  Sparkles,
  Plane,
  ShieldCheck,
  Search,
} from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";
import { useVisaStore } from "@/lib/visaStore";
import { ReadinessScoreWidget } from "@/components/ReadinessScoreWidget";
import { PersonalisedChecklistWidget } from "@/components/PersonalisedChecklistWidget";
import { TravelPlannerWidget } from "@/components/TravelPlannerWidget";
import { ApplicationHealthCheckView } from "@/components/ApplicationHealthCheckModal";
import { ApplicationSummaryModal } from "@/components/ApplicationSummaryModal";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    meta(
      "Applicant Dashboard — VisaEase India",
      "Unified applicant readiness command center with score diagnostic, document checklist, travel timeline, and health audit."
    ),
  component: DashboardPage,
});

function DashboardPage() {
  const {
    data,
    verifiedDocs,
    activities,
    demoAppId,
    readiness,
    health,
    checklist,
    timeline,
    toggleChecklistItem,
    setTravelDate,
    fillSampleData,
    resetAll,
  } = useVisaStore();

  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Applicant Command Center"
        title="Your Visa Preparation Dashboard"
        text="A unified workspace monitoring your application readiness, verified documents, travel countdown, and health checks before official submission."
      />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Top Control Bar: Demo Data & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary/70 p-4 border border-border">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-saffron font-bold text-sm">
              ID
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm">
                  {data.given ? `${data.given} ${data.surname}` : "Draft Applicant"}
                </span>
                <span className="rounded-full bg-saffron-soft px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                  {demoAppId}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Nationality: <strong>{data.nationality || "Not Selected"}</strong> · Purpose: <strong>{data.purpose || "Tourism"}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={fillSampleData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-semibold text-foreground hover:bg-secondary transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-saffron" /> Load Demo Profile
            </button>
            <button
              onClick={() => setShowSummaryModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              <Download className="h-3.5 w-3.5" /> Download Summary
            </button>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-muted-foreground hover:text-destructive transition"
              title="Reset application draft"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Stat 1: Readiness Score */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Readiness Score</span>
              <Sparkles className="h-4 w-4 text-saffron" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {readiness.total}%
            </p>
            <span className={`mt-1 inline-block rounded px-2 py-0.5 text-[10px] font-bold ${readiness.levelColor}`}>
              {readiness.level}
            </span>
          </div>

          {/* Stat 2: Document Verification */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Verified Documents</span>
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {checklist.completionStats.requiredDone} / {checklist.completionStats.requiredCount}
            </p>
            <span className="mt-1 inline-block text-[11px] font-medium text-muted-foreground">
              {checklist.completionStats.percent}% mandatory ready
            </span>
          </div>

          {/* Stat 3: Health Status */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Application Health</span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-foreground capitalize">
              {health.status}
            </p>
            <button
              onClick={() => setShowHealthModal(true)}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
            >
              {health.criticalCount > 0 ? `${health.criticalCount} blockers` : "View Diagnostics"} <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Stat 4: Travel Countdown */}
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
              <span>Travel Countdown</span>
              <Calendar className="h-4 w-4 text-saffron" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {timeline.daysRemaining > 0 ? `${timeline.daysRemaining}d` : "Set Date"}
            </p>
            <span className="mt-1 inline-block text-[11px] font-medium text-muted-foreground">
              {timeline.travelDate ? new Date(timeline.travelDate).toLocaleDateString("en-GB") : "Target departure"}
            </span>
          </div>
        </div>

        {/* Section 1: Dynamic Readiness Score Diagnostic */}
        <section>
          <ReadinessScoreWidget readiness={readiness} showBreakdown={true} />
        </section>

        {/* Section 2: Health Check Diagnostic Banner */}
        <section className="card-elevated p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  health.status === "clean"
                    ? "bg-emerald-100 text-emerald-800"
                    : health.status === "critical"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <Activity className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-display text-lg font-bold text-foreground">
                  Application Health & Validation Audit
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {health.overallSummary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHealthModal(true)}
                className="btn-primary text-xs"
              >
                Inspect Health Report ({health.issues.length} Items)
              </button>
              <Link to="/apply" className="btn-outline text-xs">
                Open Form Editor
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Dual Column - Personalised Checklist & Travel Planner */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Tailored Checklist */}
          <div>
            <PersonalisedChecklistWidget
              nationality={data.nationality}
              purpose={data.purpose}
              items={checklist.items}
              notices={checklist.notices}
              stats={checklist.completionStats}
              onToggleItem={toggleChecklistItem}
            />
          </div>

          {/* Right: Travel Readiness Planner */}
          <div className="space-y-6">
            <TravelPlannerWidget
              plan={timeline}
              currentTravelDate={data.travelDate || data.arrival || ""}
              onSetTravelDate={setTravelDate}
            />

            {/* Recent Activity Audit Log */}
            <div className="card-elevated p-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-display font-bold text-foreground">
                  Recent Preparation Activity
                </h4>
                <span className="text-[11px] text-muted-foreground">Saved locally</span>
              </div>
              <ul className="mt-3 divide-y divide-border/60 text-xs">
                {activities.slice(0, 5).map((act) => (
                  <li key={act.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-saffron" />
                      <span className="font-medium text-foreground">{act.title}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{act.timestamp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Next Steps & Official Application Pathway */}
        <section className="rounded-2xl bg-primary p-8 text-primary-foreground">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-2">
              <span className="inline-block rounded-full bg-saffron-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                Ready for the Official Portal?
              </span>
              <h3 className="font-display text-2xl font-bold text-primary-foreground">
                Your Practice Application is {readiness.total}% Prepared
              </h3>
              <p className="text-xs leading-relaxed text-primary-foreground/80 max-w-xl">
                When you are satisfied with your verified documents and form rehearsal, take your practice dossier directly to the official Government of India e-Visa portal. We do not transmit data to any third party.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <a
                href="https://indianvisaonline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-saffron text-center text-xs font-bold"
              >
                Go to Official Indian Visa Portal <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => setShowSummaryModal(true)}
                className="rounded-lg border border-primary-foreground/30 px-4 py-2.5 text-center text-xs font-semibold text-primary-foreground hover:bg-primary-foreground/10"
              >
                Print / Save Practice Dossier
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Health Check Modal */}
      {showHealthModal && (
        <ApplicationHealthCheckView
          health={health}
          onClose={() => setShowHealthModal(false)}
        />
      )}

      {/* Summary Download Modal */}
      {showSummaryModal && (
        <ApplicationSummaryModal
          data={data}
          readiness={readiness}
          verifiedDocs={verifiedDocs}
          demoAppId={demoAppId}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
    </SiteLayout>
  );
}
