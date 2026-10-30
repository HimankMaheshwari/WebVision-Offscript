import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, X, ShieldCheck, ArrowRight, ExternalLink, HelpCircle, Layers } from "lucide-react";
import { VISA_CATEGORIES_DATA } from "@/lib/visaComparisonData";
import type { CategoryComparisonItem } from "@/lib/types";

export function VisaComparisonWidget() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["tourist_30d", "tourist_1yr", "business_1yr"]);
  const [activeTab, setActiveTab] = useState<string>("all");

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([...selectedIds.slice(1), id]);
      }
    }
  };

  const filteredCategories = VISA_CATEGORIES_DATA.filter((cat) => {
    if (activeTab === "tourist") return cat.id.includes("tourist");
    if (activeTab === "business") return cat.id.includes("business");
    if (activeTab === "medical") return cat.id.includes("medical");
    if (activeTab === "student") return cat.id.includes("student");
    return true;
  });

  const comparedCategories = VISA_CATEGORIES_DATA.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-8">
      {/* Category Filter Chips & Multi-select header */}
      <div className="card-elevated p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron">
              <Layers className="h-3.5 w-3.5" /> Side-by-Side Matrix
            </span>
            <h3 className="font-display text-2xl font-bold text-foreground">Visa Category Comparison</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Compare validity, entry allowances, maximum continuous stay, and permitted activities.
            </p>
          </div>

          {/* Quick Filter tabs */}
          <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1 text-xs font-medium">
            {[
              ["all", "All Visas"],
              ["tourist", "Tourist"],
              ["business", "Business"],
              ["medical", "Medical"],
              ["student", "Student"],
            ].map(([val, lbl]) => (
              <button
                key={val}
                onClick={() => setActiveTab(val)}
                className={`rounded-md px-3 py-1.5 transition ${
                  activeTab === val ? "bg-card font-semibold text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Selection pills */}
        <div className="mt-5 border-t pt-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Select up to 3 categories to compare side-by-side:
          </p>
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((c) => {
              const isSelected = selectedIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleSelect(c.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border bg-card text-foreground hover:bg-secondary"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {comparedCategories.map((cat) => (
          <div
            key={cat.id}
            className="card-elevated flex flex-col justify-between border-t-4 border-t-saffron p-6 transition hover:shadow-lg"
          >
            <div>
              <span className="rounded-full bg-saffron-soft px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                {cat.validity}
              </span>
              <h4 className="mt-3 font-display text-xl font-bold text-foreground">{cat.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{cat.tagline}</p>

              {/* Specs Box */}
              <div className="mt-5 space-y-2.5 rounded-xl bg-secondary/70 p-3.5 text-xs">
                <div className="flex justify-between border-b border-border/60 pb-1.5">
                  <span className="text-muted-foreground">Entries:</span>
                  <span className="font-semibold text-foreground text-right">{cat.entries}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-1.5">
                  <span className="text-muted-foreground">Max Continuous Stay:</span>
                  <span className="font-semibold text-foreground text-right">{cat.maxStay}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-1.5">
                  <span className="text-muted-foreground">Official Turnaround:</span>
                  <span className="font-semibold text-foreground text-right">{cat.processingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Fee:</span>
                  <span className="font-semibold text-foreground text-right">{cat.sampleFee}</span>
                </div>
              </div>

              {/* Purpose */}
              <div className="mt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary Purpose</h5>
                <p className="mt-1 text-xs leading-relaxed text-foreground">{cat.purpose}</p>
              </div>

              {/* Required Documents */}
              <div className="mt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Documents</h5>
                <ul className="mt-1.5 space-y-1 text-xs text-foreground">
                  {cat.documents.map((d) => (
                    <li key={d} className="flex items-start gap-1.5">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Permitted Activities */}
              <div className="mt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Permitted Activities</h5>
                <ul className="mt-1.5 space-y-1 text-xs text-foreground">
                  {cat.permitted.slice(0, 3).map((p) => (
                    <li key={p} className="flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prohibited Activities */}
              <div className="mt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-700">Strictly Prohibited</h5>
                <ul className="mt-1.5 space-y-1 text-xs text-foreground">
                  {cat.prohibited.slice(0, 3).map((p) => (
                    <li key={p} className="flex items-start gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Notes */}
              <p className="mt-4 rounded-lg bg-amber-50/70 p-2.5 text-[11px] text-amber-900 border border-amber-200">
                <strong>Important:</strong> {cat.notes}
              </p>
            </div>

            <div className="mt-6 border-t pt-4">
              <Link
                to="/apply"
                className="btn-primary w-full text-xs"
              >
                Practise This Category <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimers & Official portal link */}
      <div className="rounded-xl border border-border bg-card p-5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-saffron" />
          <span>Curated Sample Dataset Notice</span>
        </div>
        <p className="mt-1 leading-relaxed">
          The above comparison provides verified sample criteria. Visa specifications, bilateral exemptions, and fee structures can vary depending on citizenship and diplomatic updates. For formal submissions, always refer to the official Government of India portal:{" "}
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
