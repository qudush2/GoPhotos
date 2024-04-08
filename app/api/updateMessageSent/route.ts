import { NextRequest, NextResponse } from "next/server";
import { updateMessageSent } from "@/utils/db";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const body = await req.json();
    const convoId = body.convoId as string;

    await updateMessageSent(convoId);

    if (req.method === "POST") {
      return NextResponse.redirect(
        `https://www.gophotos.us/messages/${encodeURIComponent(convoId)}`, //change before merge to main
        302
      );
    } else {
      return new Response("not working :(", { status: 405 });
    }
  }
  // Send a response back to the client
}
