import { NextRequest, NextResponse } from "next/server";
import { updateMessageSent } from "@/src/utils/db";
import { Customer, JobDetails } from "@/src/utils/types";
import { Resend } from "resend";
import NewJob from "@/src/components/EmailTemplates/NewJob";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json();
    const convoId = body.convoId as string;
    const customer = body.customer as Customer;
    const pgName = body.pgName as string;
    const jobDetails = body.jobDetails as JobDetails;

    await updateMessageSent(convoId);

    try {
      await resend.emails.send({
        from: "gigs@gophotos.us",
        to: "gigs@gophotos.us",
        subject: `GoPhotos - New Job Requested`,
        react: NewJob({
          customer,
          pgName,
          jobDetails,
        }),
      });
    } catch (error) {
      console.error("Error sending new job email to GoPhotos");
    }

    // Return a redirect response
    return NextResponse.redirect(
      // CHANGE BEFORE PUSH TO MAIN
      `https://www.gophotos.us/messages/${encodeURIComponent(convoId)}`,
      303
    );
  } catch (error) {
    console.error("Error updating message sent status:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
