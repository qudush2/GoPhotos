import Stripe from "stripe";
import { getAccountByClerkId } from "@/src/utils/db";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2023-10-16",
});

export default async function setupProductAndPrice(
  job_price: number,
  event_title: string,
  photographer_clerk_id: string,
  convoID: string
) {
  const photographer = await getAccountByClerkId(photographer_clerk_id);

  const product = await stripe.products.create({
    name: `${photographer.full_name}'s Photography Service`,
    description: `${event_title}. Please note that there is an additional GoPhotos fee added on to the final price. This helps keep GoPhotos alive and growing!`,
    metadata: {
      convoID: convoID,
      originalPrice: job_price,
    },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(job_price * 100 * 1.1), //must be in cents
    currency: "usd",
  });

  return { product, price };
}
