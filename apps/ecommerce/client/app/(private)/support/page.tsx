import { redirect } from "next/navigation";
import { mrkFeatures } from "@/app/lib/config/features";

export default function SupportRedirectPage() {
  redirect(mrkFeatures.liveChatEnabled ? "/dashboard/chats" : "/contact");
}
