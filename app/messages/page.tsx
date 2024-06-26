import BookingCardDefault from "@/components/booking-cards/default";
import ChatInbox from "./chat-inbox";
import { auth, currentUser, clerkClient } from "@clerk/nextjs";
import {
  setPhotographerClerkid,
  isPG,
  isPG_noClerk,
  isCustomer,
  createCustomer,
  getPGinfo,
} from "@/utils/db";

export default async function Messages() {
  //move to better location
  const { userId } = auth();
  const user = await currentUser();

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
  //move to better location

  return (
    <div className="flex h-[80vh] overflow-auto px-8 sm:px-20 sm:mb-10">
      <div
        className="grid grid-cols-3 w-full h-full border-2
        xl:grid-cols-7"
      >
        <div
          className="col-span-3 
          xl:col-span-5"
        >
          <ChatInbox />
        </div>

        <div
          className="hidden border-l
          xl:block xl:col-span-2"
        >
          <BookingCardDefault className="h-full" />
        </div>
      </div>
    </div>
  );
}
