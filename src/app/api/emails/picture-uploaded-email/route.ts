import { NextRequest } from "next/server";
import { Resend } from "resend";
import {
  updateJobPictures,
  getCustomerInfo,
  getAccountByClerkId,
  updateHires,
} from "@/src/utils/db";
import { JobDetails } from "@/src/utils/types";
import PicturesUploadedEmail from "@/src/components/EmailTemplates/PicturesUploadedEmail";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const jobDetails = body.jobDetails as JobDetails;
  const pgClerkID = jobDetails.photographer_clerk_id;
  const convoID = jobDetails.conversation_id;
  const currentDate = new Date();
  const picture_url = `https://www.gophotos.us/gallery/${encodeURIComponent(convoID)}`;

  await updateJobPictures(convoID, currentDate);
  await updateHires(pgClerkID);

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { customer_clerk_id, event_title, photographer_clerk_id } = jobDetails;
  const customer = await getCustomerInfo(customer_clerk_id);
  const photographer = await getAccountByClerkId(photographer_clerk_id);

  await resend.emails.send({
    from: "gigs@gophotos.us",
    to: customer.email,
    bcc: "gigs@gophotos.us",
    subject: `GoPhotos - ${event_title} Photos Are Ready`,
    react: PicturesUploadedEmail({
      customerName: customer.full_name,
      photographerName: photographer.full_name,
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
