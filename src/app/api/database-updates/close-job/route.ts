import { NextResponse } from "next/server";
import { closeJob } from "@/src/utils/db";

export async function POST(request: Request) {
  const { convoID } = await request.json();

  try {
    await closeJob(convoID);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error closing job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to close job" },
      { status: 500 }
    );
  }
}
