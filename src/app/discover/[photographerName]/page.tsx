import {
  getAccountDetailsByName,
  getPortfolioPictures,
} from "@/src/utils/db";

import ImageModal from "@/src/components/Images/ImageModal";
import ViewAllImages from "@/src/components/Images/ViewImages";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "@nextui-org/react";

import Tag from "@/src/components/Tag";
import { ScrollArea, ScrollBar } from "@/src/components/ScrollArea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/src/components/Dialog";
import CreateChatPanel from "../create-chat-panel";
import { currentUser, SignInButton, auth, clerkClient } from "@clerk/nextjs";
import {
  setPhotographerClerkid,
  isPG,
  isPG_noClerk,
  isCustomer,
  createCustomer,
  getAccountByEmail,
} from "@/src/utils/db";

export default async function PhotographerUniquePage({
  params,
}: {
  params: { photographerName: string };
}) {
  const decodedName = decodeURIComponent(params.photographerName);
  const account = await getAccountDetailsByName(decodedName);
  const assets = (await getPortfolioPictures(account.clerk_id));
  const user = await currentUser();

  // move this to better location, temp solution
  const { userId } = auth();

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

  return (
    <div className="grid gap-1 rounded-md py-1 px-8 sm:px-20 pt-7 pb-10">
      <ScrollArea className="w-full">
        <div className="flex flex-col gap-1">
          <div className="flex w-max gap-1">
            {assets.slice(0, Math.ceil(assets.length / 2)).map((asset, idx) => (
              <div
                key={idx}
                className="relative aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden w-80 lg:w-[28rem]"
                style={{
                  position: "relative",
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                  style={{
                    filter: "blur(20px)",
                    backgroundImage: `url(${asset.imagePath})`,
                    zIndex: 0,
                  }}
                />
                <ImageModal
                  alt=""
                  src={asset.imagePath}
                />
              </div>
            ))}
          </div>
          <div className="flex w-max gap-1">
            {assets.slice(Math.ceil(assets.length / 2)).map((asset, idx) => (
              <div
                key={idx}
                className="relative aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden w-80 lg:w-[28rem]"
              >
                <div
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                  style={{
                    filter: "blur(20px)",
                    backgroundImage: `url(${asset.imagePath})`,
                    zIndex: 0,
                  }}
                />
                <ImageModal
                  alt=""
                  src={asset.imagePath}
                />
              </div>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ViewAllImages assets={assets} />

      <div className="mt-2">
        <div>
          <div
            className="mt-3 h-auto
                                        sm:grid sm:grid-cols-4
                                        md:grid-cols-6
                                        xl:grid-cols-9"
          >
            <div
              className="mr-5 flex items-start justify-between
                                            sm:col-span-2 
                                            md:col-span-3
                                            xl:col-span-5"
            >
              <div className="sm:w-full">
                <div className="flex w-full items-center">
                  <div>
                    <p className="text-base sm:text-lg font-medium">
                      {account.full_name}
                    </p>
                    <p className="text-xs sm:text-base text-gray-600 ">
                      Cambridge, MA
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="mb-0.5 text-sm sm:text-base font-medium">
                    About
                  </p>
                  <p className="text-sm sm:text-base">{account.about}</p>
                </div>
                <div className="mt-5">
                  <p className="mb-0.5 text-sm sm:text-base font-medium">
                    School
                  </p>
                  <p className="text-sm sm:text-base">{account.school}</p>
                </div>
                <div className="mt-5">
                  <p className="mb-0.5 text-sm sm:text-base font-medium">
                    Experience
                  </p>
                  <p className="text-sm sm:text-base">
                    {account.full_name.split(" ")[0]} has been hired{" "}
                    {account.hires} times.
                  </p>
                </div>
                <div className="mt-5">
                  <p className="mb-1 text-sm sm:text-base font-medium">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {account.skills.map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  <p className="mb-0.5 text-sm sm:text-base font-medium">
                    Reviews and ratings
                  </p>
                  <p className="text-sm sm:text-base italic text-gray-600">
                    {account.full_name.split(" ")[0]} is new to GoPhotos and
                    does not yet have reviews or ratings.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="h-fit rounded-md border border-gray-200 p-3 py-4 shadow-sm mt-5 sm:mt-0
                                            sm:col-span-2 sm:col-start-3
                                            md:col-span-2 md:col-start-5
                                            xl:col-span-3 xl:col-start-7"
            >
              <p className="text-base sm:text-lg font-medium">
                Estimated price
              </p>
              <p className="mt-0.5 text-sm text-gray-700">
                This estimate is based on 1 hour of {account.full_name}&apos;s
                average hourly price range.
              </p>
              <p className="mt-0.5 text-lg font-semibold">
                ${account.price_low} - ${account.price_high}
              </p>
              {user && (
                <Dialog>
                  <div className="flex justify-center">
                    <DialogTrigger className="mt-2 w-1/2 rounded-md bg-black px-2 py-1 text-base sm:text-lg font-medium text-white">
                      Request quote
                    </DialogTrigger>
                  </div>
                  <DialogOverlay>
                    <DialogContent className="fixed left-0 top-0 z-50 h-full w-full overflow-y-auto bg-white p-4">
                      <div className="my-7">
                        <CreateChatPanel account={account} />
                      </div>
                      <DialogClose
                        autoFocus={false}
                        className="absolute right-4 top-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      >
                        <XMarkIcon className="w-8" />
                        <span className="sr-only">Close</span>
                      </DialogClose>
                    </DialogContent>
                  </DialogOverlay>
                </Dialog>
              )}
              {!user && (
                <div className="flex justify-center">
                  <SignInButton>
                    <Button className="mt-2 w-fit rounded-md bg-black px-2 py-1 text-base sm:text-lg font-medium text-white">
                      Sign In to Request quote{" "}
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
