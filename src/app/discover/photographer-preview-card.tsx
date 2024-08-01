import { PlusIcon } from "@heroicons/react/20/solid";
import { StarIcon } from "@heroicons/react/24/solid";

import Tag from "@/src/components/Tag";
import {
  ScrollArea,
  ScrollBar,
} from "@/src/components/ScrollingFeatures/ScrollArea";

import Link from "next/link";
import ImageModal from "@/src/components/Images/Modal";
import { PhotographerAccount } from "@/src/utils/types";
import {
  getPortfolioPictures,
  getPhotographerRatings,
} from "@/src/utils/db";
import { Avatar } from "@nextui-org/react";

type PhotographerPreviewCardProps = {
  photographer: PhotographerAccount;
  pgType?: string;
};

export default async function PhotographerPreviewCard({
  photographer,
  pgType,
}: PhotographerPreviewCardProps) {
  const assets = await getPortfolioPictures(photographer.clerk_id, pgType);
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
    <div className="my-2 grid rounded-md bg-white md:grid-cols-[28rem_1fr] md:gap-2 shadow-lg">
      {/* Scroll Area */}
      <div className="h-full w-full rounded-md md:col-start-2 overflow-x-auto flex items-center">
        <div className="flex w-max gap-1">
          {assets.slice(0, 7).map((asset, idx) => (
            <div
              key={idx}
              className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden w-80 lg:w-[28rem]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center blur-lg opacity-50"
                style={{
                  backgroundImage: `url(${asset.url})`,
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
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform z-10 bg-white px-3 py-1 text-md font-medium text-black shadow-md"
              >
                View all
              </Link>
              <div
                className="absolute inset-0 bg-cover bg-center blur-sm"
                style={{
                  backgroundImage: `url(${assets[7].url})`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* PG Info */}
      <Link
        href={`/discover/${encodeURIComponent(photographer.custom_url)}`}
        passHref
        className="rounded-md md:row-start-1 grid grid-cols-2 aspect-auto md:aspect-[3/2] overflow-hidden relative group border border-gray-200 shadow-lg"
      >
        <div className="absolute inset-0 z-10 hidden md:block">
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-xl font-semibold">
              View Profile
            </span>
          </div>
        </div>

        <div className="overflow-y-auto flex flex-col items-center justify-start pt-6 md:pt-10">
          {/* Column 1 content */}
          <div className="md:w-[5rem] md:h-[5rem] w-[4.5rem] h-[4.5rem] mb-2 rounded-full p-[2px] bg-gradient-to-r from-[#ff9993] via-[#fc7674] to-[#fc4d74] flex-shrink-0">
            <Avatar
              showFallback
              name={photographer.full_name}
              src={photographer.pfp_url}
              className="w-full h-full rounded-full bg-white"
            />
          </div>
          <div className="mt-2 text-base md:text-lg font-semibold">
            {photographer.full_name.split(" ")[0]}
          </div>
          <div className="text-xs md:text-sm text-gray-500">
            {photographer.location}
          </div>
          <div className="mt-3 md:pt-3">
            {totalRatings > 0 ? (
              <div className="flex flex-col items-center">
                {renderStars(avgRating)}
                <span className="text-xs md:text-sm text-gray-600 mt-1">
                  ({totalRatings})
                </span>
              </div>
            ) : (
              <p className="text-xs md:text-sm text-gray-600">
                No rating available
              </p>
            )}
          </div>
        </div>
        <div className="overflow-y-auto p-4">
          {/* Column 2 content */}
          <div className="space-y-3">
            <div>
              <p className="text-base md:text-lg font-semibold">
                ${photographer.price_low} - ${photographer.price_high}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                Est. Hourly Price
              </p>
            </div>
            <hr className="border-gray-200 w-full" />
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-1">About</h3>
              <p className="line-clamp-3 text-xs md:text-sm">
                {photographer.about}
              </p>
            </div>
            <hr className="border-gray-200 w-full" />
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-1">
                Skills
              </h3>
              <div className="text-xs md:text-sm">
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

        {/* New button for small screens */}
        <div className="mt-2 w-full rounded-md border border-gray-600 px-2 py-1 text-sm font-medium text-black col-span-2 md:hidden">
          <span className="flex justify-center">View Profile</span>
        </div>
      </Link>
    </div>
  );
}
