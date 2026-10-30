import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Search, Loader2, AlertTriangle } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/tracker")({
  head: () => meta("Application Tracker — VisaEase", "Enter a sample application ID to see simulated progress through each stage."),
  component: Tracker,
});

const stages = ["Submitted", "Under Review", "Documents Required", "Decision"];
type App = { name: string; visa: string; stage: number; dates: string[]; note: string };
export const apps: Record<string, App> = {
  "VE-2026-1001": { name: "Emma Clarke · United Kingdom", visa: "Tourist (demo)", stage: 1, dates: ["24 Oct 2026", "26 Oct 2026"], note: "Your demo application is being reviewed." },
  "VE-2026-1002": { name: "Kenji Tanaka · Japan", visa: "Business (demo)", stage: 2, dates: ["18 Oct 2026", "19 Oct 2026", "22 Oct 2026"], note: "Simulated request: please provide a clearer passport scan." },
  "VE-2026-1003": { name: "Lucas Silva · Brazil", visa: "Medical (demo)", stage: 3, dates: ["10 Oct 2026", "11 Oct 2026", "13 Oct 2026", "17 Oct 2026"], note: "A simulated decision has been reached. Real decisions come only from Indian authorities." },
  "VE-2026-1004": { name: "Amara Okafor · South Africa", visa: "Study (demo)", stage: 0, dates: ["29 Oct 2026"], note: "Your demo application has been received." },
};

function Tracker() {
  const [q, setQ] = useState("");
  const [app, setApp] = useState<(App & { id: string }) | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const track = (raw: string) => {
    const id = raw.trim().toUpperCase();
    setQ(id); setApp(null); setError("");
    if (!id) { setError("Please enter an application ID."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const found = apps[id];
      found ? setApp({ ...found, id }) : setError(`No sample application found for "${id}". Try one of the demo IDs below.`);
    }, 800);
  };

  return (
    <SiteLayout>
      <PageHeader eyebrow="Application Tracker" title="Track a demo application" text="All statuses on this page are simulated using sample data. Real application status is available only on the official portal." />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); track(q); }}>
          <input className="field" maxLength={20} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter sample ID e.g. VE-2026-1001" />
          <button className="btn-primary" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Track</button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">Demo IDs: {Object.keys(apps).map((k) => <button key={k} onClick={() => track(k)} className="rounded-full bg-secondary px-3 py-1 font-medium hover:bg-saffron-soft">{k}</button>)}</div>

        {loading && <div className="mt-8 flex items-center justify-center gap-2 p-10 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin text-saffron" />Looking up application…</div>}
        {error && <p role="alert" className="mt-8 flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"><AlertTriangle className="h-4 w-4" />{error}</p>}

        {app && (
          <div className="card-elevated mt-8 animate-in fade-in p-6 md:p-8">
            <p className="mb-4 inline-block rounded-full bg-saffron-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">Simulated status · Demo data</p>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-sm text-muted-foreground">{app.id}</p><h2 className="text-2xl font-semibold">{app.name}</h2><p className="text-sm text-muted-foreground">{app.visa}</p></div>
              <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">{stages[app.stage]} (simulated)</span>
            </div>
            <p className="mt-4 rounded-lg bg-secondary p-3 text-sm">{app.note}</p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-saffron transition-all" style={{ width: `${((app.stage + 1) / stages.length) * 100}%` }} /></div>
            <ol className="mt-8">
              {stages.map((s, i) => {
                const done = i < app.stage || (i === app.stage && i === stages.length - 1), cur = i === app.stage && !done;
                return (
                  <li key={s} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${done ? "bg-success text-primary-foreground" : cur ? "bg-saffron text-foreground" : "bg-secondary text-muted-foreground"}`}>{done ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}</span>
                      {i < stages.length - 1 && <span className={`w-px flex-1 ${i < app.stage ? "bg-success" : "bg-border"}`} />}
                    </div>
                    <div className="pb-6"><p className="font-semibold">{s}</p><p className="text-sm text-muted-foreground">{app.dates[i] ? `${app.dates[i]}${cur ? " · current" : ""}` : "Pending"}</p></div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
