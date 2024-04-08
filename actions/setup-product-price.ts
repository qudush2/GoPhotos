import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: "2023-10-16",
  });

export default async function setupProductAndPrice(
    job_price: number,
    event_title: string
  ) {
    const user = await currentUser();
  
    const product = await stripe.products.create({
      name: `${user?.firstName} ${user?.lastName}'s Photography Service`,
      description: `${event_title}`,
    });
  
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(job_price * 100 * 1.1), //must be in cents
      currency: "usd",
    });
  
    return { product, price };
  }