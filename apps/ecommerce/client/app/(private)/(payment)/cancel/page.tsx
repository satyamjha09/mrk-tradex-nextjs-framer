import { redirect } from "next/navigation";

export default function PaymentCancelRedirectPage() {
  redirect("/products");
}
