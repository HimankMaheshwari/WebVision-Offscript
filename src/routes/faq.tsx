import { createFileRoute } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import { ChevronDown, Send, Plane } from "lucide-react";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";

export const Route = createFileRoute("/faq")({
  head: () => meta("FAQ & Visa Assistant — VisaEase", "Answers to common Indian visa questions plus an interactive visa assistant."),
  component: Faq,
});

const faqs = [
  { q: "What visa categories are there for India?", a: "Common categories include Tourist, Business, Medical and Student visas. Many nationalities can apply for some of these online as an e-Visa. Use our Visa Finder for a suggestion." },
  { q: "What documents are usually needed?", a: "Typically a valid passport, a recent photograph and documents supporting your purpose of visit (for example an invitation, hospital or admission letter). Exact requirements vary." },
  { q: "What are the main application steps?", a: "1) Find the right visa category, 2) prepare your documents, 3) fill in the application on the official portal, 4) pay the fee, 5) wait for the decision by email." },
  { q: "How much does a visa cost?", a: "Fees depend on your nationality, visa category and duration. Check the current fee on the official Government of India visa website." },
  { q: "Can VisaEase guarantee my visa?", a: "No. VisaEase gives information only. All decisions are made solely by Indian authorities." },
  { q: "Does VisaEase submit my application?", a: "No. VisaEase is a guidance prototype. Applications must be made on the official Government of India visa portal." },
];

const kb: [string[], string][] = [
  [["category", "categories", "type", "kind"], "Common Indian visa categories are Tourist, Business, Medical and Student. The best fit depends on why you're travelling — try the Visa Finder for a suggestion."],
  [["photo", "picture"], "You'll usually need a recent, clear passport-style photo with a plain background. Check the exact specifications on the official portal, and test your file in our Document Checker."],
  [["document", "need", "require", "passport"], "Most applications ask for a valid passport, a recent photograph and supporting documents for your purpose of visit. Requirements differ by category and nationality."],
  [["step", "how do i apply", "apply", "process"], "Typical steps: 1) choose a visa category, 2) prepare documents, 3) complete the form on the official portal, 4) pay the fee, 5) wait for the outcome. You can practise in our Guided Application."],
  [["fee", "cost", "price", "pay"], "Visa fees vary by nationality, category and duration, and can change. Please check the current fee on the official Government of India visa website."],
  [["business", "meeting", "conference"], "Travelling for meetings or trade usually falls under the Business visa category. An invitation letter or business card is commonly requested."],
  [["medical", "hospital", "treatment"], "Travelling for treatment usually falls under the Medical visa category, typically with a letter from the hospital in India."],
  [["study", "student", "university"], "Studying in India generally needs a Student visa, usually supported by an admission letter from your institution."],
  [["tourist", "holiday", "travel", "visit"], "Sightseeing or visiting family usually falls under the Tourist visa category. Use the Visa Finder for a tailored suggestion."],
  [["long", "time", "days"], "Processing times vary. It's wise to apply well before your travel date — the official portal lists current guidance."],
  [["approve", "guarantee", "reject"], "VisaEase can't approve visas or predict outcomes. Decisions are made only by Indian authorities."],
  [["track", "status"], "Real application status is shown on the official portal. Try our Tracker for a simulated walkthrough."],
];

export function answer(text: string) {
  const t = text.toLowerCase();
  if (/\b(hi|hello|hey|namaste)\b/.test(t)) return "Namaste! 🙏 Ask me about visa types, photos, passports, fees or processing times.";
  const hit = kb.find(([keys]) => keys.some((k) => t.includes(k)));
  return hit ? hit[1] : "I'm not sure about that one. Try asking about visa types, photo rules, passport validity, fees or processing time. For official answers, check the Government of India e-Visa portal.";
}

type Msg = { role: "user" | "bot"; text: string };

function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: "Hi, I'm Yatra, your VisaEase assistant. How can I help with your trip to India?" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [msgs, typing]);
  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]); setInput(""); setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, { role: "bot", text: answer(text) }]); setTyping(false); }, 700);
  };
  return (
    <div className="card-elevated flex h-[560px] flex-col overflow-hidden">
      <div className="flex items-center gap-3 bg-primary p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron text-foreground"><Plane className="h-5 w-5" /></span>
        <div><p className="font-semibold text-primary-foreground">Yatra · Visa Assistant</p><p className="text-xs text-primary-foreground/70">Guidance only, not legal advice</p></div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
            <p className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{m.text}</p>
          </div>
        ))}
        {typing && <p className="w-16 animate-pulse rounded-2xl bg-secondary px-4 py-2.5 text-sm">•••</p>}
        <div ref={end} />
      </div>
      <div className="flex flex-wrap gap-2 border-t px-4 pt-3">
        {["Photo requirements", "How long does it take?", "Business visa", "Fees"].map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1 text-xs font-medium hover:bg-saffron-soft">{s}</button>)}
      </div>
      <form className="flex gap-2 p-4" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input className="field" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your Indian visa…" />
        <button className="btn-saffron px-4" aria-label="Send"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <PageHeader eyebrow="Help centre" title="FAQ & Visa Assistant" text="Quick answers to the questions travellers ask most, plus an assistant to guide you." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2">
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="card-elevated">
              <button className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold" onClick={() => setOpen(open === i ? null : i)}>
                {f.q}<ChevronDown className={`h-5 w-5 shrink-0 text-saffron transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-5 pb-5 text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
        <Assistant />
      </div>
    </SiteLayout>
  );
}
