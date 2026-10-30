import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Search, Loader2, AlertTriangle, Sparkles, LayoutDashboard } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";
import { useVisaStore } from "@/lib/visaStore";

export const Route = createFileRoute("/tracker")({
  head: () =>
    meta(
      "Application Tracker — VisaEase India",
      "Enter a sample or practice application ID to see simulated progress through official review stages."
    ),
  component: Tracker,
});

const stages = ["Submitted", "Under Review", "Documents Required", "Decision"];
type App = { name: string; visa: string; stage: number; dates: string[]; note: string };

export const apps: Record<string, App> = {
  "VE-2026-1001": {
    name: "Emma Clarke · United Kingdom",
    visa: "Tourist e-Visa (365 Days)",
    stage: 1,
    dates: ["24 Oct 2026", "26 Oct 2026"],
    note: "Your demo application is being reviewed by the immigration processing unit.",
  },
  "VE-2026-1002": {
    name: "Kenji Tanaka · Japan",
    visa: "Business e-Visa (1 Year)",
    stage: 2,
    dates: ["18 Oct 2026", "19 Oct 2026", "22 Oct 2026"],
    note: "Simulated request: please provide a clearer business card scan.",
  },
  "VE-2026-1003": {
    name: "Lucas Silva · Brazil",
    visa: "Medical e-Visa (60 Days)",
    stage: 3,
    dates: ["10 Oct 2026", "11 Oct 2026", "13 Oct 2026", "17 Oct 2026"],
    note: "A simulated decision has been reached. Real decisions are delivered only via official email from Indian authorities.",
  },
  "VE-2026-1004": {
    name: "Amara Okafor · South Africa",
    visa: "Regular Student Visa",
    stage: 0,
    dates: ["29 Oct 2026"],
    note: "Your demo application has been logged into the intake queue.",
  },
};

function Tracker() {
  const { demoAppId, data, readiness } = useVisaStore();

  const [q, setQ] = useState("");
  const [app, setApp] = useState<(App & { id: string; isLiveDraft?: boolean }) | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const track = (raw: string) => {
    const id = raw.trim().toUpperCase();
    setQ(id);
    setApp(null);
    setError("");

    if (!id) {
      setError("Please enter an application ID.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Check if user is looking up their own live draft ID
      if (id === demoAppId) {
        const stageIndex = readiness.total >= 95 ? 1 : readiness.total >= 60 ? 1 : 0;
        setApp({
          id,
          name: data.given ? `${data.given} ${data.surname} · ${data.nationality || "Intl"}` : "Current Practice Draft",
          visa: `${data.category || "Tourist"} (${data.purpose || "Tourism"})`,
          stage: stageIndex,
          dates: [new Date().toLocaleDateString("en-GB")],
          note: `Active practice draft with ${readiness.total}% readiness score. Ready to review on the dashboard.`,
          isLiveDraft: true,
        });
        return;
      }

      const found = apps[id];
      if (found) {
        setApp({ ...found, id });
      } else {
        setError(`No sample application found for "${id}". Try one of the demo IDs below.`);
      }
    }, 600);
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Application Tracking Simulator"
        title="Track a demo application"
        text="All statuses on this page are simulated walkthrough demonstrations. Real application status is available only on the official Indian e-Visa portal."
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            track(q);
          }}
        >
          <input
            className="field text-xs sm:text-sm"
            maxLength={25}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter sample ID e.g. VE-2026-1001"
          />
          <button className="btn-primary text-xs shrink-0" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Track Status
          </button>
        </form>

        {/* Demo ID pills & User Draft shortcut */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-muted-foreground">Demo IDs:</span>
          {Object.keys(apps).map((k) => (
            <button
              key={k}
              onClick={() => track(k)}
              className="rounded-full border border-border bg-card px-3 py-1 font-medium hover:bg-secondary transition text-foreground"
            >
              {k}
            </button>
          ))}
          <button
            onClick={() => track(demoAppId)}
            className="rounded-full bg-saffron-soft px-3 py-1 font-bold text-accent-foreground hover:brightness-95 flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" /> Track My Live Draft ({demoAppId})
          </button>
        </div>

        {loading && (
          <div className="mt-8 flex items-center justify-center gap-2 p-10 text-muted-foreground text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-saffron" /> Querying simulated intake records…
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="mt-8 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-xs font-medium text-destructive"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        {app && (
          <div className="card-elevated mt-8 animate-in fade-in p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-saffron-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
                {app.isLiveDraft ? "Your Live Practice Draft" : "Simulated Status · Demo Record"}
              </span>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {stages[app.stage]} (simulated)
              </span>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
              <div>
                <p className="text-xs font-mono text-muted-foreground">{app.id}</p>
                <h2 className="text-2xl font-bold font-display text-foreground">{app.name}</h2>
                <p className="text-xs text-muted-foreground">{app.visa}</p>
              </div>

              {app.isLiveDraft && (
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Readiness:</span>
                  <p className="font-display text-xl font-bold text-primary">{readiness.total}%</p>
                </div>
              )}
            </div>

            <p className="rounded-xl bg-secondary p-3.5 text-xs text-foreground leading-relaxed">
              {app.note}
            </p>

            {/* Stepper Progress Bar */}
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-saffron transition-all duration-500"
                style={{ width: `${((app.stage + 1) / stages.length) * 100}%` }}
              />
            </div>

            {/* Stage Steps */}
            <ol className="mt-6 space-y-2">
              {stages.map((s, i) => {
                const isDone = i < app.stage || (i === app.stage && i === stages.length - 1);
                const isCurrent = i === app.stage && !isDone;
                return (
                  <li key={s} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          isDone
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-saffron text-foreground ring-4 ring-saffron/20"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isDone ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </span>
                      {i < stages.length - 1 && (
                        <span className={`w-0.5 flex-1 my-1 ${i < app.stage ? "bg-emerald-600" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-xs text-foreground">{s}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {app.dates[i] ? `${app.dates[i]}${isCurrent ? " · In Progress" : ""}` : "Pending Next Milestone"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {app.isLiveDraft && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Link to="/dashboard" className="btn-primary text-xs">
                  <LayoutDashboard className="h-3.5 w-3.5" /> Open in Dashboard
                </Link>
                <Link to="/apply" className="btn-outline text-xs">
                  Continue Form
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
