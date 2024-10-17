import { NextRequest } from "next/server";
import { createJob, createJobDetails } from "@/src/utils/db";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const body = await req.formData();
    const convoID = body.get("convoID") as string;
    const customerID = body.get("userID") as string;
    const pgClerkID = body.get("accountID") as string;
    const eventTitle = body.get("eventTitle") as string;
    const location = body.get("location") as string;
    const startTime = body.get("startTime") as string;
    const endTime = body.get("endTime") as string;
    const eventDate = body.get("eventDate") as string;
    const organization = body.get("organization") as string;
    const eventDescription = body.get("eventDescription") as string;

    await createJobDetails(
      convoID,
      eventTitle,
      location,
      startTime,
      endTime,
      eventDate,
      organization,
      eventDescription,
      false
    );

    await createJob(pgClerkID, customerID, convoID);
    return new Response("It works", { status: 200 });
  } else {
    return new Response("not working :(", { status: 405 });
  }
}
