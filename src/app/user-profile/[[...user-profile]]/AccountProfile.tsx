"use client";
import { UserProfile, useUser } from "@clerk/nextjs";
import Tag from "@/src/components/Tag";
import { Edit2, DollarSquare, Image } from "iconic-react";
import { PhotographerAccount } from "@/src/utils/types";
import Manage from "@/src/components/Images/AccountProfile/Manager";

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
    const {
      about,
      location,
      price_low: priceLow,
      price_high: priceHigh,
      school,
      skills,
      hires,
      visible,
      custom_url,
    } = photographerAccount;

    return (
      <UserProfile path="/user-profile" routing="path">
        <UserProfile.Page
          label="Profile Page"
          labelIcon={<Edit2 variant="Bold" />}
          url="profile-page"
        >
          <div>
            <p className="text-xl">About</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">{about}</p>
          </div>
          <div>
            <p className="text-xl mt-10">Custom URL</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">https://www.gophotos.us/{custom_url}</p>
          </div>
          <div>
            <p className="text-xl mt-10">Location</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">{location}</p>
          </div>
          <div>
            <p className="text-xl mt-10">School</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">{school}</p>
          </div>
          <div>
            <p className="text-xl mt-10">Hourly Price Range</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">
              ${priceLow} - ${priceHigh}
            </p>
          </div>
          <div>
            <p className="text-xl mt-10">Hires</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">{hires}</p>
          </div>
          <div>
            <p className="text-xl mt-10">Profile Visible</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">
              {visible ? (
                <div>you're profile is visible</div>
              ) : (
                <div>you're profile is not visible</div>
              )}
            </p>
          </div>
          <div>
            <p className="text-xl mt-10">Skills</p>
            <hr className="my-2 border-gray-300" />
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </div>
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
