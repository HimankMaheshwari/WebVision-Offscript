import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, CheckCircle2, AlertTriangle, Loader2, X, ShieldCheck } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/document-checker")({
  head: () => meta("Document Checker — VisaEase", "Check your passport PDF and photograph for file type, size and readability before applying."),
  component: Checker,
});

type Check = { label: string; ok: boolean; note: string };
type Kind = "passport" | "photo";

const rules = {
  passport: { title: "Passport (PDF)", accept: "application/pdf", maxKb: 1024, hint: "PDF file, up to 1 MB" },
  photo: { title: "Photograph", accept: "image/jpeg,image/png", maxKb: 1024, hint: "JPEG or PNG, up to 1 MB" },
};

function readImage(file: File): Promise<{ w: number; h: number }> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { res({ w: img.naturalWidth, h: img.naturalHeight }); URL.revokeObjectURL(url); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("unreadable")); };
    img.src = url;
  });
}

async function readPdf(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return String.fromCharCode(...head) === "%PDF-";
}

async function analyse(kind: Kind, file: File | null): Promise<Check[]> {
  if (!file) return [{ label: "File uploaded", ok: false, note: "This document is required but hasn't been uploaded." }];
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
    checks.push({ label: "File type", ok: typeOk, note: typeOk ? file.type.replace("image/", "").toUpperCase() : `${file.type || "Unknown type"} — please upload JPEG or PNG` });
    checks.push({ label: "File size", ok: kb > 0 && kb <= rules.photo.maxKb, note: `${kb.toFixed(0)} KB (max ${rules.photo.maxKb} KB)` });
    try {
      const { w, h } = await readImage(file);
      checks.push({ label: "Image readable", ok: true, note: `${w}×${h} pixels` });
      checks.push({ label: "Image dimensions", ok: w >= 350 && h >= 350, note: w >= 350 && h >= 350 ? "Clear enough for most forms" : "Very small — a larger photo is recommended" });
    } catch { checks.push({ label: "Image readable", ok: false, note: "The image could not be opened — it may be damaged" }); }
  }
  return checks;
}

function Badge({ ok }: { ok: boolean }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${ok ? "bg-success-soft text-success" : "bg-saffron-soft text-accent-foreground"}`}>{ok ? "PASS" : "NEEDS ATTENTION"}</span>;
}

function Slot({ kind, file, onChange, checks }: { kind: Kind; file: File | null; onChange: (f: File | null) => void; checks?: Check[] | undefined }) {
  const r = rules[kind];
  return (
    <div className="card-elevated p-6">
      <div className="flex items-start justify-between gap-2">
        <div><h2 className="text-xl font-semibold">{r.title} <span className="text-destructive">*</span></h2><p className="text-sm text-muted-foreground">{r.hint}</p></div>
        {checks && <Badge ok={checks.every((c) => c.ok)} />}
      </div>
      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition hover:border-saffron hover:bg-saffron-soft"
        onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onChange(e.dataTransfer.files[0] ?? null); }}>
        <Upload className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm font-medium">{file ? file.name : "Click to choose or drop a file"}</span>
        <input type="file" className="hidden" accept={r.accept} onChange={(e) => { onChange(e.target.files?.[0] ?? null); e.target.value = ""; }} />
      </label>
      {file && <button onClick={() => onChange(null)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"><X className="h-3 w-3" />Remove file</button>}
      {checks && (
        <ul className="mt-4 space-y-2">{checks.map((c) => (
          <li key={c.label} className="flex gap-3 rounded-lg bg-secondary p-3">
            {c.ok ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" /> : <AlertTriangle className="h-5 w-5 shrink-0 text-saffron" />}
            <div><p className="text-sm font-semibold">{c.label}</p><p className="text-xs text-muted-foreground">{c.note}</p></div>
          </li>
        ))}</ul>
      )}
    </div>
  );
}

function Checker() {
  const [files, setFiles] = useState<Record<Kind, File | null>>({ passport: null, photo: null });
  const [results, setResults] = useState<Record<Kind, Check[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const set = (k: Kind) => (f: File | null) => { setFiles((p) => ({ ...p, [k]: f })); setResults(null); };

  const run = async () => {
    setLoading(true);
    const [passport, photo] = await Promise.all([analyse("passport", files.passport), analyse("photo", files.photo)]);
    await new Promise((r) => setTimeout(r, 600));
    setResults({ passport, photo }); setLoading(false);
  };
  const allOk = results && [...results.passport, ...results.photo].every((c) => c.ok);

  return (
    <SiteLayout>
      <PageHeader eyebrow="Document Checker" title="Check your files before you apply" text="Basic checks for file type, size and readability. Files are checked in your browser only and are never uploaded or stored." />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" />Your documents stay on your device. Refreshing the page clears them.</p>
        <div className="grid gap-6 md:grid-cols-2">
          <Slot kind="passport" file={files.passport} onChange={set("passport")} checks={results?.passport} />
          <Slot kind="photo" file={files.photo} onChange={set("photo")} checks={results?.photo} />
        </div>
        <div className="mt-6 flex flex-col items-center gap-4">
          <button className="btn-primary min-w-48" onClick={run} disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Checking…" : "Check documents"}</button>
          {results && (
            <div role="status" className={`w-full rounded-xl p-5 text-center ${allOk ? "bg-success-soft text-success" : "bg-saffron-soft text-accent-foreground"}`}>
              <p className="text-lg font-bold">{allOk ? "PASS — your files look ready" : "NEEDS ATTENTION — see the reasons above"}</p>
              <p className="mt-1 text-sm">These are basic technical checks only and do not confirm that your documents will be accepted.</p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
