import {
  getAccountByCustomURL,
  getPortfolioPictures,
  getPhotographerRatings,
} from "@/src/utils/db";

import ViewAllImages from "@/src/components/Images/ViewAll";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Button } from "@nextui-org/react";
import { StarIcon } from "@heroicons/react/24/solid";
import ShareProfile from "@/src/components/DiscoverPage/PhotographerPage/ShareProfile";
import { getImageUrl } from "@/src/utils/imageOptimization";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import CreateChatPanel from "../../../components/DiscoverPage/CreateChatPanel";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import ScrollableAssets from "@/src/components/ScrollingFeatures/ScrollableAssets";
import { notFound } from "next/navigation";

export default async function PhotographerUniquePage({
  params,
}: {
  params: { photographerURL: string };
}) {
  const decodedURL = decodeURIComponent(params.photographerURL);
  const account = await getAccountByCustomURL(decodedURL);

  if (!account) {
    notFound();
  }

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
                  <div className="flex flex-wrap gap-2">
                    {account.skills.map((skill) => (
                      <div
                        key={skill}
                        className="whitespace-nowrap rounded-md border border-gray-300 px-2 py-1 text-xs sm:text-sm font-medium"
                      >
                        {skill}
                      </div>
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
              <div className="space-y-2 mb-5">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold">
                    ${account.price_low}
                  </span>
                  <span className="mx-2 text-xl">-</span>
                  <span className="text-xl font-bold">
                    ${account.price_high}
                  </span>
                  <span className="ml-2 text-sm text-gray-700">per hour</span>
                </div>
                <p className="text-base text-gray-800">
                  Estimated range for a 1-hour session with{" "}
                  {account.full_name.split(" ")[0]}.
                </p>
                <p className="text-sm text-gray-600">
                  *Actual pricing may vary based on project requirements.
                </p>
              </div>
              {user && (
                <Dialog>
                  <div className="flex justify-center">
                    <DialogTrigger className="mt-2 w-1/2 rounded-md bg-black px-2 py-1 text-base sm:text-lg font-medium text-white">
                      Request quote
                    </DialogTrigger>
                  </div>
                    <DialogOverlay className="fixed inset-0 bg-black/50 z-50">
                    <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl w-full max-w-md">
                      {/* <div className="my-7">
                        <CreateChatPanel account={account} />
                      </div> */}
                      <div className="my-7 flex flex-col items-center space-y-4">
                        <h2 className="text-xl font-semibold">Contact Information</h2>
                        <div className="text-center">
                          <p className="text-lg font-medium">{account.full_name}</p>
                          <p className="text-gray-600">{account.email}</p>
                        </div>
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
