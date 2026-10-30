import { useState, useRef, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  Send,
  Plane,
  X,
  MessageCircle,
  Sparkles,
  BookOpen,
  Info,
  ChevronDown,
  Minimize2,
  Maximize2,
  ShieldCheck,
} from "lucide-react";
import {
  answerQuestion,
  getContextualSuggestions,
  VISA_TERMS_DICTIONARY,
  CURATED_FAQS,
} from "@/lib/faqDataset";

interface Message {
  role: "user" | "bot";
  text: string;
  matchedTitle?: string;
  source?: "faq" | "dictionary" | "general" | "greeting";
  officialNotice?: string;
}

interface Props {
  inline?: boolean;
}

export function ContextAwareAssistant({ inline = false }: Props) {
  // Read current route path for contextual awareness
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [isOpen, setIsOpen] = useState(inline);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Namaste! 🙏 I'm Yatra, your VisaEase intelligence guide. I can help clarify confusing terms (like 'Reference in India' or the '6-month rule'), review photo/PDF rules, or answer questions about your visa journey.",
      source: "greeting",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "dictionary" | "faqs">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts based on current page
  const contextualPrompts = getContextualSuggestions(currentPath);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const res = answerQuestion(text, currentPath);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res.text,
          source: res.source,
          matchedTitle: res.matchedTitle,
          officialNotice: res.officialNotice,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const chatContent = (
    <div className="flex h-full flex-col overflow-hidden bg-card text-card-foreground">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron text-foreground shadow-sm">
            <Plane className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm leading-none">Yatra 2.0</h3>
              <span className="rounded-full bg-saffron-soft px-1.5 py-0.2 text-[10px] font-bold text-accent-foreground">
                Verified
              </span>
            </div>
            <p className="mt-1 text-[11px] text-primary-foreground/75">
              Context-Aware Indian Visa Guide
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Quick Tab Switcher */}
          <div className="mr-2 flex rounded-md bg-primary-foreground/10 p-0.5 text-xs">
            <button
              onClick={() => setActiveTab("chat")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition ${
                activeTab === "chat" ? "bg-primary-foreground text-primary font-bold" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("dictionary")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition ${
                activeTab === "dictionary" ? "bg-primary-foreground text-primary font-bold" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              Glossary
            </button>
          </div>

          {!inline && (
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label="Close Assistant"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      {activeTab === "chat" ? (
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-xs">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-xs shadow-xs"
                      : "bg-secondary text-foreground rounded-bl-xs border border-border/60"
                  }`}
                >
                  {m.matchedTitle && (
                    <div className="mb-1.5 flex items-center gap-1 font-semibold text-primary">
                      <Sparkles className="h-3 w-3 text-saffron" />
                      <span>{m.matchedTitle}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.officialNotice && (
                    <div className="mt-2 flex items-center gap-1 border-t border-border/40 pt-1 text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>{m.officialNotice}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-2.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-saffron" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-saffron [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-saffron [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Smart Chips */}
          <div className="border-t bg-secondary/30 px-3 py-2">
            <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-saffron" /> Suggested for this page
            </p>
            <div className="flex flex-wrap gap-1.5">
              {contextualPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition hover:border-saffron hover:bg-saffron-soft hover:text-accent-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2 border-t p-3 bg-card"
          >
            <input
              type="text"
              className="field text-xs py-2"
              placeholder="Ask Yatra about Indian visas, photos, passports..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn-saffron px-3.5 py-2 text-xs shrink-0"
              aria-label="Send Message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </>
      ) : (
        /* Dictionary View */
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Demystified Indian Visa Terminology
          </p>
          {VISA_TERMS_DICTIONARY.map((term) => (
            <div key={term.term} className="rounded-xl border border-border bg-card p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground text-sm">{term.term}</h4>
                <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {term.category}
                </span>
              </div>
              <p className="text-muted-foreground font-medium">{term.shortDesc}</p>
              <p className="text-foreground leading-relaxed">{term.detailedExplanation}</p>
              <p className="rounded bg-saffron-soft/60 p-2 text-[11px] text-accent-foreground">
                <strong>Advisory:</strong> {term.officialAdvice}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (inline) {
    return <div className="card-elevated h-[560px] overflow-hidden">{chatContent}</div>;
  }

  return (
    <>
      {/* Floating Trigger Button on Every Page */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-xl transition-all duration-300 hover:scale-105 hover:bg-primary/95 focus:outline-hidden"
            aria-label="Open Visa Assistant"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron text-foreground">
              <Plane className="h-4 w-4" />
            </span>
            <span className="font-semibold text-sm">Ask Yatra</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        )}
      </div>

      {/* Floating Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          {chatContent}
        </div>
      )}
    </>
  );
}
