import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Info, Loader2, ArrowRight, Layers, Sparkles } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";
import { useVisaStore } from "@/lib/visaStore";
import type { VisaCategory } from "@/lib/types";

export const Route = createFileRoute("/visa-finder")({
  head: () =>
    meta(
      "Smart Visa Finder — VisaEase India",
      "Select your nationality, purpose and duration to discover the most appropriate Indian visa category."
    ),
  component: Finder,
});

const nationalities = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Canada",
  "Singapore",
  "Brazil",
  "South Africa",
  "Other",
];
const purposes = ["Tourism", "Business", "Medical", "Study"] as const;
const durations = ["Up to 30 days", "1 – 6 months", "6 months – 1 year", "More than 1 year"];

type Result = {
  name: string;
  category: VisaCategory;
  why: string;
  docs: string[];
  online: string;
};

export function suggestVisa(purpose: string, duration: string): Result {
  const long = duration === "More than 1 year";
  switch (purpose) {
    case "Business":
      return {
        name: "e-Business Visa category (1 Year)",
        category: "Business",
        why: "Your trip is for commercial or business activities such as corporate meetings, trade negotiations, or sales, which generally fall under the business visa category.",
        docs: [
          "Valid passport (min 6 months validity)",
          "Recent passport photograph with white background",
          "Copy of corporate business card",
          "Official invitation letter from Indian host entity",
        ],
        online: long
          ? "Stays exceeding 180 continuous days require registration with e-FRRO or an application through an Indian Mission."
          : "An electronic (e-Visa) option is available for 165+ eligible nationalities with multiple entries.",
      };
    case "Medical":
      return {
        name: "e-Medical Visa category (60 Days)",
        category: "Medical",
        why: "You plan to receive specialized treatment in India, so the e-Medical visa category is the closest match.",
        docs: [
          "Valid passport",
          "Recent photograph",
          "Official recommendation letter from treating hospital in India",
          "Up to 2 Medical Attendant visas can accompany principal patient",
        ],
        online: "An electronic (e-Visa) option is available offering triple entry within 60 days.",
      };
    case "Study":
      return {
        name: "Regular Student Visa category (Paper / Mission)",
        category: "Student",
        why: "You plan to study in India, which generally needs an institutional student visa linked to your university's admission and Ministry approvals.",
        docs: [
          "Physical passport submitted to Indian Mission",
          "Recent photographs",
          "Admission letter from recognized university/institute",
          "Proof of financial support / bank statements",
        ],
        online: "Student visas are typically applied for through an Indian Diplomatic Mission or VFS center rather than as an e-Visa.",
      };
    default:
      return {
        name: "e-Tourist Visa category (30-Day / 1-Year / 5-Year)",
        category: "Tourist",
        why: "Your trip is for sightseeing, visiting friends or family, or short recreational stay, which matches the tourist visa category.",
        docs: [
          "Valid passport (PDF scan of bio page)",
          "Recent photograph (square JPEG, white background)",
          "Confirmed return or onward ticket",
        ],
        online: long
          ? "Very long stays may require an application through an Indian Mission or 5-year multi-entry tourist e-Visa."
          : "An electronic (e-Visa) option is available for eligible nationalities (double entry for 30-day, multiple entry for 1/5-year).",
      };
  }
}

function Finder() {
  const { setFormData, addActivity } = useVisaStore();
  const navigate = useNavigate();

  const [nat, setNat] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nat || !purpose || !duration) {
      setError("Please choose your nationality, purpose and duration.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const res = suggestVisa(purpose, duration);
      setResult(res);
      setLoading(false);
      addActivity(`Found visa match: ${res.name}`, "profile");
    }, 600);
  };

  const handleApplyToDraft = () => {
    if (!result) return;
    setFormData({
      nationality: nat,
      purpose,
      category: result.category,
    });
    navigate({ to: "/apply" });
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Smart Visa Finder"
        title="Which Indian visa fits your trip?"
        text="Answer three quick questions to see a suggested visa category. This is guidance only — eligibility is decided solely by Indian authorities."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1.2fr]">
        <form className="card-elevated space-y-5 p-6" onSubmit={submit}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Passport Nationality</span>
            <select className="field text-xs" value={nat} onChange={(e) => setNat(e.target.value)}>
              <option value="">Select country</option>
              {nationalities.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Purpose of Visit</span>
            <div className="grid grid-cols-2 gap-2">
              {purposes.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                    purpose === p
                      ? "border-saffron bg-saffron-soft text-accent-foreground font-bold shadow-xs"
                      : "border-border hover:bg-secondary text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Duration of Stay</span>
            <select className="field text-xs" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="">Select duration</option>
              {durations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-xs text-destructive font-medium">
              {error}
            </p>
          )}

          <button className="btn-primary w-full text-xs font-bold" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Matching Visa Category…" : "Find Matching Visa"}
          </button>
        </form>

        <div>
          {result ? (
            <div className="card-elevated animate-in fade-in slide-in-from-bottom-2 p-6 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                <Info className="h-3.5 w-3.5" /> Guidance only — not an eligibility decision
              </span>

              <h2 className="text-2xl font-bold font-display text-foreground">{result.name}</h2>
              <p className="text-xs text-muted-foreground">
                Tailored for a <strong>{nat}</strong> traveller · {purpose} · {duration}
              </p>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Why this suggestion</h3>
                <p className="mt-1 text-xs text-foreground leading-relaxed">{result.why}</p>
              </div>

              <div className="rounded-xl bg-secondary p-3 text-xs text-foreground">
                <strong>Submission Route:</strong> {result.online}
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Documents usually requested
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {result.docs.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleApplyToDraft}
                  className="btn-saffron text-xs font-bold"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Apply this to My Practice Form
                </button>
                <Link to="/compare" className="btn-outline text-xs">
                  <Layers className="h-3.5 w-3.5 text-primary" /> Compare All Categories
                </Link>
                <Link to="/document-checker" className="btn-outline text-xs">
                  Check Documents
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 text-center text-muted-foreground">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-saffron" />
              ) : (
                <>
                  <Layers className="h-10 w-10 text-muted-foreground/40 mb-2" />
                  <p className="font-semibold text-foreground text-sm">Select your details to view recommendations</p>
                  <p className="text-xs mt-1 max-w-xs">
                    We will analyze your nationality, purpose, and trip length to recommend the right category.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
