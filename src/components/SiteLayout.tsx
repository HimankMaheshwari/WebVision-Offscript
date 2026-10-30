import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Plane, LayoutDashboard, ShieldCheck } from "lucide-react";
import { ContextAwareAssistant } from "./ContextAwareAssistant";

export const nav = [
  { to: "/visa-finder", label: "Visa Finder" },
  { to: "/compare", label: "Categories" },
  { to: "/document-checker", label: "Document Checker" },
  { to: "/apply", label: "Guided Application" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tracker", label: "Tracker" },
  { to: "/faq", label: "FAQ & Assistant" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Disclaimer Banner */}
      <div className="bg-primary py-1.5 px-4 text-center text-xs text-primary-foreground/90 font-medium">
        <span>Independent Hackathon Prototype · Not an official government portal · Apply officially only at </span>
        <a
          href="https://indianvisaonline.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline text-saffron hover:brightness-110"
        >
          indianvisaonline.gov.in
        </a>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-saffron shadow-xs">
              <Plane className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              Visa<span className="text-saffron">Ease</span>
              <span className="ml-1 rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                India
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-2.5 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground hover:bg-secondary/60 xl:text-sm xl:px-3"
                activeProps={{ className: "text-primary bg-secondary font-bold" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
              <span>Dashboard</span>
            </Link>
            <Link to="/apply" className="btn-saffron py-1.5 px-3.5 text-xs font-bold">
              Practise Form
            </Link>
          </div>

          <button
            className="lg:hidden rounded-lg p-2 text-foreground hover:bg-secondary focus:outline-hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="border-t bg-card px-4 py-3 lg:hidden space-y-1 shadow-lg">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary text-foreground"
                activeProps={{ className: "bg-secondary text-primary font-bold" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2 flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="btn-outline text-center text-xs"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/apply"
                onClick={() => setOpen(false)}
                className="btn-saffron text-center text-xs"
              >
                Practise Application
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Floating Context-Aware Assistant */}
      <ContextAwareAssistant />

      {/* Footer */}
      <footer className="border-t bg-secondary/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm text-muted-foreground md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-saffron">
                <Plane className="h-4 w-4" />
              </span>
              <p className="font-display text-lg font-bold text-foreground">
                Visa<span className="text-saffron">Ease</span> India
              </p>
            </div>
            <p className="max-w-md text-xs leading-relaxed">
              An intelligent, personalized visa preparation platform for international travellers visiting the Republic of India.
              We provide practice forms, local scan verification, travel planning, and document checking.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Independent Hackathon Showcase · 100% Client-Side Privacy</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-2.5">
              Tools & Features
            </h4>
            <div className="flex flex-col gap-1.5 text-xs">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className="hover:text-foreground transition">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-2.5">
              Important Disclaimers
            </h4>
            <p>
              VisaEase does NOT issue, approve, or submit visa applications to any government agency.
            </p>
            <p>
              Official e-Visa applications must be submitted solely at{" "}
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
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} VisaEase India Prototype. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="border-b bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-saffron">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl text-foreground">
          {title}
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </section>
  );
}

export const meta = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
