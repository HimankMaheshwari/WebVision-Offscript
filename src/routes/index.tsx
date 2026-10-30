import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, FileCheck2, ClipboardList, Activity, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { SiteLayout, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => meta("VisaEase — Indian Visa Application Assistance", "Find the right Indian visa, check your documents and walk through a guided demo application."),
  component: Index,
});

const features = [
  { to: "/visa-finder", icon: Compass, title: "Smart Visa Finder", text: "Answer three questions and get a suggested visa category." },
  { to: "/document-checker", icon: FileCheck2, title: "Document Checker", text: "Check passport and photo files for size, format and quality." },
  { to: "/apply", icon: ClipboardList, title: "Guided Application", text: "A clear, step-by-step practice form with tips at every stage." },
  { to: "/tracker", icon: Activity, title: "Application Tracker", text: "See how an application moves from submission to decision." },
  { to: "/faq", icon: MessageCircle, title: "FAQ & Assistant", text: "Get quick answers to common visa questions, any time." },
] as const;

function Index() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <img src={hero} alt="India Gate in New Delhi at sunset" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-sm text-primary-foreground backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-saffron" /> Free guidance for international travellers
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-primary-foreground md:text-6xl">
            Your journey to India, <span className="italic text-saffron">made simple.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">
            VisaEase helps international travellers understand Indian visa options, prepare documents and practise the application — before applying on the official portal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/visa-finder" className="btn-saffron">Find my visa <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/document-checker" className="btn-outline">Check documents</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4 relative">
        {[["5 min", "Average visa match"], ["100%", "Free demo tools"], ["4", "Visa categories covered"], ["24/7", "Assistant availability"]].map(([a, b]) => (
          <div key={b} className="card-elevated p-5">
            <p className="font-display text-2xl font-semibold text-primary">{a}</p>
            <p className="text-sm text-muted-foreground">{b}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-saffron">Everything in one place</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Prepare with confidence</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="card-elevated group p-6 transition hover:-translate-y-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-saffron-soft text-accent-foreground"><f.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-muted-foreground">{f.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          {[["1", "Discover", "Find the visa that fits your trip."], ["2", "Prepare", "Check documents and practise the form."], ["3", "Apply officially", "Submit on the Government of India e-Visa portal."]].map(([n, t, d]) => (
            <div key={n}>
              <span className="font-display text-5xl text-saffron">{n}</span>
              <h3 className="mt-2 text-xl font-semibold text-primary-foreground">{t}</h3>
              <p className="mt-1 text-primary-foreground/70">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
