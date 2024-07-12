import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerInfo,
  getJobDetails,
  getAccountByClerkId,
} from "@/src/utils/db";
import { Customer, JobDetails, Account } from "@/src/utils/types";
import PaymentEmailCustomer from "@/src/components/Emails/PaymentReadyCustomer";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (req.method === "POST") {
    const body = await req.json();
    const convoID = body.convoID as string;
    const jobDetails = (await getJobDetails(convoID)) as JobDetails;
    const { customer_clerk_id, event_title, photographer_clerk_id } =
      jobDetails;

    const customer = (await getCustomerInfo(customer_clerk_id)) as Customer;

    const photographer = (await getAccountByClerkId(
      photographer_clerk_id
    )) as Account;

    await resend.emails.send({
      from: "gigs@gophotos.us",
      to: customer.email,
      bcc: "gigs@gophotos.us",
      subject: `GoPhotos - Pay Now to Confirm Booking with ${photographer.fullName}`,
      react: PaymentEmailCustomer({
        customerName: customer.full_name,
        photographerName: photographer.fullName,
        event_title: event_title,
      }),
    });

    return NextResponse.redirect(
      `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`,
      302
    );
  } else {
    return new Response("not working :(", { status: 405 });
  }
}
