// @ts-nocheck
import RouteNotice from "@/app/components/templates/RouteNotice";

export default function OrderTrackingPage({ params }) {
  return (
    <RouteNotice
      eyebrow="Order tracking"
      title={`Tracking page for ${params?.orderId || "your order"}`}
      description="This dynamic order route is now inside the MRK app. Live tracking will be connected when the order API is wired in the backend phase."
      actions={[
        { href: "/orders", label: "All orders", primary: true },
        { href: "/shop", label: "Catalog" },
      ]}
    />
  );
}
