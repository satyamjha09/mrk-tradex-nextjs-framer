import { redirect } from "next/navigation";

export default function PaymentSuccessRedirectPage() {
  redirect("/products");
}
