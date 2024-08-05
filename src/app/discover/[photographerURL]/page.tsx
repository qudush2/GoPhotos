import {
  getAccountByCustomURL,
  getPortfolioPictures,
  getPhotographerRatings,
} from "@/src/utils/db";

import ViewAllImages from "@/src/components/Images/ViewAll";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "@nextui-org/react";
import { StarIcon } from "@heroicons/react/24/solid";
import ShareProfile from "@/src/components/ShareProfile";
import { getImageUrl } from "@/src/utils/imageOptimization";

import Tag from "@/src/components/Tag";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/src/components/Dialog";
import CreateChatPanel from "../create-chat-panel";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import ScrollableAssets from "@/src/components/ScrollingFeatures/ScrollableAssets";

export default async function PhotographerUniquePage({
  params,
}: {
  params: { photographerURL: string };
}) {
  const decodedURL = decodeURIComponent(params.photographerURL);
  const account = await getAccountByCustomURL(decodedURL);
  let assets = await getPortfolioPictures(account.clerk_id);
  assets = assets.map((asset) => ({
    ...asset,
    url: getImageUrl(asset.key),
  }));

  const user = await currentUser();
  const { avgRating, totalRatings } = await getPhotographerRatings(
    account.clerk_id
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid gap-1 rounded-md py-1 px-8 sm:px-20 pt-7 pb-10">
      <ScrollableAssets assets={assets} />
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
                <div className="flex w-full items-center justify-between mb-2">
                  <ShareProfile
                    photographerName={account.full_name}
                    photographerURL={decodedURL}
                  />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div>
                    <p className="text-base sm:text-lg font-medium">
                      {account.full_name}
                    </p>
                    <p className="text-xs sm:text-base text-gray-600 ">
                      {account.location}
                    </p>
                  </div>
                  <div className="text-right">
                    {totalRatings > 0 ? (
                      <div className="flex flex-col items-end">
                        {renderStars(avgRating)}
                        <span className="text-sm text-gray-600">
                          ({totalRatings}{" "}
                          {totalRatings === 1 ? "rating" : "ratings"})
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No ratings yet</p>
                    )}
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
