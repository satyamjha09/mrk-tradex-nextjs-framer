import { redirect } from "next/navigation";

export default function PaymentFailureRedirectPage() {
  redirect("/products");
}
