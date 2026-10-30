import { Link } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, FileText, Upload, ShieldAlert, Sparkles, ExternalLink } from "lucide-react";
import type { ChecklistItem } from "@/lib/types";
import type { SpecialNotice } from "@/lib/documentRules";

interface Props {
  nationality: string;
  purpose: string;
  items: ChecklistItem[];
  notices: SpecialNotice[];
  stats: { requiredCount: number; requiredDone: number; percent: number };
  onToggleItem: (id: string) => void;
  interactive?: boolean;
}

export function PersonalisedChecklistWidget({
  nationality,
  purpose,
  items,
  notices,
  stats,
  onToggleItem,
  interactive = true,
}: Props) {
  const requiredItems = items.filter((i) => i.required);
  const optionalItems = items.filter((i) => !i.required);

  return (
    <div className="space-y-6">
      {/* Top Banner with Summary */}
      <div className="card-elevated p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron">
              <Sparkles className="h-3.5 w-3.5" /> Tailored Verification Matrix
            </span>
            <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
              Document Checklist for {nationality || "International"} Travellers
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Customized for <span className="font-semibold text-foreground">{purpose || "Tourism"}</span> visit to India.
              Based on official Indian Bureau of Immigration guidelines.
            </p>
          </div>

          <div className="rounded-xl bg-secondary p-4 text-center">
            <span className="block text-2xl font-bold text-primary">
              {stats.requiredDone} / {stats.requiredCount}
            </span>
            <span className="text-xs font-medium text-muted-foreground">Required Ready ({stats.percent}%)</span>
            <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-saffron transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nationality Notices */}
        {notices.length > 0 && (
          <div className="mt-6 space-y-2.5">
            {notices.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 rounded-lg border p-3.5 text-xs ${
                  n.type === "alert"
                    ? "border-rose-200 bg-rose-50 text-rose-900"
                    : n.type === "warning"
                    ? "border-amber-200 bg-amber-50 text-amber-900"
                    : "border-blue-200 bg-blue-50 text-blue-900"
                }`}
              >
                {n.type === "alert" ? (
                  <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                ) : n.type === "warning" ? (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-blue-600" />
                )}
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="mt-0.5 leading-relaxed opacity-90">{n.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Required Documents Section */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              !
            </span>
            <h4 className="font-display text-lg font-semibold text-foreground">
              Mandatory Documents ({requiredItems.length})
            </h4>
          </div>
          <span className="text-xs font-semibold text-destructive">Must be prepared before applying</span>
        </div>

        <div className="mt-4 space-y-3">
          {requiredItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col gap-3 rounded-xl border p-4 transition md:flex-row md:items-center md:justify-between ${
                item.checked
                  ? "border-emerald-200 bg-emerald-50/60"
                  : "border-border bg-card hover:bg-secondary/40"
              }`}
            >
              <div className="flex items-start gap-3">
                {interactive ? (
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={item.checked}
                    onChange={() => onToggleItem(item.id)}
                    className="mt-1 h-5 w-5 rounded border-input text-primary accent-[var(--primary)] focus:ring-primary"
                  />
                ) : (
                  <span className="mt-1">
                    {item.checked ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <div className="h-5 w-5 rounded border-2 border-muted-foreground/40" />
                    )}
                  </span>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor={item.id} className="cursor-pointer font-semibold text-foreground">
                      {item.title}
                    </label>
                    {item.verified && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                        Scan Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  <p className="mt-1 text-[11px] font-medium text-primary">Hint: {item.uploadHint}</p>
                </div>
              </div>

              {item.docKind && (
                <div className="shrink-0">
                  <Link
                    to="/document-checker"
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:border-saffron hover:bg-saffron-soft"
                  >
                    <Upload className="h-3.5 w-3.5 text-saffron" /> Test File in Checker
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Optional / Supporting Documents Section */}
      {optionalItems.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h4 className="font-display text-lg font-semibold text-foreground">
              Recommended Supporting Documents ({optionalItems.length})
            </h4>
            <span className="text-xs text-muted-foreground">Optional, but prevents processing delays</span>
          </div>

          <div className="mt-4 space-y-3">
            {optionalItems.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col gap-3 rounded-xl border p-4 transition md:flex-row md:items-center md:justify-between ${
                  item.checked ? "border-emerald-200 bg-emerald-50/60" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  {interactive ? (
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={item.checked}
                      onChange={() => onToggleItem(item.id)}
                      className="mt-1 h-5 w-5 rounded border-input accent-[var(--primary)]"
                    />
                  ) : (
                    <span className="mt-1">
                      {item.checked ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <div className="h-5 w-5 rounded border-2 border-muted-foreground/40" />
                      )}
                    </span>
                  )}
                  <div>
                    <label htmlFor={item.id} className="cursor-pointer font-semibold text-foreground">
                      {item.title}
                    </label>
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                    <p className="mt-1 text-[11px] font-medium text-muted-foreground">{item.uploadHint}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official disclaimer link */}
      <div className="rounded-xl bg-secondary/80 p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5 font-semibold text-foreground">
          <ExternalLink className="h-3.5 w-3.5 text-primary" /> Independent Preparation Matrix
        </p>
        <p className="mt-1">
          These requirements represent sample preparation guidelines. Indian authorities may request supplementary documentation during processing. Always refer to official government notifications at{" "}
          <a
            href="https://indianvisaonline.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline"
          >
            indianvisaonline.gov.in
          </a>
          .
        </p>
      </div>
    </div>
  );
}
