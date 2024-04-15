import { cn } from "@/utils/cn";

import { Playfair_Display as PlayfairDisplay } from "next/font/google";
import SearchArea from "@/app/discover/search-area";
import { auth, currentUser, clerkClient } from "@clerk/nextjs";
import {
  setPhotographerClerkid,
  isPG,
  isPG_noClerk,
  isCustomer,
  createCustomer,
  getPGinfo,
} from "../utils/db";
import { getPhotographers } from "@/utils/api";
import LandingPageCard from "@/components/landing-page-card";

const playfairDisplay = PlayfairDisplay({
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: true,
});

export default async function LandingPage() {
  const { userId } = auth();
  const user = await currentUser();
  const photographers = await getPhotographers();
  console.log("hey im here", photographers);

  if (userId && user && user.publicMetadata.isPhotographer == null) {
    const email = user.emailAddresses[0].emailAddress;
    const fullName = user.firstName + " " + user.lastName;
    const info = await getPGinfo(email);

    if (await isPG_noClerk(email)) {
      await setPhotographerClerkid(email, userId);
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          isPhotographer: true,
          location: info.location,
          hourlyPriceLow: info.hourlyPriceLow,
          hourlyPriceHigh: info.hourlyPriceHigh,
          school: info.school,
          skills: info.skills,
          about: info.about,
          hires: info.hires,
          hasStripeID: false,
        },
      });
    } else if (!(await isCustomer(email)) && !(await isPG(email))) {
      await createCustomer(email, fullName, userId);
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          isPhotographer: false,
        },
      });
    }
  }

  return (
    <div
      className="relative h-auto bg-[#f4f4f4] py-20 
    sm:pb-7 sm:pt-5"
    >
      <div className="flex justify-center items-center space-x-7 w-full border-2 border-black">
        <div className="px-8 sm:w-full sm:px-20 border-2 border-green-500">
          <div className="text-black border-2 border-red-500">
            <p
              className={cn(
                playfairDisplay.className,
                "text-5xl sm:text-6xl font-medium"
              )}
            >
              Hiring Photographers{" "}
              <span className="inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text pl-0.5 italic leading-snug text-transparent">
                simplified.
              </span>
            </p>
            <p className="mb-5 sm:mb-10 mt-6 font-serif text-2xl italic text-black flex justify-center">
              The All-In-One Photographer Booking Platform
            </p>
          </div>

          <div className="border-2 border-blue-500">
            <SearchArea />
            <p className="pt-3 text-sm italic text-gray-600">
              Currently available in Boston, MA & Cambridge, MA areas
            </p>
          </div>

          <div>
            <LandingPageCard photographers={photographers} />
          </div>
        </div>
      </div>
    </div>
  );
}
