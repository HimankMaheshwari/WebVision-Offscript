import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Lightbulb, Loader2 } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/apply")({
  head: () => meta("Guided Application — VisaEase", "Practise an Indian visa application with a step-by-step demo form and helpful tips."),
  component: Apply,
});

type F = { name: string; label: string; type?: string; options?: string[] };
type D = Partial<Record<"given"|"surname"|"dob"|"gender"|"nationality"|"email"|"passport"|"issuePlace"|"issue"|"expiry"|"purpose"|"arrival"|"city"|"hotel", string>> & Record<string, string | undefined>;
const steps: { title: string; tip: string; fields: F[] }[] = [
  { title: "Personal details", tip: "Enter your name exactly as printed on your passport.", fields: [
    { name: "given", label: "Given name(s)" }, { name: "surname", label: "Surname" },
    { name: "dob", label: "Date of birth", type: "date" }, { name: "gender", label: "Gender", options: ["Female", "Male", "Other"] },
    { name: "nationality", label: "Nationality", options: ["United States", "United Kingdom", "Germany", "Australia", "Japan", "Other"] }, { name: "email", label: "Email", type: "email" } ] },
  { title: "Passport details", tip: "Check your passport's expiry date carefully against your travel dates.", fields: [
    { name: "passport", label: "Passport number" }, { name: "issuePlace", label: "Place of issue" },
    { name: "issue", label: "Date of issue", type: "date" }, { name: "expiry", label: "Date of expiry", type: "date" } ] },
  { title: "Travel details", tip: "Have your planned arrival date and accommodation address ready.", fields: [
    { name: "purpose", label: "Purpose of visit", options: ["Tourism", "Business", "Medical", "Study"] },
    { name: "arrival", label: "Expected arrival", type: "date" },
    { name: "city", label: "Arrival city", options: ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Goa"] },
    { name: "hotel", label: "Address / hotel in India" } ] },
];
const checklist = ["Scanned passport bio page (PDF)", "Recent passport-style photograph", "Travel itinerary or return ticket", "Supporting letter for my visit purpose (if applicable)"];
const all = [...steps.map((s) => s.title), "Document checklist"];

export function validateStep(step: number, d: D, docs: boolean[]): Record<string, string> {
  const e: Record<string, string> = {};
  if (step < steps.length) steps[step]!.fields.forEach((f) => { if (!d[f.name]?.trim()) e[f.name] = "This field is required"; });
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
  if (step === 2 && d.arrival && new Date(d.arrival) <= new Date()) e["arrival"] = "Arrival date must be in the future";
  if (step === 3 && !docs.every(Boolean)) e["docs"] = "Please confirm you have every document ready";
  return e;
}

function Apply() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<D>({});
  const [docs, setDocs] = useState<boolean[]>(checklist.map(() => false));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const fill = () => setData({ given: "Emma", surname: "Clarke", dob: "1992-04-18", gender: "Female", nationality: "United Kingdom", email: "emma.clarke@example.com", passport: "533380006", issuePlace: "London", issue: "2021-06-10", expiry: "2031-06-09", purpose: "Tourism", arrival: "2026-12-14", city: "Delhi", hotel: "Janpath, New Delhi" });
  const go = (n: number) => { const e = validateStep(step, data, docs); setErrors(e); if (!Object.keys(e).length) setStep(n); };
  const submit = () => {
    const e = validateStep(step, data, docs); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true); setTimeout(() => { setLoading(false); setDone(true); }, 1200);
  };
  const reset = () => { setStep(0); setData({}); setDocs(checklist.map(() => false)); setDone(false); setErrors({}); };

  return (
    <SiteLayout>
      <PageHeader eyebrow="Guided Application" title="Practise your visa application" text="A demo form to help you prepare. Nothing is sent to any government — this is practice only." />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ol className="mb-8 flex items-center gap-2">
          {all.map((t, i) => (
            <li key={t} className="flex flex-1 items-center gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i < step || done ? "bg-success text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{i < step || done ? <Check className="h-4 w-4" /> : i + 1}</span>
              <span className="hidden text-sm font-medium md:block">{t}</span>
              {i < all.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>

        <div className="card-elevated p-6 md:p-8">
          {done ? (
            <div role="status" className="py-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success"><Check className="h-7 w-7" /></span>
              <h2 className="mt-4 text-2xl font-semibold">Demo application submitted!</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">Your simulated reference is <strong>VE-2026-1001</strong>. This was <strong>not</strong> sent to any government and is not a real application.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/tracker" className="btn-primary">Track demo application</Link><button className="btn-outline" onClick={reset}>Start over</button></div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl font-semibold">{all[step]}</h2>
                {step < steps.length && <button onClick={fill} className="text-sm font-semibold text-accent-foreground underline">Fill sample data</button>}
              </div>
              {step < steps.length ? (
                <>
                  <div className="mt-4 flex gap-3 rounded-lg bg-saffron-soft p-4 text-sm text-accent-foreground"><Lightbulb className="h-5 w-5 shrink-0" />{steps[step]!.tip}</div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {steps[step]!.fields.map((f) => (
                      <label key={f.name} className="block">
                        <span className="mb-1.5 block text-sm font-semibold">{f.label}</span>
                        {f.options ? (
                          <select className="field" value={data[f.name] ?? ""} onChange={(e) => setData({ ...data, [f.name]: e.target.value })}><option value="">Select</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
                        ) : (
                          <input className="field" maxLength={100} type={f.type ?? "text"} value={data[f.name] ?? ""} onChange={(e) => setData({ ...data, [f.name]: e.target.value })} />
                        )}
                        {errors[f.name] && <span className="mt-1 block text-xs text-destructive">{errors[f.name]}</span>}
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Tick each item you have ready. You can test your files in the <Link to="/document-checker" className="font-semibold text-primary underline">Document Checker</Link>.</p>
                  {checklist.map((c, i) => (
                    <label key={c} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${docs[i] ? "border-success bg-success-soft" : "hover:bg-secondary"}`}>
                      <input type="checkbox" className="h-4 w-4 accent-[var(--success)]" checked={docs[i]} onChange={() => setDocs(docs.map((v, j) => (j === i ? !v : v)))} />
                      <span className="text-sm font-medium">{c}</span>
                    </label>
                  ))}
                  {errors["docs"] && <p className="text-sm text-destructive">{errors["docs"]}</p>}
                </div>
              )}
              {Object.keys(errors).length > 0 && <p role="alert" className="mt-5 rounded-md bg-destructive/10 p-3 text-sm text-destructive">Please fix the highlighted fields before continuing.</p>}
              <div className="mt-8 flex justify-between">
                <button className="btn-outline" disabled={step === 0 || loading} onClick={() => { setErrors({}); setStep(step - 1); }}>Back</button>
                {step < all.length - 1
                  ? <button className="btn-primary" onClick={() => go(step + 1)}>Next</button>
                  : <button className="btn-saffron" onClick={submit} disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Submitting…" : "Submit demo"}</button>}
              </div>
            </>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
