import type { ChecklistItem, DocumentVerification, VisaCategory } from "./types";

export interface SpecialNotice {
  id: string;
  type: "warning" | "info" | "alert";
  title: string;
  description: string;
}

export function getPersonalizedChecklist(
  nationality: string,
  purpose: string,
  category: VisaCategory = "Tourist",
  verifiedDocs: Record<string, DocumentVerification | undefined> = {},
  checkedMap: Record<string, boolean> = {}
): {
  items: ChecklistItem[];
  notices: SpecialNotice[];
  completionStats: { requiredCount: number; requiredDone: number; percent: number };
} {
  const normPurpose = (purpose || category || "Tourism").toLowerCase();
  const items: ChecklistItem[] = [];
  const notices: SpecialNotice[] = [];

  const passportVerified = verifiedDocs.passport?.verified;
  items.push({
    id: "chk_passport",
    title: "Passport Bio-Page Scanned Copy (PDF)",
    description: "Clear PDF scan of biographical page showing photo and personal particulars. Max 1 MB.",
    category: "Mandatory Identification",
    required: true,
    checked: passportVerified ? true : Boolean(checkedMap["chk_passport"]),
    uploadHint: "PDF format, under 1 MB, no glare or cropped edges.",
    docKind: "passport",
    verified: passportVerified,
  });

  const photoVerified = verifiedDocs.photo?.verified;
  items.push({
    id: "chk_photo",
    title: "Recent Passport-Style Photograph",
    description: "Front-facing digital photo with equal height and width, plain white background, without spectacles or shadows.",
    category: "Mandatory Identification",
    required: true,
    checked: photoVerified ? true : Boolean(checkedMap["chk_photo"]),
    uploadHint: "JPEG/PNG, min 350x350px, under 1 MB, white background.",
    docKind: "photo",
    verified: photoVerified,
  });

  if (normPurpose.includes("business")) {
    items.push({
      id: "chk_business_card",
      title: "Copy of Business Card or Corporate Profile",
      description: "Visiting card of applicant showing company name, designation, and official email.",
      category: "Category Supporting Proof",
      required: true,
      checked: Boolean(checkedMap["chk_business_card"]),
      uploadHint: "Clear image or PDF of both sides of your corporate card.",
    });

    items.push({
      id: "chk_invitation",
      title: "Letter of Invitation from Host Indian Entity",
      description: "Official invitation on Indian company letterhead with complete address, contact details, and Corporate Identity Number (CIN) or GST.",
      category: "Category Supporting Proof",
      required: true,
      checked: Boolean(checkedMap["chk_invitation"]),
      uploadHint: "PDF document signed by authorized Indian company executive.",
    });

    items.push({
      id: "chk_deputation_letter",
      title: "Deputation / Sponsorship Letter from Employer",
      description: "Letter from your current employer stating your role, reason for business visit, and confirmation that all trip expenses will be borne.",
      category: "Optional Supporting Proof",
      required: false,
      checked: Boolean(checkedMap["chk_deputation_letter"]),
      uploadHint: "Helpful for multi-entry business visa evaluation.",
    });
  } else if (normPurpose.includes("medical")) {
    items.push({
      id: "chk_hospital",
      title: "Official Hospital Letter from Recognized Hospital in India",
      description: "Letter on official hospital letterhead specifying medical condition, tentative treatment schedule, and treating doctor details.",
      category: "Category Supporting Proof",
      required: true,
      checked: Boolean(checkedMap["chk_hospital"]),
      uploadHint: "Signed/stamped hospital confirmation letter in PDF format.",
    });

    items.push({
      id: "chk_medical_history",
      title: "Medical Records / Local Doctor Referral",
      description: "Summary from applicant's home doctor or hospital explaining the nature of medical intervention required.",
      category: "Optional Supporting Proof",
      required: false,
      checked: Boolean(checkedMap["chk_medical_history"]),
      uploadHint: "Reduces processing verification delays.",
    });
  } else if (normPurpose.includes("student") || normPurpose.includes("study")) {
    items.push({
      id: "chk_admission",
      title: "Bonafide Admission Letter from Recognized Indian Institution",
      description: "Firm letter of admission stating course name, duration, and AICTE/UGC accreditation of the university.",
      category: "Category Supporting Proof",
      required: true,
      checked: Boolean(checkedMap["chk_admission"]),
      uploadHint: "Official PDF on institution letterhead.",
    });

    items.push({
      id: "chk_financial_proof",
      title: "Proof of Financial Sustenance",
      description: "Bank statements or scholarship award demonstrating funds to cover tuition and living expenses in India.",
      category: "Category Supporting Proof",
      required: true,
      checked: Boolean(checkedMap["chk_financial_proof"]),
      uploadHint: "Bank statements from last 3-6 months.",
    });
  } else if (normPurpose.includes("conference")) {
    items.push({
      id: "chk_mea_clearance",
      title: "Ministry of External Affairs (MEA) Political Clearance",
      description: "Clearance obtained by the conference organizer from MEA India for holding international conference.",
      category: "Category Supporting Proof",
      required: true,
      checked: Boolean(checkedMap["chk_mea_clearance"]),
      uploadHint: "Usually provided by conference organizers in India.",
    });

    items.push({
      id: "chk_conf_invite",
      title: "Official Conference Invitation Letter",
      description: "Letter addressed to applicant mentioning participant status, dates, and agenda.",
      category: "Category Supporting Proof",
      required: true,
      checked: Boolean(checkedMap["chk_conf_invite"]),
      uploadHint: "PDF invitation.",
    });
  } else {
    items.push({
      id: "chk_itinerary",
      title: "Return Flight Ticket or Travel Itinerary",
      description: "Confirmed return or onward flight booking showing departure from India within permitted stay duration.",
      category: "Travel Readiness",
      required: true,
      checked: Boolean(checkedMap["chk_itinerary"]),
      uploadHint: "Flight confirmation or travel booking receipt.",
    });

    items.push({
      id: "chk_hotel_booking",
      title: "Hotel Reservation / Host Address Proof",
      description: "Proof of accommodation in the arrival city (e.g. hotel voucher or host invitation letter).",
      category: "Travel Readiness",
      required: false,
      checked: Boolean(checkedMap["chk_hotel_booking"]),
      uploadHint: "Hotel confirmation email or booking slip.",
    });
  }

  items.push({
    id: "chk_yellow_fever",
    title: "Yellow Fever / Oral Polio Vaccination (if applicable)",
    description: "Required only if arriving from or transited through yellow fever endemic countries (Africa / South America).",
    category: "Health & Border Control",
    required: false,
    checked: Boolean(checkedMap["chk_yellow_fever"]),
    uploadHint: "Original International Certificate of Vaccination (yellow card).",
  });

  const natNorm = (nationality || "").toLowerCase();

  if (natNorm.includes("pakistan") || natNorm.includes("bangladesh") || natNorm.includes("afghanistan")) {
    notices.push({
      id: "notice_special_mission",
      type: "alert",
      title: "Prior Referral / Mission Application Category",
      description:
        "Travelers holding passports or parentage associated with certain regional jurisdictions generally require paper visa applications via the nearest Indian Diplomatic Mission rather than electronic e-Visas. Verify with official authorities.",
    });
  }

  if (["nigeria", "kenya", "uganda", "ethiopia", "brazil", "colombia", "peru"].some((c) => natNorm.includes(c))) {
    notices.push({
      id: "notice_yellow_fever",
      type: "warning",
      title: "Mandatory Yellow Fever Clearance Notice",
      description:
        "Any passenger arriving from or transiting through designated endemic countries must possess a valid International Certificate of Vaccination at least 10 days prior to arrival to prevent mandatory quarantine.",
    });
  }

  notices.push({
    id: "notice_disclaimer",
    type: "info",
    title: "Sample Verification Guidance",
    description:
      "This checklist is a sample preparation guideline compiled for international travellers. Requirements are subject to change by Indian Immigration authorities. Check indianvisaonline.gov.in before booking.",
  });

  const requiredItems = items.filter((i) => i.required);
  const requiredDone = requiredItems.filter((i) => i.checked).length;
  const percent = requiredItems.length > 0 ? Math.round((requiredDone / requiredItems.length) * 100) : 100;

  return {
    items,
    notices,
    completionStats: {
      requiredCount: requiredItems.length,
      requiredDone,
      percent,
    },
  };
}
