import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import {
  updatePaid,
  getJobDetails,
  getCustomerInfo,
  getAccountByClerkId,
} from "@/src/utils/db";
import PaymentConfirmedCustomer from "@/src/components/Emails/PaymentConfirmedCustomer";
import PaymentConfirmedPhotographer from "@/src/components/Emails/PaymentConfirmedPhotographer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const convoID = session.metadata?.convoID;

    if (convoID) {
      await updatePaid(convoID);

      const jobDetails = await getJobDetails(convoID);
      const customer = await getCustomerInfo(jobDetails.customer_clerk_id);
      const photographer = await getAccountByClerkId(
        jobDetails.photographer_clerk_id
      );

      // Send payment confirmation email to customer
      console.log(customer);
      console.log(photographer);
      await resend.emails.send({
        from: "gigs@gophotos.us",
        to: customer.email,
        bcc: "gigs@gophotos.us",
        subject: `Payment Confirmed for ${jobDetails.event_title} with ${photographer.full_name}`,
        react: PaymentConfirmedCustomer({
          customerName: customer.full_name,
          photographerName: photographer.full_name,
          event_title: jobDetails.event_title,
        }),
      });

      // Send notification email to photographer
      await resend.emails.send({
        from: "gigs@gophotos.us",
        to: photographer.email,
        bcc: "gigs@gophotos.us",
        subject: `Payment Received for ${jobDetails.event_title} with ${customer.full_name}`,
        react: PaymentConfirmedPhotographer({
          photographerName: photographer.full_name,
          customerName: customer.full_name,
          event_title: jobDetails.event_title,
        }),
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
