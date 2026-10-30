import type { ApplicationData, DocumentVerification, HealthIssue } from "./types";

export function runApplicationHealthCheck(
  data: Partial<ApplicationData>,
  verifiedDocs: Record<string, DocumentVerification | undefined> = {},
  checkedMap: Record<string, boolean> = {}
): {
  issues: HealthIssue[];
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  status: "critical" | "warning" | "clean";
  overallSummary: string;
} {
  const issues: HealthIssue[] = [];

  // 1. Personal Details Checks (Step 0)
  if (!data.given?.trim()) {
    issues.push({
      id: "err_given",
      severity: "critical",
      field: "given",
      title: "Given Name is Missing",
      description: "Indian immigration requires your given names exactly as shown in the machine-readable zone of your passport.",
      fixStep: 0,
      fixActionLabel: "Enter Given Name",
    });
  } else if (data.given.length > 50) {
    issues.push({
      id: "err_given_length",
      severity: "warning",
      field: "given",
      title: "Given Name Exceeds Standard Length",
      description: "Most visa forms cap the given name field at 50 characters. Check if abbreviations are allowed.",
      fixStep: 0,
      fixActionLabel: "Review Given Name",
    });
  }

  if (!data.surname?.trim()) {
    issues.push({
      id: "err_surname",
      severity: "critical",
      field: "surname",
      title: "Surname is Missing",
      description: "Surname or family name is mandatory. If you have only a single name, official instructions specify entering your single name in surname and leaving given name blank or as LNU.",
      fixStep: 0,
      fixActionLabel: "Enter Surname",
    });
  }

  if (!data.dob?.trim()) {
    issues.push({
      id: "err_dob_missing",
      severity: "critical",
      field: "dob",
      title: "Date of Birth is Missing",
      description: "Date of birth is required to verify age eligibility and identity matching.",
      fixStep: 0,
      fixActionLabel: "Enter Date of Birth",
    });
  } else {
    const dob = new Date(data.dob);
    if (isNaN(dob.getTime()) || dob >= new Date()) {
      issues.push({
        id: "err_dob_future",
        severity: "critical",
        field: "dob",
        title: "Date of Birth Cannot Be in the Future",
        description: "The entered date of birth appears invalid or set in the future.",
        fixStep: 0,
        fixActionLabel: "Correct Date of Birth",
      });
    }
  }

  if (!data.nationality?.trim()) {
    issues.push({
      id: "err_nationality",
      severity: "critical",
      field: "nationality",
      title: "Nationality is Not Selected",
      description: "Your passport nationality determines e-Visa eligibility, visa fees, and stay duration limits.",
      fixStep: 0,
      fixActionLabel: "Select Nationality",
    });
  }

  if (!data.email?.trim()) {
    issues.push({
      id: "err_email_missing",
      severity: "critical",
      field: "email",
      title: "Email Address is Missing",
      description: "Your official Electronic Travel Authorization (ETA) is delivered via email.",
      fixStep: 0,
      fixActionLabel: "Add Email",
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    issues.push({
      id: "err_email_format",
      severity: "critical",
      field: "email",
      title: "Invalid Email Address Format",
      description: "Ensure your email address has standard formatting (e.g., name@example.com) with no typos.",
      fixStep: 0,
      fixActionLabel: "Fix Email Address",
    });
  }

  // 2. Passport Details Checks (Step 1)
  if (!data.passport?.trim()) {
    issues.push({
      id: "err_passport_missing",
      severity: "critical",
      field: "passport",
      title: "Passport Number is Missing",
      description: "Valid travel passport number is strictly required for all international applicants.",
      fixStep: 1,
      fixActionLabel: "Add Passport Number",
    });
  } else if (!/^[A-Za-z0-9]{6,12}$/.test(data.passport)) {
    issues.push({
      id: "err_passport_format",
      severity: "critical",
      field: "passport",
      title: "Non-standard Passport Format",
      description: "Passport numbers typically consist of 6 to 12 alphanumeric characters without spaces, hyphens, or special symbols.",
      fixStep: 1,
      fixActionLabel: "Correct Passport Number",
    });
  }

  if (!data.issuePlace?.trim()) {
    issues.push({
      id: "err_issue_place",
      severity: "warning",
      field: "issuePlace",
      title: "Place of Issue is Blank",
      description: "Specify the issuing city or authority as indicated on the bio-data page of your passport.",
      fixStep: 1,
      fixActionLabel: "Add Issue Place",
    });
  }

  if (!data.issue?.trim()) {
    issues.push({
      id: "err_issue_date",
      severity: "warning",
      field: "issue",
      title: "Passport Issue Date is Blank",
      description: "Providing the exact date of issue is required on the official application.",
      fixStep: 1,
      fixActionLabel: "Add Issue Date",
    });
  }

  if (!data.expiry?.trim()) {
    issues.push({
      id: "err_expiry_missing",
      severity: "critical",
      field: "expiry",
      title: "Passport Expiry Date is Missing",
      description: "Mandatory to verify the 6-month validity compliance rule enforced by Indian Immigration.",
      fixStep: 1,
      fixActionLabel: "Add Expiry Date",
    });
  } else {
    const exp = new Date(data.expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (exp <= today) {
      issues.push({
        id: "err_passport_expired",
        severity: "critical",
        field: "expiry",
        title: "Passport Has Expired",
        description: "Your passport has expired. You must renew your passport before applying for an Indian visa.",
        fixStep: 1,
        fixActionLabel: "Renew Passport",
      });
    } else {
      const travelDate = data.arrival ? new Date(data.arrival) : today;
      const sixMonthsAfter = new Date(travelDate.getTime() + 180 * 24 * 60 * 60 * 1000);
      if (exp < sixMonthsAfter) {
        issues.push({
          id: "err_six_months_rule",
          severity: "critical",
          field: "expiry",
          title: "Fails 6-Month Validity Requirement",
          description: `Your passport expires on ${exp.toLocaleDateString("en-GB")}, which is less than 6 months beyond your intended arrival date (${travelDate.toLocaleDateString("en-GB")}). Entry will be denied at border control.`,
          fixStep: 1,
          fixActionLabel: "Check Passport Expiry",
        });
      }
    }
  }

  // 3. Travel Details Checks (Step 2)
  if (!data.purpose?.trim()) {
    issues.push({
      id: "err_purpose",
      severity: "critical",
      field: "purpose",
      title: "Purpose of Visit Unspecified",
      description: "Selecting a clear purpose (Tourism, Business, Medical, etc.) determines the necessary visa type.",
      fixStep: 2,
      fixActionLabel: "Select Purpose",
    });
  }

  if (!data.arrival?.trim()) {
    issues.push({
      id: "err_arrival_missing",
      severity: "warning",
      field: "arrival",
      title: "Expected Arrival Date is Blank",
      description: "Required to evaluate whether your application falls within the official 120-day to 4-day application window.",
      fixStep: 2,
      fixActionLabel: "Set Arrival Date",
    });
  } else {
    const arrival = new Date(data.arrival);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (arrival < today) {
      issues.push({
        id: "err_arrival_past",
        severity: "critical",
        field: "arrival",
        title: "Arrival Date is in the Past",
        description: "Expected arrival date must be a future date.",
        fixStep: 2,
        fixActionLabel: "Update Arrival Date",
      });
    } else {
      const daysUntilArrival = Math.ceil((arrival.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilArrival < 4) {
        issues.push({
          id: "err_arrival_too_soon",
          severity: "warning",
          field: "arrival",
          title: "Tight Submission Window (< 4 Days)",
          description: "Official Indian e-Visas must be submitted at least 4 calendar days before scheduled flight departure.",
          fixStep: 2,
          fixActionLabel: "Adjust Travel Dates",
        });
      }
    }
  }

  if (!data.city?.trim()) {
    issues.push({
      id: "err_city",
      severity: "warning",
      field: "city",
      title: "Port of Entry (Arrival City) Not Selected",
      description: "e-Visa travelers must enter India through one of 31 designated international airports or 5 designated seaports.",
      fixStep: 2,
      fixActionLabel: "Select Arrival City",
    });
  }

  if (!data.hotel?.trim() || data.hotel.trim().length < 5) {
    issues.push({
      id: "err_hotel",
      severity: "warning",
      field: "hotel",
      title: "Accommodation / Hotel Address Incomplete",
      description: "A valid local contact reference or hotel address in India is mandatory on the official visa form.",
      fixStep: 2,
      fixActionLabel: "Add Hotel Details",
    });
  }

  // 4. Document Verification Checks (Step 3)
  const passportDoc = verifiedDocs.passport;
  if (!passportDoc || !passportDoc.verified) {
    if (!checkedMap["chk_passport"]) {
      issues.push({
        id: "err_doc_passport",
        severity: "critical",
        title: "Passport Bio-Page PDF Not Verified",
        description: "You have not verified your passport bio-page scan in the Document Checker. Indian immigration requires a clear PDF under 1 MB.",
        fixStep: 3,
        fixActionLabel: "Check Passport PDF",
      });
    }
  }

  const photoDoc = verifiedDocs.photo;
  if (!photoDoc || !photoDoc.verified) {
    if (!checkedMap["chk_photo"]) {
      issues.push({
        id: "err_doc_photo",
        severity: "critical",
        title: "Passport Photograph Not Verified",
        description: "Photograph must have plain white background, square aspect ratio, and minimum 350x350 pixels.",
        fixStep: 3,
        fixActionLabel: "Check Photo File",
      });
    }
  }

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  let status: "critical" | "warning" | "clean" = "clean";
  let overallSummary = "Your application passed all health checks and adheres to standard Indian visa requirements.";

  if (criticalCount > 0) {
    status = "critical";
    overallSummary = `Found ${criticalCount} critical blocker${criticalCount > 1 ? "s" : ""} that would cause official visa rejection or border denial.`;
  } else if (warningCount > 0) {
    status = "warning";
    overallSummary = `Found ${warningCount} item${warningCount > 1 ? "s" : ""} needing attention before official submission.`;
  }

  return {
    issues,
    criticalCount,
    warningCount,
    infoCount,
    status,
    overallSummary,
  };
}
