import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const body = await req.json();

    // console.log('this is the body of the form that was receieved',body)
    console.log('api route reached')

    if (req.method === "POST") {
        console.log('exited successfully')
        return new Response("It works", { status: 200 });
    } else {
      return new Response("not working :(", { status: 405 });
    }
  }
}