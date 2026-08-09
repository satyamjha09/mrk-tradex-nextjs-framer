import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

let stripe: Stripe | undefined;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is required to use Stripe payments.");
  }

  if (!stripe) {
    stripe = new Stripe(secretKey, {
      apiVersion: "2025-03-31.basil",
    });
  }

  return stripe;
}
