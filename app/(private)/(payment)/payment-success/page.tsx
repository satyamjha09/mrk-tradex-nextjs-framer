// @ts-nocheck
import RouteNotice from "@/app/components/templates/RouteNotice";

export default function PaymentSuccessPage() {
  return (
    <RouteNotice
      eyebrow="Payment"
      title="Payment success route is ready."
      description="The success page is now present in the main app. In the backend phase it will receive the real order/payment details."
      actions={[
        { href: "/orders", label: "View orders", primary: true },
        { href: "/shop", label: "Continue browsing" },
      ]}
    />
  );
}
