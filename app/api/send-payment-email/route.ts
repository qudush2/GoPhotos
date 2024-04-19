import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerInfo,
  getJobDetails,
  getAccountByClerkId,
} from "@/utils/db";
import { Customer, JobDetails, Account } from "@/utils/types";
import PaymentEmailCustomer from "@/components/payment-email-customer";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (req.method === "POST") {
    const body = await req.json();
    const convoID = body.convoID as string;
    const jobDetails = (await getJobDetails(convoID)) as JobDetails;
    const {
      customer_clerk_id,
      event_title,
      photographer_clerk_id,
      payment_url,
    } = jobDetails;
    
    const customer = (await getCustomerInfo(customer_clerk_id)) as Customer;
    const customer_name = customer.full_name.split(" ")[0];
    const customer_email = customer.email;
    
    const photographer_account = (await getAccountByClerkId(
      photographer_clerk_id
      )) as Account;
    const photographer_name = photographer_account.fullName;

    await resend.emails.send({
      from: "gigs@gophotos.us",
      to: customer_email,
      bcc: "gigs@gophotos.us",
      subject: `GoPhotos - Pay Now to Confirm Booking with ${photographer_name}`,
      react: PaymentEmailCustomer({
        customerName: customer_name,
        photographerName: photographer_name,
        event_title: event_title,
        payment_url: payment_url,
      }),
    });

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
