import { NextRequest } from "next/server";
import { Resend } from "resend";
import { getCustomerInfo, getJobDetails } from "@/src/utils/db";
import { JobDetails } from "@/src/utils/types";
import ShareGalleryEmail from "@/src/components/EmailTemplates/ShareGallery";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const jobDetails = (await getJobDetails(body.convoID)) as JobDetails;
  const emails = body.email as string[];
  const picture_url = `https://www.gophotos.us/gallery/${encodeURIComponent(body.convoID)}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { customer_clerk_id, event_title } = jobDetails;
  const customer = await getCustomerInfo(customer_clerk_id);

  try {
    await resend.emails.send({
      from: "gigs@gophotos.us",
      to: customer.email,
      bcc: ["gigs@gophotos.us", ...emails],
      subject: `GoPhotos - ${customer.full_name} is sharing ${event_title} Photos With You`,
      react: ShareGalleryEmail({
        customerName: customer.full_name,
        event_title: event_title,
        picture_url: picture_url,
      }),
    });

    return new Response("Gallery shared successfully", { status: 200 });
  } catch (error) {
    console.error("Error sharing gallery:", error);
    return new Response("Failed to share gallery", { status: 500 });
  }
}
