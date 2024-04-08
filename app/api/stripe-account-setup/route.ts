import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser, clerkClient } from "@clerk/nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2023-10-16",
});

export async function POST() {
  const user = await currentUser();
  let account;

  if (
    user &&
    !user.publicMetadata.hasStripeID &&
    user.publicMetadata.isPhotographer
  ) {
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
        email: user.emailAddresses[0].emailAddress || "",
        phone: user.phoneNumbers[0].phoneNumber || "",
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      type: "account_onboarding",
      refresh_url: "https://www.gophotos.us/user-profile/profile-page",
      return_url: "https://www.gophotos.us/user-profile/profile-page",
    });

    const accountInfoComplete = (await stripe.accounts.retrieve(account.id))
      .payouts_enabled;
    if (accountInfoComplete) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          StripeId: account.id,
        },
        publicMetadata: {
          hasStripeID: true,
        },
      });
    }

    return NextResponse.redirect(accountLink.url, 302);
  } else if (
    user &&
    user.publicMetadata.hasStripeID &&
    user.publicMetadata.isPhotographer
  ) {
    const user_diff = await clerkClient.users.getUser(user.id);
    account = user_diff.privateMetadata.StripeId as string;
    const accountLink = await stripe.accounts.createLoginLink(account);
    return NextResponse.redirect(accountLink.url, 302);
  }
}
