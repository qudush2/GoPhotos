// import Stripe from "stripe";
// import { NextRequest } from "next/server";
// import { headers } from "next/headers";
// import { updatePaid } from "@/utils/db";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   typescript: true,
//   apiVersion: "2023-10-16",
// });

// export async function POST(request: NextRequest) {
//   const body = await request.text();
//   //   const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
//   const endpointSecret =
//     "whsec_eac9a8b5fac884855026bbe705e4b3ea9a16b8bec58a5e3a8c443da32910c270";
//   const sig = headers().get("stripe-signature") as string;

//   const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

//   switch (event.type) {
//     case "checkout.session.completed":
//       const convoID = event.data.object?.metadata?.convoID || "";
//       await updatePaid(convoID);
//       console.log(`Payment successful for convoID: ${convoID}`);
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//   return new Response("RESPONSE EXECUTE", {
//     status: 200,
//   });
// }
