import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";
import { ContextAwareAssistant } from "@/components/ContextAwareAssistant";
import { CURATED_FAQS, answerQuestion } from "@/lib/faqDataset";

export const Route = createFileRoute("/faq")({
  head: () =>
    meta(
      "FAQ & Visa Assistant — VisaEase India",
      "Answers to essential Indian visa procedures, photo specifications, rules, plus an intelligent context-aware assistant."
    ),
  component: Faq,
});

const defaultFaqs = [
  {
    q: "What visa categories are there for India?",
    a: "Common categories include Tourist (30-day, 1-year, 5-year), Business, Medical, Conference and Student visas. Eligible nationalities can apply for most of these online as an electronic e-Visa. Use our Visa Finder and Category Comparison for full matrices.",
  },
  {
    q: "What documents are usually needed?",
    a: "Universally: a valid passport bio-page scan (PDF, max 1MB) with 6 months validity, and a recent square photo (JPEG, min 350x350px, white background). Purpose-specific documents include business cards/invitation letters, hospital letters, or university admission documents.",
  },
  {
    q: "What are the main application steps?",
    a: "1) Rehearse in VisaEase practice form, 2) test PDF/photo in Document Checker, 3) submit on official portal indianvisaonline.gov.in at least 4 days before travel, 4) pay official fee, 5) print color ETA upon grant.",
  },
  {
    q: "What is the 6-month passport validity rule?",
    a: "Indian immigration regulations require your passport to be valid for at least 180 days (6 months) beyond your scheduled date of arrival in India, and to possess at least 2 blank pages for stamps.",
  },
  {
    q: "What does 'Reference Name in India' mean if I'm staying in a hotel?",
    a: "If you do not have personal contacts or relatives in India, enter the name, full address, and telephone number of your confirmed hotel or resort. This is fully standard and recognized for tourists.",
  },
  {
    q: "Can VisaEase guarantee or submit my visa?",
    a: "No. VisaEase is an independent hackathon preparation prototype. We do not store passport data, issue visas, or submit to any government. Applications must be submitted on indianvisaonline.gov.in.",
  },
];

export function answer(text: string): string {
  const res = answerQuestion(text, "/faq");
  return res.text;
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Help & Knowledge Center"
        title="Frequently Asked Questions & Assistant"
        text="Quick answers to international traveler questions about Indian immigration policies, photo standards, port of entry rules, plus your AI guide."
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2 items-start">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-saffron-soft text-accent-foreground font-bold text-xs">
              ?
            </span>
            <h3 className="font-display text-lg font-bold text-foreground">
              Essential Immigration FAQs
            </h3>
          </div>

          {defaultFaqs.map((f, i) => (
            <div key={f.q} className="card-elevated overflow-hidden transition">
              <button
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-foreground text-sm hover:bg-secondary/40"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{f.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-saffron transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t bg-secondary/30 px-5 py-4 text-xs leading-relaxed text-muted-foreground">
                  {f.a}
                </div>
              )}
            </div>
          ))}

          {/* More curated tips box */}
          <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground space-y-1.5 mt-6">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-saffron" /> Tip for Applicants
            </p>
            <p>
              Looking for a definition of specific immigration terms like <em>e-Visa vs Regular Visa</em>, <em>Continuous Stay Limits</em>, or <em>Biometric Capture</em>? Ask Yatra in the interactive guide on the right or switch to the Glossary tab!
            </p>
          </div>
        </div>

        {/* Embedded Full-Featured Assistant */}
        <ContextAwareAssistant inline={true} />
      </div>
    </SiteLayout>
  );
}
