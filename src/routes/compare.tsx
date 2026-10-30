import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHeader, meta } from "@/components/SiteLayout";
import { VisaComparisonWidget } from "@/components/VisaComparisonWidget";

export const Route = createFileRoute("/compare")({
  head: () =>
    meta(
      "Visa Category Comparison — VisaEase India",
      "Side-by-side comparison of Indian Tourist, Business, Medical, Conference, and Student visas. Compare validity, permitted stay, fees, and rules."
    ),
  component: ComparePage,
});

function ComparePage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Category Intelligence"
        title="Compare Indian Visa Categories"
        text="A detailed comparative matrix to help you choose the right visa category before applying. All rules are curated sample guidelines from official immigration standards."
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <VisaComparisonWidget />
      </div>
    </SiteLayout>
  );
}
