import { cn } from "@/src/utils/cn";

import { Playfair_Display as PlayfairDisplay } from "next/font/google";
import SearchArea from "@/src/app/discover/search-area";
import Image from "next/image";
import { auth, currentUser, clerkClient } from "@clerk/nextjs";
import {
  setPhotographerClerkid,
  isPG,
  isPG_noClerk,
  isCustomer,
  createCustomer,
  getAccountByEmail,
} from "../utils/db";

const playfairDisplay = PlayfairDisplay({
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: true,
});

export default async function LandingPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (userId && user && user.publicMetadata.isPhotographer == null) {
    const email = user.emailAddresses[0].emailAddress;
    const fullName = user.firstName + " " + user.lastName;
    const info = await getAccountByEmail(email);

    if (await isPG_noClerk(email)) {
      await setPhotographerClerkid(email, userId);
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          isPhotographer: true,
          location: info.location,
          hourlyPriceLow: info.price_low,
          hourlyPriceHigh: info.price_high,
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
    <div className="relative h-auto bg-[#f4f4f4] py-20 sm:pb-7 sm:pt-5">
      <div className="justify-right flex items-center space-x-7">
        <div className="md:w-1/2 px-8 sm:pl-20">
          <div className="text-black">
            <p
              className={cn(
                playfairDisplay.className,
                "text-5xl sm:text-6xl font-medium"
              )}
            >
              Hiring Photographers <br />
              <span className="inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text pl-0.5 italic leading-snug text-transparent">
                simplified.
              </span>
            </p>
            <p className="mb-5 sm:mb-10 mt-6 font-serif text-2xl italic text-black">
              The All-In-One Photographer Booking Platform
            </p>
          </div>
          <div>
            <SearchArea />
            <p className="pt-3 text-sm italic text-gray-600">
              {" "}
              Currently available in Boston, MA & Cambridge, MA areas
            </p>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-end pr-16">
          <Image
            src="https://res.cloudinary.com/dklvhnniq/image/upload/f_auto,q_auto/kymcdxwxu270hpjh8gfz"
            alt="Photographer taking a picture"
            width={700}
            height={100}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
