import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Plane } from "lucide-react";

const nav = [
  { to: "/visa-finder", label: "Visa Finder" },
  { to: "/document-checker", label: "Document Checker" },
  { to: "/apply", label: "Guided Application" },
  { to: "/tracker", label: "Tracker" },
  { to: "/faq", label: "FAQ & Assistant" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-primary py-1.5 text-center text-xs text-primary-foreground/80">
        Hackathon prototype · Not an official government portal · Official e-Visa applications are made only at indianvisaonline.gov.in
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-saffron"><Plane className="h-5 w-5" /></span>
            <span className="font-display text-xl font-semibold">Visa<span className="text-saffron">Ease</span></span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-primary bg-secondary" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Link to="/visa-finder" className="btn-saffron hidden text-sm lg:inline-flex">Get started</Link>
          <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <nav className="border-t px-4 py-3 lg:hidden">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 font-medium hover:bg-secondary">{n.label}</Link>
            ))}
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted-foreground md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">Visa<span className="text-saffron">Ease</span></p>
            <p className="mt-2">Guidance for travellers to India. We do not approve visas or submit applications to any government.</p>
          </div>
          <div className="flex flex-col gap-1.5">{nav.map((n) => <Link key={n.to} to={n.to} className="hover:text-foreground">{n.label}</Link>)}</div>
          <p>Information is illustrative sample data for a hackathon demo. Always verify requirements with the official Government of India e-Visa portal.</p>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="border-b bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-saffron">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{text}</p>
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
