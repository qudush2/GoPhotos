import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2023-10-16",
});

//need to check if charges enabled & photographer --> should only be controlled by photographers

export async function POST(req: NextRequest) {
  const { price } = await setupProductAndPrice();
  const account = "acct_1OzWdFFLIQHueOEv";

  if (req.method === "POST") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 123,
        transfer_data: {
          destination: account,
        },
      },
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    if (session.url === null) {
      return new Response("Session URL is null", { status: 500 });
    }
    return NextResponse.redirect(session.url, 302);
  } else {
    return new Response("not working :(", { status: 500 });
  }
}

export async function setupProductAndPrice() {
  const product = await stripe.products.create({
    name: "Amazing Productssss", //use photographer name
    description: "Description of the amazing product", //user conversation name/ gig title given by customer
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2000, //ask photographer for price
    currency: "usd",
  });

  return { product, price };
}
