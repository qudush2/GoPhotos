import { NextRequest } from "next/server";
import { Resend } from "resend";
import {
  updateJobPictures,
  getCustomerInfo,
  getAccountByClerkId,
} from "@/utils/db";
import PicturesUploadedEmail from "@/components/pictures-uploaded-email";
import { JobDetails, Customer, Account } from "@/utils/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const convoID = body.conversation_id as string;
  const picture_url = body.picture_url as string;
  const jobDetails = body.jobDetails as JobDetails;
  const currentDate = new Date();

  await updateJobPictures(convoID, picture_url, currentDate);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { customer_clerk_id, event_title, photographer_clerk_id } = jobDetails;
  const customer = (await getCustomerInfo(customer_clerk_id)) as Customer;
  const photographer = (await getAccountByClerkId(
    photographer_clerk_id
  )) as Account;

  await resend.emails.send({
    from: "gigs@gophotos.us",
    to: customer.email,
    bcc: "gigs@gophotos.us",
    subject: `GoPhotos - ${event_title} Photos Are Ready`,
    react: PicturesUploadedEmail({
      customerName: customer.full_name,
      photographerName: photographer.fullName,
      event_title: event_title,
      picture_url: picture_url,
    }),
  });

  if (req.method === "POST") {
    return new Response("picture url updated", { status: 200 });
  } else {
    return new Response("not working :(", { status: 405 });
  }
}
