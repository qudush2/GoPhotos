import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";
import { updateJobPaymentUrl, getJobDetails, updateJobPrice } from "@/utils/db";
import { JobDetails } from "@/utils/types";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const convoID = body.convoID as string;
  const job_price = body.job_price as string;
  const job_price_num = parseInt(job_price, 10);

  await updateJobPrice(convoID, job_price);

  const jobDetails = (await getJobDetails(convoID)) as JobDetails;
  const { event_title } = jobDetails;

  const user = await currentUser();
  const { price } = await setupProductAndPrice(job_price_num, event_title);

  if (req.method === "POST") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`, //change before merge to main
      cancel_url: `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`, //change before merge to main
    });

    if (session.url === null) {
      return new Response("Session URL is null", { status: 404 });
    }
    updateJobPaymentUrl(convoID, session.url);
    return NextResponse.redirect(
      `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`, //change before merge to main
      302
    );
  } else {
    return new Response("not working :(", { status: 405 });
  }
}

export async function setupProductAndPrice(
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
