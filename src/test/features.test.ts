import { describe, expect, it } from "vitest";
import { calculateReadinessScore } from "@/lib/readinessScore";
import { getPersonalizedChecklist } from "@/lib/documentRules";
import { runApplicationHealthCheck } from "@/lib/healthCheck";
import { generateTravelTimeline } from "@/lib/travelTimeline";
import { answerQuestion, getContextualSuggestions, VISA_TERMS_DICTIONARY } from "@/lib/faqDataset";
import { suggestVisa } from "@/routes/visa-finder";
import { validateStep } from "@/routes/apply";

describe("Visa Readiness Score Calculation", () => {
  it("scores 0 or low for an empty application draft", () => {
    const res = calculateReadinessScore({}, {});
    expect(res.total).toBeLessThan(20);
    expect(res.level).toBe("Needs Attention");
    expect(res.recommendations.length).toBeGreaterThan(0);
  });

  it("calculates high score for a complete sample application", () => {
    const completeData = {
      given: "Emma",
      surname: "Clarke",
      dob: "1992-04-18",
      gender: "Female",
      nationality: "United Kingdom",
      email: "emma.clarke@example.com",
      passport: "533380006",
      issuePlace: "London",
      issue: "2021-06-10",
      expiry: "2031-06-09",
      purpose: "Tourism",
      arrival: "2026-12-14",
      city: "Delhi",
      hotel: "The Imperial Hotel, New Delhi",
    };

    const verifiedDocs = {
      passport: {
        kind: "passport" as const,
        fileName: "passport.pdf",
        fileSizeKb: 340,
        fileType: "application/pdf",
        verified: true,
        notes: "PDF OK",
        uploadedAt: "2026-10-30",
      },
      photo: {
        kind: "photo" as const,
        fileName: "photo.jpg",
        fileSizeKb: 210,
        fileType: "image/jpeg",
        verified: true,
        notes: "Photo OK",
        uploadedAt: "2026-10-30",
      },
    };

    const checkedMap = {
      chk_passport: true,
      chk_photo: true,
      chk_itinerary: true,
    };

    const res = calculateReadinessScore(completeData, verifiedDocs, checkedMap);
    expect(res.total).toBe(100);
    expect(res.level).toBe("Ready for Submission");
  });

  it("penalizes passport expiring within 6 months of travel", () => {
    const data = {
      given: "John",
      surname: "Doe",
      dob: "1990-01-01",
      gender: "Male",
      nationality: "United States",
      email: "john@example.com",
      passport: "A12345678",
      issuePlace: "Washington",
      issue: "2018-01-01",
      arrival: "2026-12-01",
      // Expiry only 1 month after arrival (violates 180-day rule!)
      expiry: "2027-01-01",
      purpose: "Tourism",
      city: "Delhi",
      hotel: "Taj Palace Hotel",
    };

    const res = calculateReadinessScore(data, {});
    const sixMonthsRec = res.recommendations.find((r) => r.id === "rec_passport_6months");
    expect(sixMonthsRec).toBeDefined();
  });
});

describe("Personalised Document Checklist Engine", () => {
  it("generates business-specific documents for business travel", () => {
    const res = getPersonalizedChecklist("Germany", "Business", "Business");
    const docTitles = res.items.map((i) => i.title);
    expect(docTitles.some((t) => t.includes("Business Card"))).toBe(true);
    expect(docTitles.some((t) => t.includes("Letter of Invitation"))).toBe(true);
  });

  it("generates medical-specific documents for medical travel", () => {
    const res = getPersonalizedChecklist("United Kingdom", "Medical", "Medical");
    const docTitles = res.items.map((i) => i.title);
    expect(docTitles.some((t) => t.includes("Hospital Letter"))).toBe(true);
  });

  it("flags yellow fever notice for endemic origin countries", () => {
    const res = getPersonalizedChecklist("Nigeria", "Tourism", "Tourist");
    const notice = res.notices.find((n) => n.id === "notice_yellow_fever");
    expect(notice).toBeDefined();
  });
});

describe("Application Health Check Audit", () => {
  it("detects critical issues in blank or invalid drafts", () => {
    const res = runApplicationHealthCheck({}, {}, {});
    expect(res.status).toBe("critical");
    expect(res.criticalCount).toBeGreaterThan(0);
    expect(res.issues.some((i) => i.field === "given")).toBe(true);
    expect(res.issues.some((i) => i.field === "passport")).toBe(true);
  });

  it("provides valid navigation step indices for fixing issues", () => {
    const res = runApplicationHealthCheck({ email: "invalid-email" }, {}, {});
    const emailIssue = res.issues.find((i) => i.field === "email");
    expect(emailIssue).toBeDefined();
    expect(emailIssue?.fixStep).toBe(0); // Personal details step
  });
});

describe("Travel Readiness Planner Timeline", () => {
  it("calculates countdown and milestones for future travel date", () => {
    const futureDate = "2026-12-25";
    const plan = generateTravelTimeline(futureDate, true, 85);
    expect(plan.milestones.length).toBe(4);
    expect(plan.travelDate).toBe(futureDate);
    expect(plan.disclaimer).toContain("Guidance timeline only");
  });
});

describe("Context-Aware Visa Assistant & Dictionary", () => {
  it("explains visa dictionary terms accurately", () => {
    const res = answerQuestion("What is Reference in India?", "/apply");
    expect(res.text.toLowerCase()).toContain("reference");
    expect(res.text.toLowerCase()).toContain("hotel");
  });

  it("answers 6-month validity rule questions", () => {
    const res = answerQuestion("Tell me about the 6-month passport validity rule", "/faq");
    expect(res.text.toLowerCase()).toContain("180 days");
  });

  it("provides contextual suggestions per page", () => {
    const checkerSuggestions = getContextualSuggestions("/document-checker");
    expect(checkerSuggestions.some((s) => s.includes("photo") || s.includes("PDF"))).toBe(true);

    const applySuggestions = getContextualSuggestions("/apply");
    expect(applySuggestions.some((s) => s.includes("Reference"))).toBe(true);
  });
});

describe("Legacy Function Compatibility Preservation", () => {
  it("suggestVisa function returns valid advice", () => {
    const res = suggestVisa("Tourism", "Up to 30 days");
    expect(res.name).toContain("Tourist");
  });

  it("validateStep function validates step 0 correctly", () => {
    const errors = validateStep(0, {}, [false, false, false, false]);
    expect(errors.given).toBe("This field is required");
  });
});
