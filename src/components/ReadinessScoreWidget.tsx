import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import type { ReadinessScoreResult } from "@/lib/types";

interface Props {
  readiness: ReadinessScoreResult;
  onNavigateStep?: (step: number) => void;
  showBreakdown?: boolean;
  compact?: boolean;
}

export function ReadinessScoreWidget({
  readiness,
  onNavigateStep,
  showBreakdown = true,
  compact = false,
}: Props) {
  const { total, level, levelColor, breakdown, recommendations } = readiness;

  // Determine stroke color for gauge
  const strokeColor =
    total >= 90
      ? "text-emerald-500"
      : total >= 70
      ? "text-blue-500"
      : total >= 45
      ? "text-amber-500"
      : "text-rose-500";

  return (
    <div className={`card-elevated p-6 ${compact ? "p-4" : "p-6"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-saffron">
            <Sparkles className="h-3.5 w-3.5" /> Dynamic Diagnostic
          </span>
          <h3 className="font-display text-xl font-semibold text-foreground">Visa Readiness Score</h3>
          <p className="text-xs text-muted-foreground">
            Real-time evaluation against Indian Bureau of Immigration standards
          </p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${levelColor}`}>
          {level}
        </span>
      </div>

      <div className="mt-5 grid items-center gap-6 sm:grid-cols-[140px_1fr]">
        {/* Radial / Donut Score Indicator */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-secondary"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${strokeColor} transition-all duration-700 ease-out`}
                strokeDasharray={`${total}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                {total}%
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Ready
              </span>
            </div>
          </div>
        </div>

        {/* Section Bars */}
        <div className="space-y-2.5">
          {Object.entries(breakdown).map(([key, sec]) => {
            const pct = Math.round((sec.score / sec.max) * 100);
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{sec.label}</span>
                  <span className="font-semibold text-foreground">
                    {sec.score} / {sec.max} pts ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Recommendations */}
      {showBreakdown && recommendations.length > 0 && (
        <div className="mt-6 border-t pt-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 text-saffron" />
            Priority Recommendations to Reach 100%
          </p>
          <ul className="mt-3 space-y-2">
            {recommendations.slice(0, 3).map((rec) => (
              <li
                key={rec.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-secondary/80 p-3 text-xs transition hover:bg-secondary"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex shrink-0 items-center justify-center rounded-md bg-saffron-soft px-1.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                    +{rec.impact}%
                  </span>
                  <span className="font-medium text-foreground">{rec.title}</span>
                </div>
                {onNavigateStep ? (
                  <button
                    onClick={() => onNavigateStep(rec.stepIndex)}
                    className="inline-flex items-center gap-1 rounded bg-card px-2.5 py-1 text-xs font-semibold text-primary shadow-xs hover:bg-primary hover:text-primary-foreground"
                  >
                    {rec.actionLabel} <ArrowRight className="h-3 w-3" />
                  </button>
                ) : (
                  <Link
                    to="/apply"
                    className="inline-flex items-center gap-1 rounded bg-card px-2.5 py-1 text-xs font-semibold text-primary shadow-xs hover:bg-primary hover:text-primary-foreground"
                  >
                    {rec.actionLabel} <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {total === 100 && (
        <div className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            Outstanding! Your application draft meets all sample verification criteria.
          </span>
        </div>
      )}
    </div>
  );
}
