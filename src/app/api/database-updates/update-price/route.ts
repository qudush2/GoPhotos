import { NextRequest } from "next/server";
import { updateJobPrice, updatePaid, getJobDetails } from "@/src/utils/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const convoID = body.convoID as string;
  const job_price = body.job_price as string;

  const jobDetails = await getJobDetails(convoID);

  await updateJobPrice(convoID, job_price);
  if (jobDetails.mit_po) {
    await updatePaid(
      convoID,
      jobDetails.customer_clerk_id,
      jobDetails.photographer_clerk_id
    );
  }

  if (req.method === "POST") {
    return new Response("price updated", { status: 200 });
  } else {
    return new Response("not working :(", { status: 405 });
  }
}
