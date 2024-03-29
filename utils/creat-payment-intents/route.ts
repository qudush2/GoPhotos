import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2023-10-16",
});

// const account = await stripe.accounts.create({
//     type: 'express',
//   });
const account = await (stripe.accounts.create({
  type: "express",
}));
console.log(account);

const accountLink = await (stripe.accountLinks.create({
  account: "{{CONNECTED_ACCOUNT_ID}}",
  refresh_url: "https://example.com/reauth",
  return_url: "https://example.com/return",
  type: "account_onboarding",
}))

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  const { amount } = data;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "USD",
    });

    return new NextResponse(paymentIntent.client_secret, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}
