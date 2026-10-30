import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/visa-finder")({
  head: () => meta("Smart Visa Finder — VisaEase", "Select your nationality, purpose and duration to see a suggested Indian visa category."),
  component: Finder,
});

const nationalities = ["United States", "United Kingdom", "Germany", "France", "Australia", "Japan", "Canada", "Brazil", "South Africa", "Singapore", "Other"];
const purposes = ["Tourism", "Business", "Medical", "Study"] as const;
const durations = ["Up to 30 days", "1 – 6 months", "6 months – 1 year", "More than 1 year"];

type Result = { name: string; why: string; docs: string[]; online: string };

export function suggestVisa(purpose: string, duration: string): Result {
  const long = duration === "More than 1 year";
  switch (purpose) {
    case "Business":
      return { name: "Business Visa category", why: "Your trip is for business activities such as meetings, trade or sales, which generally fall under the business visa category.", docs: ["Valid passport", "Recent photograph", "Business card or invitation letter"], online: long ? "Longer stays may need an application through an Indian Mission." : "An electronic (e-Visa) option is often available for eligible nationalities." };
    case "Medical":
      return { name: "Medical Visa category", why: "You plan to receive treatment in India, so the medical visa category is the closest match.", docs: ["Valid passport", "Recent photograph", "Letter from the treating hospital in India"], online: "An electronic (e-Visa) option is often available for eligible nationalities." };
    case "Study":
      return { name: "Student Visa category", why: "You plan to study in India, which generally needs a student visa linked to your institution's admission.", docs: ["Valid passport", "Recent photograph", "Admission letter from the institution", "Proof of funds"], online: "Student visas are typically applied for through an Indian Mission rather than as an e-Visa." };
    default:
      return { name: "Tourist Visa category", why: "Your trip is for sightseeing, visiting friends or family, or a short recreational stay, which matches the tourist visa category.", docs: ["Valid passport", "Recent photograph", "Travel itinerary or return ticket"], online: long ? "Very long stays may require an application through an Indian Mission." : "An electronic (e-Visa) option is often available for eligible nationalities." };
  }
}

function Finder() {
  const [nat, setNat] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nat || !purpose || !duration) { setError("Please choose your nationality, purpose and duration."); return; }
    setError(""); setLoading(true); setResult(null);
    setTimeout(() => { setResult(suggestVisa(purpose, duration)); setLoading(false); }, 700);
  };

  return (
    <SiteLayout>
      <PageHeader eyebrow="Smart Visa Finder" title="Which Indian visa fits your trip?" text="Answer three questions to see a suggested visa category. This is guidance only — eligibility is decided by Indian authorities." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1.2fr]">
        <form className="card-elevated space-y-5 p-6" onSubmit={submit}>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Nationality</span>
            <select className="field" value={nat} onChange={(e) => setNat(e.target.value)}><option value="">Select country</option>{nationalities.map((n) => <option key={n}>{n}</option>)}</select>
          </label>
          <div><span className="mb-1.5 block text-sm font-semibold">Purpose of visit</span>
            <div className="grid grid-cols-2 gap-2">{purposes.map((p) => (
              <button type="button" key={p} onClick={() => setPurpose(p)} className={`rounded-md border px-3 py-2.5 text-sm font-medium transition ${purpose === p ? "border-saffron bg-saffron-soft text-accent-foreground" : "hover:bg-secondary"}`}>{p}</button>
            ))}</div>
          </div>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Duration of stay</span>
            <select className="field" value={duration} onChange={(e) => setDuration(e.target.value)}><option value="">Select duration</option>{durations.map((d) => <option key={d}>{d}</option>)}</select>
          </label>
          {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Finding…" : "Find Visa"}</button>
        </form>

        <div>
          {result ? (
            <div className="card-elevated animate-in fade-in slide-in-from-bottom-2 p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground"><Info className="h-3.5 w-3.5" />Guidance only — not an eligibility decision</span>
              <h2 className="mt-4 text-2xl font-semibold">{result.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">For a {nat} traveller · {purpose} · {duration}</p>
              <h3 className="mt-5 font-sans text-sm font-semibold">Why this suggestion</h3>
              <p className="mt-1 text-muted-foreground">{result.why}</p>
              <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">{result.online}</p>
              <h3 className="mt-5 font-sans text-sm font-semibold">Documents usually requested</h3>
              <ul className="mt-2 space-y-1.5">{result.docs.map((d) => <li key={d} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" />{d}</li>)}</ul>
              <p className="mt-5 text-xs text-muted-foreground">Rules, fees and eligibility vary by nationality and change over time. Always confirm on the official Government of India visa website before applying.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/document-checker" className="btn-saffron text-sm">Check my documents</Link>
                <Link to="/apply" className="btn-outline text-sm">Practise the form</Link>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center rounded-xl border-2 border-dashed p-8 text-center text-muted-foreground">
              {loading ? <Loader2 className="h-8 w-8 animate-spin text-saffron" /> : "Your suggested visa category will appear here."}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
