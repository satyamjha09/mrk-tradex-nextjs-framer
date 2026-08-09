// @ts-nocheck
import RouteNotice from "@/app/components/templates/RouteNotice";

export default function CartPage() {
  return (
    <RouteNotice
      eyebrow="Cart"
      title="Your cart is part of the merged app."
      description="The cart route now lives inside the MRK site. Product selection, cart totals and checkout will become fully active once the backend API is connected in the next phase."
      actions={[
        { href: "/shop", label: "Browse catalog", primary: true },
        { href: "/contact", label: "Send enquiry" },
      ]}
    />
  );
}
