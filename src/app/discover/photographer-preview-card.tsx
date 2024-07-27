import { PlusIcon } from "@heroicons/react/20/solid";

import Tag from "@/src/components/Tag";
import { ScrollArea, ScrollBar } from "@/src/components/ScrollArea";

import Link from "next/link";
import ImageModal from "@/src/components/Images/Modal";
import { PhotographerAccount } from "@/src/utils/types";
import { getAccountByClerkId, getPortfolioPictures } from "@/src/utils/db";
import { Avatar } from "@nextui-org/react";

type PhotographerPreviewCardProps = {
  photographer: PhotographerAccount;
  pgType?: string;
};

export default async function PhotographerPreviewCard({
  photographer,
  pgType,
}: PhotographerPreviewCardProps) {
  const account = await getAccountByClerkId(photographer.clerk_id);
  const assets = await getPortfolioPictures(photographer.clerk_id, pgType);

  return (
    <div className="my-2 grid gap-5 rounded-md bg-white py-5 md:grid-cols-[21rem_1fr] md:gap-2 shadow-lg pr-1">
      <ScrollArea className="h-full w-full rounded-md md:col-start-2">
        <div className="flex w-max gap-1">
          {assets.slice(0, 7).map((asset, idx) => (
            <div
              key={idx}
              className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden w-80 md:w-80 lg:w-[28rem]"
              style={{
                position: "relative",
              }}
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
                href={`/discover/${encodeURIComponent(account.custom_url)}`}
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

      {/* brief pg info section */}
      <div className="flex flex-col justify-between gap-2 rounded-md p-2 shadow-lg md:row-start-1 pl-3">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center gap-2">
              {/* add pfp here */}
              <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-r from-[#ff9993] via-[#fc7674] to-[#fc4d74]">
                <Avatar
                  showFallback
                  name={account.full_name}
                  src={account.pfp_url}
                  className="w-full h-full rounded-full bg-white"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{account.full_name}</p>
                <p className="text-xs text-gray-600">{photographer.location}</p>
              </div>
            </div>
            <div className="whitespace-nowrap pt-2 text-right">
              {(!pgType || pgType !== "Graduation") && (
                <>
                  <p className="text-xs text-gray-600">Est. Hourly Price</p>
                  <p className="text-lg font-semibold">
                    ${photographer.price_low} - ${photographer.price_high}
                  </p>
                </>
              )}
              {pgType === "Graduation" && (
                <>
                  <div className="whitespace-nowrap rounded-md border border-gray-300 px-2 py-1 bg-[#FC4D74] text-white text-xs sm:text-sm font-medium">
                    Special Grad Pricing
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-1 grid gap-1 sm:grid-cols-2 sm:grid-rows-1 md:grid-cols-1 md:grid-rows-[auto_auto]">
            <div className="sm:col-start-1 sm:row-start-1">
              <p className="mt-2 text-xs uppercase text-gray-600">About</p>
              <p className="line-clamp-2 text-sm md:line-clamp-3">
                {photographer.about}
              </p>
            </div>
            <div className="md:row-start-2">
              <p className="mt-2 text-xs uppercase text-gray-600">School</p>
              <p className="text-sm">{photographer.school}</p>
            </div>
            <div className="sm:col-start-2 sm:row-start-1 md:col-start-1 md:row-start-3">
              <p className="mt-2 text-xs uppercase text-gray-600">Skills</p>
              <div className="mt-0.5 flex flex-wrap gap-1">
                {photographer.skills.slice(0, 3).map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
                {photographer.skills.length - 3 > 0 && (
                  <Tag key={photographer.skills[0]}>
                    <span className="flex items-center font-medium">
                      <PlusIcon className="h-3 w-3" />
                      {photographer.skills.length - 3}
                    </span>
                  </Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Book Now button */}
        <div className="mt-2 w-full rounded-md border border-gray-600 px-2 py-1 text-sm font-medium text-black">
          <Link
            href={`/discover/${encodeURIComponent(account.custom_url)}`}
            passHref
            target="_blank"
            className="flex justify-center"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
