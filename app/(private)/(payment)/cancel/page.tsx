// @ts-nocheck
import RouteNotice from "@/app/components/templates/RouteNotice";

export default function PaymentCancelPage() {
  return (
    <RouteNotice
      eyebrow="Payment"
      title="Payment was cancelled."
      description="This payment status route is now part of the main app. You can return to the catalog or contact MRK for help completing the enquiry."
      actions={[
        { href: "/shop", label: "Return to catalog", primary: true },
        { href: "/contact", label: "Contact MRK" },
      ]}
    />
  );
}
