export type VisaCategory = "Tourist" | "Business" | "Medical" | "Student" | "Conference";

export interface ApplicationData {
  given: string;
  surname: string;
  dob: string;
  gender: string;
  nationality: string;
  email: string;
  passport: string;
  issuePlace: string;
  issue: string;
  expiry: string;
  purpose: string;
  category: VisaCategory;
  arrival: string;
  city: string;
  hotel: string;
  travelDate?: string;
  referenceName?: string;
  referencePhone?: string;
  referenceAddress?: string;
}

export interface DocumentVerification {
  kind: "passport" | "photo" | "invitation" | "hospital_letter" | "admission_letter" | "ticket";
  fileName: string;
  fileSizeKb: number;
  fileType: string;
  verified: boolean;
  notes: string;
  uploadedAt: string;
  dimensions?: { w: number; h: number };
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  required: boolean;
  checked: boolean;
  uploadHint: string;
  docKind?: "passport" | "photo" | "invitation" | "hospital_letter" | "admission_letter" | "ticket";
  verified?: boolean;
}

export interface ReadinessScoreResult {
  total: number;
  level: "Needs Attention" | "In Progress" | "High Readiness" | "Ready for Submission";
  levelColor: string;
  breakdown: {
    profile: { score: number; max: number; label: string };
    passport: { score: number; max: number; label: string };
    travel: { score: number; max: number; label: string };
    documents: { score: number; max: number; label: string };
  };
  recommendations: Array<{
    id: string;
    title: string;
    impact: number;
    section: "profile" | "passport" | "travel" | "documents";
    stepIndex: number;
    actionLabel: string;
  }>;
}

export interface HealthIssue {
  id: string;
  severity: "critical" | "warning" | "info";
  field?: string;
  title: string;
  description: string;
  fixStep: number;
  fixActionLabel: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  timestamp: string;
  type: "profile" | "passport" | "travel" | "doc" | "review";
}

export interface CategoryComparisonItem {
  id: string;
  name: string;
  tagline: string;
  purpose: string;
  validity: string;
  entries: string;
  maxStay: string;
  processingTime: string;
  sampleFee: string;
  documents: string[];
  permitted: string[];
  prohibited: string[];
  notes: string;
  officialLinkNotice: string;
}
