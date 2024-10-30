import { NextRequest } from "next/server";
import {
  createJob,
  createJobDetails,
  updateMessageSent,
  isCustomer,
  getCustomerInfoEmail,
  getAccountByClerkId,
  updateJobPrice
} from "@/src/utils/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import CreateJob from "@/src/components/EmailTemplates/CreateJob";
import UserCreated from "@/src/components/EmailTemplates/UserCreated";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = await req.formData();
    const jobID = uuidv4();
    const pgClerkID = userId;
    const eventTitle = body.get("eventTitle") as string;
    const eventDate = body.get("eventDate") as string;
    const eventDescription = body.get("eventDescription") as string;
    const customerEmail = body.get("customerEmail") as string;
    const customerName = body.get("customerName") as string;
    const price = body.get("price") as string;
    const mit_po = body.get("mit_po") === "true";
    const [location, startTime, endTime, organization] = Array(4).fill(
      ""
    ) as string[];
    const pgInfo = await getAccountByClerkId(pgClerkID);
    const [firstName, ...lastNameParts] = customerName.split(" ");
    const lastName = lastNameParts.join(" ");
    let customerClerkID;

    if (await isCustomer(customerEmail)) {
      customerClerkID = (await getCustomerInfoEmail(customerEmail)).clerkid;
    } else {
      const password = uuidv4();
      const response = await clerkClient.users.createUser({
        firstName,
        lastName,
        emailAddress: [customerEmail],
        password,
      });
      customerClerkID = response.id as string;

      await resend.emails.send({
        from: "gigs@gophotos.us",
        to: customerEmail,
        bcc: "gigs@gophotos.us",
        subject: `GoPhotos - User Created for ${eventTitle} with ${pgInfo.full_name}`,
        react: UserCreated({
          customerName: firstName,
          photographerName: pgInfo.full_name,
          event_title: eventTitle,
          password,
        }),
      });
    }

    await createJob(pgClerkID, customerClerkID, jobID);
    await createJobDetails(
      jobID,
      eventTitle,
      location,
      startTime,
      endTime,
      eventDate,
      organization,
      eventDescription,
      true,
      mit_po
    );
    await updateMessageSent(jobID);
    await updateJobPrice(jobID, price)
    await resend.emails.send({
      from: "gigs@gophotos.us",
      to: customerEmail,
      bcc: "gigs@gophotos.us",
      subject: `GoPhotos - Manage ${eventTitle}'s Photographer Booking`,
      react: CreateJob({
        customerName: firstName,
        photographerName: pgInfo.full_name,
        eventTitle,
      }),
    });

    return new Response(JSON.stringify({ jobID }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response("Method not allowed", { status: 405 });
  }
}
