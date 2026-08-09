// @ts-nocheck
import RouteNotice from "@/app/components/templates/RouteNotice";

export default function OrdersPage() {
  return (
    <RouteNotice
      eyebrow="Orders"
      title="Order history route is now merged."
      description="User order history is available as a route in this app. It will show real order records once authentication and the backend order API are connected."
      actions={[
        { href: "/shop", label: "Browse catalog", primary: true },
        { href: "/profile", label: "Profile" },
      ]}
    />
  );
}
