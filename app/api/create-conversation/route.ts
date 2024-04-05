import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    return NextResponse.redirect("http://localhost:3000/messages", 302);
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
}

// db on convo_id with job details from form
// write the form response to job details table --> this can happen on the api then it redirects after it writes to db