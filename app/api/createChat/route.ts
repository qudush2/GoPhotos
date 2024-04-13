import { NextRequest, NextResponse } from "next/server";
import { getPGClerkId, createJob, addJobDetails } from "@/utils/db";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const body = await req.formData();
    const convoID = body.get('convoID') as string;
    const userID = body.get('userID') as string;
    const accountEmail = body.get('accountEmail') as string;
    const eventTitle = body.get('eventTitle') as string;
    const location = body.get('location') as string;
    const startTime = body.get('startTime') as string;
    const endTime = body.get('endTime') as string;
    const eventDate = body.get('eventDate') as string;
    const organization = body.get('organization') as string;
    const eventDescription = body.get('eventDescription') as string;

    const pgClerkID = await getPGClerkId(accountEmail);
    await addJobDetails(
    convoID,
    eventTitle,
    location,
    startTime,
    endTime,
    eventDate,
    organization,
    eventDescription
  );

    await createJob(pgClerkID, userID, convoID);

    // if (req.method === "POST") {
    // //   return NextResponse.redirect(
    // //     // `https://www.gophotos.us/messages/${encodeURIComponent(convoID)}`, //change before merge to main
    // //     `http://localhost:3000/messages/${encodeURIComponent(convoID)}`,
    // //     302
    // //   );
    // return new Response('It works',{status: 200})
    // } else {
    //   return new Response("not working :(", { status: 405 });
    // }
  }
  // Send a response back to the client
}