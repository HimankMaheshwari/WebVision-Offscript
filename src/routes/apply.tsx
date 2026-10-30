import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Check,
  Lightbulb,
  Loader2,
  Activity,
  Download,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";
import { useVisaStore } from "@/lib/visaStore";
import { ApplicationHealthCheckView } from "@/components/ApplicationHealthCheckModal";
import { ApplicationSummaryModal } from "@/components/ApplicationSummaryModal";
import { ReadinessScoreWidget } from "@/components/ReadinessScoreWidget";

export const Route = createFileRoute("/apply")({
  head: () =>
    meta(
      "Guided Application — VisaEase India",
      "Practise an Indian visa application with a step-by-step demo form, dynamic readiness evaluation, and real-time health checks."
    ),
  component: Apply,
});

type F = { name: string; label: string; type?: string; options?: string[] };
type D = Partial<
  Record<
    | "given"
    | "surname"
    | "dob"
    | "gender"
    | "nationality"
    | "email"
    | "passport"
    | "issuePlace"
    | "issue"
    | "expiry"
    | "purpose"
    | "arrival"
    | "city"
    | "hotel",
    string
  >
> &
  Record<string, string | undefined>;

const steps: { title: string; tip: string; fields: F[] }[] = [
  {
    title: "Personal details",
    tip: "Enter your name exactly as printed on your passport machine-readable zone.",
    fields: [
      { name: "given", label: "Given name(s)" },
      { name: "surname", label: "Surname" },
      { name: "dob", label: "Date of birth", type: "date" },
      { name: "gender", label: "Gender", options: ["Female", "Male", "Other"] },
      {
        name: "nationality",
        label: "Nationality",
        options: [
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
        ],
      },
      { name: "email", label: "Email", type: "email" },
    ],
  },
  {
    title: "Passport details",
    tip: "Indian Immigration requires at least 6 months remaining passport validity from your arrival date.",
    fields: [
      { name: "passport", label: "Passport number" },
      { name: "issuePlace", label: "Place of issue" },
      { name: "issue", label: "Date of issue", type: "date" },
      { name: "expiry", label: "Date of expiry", type: "date" },
    ],
  },
  {
    title: "Travel details",
    tip: "Provide your planned arrival date and booked accommodation/hotel address in India.",
    fields: [
      { name: "purpose", label: "Purpose of visit", options: ["Tourism", "Business", "Medical", "Study", "Conference"] },
      { name: "arrival", label: "Expected arrival", type: "date" },
      { name: "city", label: "Arrival city", options: ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Goa", "Hyderabad", "Kochi"] },
      { name: "hotel", label: "Address / hotel in India" },
    ],
  },
];

const checklist = [
  "Scanned passport bio page (PDF)",
  "Recent passport-style photograph",
  "Travel itinerary or return ticket",
  "Supporting letter for my visit purpose (if applicable)",
];

const all = [...steps.map((s) => s.title), "Document checklist"];

export function validateStep(step: number, d: D, docs: boolean[]): Record<string, string> {
  const e: Record<string, string> = {};
  if (step < steps.length) {
    steps[step]!.fields.forEach((f) => {
      if (!d[f.name]?.trim()) e[f.name] = "This field is required";
    });
  }
  if (step === 0) {
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e["email"] = "Enter a valid email address";
    if (d.dob && new Date(d.dob) >= new Date()) e["dob"] = "Date of birth must be in the past";
    if (d.given && d.given.length > 50) e["given"] = "Max 50 characters";
  }
  if (step === 1) {
    if (d.passport && !/^[A-Za-z0-9]{6,12}$/.test(d.passport)) e["passport"] = "Use 6–12 letters or numbers";
    if (d.issue && d.expiry && d.expiry <= d.issue) e["expiry"] = "Expiry must be after issue date";
    if (d.expiry && new Date(d.expiry) <= new Date()) e["expiry"] = "Passport appears to be expired";
  }
  if (step === 2 && d.arrival && new Date(d.arrival) <= new Date()) {
    e["arrival"] = "Arrival date must be in the future";
  }
  if (step === 3 && !docs.every(Boolean)) {
    e["docs"] = "Please confirm you have every document ready";
  }
  return e;
}

function Apply() {
  const {
    data,
    updateField,
    setFormData,
    fillSampleData,
    resetAll,
    readiness,
    health,
    checklist: storeChecklist,
    toggleChecklistItem,
    verifiedDocs,
    demoAppId,
    addActivity,
  } = useVisaStore();

  const [step, setStep] = useState(0);
  const [docs, setDocs] = useState<boolean[]>(checklist.map(() => false));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Sync docs checkboxes with store checklist items
  useEffect(() => {
    const d0 = Boolean(verifiedDocs.passport?.verified || storeChecklist.items.find((i) => i.id === "chk_passport")?.checked);
    const d1 = Boolean(verifiedDocs.photo?.verified || storeChecklist.items.find((i) => i.id === "chk_photo")?.checked);
    const d2 = Boolean(storeChecklist.items.find((i) => i.id === "chk_itinerary")?.checked);
    const d3 = Boolean(
      storeChecklist.items.find((i) => i.id === "chk_business_card" || i.id === "chk_hospital" || i.id === "chk_hotel_booking")?.checked
    );
    setDocs([d0, d1, d2, d3]);
  }, [verifiedDocs, storeChecklist.items]);

  const fill = () => {
    fillSampleData();
    setErrors({});
  };

  const go = (n: number) => {
    const e = validateStep(step, data as unknown as D, docs);
    setErrors(e);
    if (!Object.keys(e).length) {
      setStep(n);
      addActivity(`Moved to step: ${all[n]}`, "review");
    }
  };

  const submit = () => {
    const e = validateStep(step, data as unknown as D, docs);
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      addActivity("Submitted practice demo application", "review");
    }, 1000);
  };

  const handleReset = () => {
    resetAll();
    setStep(0);
    setDocs(checklist.map(() => false));
    setDone(false);
    setErrors({});
  };

  const handleNavigateStep = (targetStep: number) => {
    setStep(targetStep);
    setShowHealthModal(false);
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Guided Application Practice"
        title="Practise your Indian visa application"
        text="A guided practice form to help you prepare before touching the official portal. Changes save automatically to your browser draft."
      />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Dynamic Readiness Score & Health Check Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/80 p-4 border border-border">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-saffron font-bold text-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Readiness Score:
                </span>
                <span className="font-display font-bold text-primary">{readiness.total}%</span>
                <span className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${readiness.levelColor}`}>
                  {readiness.level}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Auto-saved locally · Sample ref: <strong>{demoAppId}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowHealthModal(true)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-semibold transition ${
                health.criticalCount > 0
                  ? "border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100"
                  : "border-border bg-card text-foreground hover:bg-secondary"
              }`}
            >
              <Activity className="h-3.5 w-3.5 text-primary" />
              Health Audit ({health.issues.length})
            </button>
            <button
              onClick={() => setShowSummaryModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              <Download className="h-3.5 w-3.5" /> Summary Dossier
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <ol className="mb-8 flex items-center gap-2">
          {all.map((t, i) => (
            <li key={t} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep(i);
                }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                  i < step || done
                    ? "bg-emerald-600 text-white"
                    : i === step
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-secondary text-muted-foreground hover:bg-border"
                }`}
              >
                {i < step || done ? <Check className="h-4 w-4" /> : i + 1}
              </button>
              <span className="hidden text-xs font-medium md:block text-foreground">{t}</span>
              {i < all.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>

        {/* Main Form Box */}
        <div className="card-elevated p-6 md:p-8">
          {done ? (
            <div role="status" className="py-8 text-center space-y-4">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-7 w-7" />
              </span>
              <h2 className="text-2xl font-bold font-display text-foreground">
                Demo Application Practice Completed!
              </h2>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Your simulated reference code is <strong>{demoAppId}</strong>.
                Your practice dossier is ready for inspection. Remember: this was <strong>not</strong> transmitted to any government server.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Link to="/tracker" className="btn-primary text-xs">
                  Track Demo Application
                </Link>
                <Link to="/dashboard" className="btn-saffron text-xs">
                  Go to Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button onClick={() => setShowSummaryModal(true)} className="btn-outline text-xs">
                  <Download className="h-3.5 w-3.5" /> Download Summary
                </button>
                <button className="btn-outline text-xs" onClick={handleReset}>
                  <RotateCcw className="h-3.5 w-3.5" /> Start Over
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-saffron">
                    Step {step + 1} of {all.length}
                  </span>
                  <h2 className="text-2xl font-bold font-display text-foreground">{all[step]}</h2>
                </div>
                {step < steps.length && (
                  <button
                    type="button"
                    onClick={fill}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-bold text-accent-foreground hover:bg-saffron-soft transition"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-saffron" /> Fill sample data
                  </button>
                )}
              </div>

              {step < steps.length ? (
                <>
                  <div className="mt-4 flex items-start gap-3 rounded-lg bg-saffron-soft/60 p-3.5 text-xs text-accent-foreground border border-saffron/30">
                    <Lightbulb className="h-4 w-4 shrink-0 text-saffron mt-0.5" />
                    <span>{steps[step]!.tip}</span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {steps[step]!.fields.map((f) => (
                      <label key={f.name} className="block">
                        <span className="mb-1 block text-xs font-semibold text-foreground">
                          {f.label} <span className="text-rose-500">*</span>
                        </span>
                        {f.options ? (
                          <select
                            className="field text-xs"
                            value={(data as Record<string, string>)[f.name] ?? ""}
                            onChange={(e) => updateField(f.name as keyof typeof data, e.target.value)}
                          >
                            <option value="">Select option</option>
                            {f.options.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            className="field text-xs"
                            maxLength={100}
                            type={f.type ?? "text"}
                            value={(data as Record<string, string>)[f.name] ?? ""}
                            onChange={(e) => updateField(f.name as keyof typeof data, e.target.value)}
                            placeholder={`Enter ${f.label.toLowerCase()}`}
                          />
                        )}
                        {errors[f.name] && (
                          <span className="mt-1 block text-xs font-medium text-destructive">
                            {errors[f.name]}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                /* Document Checklist Step */
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg bg-secondary/80 p-3.5 text-xs text-muted-foreground">
                    <p>
                      Tick each item you have prepared. You can test your PDF and photo files directly in the{" "}
                      <Link to="/document-checker" className="font-semibold text-primary underline">
                        Document Checker
                      </Link>
                      .
                    </p>
                  </div>

                  {checklist.map((c, i) => (
                    <label
                      key={c}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                        docs[i] ? "border-emerald-200 bg-emerald-50/60" : "border-border hover:bg-secondary/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[var(--primary)] text-primary"
                        checked={docs[i]}
                        onChange={() => {
                          const nextDocs = docs.map((v, j) => (j === i ? !v : v));
                          setDocs(nextDocs);
                          // Also toggle corresponding item in store
                          const keyMap = ["chk_passport", "chk_photo", "chk_itinerary", "chk_hotel_booking"];
                          if (keyMap[i]) toggleChecklistItem(keyMap[i]);
                        }}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-foreground">{c}</span>
                        {i === 0 && verifiedDocs.passport?.verified && (
                          <span className="ml-2 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            PDF Verified
                          </span>
                        )}
                        {i === 1 && verifiedDocs.photo?.verified && (
                          <span className="ml-2 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            Photo Verified
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                  {errors["docs"] && <p className="text-xs text-destructive font-medium">{errors["docs"]}</p>}
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <p role="alert" className="mt-5 rounded-md bg-destructive/10 p-3 text-xs text-destructive font-medium">
                  Please fix the highlighted fields above before advancing.
                </p>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between border-t pt-4">
                <button
                  type="button"
                  className="btn-outline text-xs"
                  disabled={step === 0 || loading}
                  onClick={() => {
                    setErrors({});
                    setStep(step - 1);
                  }}
                >
                  Back
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHealthModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline px-2 py-1"
                  >
                    Run Health Audit
                  </button>
                  {step < all.length - 1 ? (
                    <button type="button" className="btn-primary text-xs" onClick={() => go(step + 1)}>
                      Next Step <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-saffron text-xs font-bold"
                      onClick={submit}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {loading ? "Submitting…" : "Submit Practice Dossier"}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Health Check Modal */}
      {showHealthModal && (
        <ApplicationHealthCheckView
          health={health}
          onNavigateStep={handleNavigateStep}
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
