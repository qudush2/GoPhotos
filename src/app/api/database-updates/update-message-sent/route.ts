import { NextRequest, NextResponse } from "next/server";
import { updateMessageSent } from "@/src/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const convoId = body.convoId as string;

    await updateMessageSent(convoId);

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
