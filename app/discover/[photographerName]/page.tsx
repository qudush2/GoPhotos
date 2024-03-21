import { Account, Asset, Photographer } from "@/utils/types";
import {
  getAccountDetailsByName,
  getPhotographer,
  getAssets,
} from "@/utils/api2";


import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/20/solid";

import Tag from "@/components/tag";
import { ScrollArea, ScrollBar } from "@/components/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/dialog";
import RequestQuotePanel from "../request-quote-panel";

export default async function PhotographerUniquePage(
  
{params}:{params:{photographerName: string}}
) {
  const decodedName = decodeURIComponent(params.photographerName)
  const account = await getAccountDetailsByName(decodedName);
  const photographer = await getPhotographer(account.id);
  const assets = await getAssets(account.id);

  return (
    <div className="grid gap-1 rounded-md py-1 px-8 sm:px-20 pt-7 pb-10" >
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
                    backgroundImage: `url(${asset.cdnPath})`,
                    zIndex: 0,
                  }}
                />
                <Image
                  alt=""
                  src={asset.cdnPath}
                  placeholder="blur"
                  blurDataURL={asset.placeholderBase64}
                  fill
                  className="object-contain z-10"
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
                    backgroundImage: `url(${asset.cdnPath})`,
                    zIndex: 0,
                  }}
                />
                <Image
                  alt=""
                  src={asset.cdnPath}
                  placeholder="blur"
                  blurDataURL={asset.placeholderBase64}
                  fill
                  className="object-contain z-10"
                />
              </div>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* overlay section */}
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
                      {account.fullName}
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
                  <p className="text-sm sm:text-base">{photographer.about}</p>
                </div>
                <div className="mt-5">
                  <p className="mb-0.5 text-sm sm:text-base font-medium">
                    School
                  </p>
                  <p className="text-sm sm:text-base">{photographer.school}</p>
                </div>
                <div className="mt-5">
                  <p className="mb-0.5 text-sm sm:text-base font-medium">
                    Experience
                  </p>
                  <p className="text-sm sm:text-base">
                    {account.fullName.split(" ")[0]} has been hired{" "}
                    {photographer.hires} times.
                  </p>
                </div>
                <div className="mt-5">
                  <p className="mb-1 text-sm sm:text-base font-medium">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {photographer.skills.map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                  </div>
                </div>
                <div className="mt-5">
                  <p className="mb-0.5 text-sm sm:text-base font-medium">
                    Reviews and ratings
                  </p>
                  <p className="text-sm sm:text-base italic text-gray-600">
                    {account.fullName.split(" ")[0]} is new to GoPhotos and does
                    not yet have reviews or ratings.
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
                This estimate is based on 1 hour of {account.fullName}&apos;s
                average hourly price range.
              </p>
              <p className="mt-0.5 text-lg font-semibold">
                ${photographer.estimatedHourlyPriceRange[0]} - $
                {photographer.estimatedHourlyPriceRange[1]}
              </p>
              <Dialog>
                <div className="flex justify-center">
                  <DialogTrigger className="mt-2 w-1/2 rounded-md bg-black px-2 py-1 text-base sm:text-lg font-medium text-white">
                    Request quote
                  </DialogTrigger>
                </div>
                <DialogOverlay>
                  <DialogContent className="fixed left-0 top-0 z-10 h-full w-full overflow-y-auto bg-white p-4">
                    <div className="my-7">
                      <RequestQuotePanel photographer={account} />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
