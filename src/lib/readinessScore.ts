import type { ApplicationData, DocumentVerification, ReadinessScoreResult } from "./types";

export function calculateReadinessScore(
  data: Partial<ApplicationData>,
  verifiedDocs: Record<string, DocumentVerification | undefined>,
  checkedListIds: Record<string, boolean> = {}
): ReadinessScoreResult {
  const recommendations: ReadinessScoreResult["recommendations"] = [];

  // 1. Profile Details (Max 25 pts)
  let profileScore = 0;
  const profileMax = 25;

  if (data.given?.trim() && data.surname?.trim()) {
    profileScore += 8;
  } else {
    recommendations.push({
      id: "rec_name",
      title: "Add your full legal name matching your passport",
      impact: 8,
      section: "profile",
      stepIndex: 0,
      actionLabel: "Complete Name",
    });
  }

  if (data.dob?.trim()) {
    const dobDate = new Date(data.dob);
    if (!isNaN(dobDate.getTime()) && dobDate < new Date()) {
      profileScore += 5;
    } else {
      recommendations.push({
        id: "rec_dob",
        title: "Verify your date of birth is in the past",
        impact: 5,
        section: "profile",
        stepIndex: 0,
        actionLabel: "Fix Date of Birth",
      });
    }
  } else {
    recommendations.push({
      id: "rec_dob_missing",
      title: "Enter your date of birth",
      impact: 5,
      section: "profile",
      stepIndex: 0,
      actionLabel: "Add Date of Birth",
    });
  }

  if (data.gender?.trim()) {
    profileScore += 3;
  } else {
    recommendations.push({
      id: "rec_gender",
      title: "Select your gender as stated on passport",
      impact: 3,
      section: "profile",
      stepIndex: 0,
      actionLabel: "Select Gender",
    });
  }

  if (data.nationality?.trim()) {
    profileScore += 4;
  } else {
    recommendations.push({
      id: "rec_nationality",
      title: "Specify your passport nationality",
      impact: 4,
      section: "profile",
      stepIndex: 0,
      actionLabel: "Choose Nationality",
    });
  }

  if (data.email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    profileScore += 5;
  } else {
    recommendations.push({
      id: "rec_email",
      title: "Provide a valid email address for application correspondence",
      impact: 5,
      section: "profile",
      stepIndex: 0,
      actionLabel: "Update Email",
    });
  }

  // 2. Passport Details & 6-Month Rule (Max 25 pts)
  let passportScore = 0;
  const passportMax = 25;

  if (data.passport?.trim() && /^[A-Za-z0-9]{6,12}$/.test(data.passport)) {
    passportScore += 8;
  } else {
    recommendations.push({
      id: "rec_passport_no",
      title: "Provide valid passport number (6–12 alphanumeric characters)",
      impact: 8,
      section: "passport",
      stepIndex: 1,
      actionLabel: "Enter Passport Number",
    });
  }

  if (data.issuePlace?.trim()) {
    passportScore += 4;
  } else {
    recommendations.push({
      id: "rec_issue_place",
      title: "Enter passport place of issue / issuing authority",
      impact: 4,
      section: "passport",
      stepIndex: 1,
      actionLabel: "Add Issue Place",
    });
  }

  if (data.issue?.trim()) {
    passportScore += 4;
  } else {
    recommendations.push({
      id: "rec_issue_date",
      title: "Provide passport issue date",
      impact: 4,
      section: "passport",
      stepIndex: 1,
      actionLabel: "Add Issue Date",
    });
  }

  if (data.expiry?.trim()) {
    const expDate = new Date(data.expiry);
    const today = new Date();
    const travelDate = data.arrival ? new Date(data.arrival) : today;
    const sixMonthsAfterTravel = new Date(travelDate.getTime() + 180 * 24 * 60 * 60 * 1000);

    if (expDate > sixMonthsAfterTravel) {
      passportScore += 9;
    } else if (expDate > today) {
      passportScore += 4;
      recommendations.push({
        id: "rec_passport_6months",
        title: "Warning: Indian regulations require 6 months passport validity beyond your arrival date",
        impact: 5,
        section: "passport",
        stepIndex: 1,
        actionLabel: "Check Validity",
      });
    } else {
      recommendations.push({
        id: "rec_passport_expired",
        title: "Passport appears to be expired. Renewal required before visa application.",
        impact: 9,
        section: "passport",
        stepIndex: 1,
        actionLabel: "Renew Passport",
      });
    }
  } else {
    recommendations.push({
      id: "rec_expiry_missing",
      title: "Enter passport expiry date to verify 6-month validity compliance",
      impact: 9,
      section: "passport",
      stepIndex: 1,
      actionLabel: "Add Expiry Date",
    });
  }

  // 3. Travel Details (Max 20 pts)
  let travelScore = 0;
  const travelMax = 20;

  if (data.purpose?.trim()) {
    travelScore += 6;
  } else {
    recommendations.push({
      id: "rec_purpose",
      title: "Select your visit purpose (Tourism, Business, Medical, etc.)",
      impact: 6,
      section: "travel",
      stepIndex: 2,
      actionLabel: "Select Purpose",
    });
  }

  if (data.arrival?.trim()) {
    const arrivalDate = new Date(data.arrival);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (arrivalDate >= today) {
      travelScore += 6;
    } else {
      recommendations.push({
        id: "rec_arrival_past",
        title: "Expected arrival date cannot be in the past",
        impact: 6,
        section: "travel",
        stepIndex: 2,
        actionLabel: "Adjust Date",
      });
    }
  } else {
    recommendations.push({
      id: "rec_arrival_missing",
      title: "Set expected arrival date for e-Visa application window calculation",
      impact: 6,
      section: "travel",
      stepIndex: 2,
      actionLabel: "Set Arrival Date",
    });
  }

  if (data.city?.trim()) {
    travelScore += 4;
  } else {
    recommendations.push({
      id: "rec_city",
      title: "Specify designated arrival airport / immigration port of entry",
      impact: 4,
      section: "travel",
      stepIndex: 2,
      actionLabel: "Choose Port of Entry",
    });
  }

  if (data.hotel?.trim() && data.hotel.length >= 5) {
    travelScore += 4;
  } else {
    recommendations.push({
      id: "rec_hotel",
      title: "Provide accommodation or hotel address in India",
      impact: 4,
      section: "travel",
      stepIndex: 2,
      actionLabel: "Enter Address",
    });
  }

  // 4. Documents & Verifications (Max 30 pts)
  let docScore = 0;
  const docMax = 30;

  const passportDoc = verifiedDocs.passport;
  if (passportDoc && passportDoc.verified) {
    docScore += 10;
  } else if (checkedListIds["chk_passport"]) {
    docScore += 6;
  } else {
    recommendations.push({
      id: "rec_doc_passport",
      title: "Verify your Passport Bio-Page PDF in the Document Checker",
      impact: 10,
      section: "documents",
      stepIndex: 3,
      actionLabel: "Check Passport PDF",
    });
  }

  const photoDoc = verifiedDocs.photo;
  if (photoDoc && photoDoc.verified) {
    docScore += 10;
  } else if (checkedListIds["chk_photo"]) {
    docScore += 6;
  } else {
    recommendations.push({
      id: "rec_doc_photo",
      title: "Check and verify your recent passport photo meets size/dimensions",
      impact: 10,
      section: "documents",
      stepIndex: 3,
      actionLabel: "Check Photo",
    });
  }

  const hasCategoryDoc =
    checkedListIds["chk_itinerary"] ||
    checkedListIds["chk_business_card"] ||
    checkedListIds["chk_hospital"] ||
    checkedListIds["chk_admission"] ||
    checkedListIds["chk_letter"];

  if (hasCategoryDoc) {
    docScore += 10;
  } else {
    const purposeName = data.purpose || "your trip";
    recommendations.push({
      id: "rec_doc_category",
      title: `Confirm supporting documents for ${purposeName} in the checklist`,
      impact: 10,
      section: "documents",
      stepIndex: 3,
      actionLabel: "Review Checklist",
    });
  }

  const total = Math.min(100, Math.round(profileScore + passportScore + travelScore + docScore));

  let level: ReadinessScoreResult["level"];
  let levelColor: string;

  if (total >= 95) {
    level = "Ready for Submission";
    levelColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  } else if (total >= 75) {
    level = "High Readiness";
    levelColor = "text-blue-700 bg-blue-50 border-blue-200";
  } else if (total >= 45) {
    level = "In Progress";
    levelColor = "text-amber-800 bg-amber-50 border-amber-200";
  } else {
    level = "Needs Attention";
    levelColor = "text-rose-700 bg-rose-50 border-rose-200";
  }

  recommendations.sort((a, b) => b.impact - a.impact);

  return {
    total,
    level,
    levelColor,
    breakdown: {
      profile: { score: profileScore, max: profileMax, label: "Personal Details" },
      passport: { score: passportScore, max: passportMax, label: "Passport Verification" },
      travel: { score: travelScore, max: travelMax, label: "Travel Itinerary" },
      documents: { score: docScore, max: docMax, label: "Document Verification" },
    },
    recommendations,
  };
}
