"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { Edit2, DollarSquare, Image } from "iconic-react";
import { PhotographerAccount } from "@/src/utils/types";
import Manage from "@/src/components/Images/AccountProfile/Manager";
import EditProfile from "@/src/components/UserProfilePage/EditProfile";

interface AccountProfileProps {
  photographerAccount: PhotographerAccount | null;
  isPhotographer: boolean;
}

export default function AccountProfile({
  photographerAccount,
  isPhotographer,
}: AccountProfileProps) {
  const { user } = useUser();

  if (user && !isPhotographer) {
    return <UserProfile path="/user-profile" routing="path" />;
  }

  if (user && isPhotographer && photographerAccount) {
    return (
      <UserProfile path="/user-profile" routing="path">
        <UserProfile.Page
          label="Profile Page"
          labelIcon={<Edit2 variant="Bold" />}
          url="profile-page"
        >
          <EditProfile photographerAccount={photographerAccount} />
        </UserProfile.Page>

        <UserProfile.Page
          label="Stripe Dashbord"
          labelIcon={<DollarSquare variant="Bold" />}
          url="stripe-dashboard"
        >
          {!user.publicMetadata.hasStripeID ? (
            <>
              hi, please complete the setup of your stripe account to begin
              receiving payments and manage your completed jobs
              <form
                action="/api/stripe/stripe-account-setup"
                className="border-2 border-black p-2 my-5 bg-[#FC7674] flex justify-center text-white"
                method="POST"
              >
                <button type="submit">Set up Stripe Account</button>
              </form>
            </>
          ) : (
            <>
              {" "}
              hi, you will be able to see your updated expected payout within a
              couple days of completing a job.
              <form
                action="/api/stripe/stripe-account-setup"
                className="border-2 border-black p-2 my-5 bg-[#FC7674] flex justify-center text-white"
                method="POST"
                target="_blank"
              >
                <button type="submit">Manage Account</button>
              </form>
            </>
          )}
          <p className="font-medium">
            {" "}
            Sorry for the appearance of this page, we will soon fix this!
          </p>
        </UserProfile.Page>

        <UserProfile.Page
          label="Portfolio Pics"
          labelIcon={<Image variant="Bulk" />}
          url="portfolio-pics"
        >
          <Manage
            folderId={`portfolio-pictures/${user.id}`}
            isPhotographer={isPhotographer}
          />
        </UserProfile.Page>
      </UserProfile>
    );
  }
}
