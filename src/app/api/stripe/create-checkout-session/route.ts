import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getJobDetails, updateJobPrice } from "@/src/utils/db";
import { JobDetails } from "@/src/utils/types";
import setupProductAndPrice from "@/src/actions/setup-product-price";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const convoID = body.get("conversation_id") as string;
  const job_price = body.get("job_price") as string;
  const job_price_num = parseInt(job_price, 10);

  await updateJobPrice(convoID, job_price);

  const jobDetails = (await getJobDetails(convoID)) as JobDetails;
  const { event_title, photographer_clerk_id } = jobDetails;

  const { price } = await setupProductAndPrice(
    job_price_num,
    event_title,
    photographer_clerk_id,
    convoID
  );

  if (req.method === "POST") {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`,
      cancel_url: `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`,
      metadata: {
        convoID: convoID,
      },
    });

    if (session.url === null) {
      return new Response("Session URL is null", { status: 404 });
    }
    return NextResponse.redirect(session.url, 302);
  } else {
    return new Response("not working :(", { status: 405 });
  }
}
