import { NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { updateStripeID } from "@/src/utils/db";
import { PhotographerAccount } from "@/src/utils/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const photographerAccount = (await request.json()) as PhotographerAccount;

  try {
    let accountLinkUrl: string;

    if (!photographerAccount.stripe_id) {
      const account = await stripe.accounts.create({
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
        },
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        type: "account_onboarding",
        refresh_url: "https://www.gophotos.us/user-profile/profile-page",
        return_url: "https://www.gophotos.us/user-profile/profile-page",
      });

      await updateStripeID(account.id, photographerAccount.clerk_id);
      accountLinkUrl = accountLink.url;
    } else {
      const accountInfoComplete = (
        await stripe.accounts.retrieve(photographerAccount.stripe_id)
      ).payouts_enabled;

      if (!accountInfoComplete) {
        const accountLink = await stripe.accountLinks.create({
          account: photographerAccount.stripe_id,
          type: "account_update",
          refresh_url: "https://www.gophotos.us/user-profile/profile-page",
          return_url: "https://www.gophotos.us/user-profile/profile-page",
        });
        accountLinkUrl = accountLink.url;
      } else {
        const accountLink = await stripe.accounts.createLoginLink(
          photographerAccount.stripe_id
        );
        accountLinkUrl = accountLink.url;
      }
    }

    return NextResponse.json({ url: accountLinkUrl });
  } catch (error) {
    console.error("Error creating Stripe account or login link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
