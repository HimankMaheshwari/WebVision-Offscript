import { useRef } from "react";
import { Printer, Download, X, ShieldCheck, CheckCircle2, Plane } from "lucide-react";
import type { ApplicationData, ReadinessScoreResult, DocumentVerification } from "@/lib/types";

interface Props {
  data: ApplicationData;
  readiness: ReadinessScoreResult;
  verifiedDocs: Record<string, DocumentVerification | undefined>;
  demoAppId: string;
  onClose: () => void;
}

export function ApplicationSummaryModal({ data, readiness, verifiedDocs, demoAppId, onClose }: Props) {
  const summaryRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textContent = `
========================================================================
VISAEASE INDIA — DEMO APPLICATION PRACTICE SUMMARY
========================================================================
NOTE: This document is an independent practice record for international
travellers. IT IS NOT AN OFFICIAL VISA NOR HAS IT BEEN SUBMITTED TO ANY
GOVERNMENT. Official applications are processed only at indianvisaonline.gov.in.
========================================================================
Reference Code: ${demoAppId}
Readiness Score: ${readiness.total}% (${readiness.level})
Generated On: ${new Date().toLocaleString()}

1. APPLICANT IDENTIFICATION
------------------------------------------------------------------------
Full Name:         ${data.given || "N/A"} ${data.surname || "N/A"}
Date of Birth:     ${data.dob || "N/A"}
Gender:            ${data.gender || "N/A"}
Nationality:       ${data.nationality || "N/A"}
Email Address:     ${data.email || "N/A"}

2. PASSPORT PARTICULARS
------------------------------------------------------------------------
Passport Number:   ${data.passport || "N/A"}
Place of Issue:    ${data.issuePlace || "N/A"}
Date of Issue:     ${data.issue || "N/A"}
Date of Expiry:    ${data.expiry || "N/A"}
Validity Status:   ${readiness.breakdown.passport.score >= 20 ? "Complies with 6-Month Validity Rule" : "Check Expiry Date"}

3. TRAVEL ITINERARY & ACCOMMODATION
------------------------------------------------------------------------
Visa Category:     ${data.category} / ${data.purpose}
Expected Arrival:  ${data.arrival || "N/A"}
Port of Entry:     ${data.city || "Delhi"} International Airport
Stay Address:      ${data.hotel || "N/A"}

4. VERIFIED PREPARATION DOCUMENTS
------------------------------------------------------------------------
- Passport Bio PDF:   ${verifiedDocs.passport?.verified ? "VERIFIED (Clean PDF Scan)" : "Pending Scan"}
- Recent Photo:       ${verifiedDocs.photo?.verified ? "VERIFIED (White Background, Valid Dimensions)" : "Pending Photo"}

5. OFFICIAL NEXT STEPS
------------------------------------------------------------------------
1. Navigate to https://indianvisaonline.gov.in
2. Choose "Apply here for e-Visa"
3. Re-enter your verified information as rehearsed on VisaEase
4. Upload your verified Passport PDF and Photograph
5. Pay official government fee via card/SBI ePay
6. Monitor Electronic Travel Authorization (ETA) status

========================================================================
VisaEase Independent Hackathon Project
========================================================================
`.trim();

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VisaEase_Demo_Summary_${demoAppId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl md:p-8">
        {/* Modal Controls */}
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-saffron">
              <Plane className="h-4 w-4" />
            </span>
            <span className="font-display font-bold text-foreground">
              Visa<span className="text-saffron">Ease</span> Summary
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-3.5 w-3.5" /> Download Text
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div ref={summaryRef} className="space-y-6 rounded-xl border border-border p-6 bg-card text-foreground">
          {/* Header */}
          <div className="border-b pb-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-saffron">
              Demo Application Practice Sheet
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">
              Indian Visa Preparation Dossier
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Reference: <strong className="text-foreground">{demoAppId}</strong> · Generated: {new Date().toLocaleDateString("en-GB")}
            </p>
            <div className="mt-3 inline-block rounded-md bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
              NON-OFFICIAL DEMO APPLICATION · NOTHING HAS BEEN SUBMITTED TO INDIAN AUTHORITIES
            </div>
          </div>

          {/* Score & Health Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-secondary p-4">
            <div>
              <span className="text-xs text-muted-foreground">Readiness Diagnostic</span>
              <p className="font-display text-2xl font-bold text-primary">
                {readiness.total}% <span className="text-sm font-semibold">({readiness.level})</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Visa Classification</span>
              <p className="font-semibold text-foreground">{data.category} Visa ({data.purpose})</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 sm:grid-cols-2 text-xs">
            {/* Box 1 */}
            <div className="space-y-2 rounded-lg border border-border p-3.5">
              <h4 className="font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
                Applicant Identity
              </h4>
              <p><strong className="text-muted-foreground">Full Name:</strong> {data.given || "—"} {data.surname || "—"}</p>
              <p><strong className="text-muted-foreground">Date of Birth:</strong> {data.dob || "—"}</p>
              <p><strong className="text-muted-foreground">Gender:</strong> {data.gender || "—"}</p>
              <p><strong className="text-muted-foreground">Passport Nationality:</strong> {data.nationality || "—"}</p>
              <p><strong className="text-muted-foreground">Email:</strong> {data.email || "—"}</p>
            </div>

            {/* Box 2 */}
            <div className="space-y-2 rounded-lg border border-border p-3.5">
              <h4 className="font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
                Passport Parameters
              </h4>
              <p><strong className="text-muted-foreground">Passport Number:</strong> {data.passport || "—"}</p>
              <p><strong className="text-muted-foreground">Place of Issue:</strong> {data.issuePlace || "—"}</p>
              <p><strong className="text-muted-foreground">Date of Issue:</strong> {data.issue || "—"}</p>
              <p><strong className="text-muted-foreground">Date of Expiry:</strong> {data.expiry || "—"}</p>
              <p><strong className="text-muted-foreground">6-Month Rule:</strong> {readiness.breakdown.passport.score >= 20 ? "Compliant ✓" : "Needs Review"}</p>
            </div>

            {/* Box 3 */}
            <div className="space-y-2 rounded-lg border border-border p-3.5">
              <h4 className="font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
                Travel & Port of Entry
              </h4>
              <p><strong className="text-muted-foreground">Expected Arrival:</strong> {data.arrival || "—"}</p>
              <p><strong className="text-muted-foreground">Entry Port:</strong> {data.city || "Delhi"} Airport</p>
              <p><strong className="text-muted-foreground">Accommodation:</strong> {data.hotel || "—"}</p>
              <p><strong className="text-muted-foreground">Target Travel Date:</strong> {data.travelDate || data.arrival || "—"}</p>
            </div>

            {/* Box 4 */}
            <div className="space-y-2 rounded-lg border border-border p-3.5">
              <h4 className="font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
                Document Status
              </h4>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`h-4 w-4 ${verifiedDocs.passport?.verified ? "text-emerald-600" : "text-muted-foreground"}`} />
                <span>Passport Bio Page (PDF): {verifiedDocs.passport?.verified ? "Verified" : "Pending"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`h-4 w-4 ${verifiedDocs.photo?.verified ? "text-emerald-600" : "text-muted-foreground"}`} />
                <span>Photograph (JPEG): {verifiedDocs.photo?.verified ? "Verified" : "Pending"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Practice Application Form: Rehearsed</span>
              </div>
            </div>
          </div>

          {/* Official Instructions */}
          <div className="rounded-xl bg-secondary/80 p-4 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Official Application Checklist
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Open the official portal at <strong>indianvisaonline.gov.in</strong>.</li>
              <li>Input your exact particulars identical to the verified details on this sheet.</li>
              <li>Upload your verified Passport PDF and Photograph.</li>
              <li>Pay the designated government e-Visa fee and note your 15-character Government Application ID.</li>
              <li>Print your Electronic Travel Authorization (ETA) once 'GRANTED' notification arrives.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
