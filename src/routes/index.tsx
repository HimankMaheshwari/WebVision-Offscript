import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  FileCheck2,
  ClipboardList,
  Activity,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Layers,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import { SiteLayout, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () =>
    meta(
      "VisaEase India — Intelligent Visa Application Assistance",
      "Dynamic readiness score, personalized document checklist, application health check, travel timeline planner, and context-aware visa assistant for international travellers."
    ),
  component: Index,
});

const features = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    title: "Applicant Dashboard",
    text: "Unified command center tracking your readiness score, checklist progress, and departure countdown.",
    badge: "Core Hub",
  },
  {
    to: "/visa-finder",
    icon: Compass,
    title: "Smart Visa Finder",
    text: "Answer three quick questions to identify the ideal Indian visa category for your trip.",
    badge: "Fast Match",
  },
  {
    to: "/compare",
    icon: Layers,
    title: "Category Comparison",
    text: "Side-by-side matrix of Tourist, Business, Medical, and Student visas with permitted activities.",
    badge: "Intelligence",
  },
  {
    to: "/document-checker",
    icon: FileCheck2,
    title: "Document Checker",
    text: "100% private in-browser analysis verifying passport PDF structure and photo dimensions.",
    badge: "Zero Upload",
  },
  {
    to: "/apply",
    icon: ClipboardList,
    title: "Guided Application",
    text: "Step-by-step practice form with real-time field validation, tips, and draft auto-saving.",
    badge: "Practice Mode",
  },
  {
    to: "/tracker",
    icon: Activity,
    title: "Application Tracker",
    text: "Simulate how your application moves from intake to electronic travel authorization (ETA).",
    badge: "Simulator",
  },
  {
    to: "/faq",
    icon: MessageCircle,
    title: "FAQ & Yatra Assistant",
    text: "Demystified explanations of terms like 'Reference in India', 6-month validity, and airport rules.",
    badge: "AI Guide",
  },
] as const;

function Index() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="India Gate in New Delhi at sunset"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground backdrop-blur-md font-medium">
            <ShieldCheck className="h-4 w-4 text-saffron" /> Intelligent Visa Preparation Platform
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-primary-foreground md:text-6xl font-display">
            Your journey to India, <span className="italic text-saffron">made simple.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/80 leading-relaxed md:text-lg">
            VisaEase is an intelligent preparation platform helping international travellers evaluate visa options, audit passport validity, calculate readiness scores, and rehearse applications before applying on the official portal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className="btn-saffron text-xs sm:text-sm font-bold">
              Open My Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/visa-finder" className="btn-outline text-xs sm:text-sm">
              Find My Visa
            </Link>
            <Link to="/document-checker" className="btn-outline text-xs sm:text-sm">
              Check Documents
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Key Metrics */}
      <section className="mx-auto -mt-10 grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4 relative z-10">
        {[
          ["100%", "Private In-Browser Analysis"],
          ["Dynamic", "Visa Readiness Score"],
          ["5 Categories", "Compared Side-by-Side"],
          ["24/7", "Context-Aware Yatra Assistant"],
        ].map(([a, b]) => (
          <div key={b} className="card-elevated p-5">
            <p className="font-display text-2xl font-bold text-primary">{a}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{b}</p>
          </div>
        ))}
      </section>

      {/* Feature Showcase Grid */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-saffron">
              All-In-One Traveler Suite
            </p>
            <h2 className="mt-2 text-3xl font-bold font-display text-foreground md:text-4xl">
              Prepare with Absolute Confidence
            </h2>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            Go to Applicant Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="card-elevated group p-6 transition hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-saffron-soft text-accent-foreground">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {f.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold font-display text-foreground">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-primary">
                Explore Tool <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Platform Highlights */}
      <section className="border-t border-b bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-saffron-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                <Sparkles className="inline h-3 w-3 mr-1" /> Intelligent Diagnostics
              </span>
              <h3 className="font-display text-3xl font-bold text-foreground">
                Never Risk Rejection Due to Simple Mistakes
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Indian Bureau of Immigration regulations strictly reject applications with blurry photos, sub-6-month passport validity, or improper document formats. VisaEase catches these before you pay official non-refundable government fees.
              </p>
              <ul className="space-y-2 text-xs text-foreground font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Real-time Visa Readiness Score (0–100%) with prioritized recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Personalized document checklist matching your purpose & nationality</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Travel readiness countdown timeline with submission reminder alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Comprehensive Application Health Audit with 1-click jump-to-fix</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/apply" className="btn-primary text-xs font-bold">
                  Start Your Guided Practice Form <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-display font-bold text-foreground text-sm">
                  Practice Dossier Snapshot
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                  100% Client-Side
                </span>
              </div>
              <div className="rounded-xl bg-secondary p-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Readiness Assessment:</span>
                  <span className="font-bold text-emerald-700">95% (High Readiness)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-[11px]">Passport Scan</p>
                  <p className="font-bold text-foreground">Verified PDF (340 KB)</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-[11px]">Photo Spec</p>
                  <p className="font-bold text-foreground">400x400 White BG</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                * Simulated practice record. Rehearse with sample data or test your real files privately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps To India Banner */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          {[
            ["1", "Discover & Check", "Identify your visa category, verify your PDF/photo scans, and check requirements."],
            ["2", "Rehearse & Audit", "Practise the application with live readiness scoring and pre-submission health checks."],
            ["3", "Apply Officially", "Submit your verified application directly on indianvisaonline.gov.in."],
          ].map(([n, t, d]) => (
            <div key={n} className="space-y-2">
              <span className="font-display text-5xl text-saffron font-bold">{n}</span>
              <h3 className="text-xl font-bold font-display text-primary-foreground">{t}</h3>
              <p className="text-xs text-primary-foreground/75 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
