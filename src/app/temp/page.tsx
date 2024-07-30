import { PlusIcon } from "@heroicons/react/20/solid";
import { StarIcon } from "@heroicons/react/24/solid";

import Tag from "@/src/components/Tag";
import {
  ScrollArea,
  ScrollBar,
} from "@/src/components/ScrollingFeatures/ScrollArea";

import Link from "next/link";
import ImageModal from "@/src/components/Images/Modal";
import {
  getAccountByEmail,
  getPortfolioPictures,
  getPhotographerRatings,
} from "@/src/utils/db";
import { Avatar } from "@nextui-org/react";

export default async function Temp() {
  const photographer = await getAccountByEmail("qudus@gophotos.us");

  const assets = await getPortfolioPictures(photographer.clerk_id);
  const { avgRating, totalRatings } = await getPhotographerRatings(
    photographer.clerk_id
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6 px-8 sm:px-20 pb-5">
      <div className="my-2 grid gap-5 rounded-md bg-white md:grid-cols-[28rem_1fr] md:gap-2 shadow-lg">
        <div className="rounded-md md:row-start-1 grid grid-cols-2 aspect-[3/2] overflow-hidden">
          <div className="overflow-y-auto flex flex-col items-center justify-start pt-4">
            {/* Column 1 content */}
            <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-r from-[#ff9993] via-[#fc7674] to-[#fc4d74] flex-shrink-0">
              <Avatar
                showFallback
                name={photographer.full_name}
                src={photographer.pfp_url}
                className="w-full h-full rounded-full bg-white"
              />
            </div>
            <div className="mt-2 text-lg font-semibold">
              {photographer.full_name.split(' ')[0]}
            </div>
            <div className="text-sm text-gray-500">{photographer.location}</div>
            <div className="mt-3">
              {totalRatings > 0 ? (
                <div className="flex flex-col items-center">
                  {renderStars(avgRating)}
                  <span className="text-sm text-gray-600 mt-1">
                    ({totalRatings})
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No rating available</p>
              )}
            </div>
          </div>
          <div className="overflow-y-auto p-4">
            {/* Column 2 content */}
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold">
                  ${photographer.price_low} - ${photographer.price_high}
                </p>
                <p className="text-sm text-gray-500">Est. Hourly Price</p>
              </div>
              <hr className="border-gray-200 w-full" />
              <div>
                <h3 className="text-base font-semibold mb-1">About</h3>
                <p className="line-clamp-3 text-sm">{photographer.about}</p>
              </div>
              <hr className="border-gray-200 w-full" />
              <div>
                <h3 className="text-base font-semibold mb-1">Skills</h3>
                <div className="text-sm">
                  {photographer.skills.slice(0, 3).map((skill, index) => (
                    <span key={skill}>
                      {index > 0 && <span className="mx-1 text-gray-300">•</span>}
                      {skill}
                    </span>
                  ))}
                  {photographer.skills.length > 3 && (
                    <span className="ml-1 text-gray-500">
                      +{photographer.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-full w-full rounded-md md:col-start-2">
          <div className="flex w-max gap-1">
            {assets.slice(0, 7).map((asset, idx) => (
              <div
                key={idx}
                className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden w-80 md:w-80 lg:w-[28rem]"
              >
                <div
                  className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${asset.url})`,
                    filter: "blur(20px)",
                    zIndex: 0,
                    opacity: 0.5,
                  }}
                />
                <ImageModal alt="" src={asset.url} />
              </div>
            ))}
            {assets.length > 7 && (
              <div className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden border w-80 lg:w-[28rem]">
                <Link
                  href={`/discover/${encodeURIComponent(photographer.custom_url)}`}
                  passHref
                  target="_blank"
                  className="text-md bg-white px-3 py-1 font-medium text-black shadow-md absolute left-1/2 top-1/2 z-10 m-2 -translate-x-1/2 -translate-y-1/2 transform "
                >
                  View all
                </Link>
                <div
                  className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${assets[7].url})`,
                    filter: "blur(5px)",
                  }}
                />
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}