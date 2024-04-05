import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2023-10-16",
});

//need to check if charges enabled & photographer --> should only be controlled by photographers

export async function POST(req: NextRequest) {
  const user = await currentUser();
  const { price } = await setupProductAndPrice();
  const account = user?.privateMetadata.StripeId as string;
  const refererUrl = req.headers.get('referer') || "https://www.gophotos.us/"; // Fallback URL if referer is not found

  if (req.method === "POST") {

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${refererUrl}`, //fix this
      cancel_url: `${refererUrl}`, //fix this
    });

    if (session.url === null) {
      return new Response("Session URL is null", { status: 404 });
    }
    return NextResponse.redirect(session.url, 302);
  } else {
    return new Response("not working :(", { status: 405 });
  }
}

export async function setupProductAndPrice() {
  const user = await currentUser();

  const product = await stripe.products.create({
    name: `${user?.firstName} ${user?.lastName}'s Photography Service`, //use photographer name
    description: `This is the user conversation name / gig title by the customer`, //user conversation name/ gig title given by customer
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(50000 * 1.1), //user current_price from db --> grab this with a db.ts function call on the unique or conversation id
    currency: "usd",
  });

  return { product, price };
}