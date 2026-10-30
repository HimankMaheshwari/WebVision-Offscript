import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar, Clock, Bell, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import type { TravelTimelinePlan } from "@/lib/travelTimeline";

interface Props {
  plan: TravelTimelinePlan;
  currentTravelDate: string;
  onSetTravelDate: (date: string) => void;
  compact?: boolean;
}

export function TravelPlannerWidget({ plan, currentTravelDate, onSetTravelDate, compact = false }: Props) {
  const [inputDate, setInputDate] = useState(currentTravelDate || "");
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (currentTravelDate) {
      setInputDate(currentTravelDate);
    }
  }, [currentTravelDate]);

  // Live countdown calculation
  useEffect(() => {
    if (!plan.travelDate) return;

    const target = new Date(plan.travelDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [plan.travelDate]);

  const toggleReminder = (id: string) => {
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputDate) {
      onSetTravelDate(inputDate);
    }
  };

  return (
    <div className="card-elevated p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron">
            <Clock className="h-3.5 w-3.5" /> Readiness Timeline
          </span>
          <h3 className="font-display text-2xl font-semibold text-foreground">Travel Readiness Planner</h3>
          <p className="text-xs text-muted-foreground">
            Milestone tracker mapped against official submission windows (120-day to 4-day guidelines)
          </p>
        </div>
      </div>

      {/* Date Picker Form */}
      <form onSubmit={handleApplyDate} className="mt-5 flex flex-wrap items-end gap-3 rounded-xl bg-secondary/60 p-4">
        <label className="flex-1 min-w-[200px]">
          <span className="mb-1 block text-xs font-semibold text-foreground">Intended Travel Date to India</span>
          <input
            type="date"
            className="field"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </label>
        <button type="submit" className="btn-saffron text-xs">
          <Calendar className="h-4 w-4" /> Calculate Milestones
        </button>
      </form>

      {/* Countdown Display */}
      {plan.travelDate && !plan.isPast && (
        <div className="mt-6 rounded-2xl bg-primary p-6 text-primary-foreground">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-saffron">Journey Countdown</p>
              <h4 className="mt-1 font-display text-xl font-bold">
                Trip Departure: {new Date(plan.travelDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </h4>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center sm:gap-3">
              {[
                ["Days", countdown.days],
                ["Hours", countdown.hours],
                ["Mins", countdown.minutes],
                ["Secs", countdown.seconds],
              ].map(([lbl, val]) => (
                <div key={lbl} className="rounded-lg bg-primary-foreground/10 px-3 py-2 backdrop-blur">
                  <span className="font-display text-2xl font-bold text-saffron">{val}</span>
                  <span className="block text-[10px] font-medium text-primary-foreground/80">{lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {plan.isUrgent && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/20 p-2.5 text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                Attention: You have {plan.daysRemaining} days remaining. Indian e-Visas must be submitted at least 4 calendar days before departure!
              </span>
            </div>
          )}
        </div>
      )}

      {/* Milestones Flow */}
      {plan.milestones.length > 0 && !compact && (
        <div className="mt-8 space-y-6">
          <h4 className="font-display text-lg font-semibold text-foreground">Step-by-Step Preparation Roadmap</h4>

          <ol className="relative space-y-6 border-l-2 border-border pl-6">
            {plan.milestones.map((m) => (
              <li key={m.id} className="relative">
                {/* Bullet */}
                <span
                  className={`absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    m.status === "completed"
                      ? "bg-emerald-600 text-white"
                      : m.status === "urgent"
                      ? "bg-rose-600 text-white animate-pulse"
                      : m.status === "current"
                      ? "bg-saffron text-foreground ring-4 ring-saffron/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {m.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : "•"}
                </span>

                <div className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-saffron">
                      {m.phase}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      Target: {m.recommendedDate} (~{m.daysBeforeTravel} days prior)
                    </span>
                  </div>

                  <h5 className="mt-1 font-semibold text-foreground">{m.title}</h5>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{m.description}</p>

                  {m.importantNote && (
                    <p className="mt-2 rounded bg-secondary/80 p-2 text-[11px] text-foreground">
                      <strong>Rule Note:</strong> {m.importantNote}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                    {m.actionUrl?.startsWith("http") ? (
                      <a
                        href={m.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        {m.actionText} <ArrowRight className="h-3 w-3" />
                      </a>
                    ) : m.actionUrl ? (
                      <Link
                        to={m.actionUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        {m.actionText} <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => toggleReminder(m.id)}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                        reminders[m.id]
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-secondary text-muted-foreground hover:bg-saffron-soft"
                      }`}
                    >
                      <Bell className="h-3 w-3" />
                      {reminders[m.id] ? "Demo Reminder Active" : "Set Demo Reminder"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Disclaimer Notice */}
      <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0 text-saffron" />
        <p>{plan.disclaimer}</p>
      </div>
    </div>
  );
}
