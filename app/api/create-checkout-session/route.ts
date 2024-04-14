import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateJobPaymentUrl, getJobDetails, updateJobPrice } from "@/utils/db";
import { JobDetails } from "@/utils/types";
import setupProductAndPrice from "@/actions/setup-product-price";

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
      // CHANGE BEFORE MERGE TO MAIN
      success_url: `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`,
      cancel_url: `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`,
      // success_url: `http://localhost:3000/messages/${encodeURIComponent(convoID)}`,
      // cancel_url: `http://localhost:3000/messages/${encodeURIComponent(convoID)}`,
    });

    if (session.url === null) {
      return new Response("Session URL is null", { status: 404 });
    }
    await updateJobPaymentUrl(convoID, session.url);
    return NextResponse.redirect(
      // CHANGE BEFORE MERGE TO MAIN
      `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`,
      // `http://localhost:3000/messages/${encodeURIComponent(convoID)}`,
      302
    );
  } else {
    return new Response("not working :(", { status: 405 });
  }
}
