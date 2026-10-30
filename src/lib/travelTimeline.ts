export interface TimelineMilestone {
  id: string;
  phase: string;
  title: string;
  recommendedDate: string;
  daysFromNow: number;
  daysBeforeTravel: number;
  status: "completed" | "current" | "upcoming" | "urgent";
  description: string;
  actionUrl?: string;
  actionText?: string;
  importantNote?: string;
  demoReminderSet?: boolean;
}

export interface TravelTimelinePlan {
  travelDate: string;
  daysRemaining: number;
  isPast: boolean;
  isUrgent: boolean;
  milestones: TimelineMilestone[];
  disclaimer: string;
}

export function generateTravelTimeline(travelDateStr: string, hasCompletedApp = false, readinessScore = 0): TravelTimelinePlan {
  const disclaimer =
    "Guidance timeline only. VisaEase is a preparation tool and does not process, expedite, or guarantee Indian visa approvals. Official processing times are determined solely by the Government of India.";

  if (!travelDateStr) {
    return {
      travelDate: "",
      daysRemaining: 0,
      isPast: false,
      isUrgent: false,
      milestones: [],
      disclaimer,
    };
  }

  const travelDate = new Date(travelDateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffMs = travelDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isPast = daysRemaining < 0;
  const isUrgent = daysRemaining <= 7 && !isPast;

  const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const getMilestoneDate = (daysBefore: number): Date => {
    return new Date(travelDate.getTime() - daysBefore * 24 * 60 * 60 * 1000);
  };

  const milestones: TimelineMilestone[] = [
    {
      id: "m_doc_prep",
      phase: "Phase 1: Document Gathering",
      title: "Audit Passport Validity & Acquire Clean Scans",
      daysBeforeTravel: Math.max(30, Math.min(daysRemaining, 45)),
      recommendedDate: formatDate(getMilestoneDate(40)),
      daysFromNow: daysRemaining - 40,
      status: readinessScore >= 40 ? "completed" : daysRemaining <= 30 ? "urgent" : "current",
      description:
        "Verify your passport has at least 6 months validity from planned arrival date and at least two blank pages. Prepare your square photo (white background) and single-page bio PDF.",
      actionUrl: "/document-checker",
      actionText: "Verify Scans Now",
      importantNote: "Passport scans must be under 1 MB and in standard PDF format.",
    },
    {
      id: "m_practice",
      phase: "Phase 2: Practice & Health Check",
      title: "Complete VisaEase Practice Form & Run Diagnostics",
      daysBeforeTravel: Math.max(20, Math.min(daysRemaining, 28)),
      recommendedDate: formatDate(getMilestoneDate(25)),
      daysFromNow: daysRemaining - 25,
      status: readinessScore >= 80 ? "completed" : hasCompletedApp ? "current" : "upcoming",
      description:
        "Run the Application Health Check to spot any invalid inputs, typos, or incomplete declarations before touching the official portal.",
      actionUrl: "/apply",
      actionText: "Practise Form",
      importantNote: "Name and passport details must match your travel document letter-for-letter.",
    },
    {
      id: "m_official_submission",
      phase: "Phase 3: Official e-Visa Submission",
      title: "Submit on Indian e-Visa Portal (indianvisaonline.gov.in)",
      daysBeforeTravel: Math.max(7, Math.min(daysRemaining, 14)),
      recommendedDate: formatDate(getMilestoneDate(14)),
      daysFromNow: daysRemaining - 14,
      status: daysRemaining < 4 ? "urgent" : daysRemaining <= 14 ? "current" : "upcoming",
      description:
        "Official Indian e-Visas must be submitted at least 4 calendar days before your scheduled arrival. Pay the official processing fee and retain your Application Reference ID.",
      actionUrl: "https://indianvisaonline.gov.in",
      actionText: "Visit Official Portal",
      importantNote: "e-Visa applications are accepted between 120 days and 4 days prior to travel.",
    },
    {
      id: "m_tracking_eta",
      phase: "Phase 4: ETA Verification & Pre-Departure",
      title: "Check ETA Status & Print Color Travel Authorization",
      daysBeforeTravel: Math.max(2, Math.min(daysRemaining, 4)),
      recommendedDate: formatDate(getMilestoneDate(4)),
      daysFromNow: daysRemaining - 4,
      status: daysRemaining <= 3 ? "current" : "upcoming",
      description:
        "Once your Electronic Travel Authorization (ETA) status shows 'GRANTED', print at least 2 physical copies. Prepare hotel voucher, return ticket, and international roaming.",
      actionUrl: "/tracker",
      actionText: "Track Status Demo",
      importantNote: "A physical printed copy of your ETA is required by airline check-in and Indian immigration officers.",
    },
  ];

  return {
    travelDate: travelDateStr,
    daysRemaining,
    isPast,
    isUrgent,
    milestones,
    disclaimer,
  };
}
