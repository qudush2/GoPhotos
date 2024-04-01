import type { NextApiRequest, NextApiResponse } from "next";
import createCheckoutSession from "../../utils/stripe-checkout";
import setupProductAndPrice from "./create-product";

//need to check if charges enabled & photographer --> should only be controlled by photographers

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("creating checkout session");
  const { product, price } = await setupProductAndPrice();
  if (req.method === "POST") {
    // You might want to dynamically set the price ID based on user input or product selection
    const sessionUrl = await createCheckoutSession(price.id);
    res.status(200).json({ url: sessionUrl });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
