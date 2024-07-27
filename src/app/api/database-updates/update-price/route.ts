import { NextRequest } from "next/server";
import { updateJobPrice } from "@/src/utils/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const convoID = body.convoID as string;
  const job_price = body.job_price as string;

  await updateJobPrice(convoID, job_price);

  if (req.method === "POST") {
    return new Response("price updated", { status: 200 });
  } else {
    return new Response("not working :(", { status: 405 });
  }
}
