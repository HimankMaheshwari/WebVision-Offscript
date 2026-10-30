import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, CheckCircle2, AlertTriangle, Loader2, X, ShieldCheck, Sparkles, ArrowRight, LayoutDashboard } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";
import { useVisaStore } from "@/lib/visaStore";
import { ReadinessScoreWidget } from "@/components/ReadinessScoreWidget";

export const Route = createFileRoute("/document-checker")({
  head: () =>
    meta(
      "Document Checker — VisaEase India",
      "Check your passport PDF and photograph for file type, size and readability before applying. 100% private in-browser analysis."
    ),
  component: Checker,
});

type Check = { label: string; ok: boolean; note: string };
type Kind = "passport" | "photo";

const rules = {
  passport: { title: "Passport Bio-Page (PDF)", accept: "application/pdf", maxKb: 1024, hint: "PDF file, up to 1 MB" },
  photo: { title: "Passport Photograph", accept: "image/jpeg,image/png", maxKb: 1024, hint: "JPEG or PNG, up to 1 MB, white background" },
};

function readImage(file: File): Promise<{ w: number; h: number }> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      res({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rej(new Error("unreadable"));
    };
    img.src = url;
  });
}

async function readPdf(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return String.fromCharCode(...head) === "%PDF-";
}

async function analyse(kind: Kind, file: File | null): Promise<Check[]> {
  if (!file) {
    return [{ label: "File uploaded", ok: false, note: "This document is required but hasn't been uploaded." }];
  }
  const kb = file.size / 1024;
  const checks: Check[] = [{ label: "File uploaded", ok: true, note: file.name }];

  if (kind === "passport") {
    const typeOk = file.type === "application/pdf";
    checks.push({ label: "File type", ok: typeOk, note: typeOk ? "PDF" : `${file.type || "Unknown type"} — please upload a PDF` });
    checks.push({ label: "File size", ok: kb > 0 && kb <= rules.passport.maxKb, note: `${kb.toFixed(0)} KB (max ${rules.passport.maxKb} KB)` });
    const readable = typeOk && (await readPdf(file));
    checks.push({ label: "File readable", ok: readable, note: readable ? "Valid PDF file" : "The file could not be read as a PDF" });
  } else {
    const typeOk = ["image/jpeg", "image/png"].includes(file.type);
    checks.push({
      label: "File type",
      ok: typeOk,
      note: typeOk ? file.type.replace("image/", "").toUpperCase() : `${file.type || "Unknown type"} — please upload JPEG or PNG`,
    });
    checks.push({ label: "File size", ok: kb > 0 && kb <= rules.photo.maxKb, note: `${kb.toFixed(0)} KB (max ${rules.photo.maxKb} KB)` });
    try {
      const { w, h } = await readImage(file);
      checks.push({ label: "Image readable", ok: true, note: `${w}×${h} pixels` });
      checks.push({
        label: "Image dimensions",
        ok: w >= 350 && h >= 350,
        note: w >= 350 && h >= 350 ? "Clear enough for standard e-Visa upload" : "Very small — a larger photo is recommended",
      });
    } catch {
      checks.push({ label: "Image readable", ok: false, note: "The image could not be opened — it may be damaged" });
    }
  }
  return checks;
}

