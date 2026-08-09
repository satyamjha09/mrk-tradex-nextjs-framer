// @ts-nocheck
import RouteNotice from "@/app/components/templates/RouteNotice";

export default function PaymentFailurePage() {
  return (
    <RouteNotice
      eyebrow="Payment"
      title="Payment could not be completed."
      description="This status page is now available in the merged app. Payment recovery will become active when Stripe and backend checkout are connected."
      actions={[
        { href: "/checkout", label: "Try checkout again", primary: true },
        { href: "/contact", label: "Ask for help" },
      ]}
    />
  );
}
