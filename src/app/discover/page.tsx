import SearchArea from "./search-area";
import PhotographerResults from "./photographer-results";

import { auth, currentUser, clerkClient } from "@clerk/nextjs";
import {
  setPhotographerClerkid,
  isPG,
  isPG_noClerk,
  isCustomer,
  createCustomer,
  getAccountByEmail,
  getAllPhotographers,
} from "@/src/utils/db";

type DiscoverPageProps = {
  searchParams: { photographyType?: string };
};

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  // move this to better location, temp solution
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
  // move to better location

  const photographers = await getAllPhotographers(searchParams.photographyType);

  return (
    <div className="bg-[#f4f4f4]">
      <div className="w-full border-b border-t border-gray-200 py-5 bg-white px-8 sm:px-20 shadow-sm">
        <SearchArea pgType={searchParams.photographyType} />
        <p className="pt-3 text-sm italic text-gray-600">
          Currently available in Boston, MA & Cambridge, MA areas
        </p>
      </div>
      <PhotographerResults
        className="mt-6 px-8 sm:px-20 pb-5"
        photographers={photographers}
        pgType={searchParams.photographyType as string}
      />
    </div>
  );
}
