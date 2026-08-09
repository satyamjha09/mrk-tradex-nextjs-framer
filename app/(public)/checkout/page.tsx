// @ts-nocheck
import RouteNotice from "@/app/components/templates/RouteNotice";

export default function CheckoutPage() {
  return (
    <RouteNotice
      eyebrow="Checkout"
      title="Checkout is ready for backend connection."
      description="This page is now available in the main app. In Phase 4 we will connect cart, user session, orders and payment API so checkout can process real enquiries or orders."
      actions={[
        { href: "/shop", label: "Back to catalog", primary: true },
        { href: "/sign-in", label: "Sign in" },
      ]}
    />
  );
}
