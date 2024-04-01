import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { currentUser, clerkClient } from "@clerk/nextjs";

export default async function Connect(request: NextResponse) {
  const user = await currentUser();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2023-10-16",
  });

  let account;

  // add case where account set up is not complete
  if (
    user &&
    user.publicMetadata.StripeID == null &&
    user.publicMetadata.isPhotographer
  ) {
    //checks if logged in & is a photographer w/o stripe ID
    account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.emailAddresses[0].emailAddress,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
        tax_reporting_us_1099_k: { requested: true },
      },
      business_type: "individual",
      individual: {
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        email: user.emailAddresses[0].emailAddress,
        phone: user.phoneNumbers[0].phoneNumber,
      },
    });

    await clerkClient.users.updateUserMetadata(user.id, {
      //updates clerk metadata with Stripe ID
      privateMetadata: {
        StripeId: account.id,
      },
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: (user?.publicMetadata.StripeID as string) || "",
    refresh_url: "http://localhost:3000/user-profile/profile-page",
    return_url: "http://localhost:3000/user-profile/profile-page",
    type: "account_onboarding",
  });

  return NextResponse.redirect(accountLink.url);
}
