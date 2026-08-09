// @ts-nocheck
import RouteNotice from "@/app/components/templates/RouteNotice";

export default function SupportRedirectPage() {
  return (
    <RouteNotice
      eyebrow="Support"
      title="Support is now inside the MRK app."
      description="Live chat and ticket handling will become active when the backend and Socket.IO server are connected. For now, use the contact route for enquiries."
      actions={[
        { href: "/contact", label: "Contact MRK", primary: true },
        { href: "/dashboard/chats", label: "Chat dashboard" },
      ]}
    />
  );
}