function Badge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
        ok ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
      }`}
    >
      {ok ? "PASS" : "NEEDS ATTENTION"}
    </span>
  );
}

function Slot({
  kind,
  file,
  onChange,
  checks,
}: {
  kind: Kind;
  file: File | null;
  onChange: (f: File | null) => void;
  checks?: Check[] | undefined;
}) {
  const r = rules[kind];
  return (
    <div className="card-elevated p-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {r.title} <span className="text-rose-500">*</span>
          </h2>
          <p className="text-xs text-muted-foreground">{r.hint}</p>
        </div>
        {checks && <Badge ok={checks.every((c) => c.ok)} />}
      </div>

      <label
        className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center transition hover:border-saffron hover:bg-saffron-soft/40"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onChange(e.dataTransfer.files[0] ?? null);
        }}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          {file ? file.name : "Click to choose or drop a file"}
        </span>
        <span className="text-xs text-muted-foreground">Processed entirely in your browser</span>
        <input
          type="file"
          className="hidden"
          accept={r.accept}
          onChange={(e) => {
            onChange(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </label>

      {file && (
        <button
          onClick={() => onChange(null)}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
        >
          <X className="h-3 w-3" /> Remove file
        </button>
      )}

      {checks && (
        <ul className="mt-4 space-y-2">
          {checks.map((c) => (
            <li key={c.label} className="flex gap-3 rounded-lg bg-secondary p-3 text-xs">
              {c.ok ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
              )}
              <div>
                <p className="font-semibold text-foreground">{c.label}</p>
                <p className="text-muted-foreground">{c.note}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Checker() {
  const { setDocVerified, removeDoc, readiness } = useVisaStore();

  const [files, setFiles] = useState<Record<Kind, File | null>>({ passport: null, photo: null });
  const [results, setResults] = useState<Record<Kind, Check[]> | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: Kind) => (f: File | null) => {
    setFiles((p) => ({ ...p, [k]: f }));
    setResults(null);
    if (!f) {
      removeDoc(k);
    }
  };

  const run = async () => {
    setLoading(true);
    const [passport, photo] = await Promise.all([analyse("passport", files.passport), analyse("photo", files.photo)]);
    await new Promise((r) => setTimeout(r, 600));

    setResults({ passport, photo });
    setLoading(false);

    // If passport checks pass, sync to visa store
    if (passport.every((c) => c.ok) && files.passport) {
      setDocVerified("passport", {
        fileName: files.passport.name,
        fileSizeKb: Math.round(files.passport.size / 1024),
        fileType: files.passport.type,
        verified: true,
        notes: "Passed PDF check & size rules",
      });
    }

    // If photo checks pass, sync to visa store
    if (photo.every((c) => c.ok) && files.photo) {
      setDocVerified("photo", {
        fileName: files.photo.name,
        fileSizeKb: Math.round(files.photo.size / 1024),
        fileType: files.photo.type,
        verified: true,
        notes: "Passed format & dimension checks",
      });
    }
  };

  const allOk = results && [...results.passport, ...results.photo].every((c) => c.ok);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Technical Scan Validation"
        title="Check your document files before you apply"
        text="Basic checks for file type, dimensions, PDF structure, and size. Files are checked locally in your browser memory and are never uploaded to any remote server."
      />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="flex items-center justify-between rounded-xl bg-secondary/80 p-3.5 text-xs text-muted-foreground border border-border">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Client-Side Privacy Guarantee: Your passport and photo files remain on your device only.</span>
          </p>
          <div className="hidden sm:flex items-center gap-2 font-semibold text-foreground">
            <span>Current Readiness:</span>
            <span className="font-bold text-primary">{readiness.total}%</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Slot kind="passport" file={files.passport} onChange={set("passport")} checks={results?.passport} />
          <Slot kind="photo" file={files.photo} onChange={set("photo")} checks={results?.photo} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <button className="btn-primary min-w-48 text-xs font-bold" onClick={run} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Analyzing Files Locally…" : "Run Document Diagnostics"}
          </button>

          {results && (
            <div
              role="status"
              className={`w-full max-w-2xl rounded-2xl p-6 text-center border ${
                allOk
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : "border-amber-300 bg-amber-50 text-amber-900"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {allOk ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <AlertTriangle className="h-6 w-6 text-amber-600" />}
                <p className="text-xl font-bold font-display">
                  {allOk ? "PASS — Your document scans are verified!" : "ATTENTION REQUIRED — See issues above"}
                </p>
              </div>
              <p className="mt-2 text-xs opacity-90 max-w-lg mx-auto leading-relaxed">
                {allOk
                  ? "Both files meet the technical upload prerequisites for the Indian e-Visa portal. Your Visa Readiness Score has been credited."
                  : "One or more documents do not meet the standard guidelines. Please correct the highlighted issues before official submission."}
              </p>

              {allOk && (
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link to="/apply" className="btn-primary text-xs">
                    Continue Guided Application <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link to="/dashboard" className="btn-outline text-xs">
                    <LayoutDashboard className="h-3.5 w-3.5 text-primary" /> View Dashboard
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
