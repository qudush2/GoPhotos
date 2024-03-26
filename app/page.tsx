import { cn } from "@/utils/cn";

import { Playfair_Display as PlayfairDisplay } from "next/font/google";
import Image from "next/image";
import SearchArea from "@/app/discover/search-area";
import { auth, currentUser, clerkClient } from "@clerk/nextjs";
import { setPhotographerClerkid, isPG, isPG_noClerk, isCustomer, createCustomer } from "../utils/db";

const playfairDisplay = PlayfairDisplay({
  subsets: ["latin"],
  style: ["normal", "italic"],
  preload: true,
});

export default async function LandingPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (userId && user) {
    const email = user.emailAddresses[0].emailAddress;
    const fullName = user.firstName + ' ' + user.lastName;

    if (await isPG_noClerk(email)) { //if their email already exists in the database w/o clerkID
      await setPhotographerClerkid(email, userId); //updates db with clerkid
      await clerkClient.users.updateUserMetadata(userId, { //updates clerk metadata to classify as photographer
        publicMetadata: {
          isPhotographer: true,
        },
      });
    } 
    
    else if (!await isCustomer(email) && !await isPG(email)) { //if not already in db & not a photographer email
      await createCustomer(email, fullName, userId) //updates db w/ clerkid
      await clerkClient.users.updateUserMetadata(userId, { //updates clerk metadata to classify as customer
        publicMetadata: {
          isPhotographer: false,
        },
      });
    }
  }

  return (
    <div className="relative h-auto bg-[#f4f4f4] py-20 sm:pb-7 sm:pt-5">
      <div className="justify-right flex items-center space-x-7">
        <div className="sm:w-1/2 px-8 sm:pl-20">
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
        <div className="hidden sm:flex w-1/2 items-center justify-end pr-16">
          <Image
            src="/images/photographer.JPG"
            alt="Photographer taking a picture"
            width={750}
            height={100}
            className="rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}