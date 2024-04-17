import { PlusIcon } from "@heroicons/react/20/solid";

import Tag from "@/components/tag";
import { ScrollArea, ScrollBar } from "@/components/scroll-area";

import Image from "next/image";
import Link from "next/link";
import { Photographer } from "@/utils/types";
import { getAccount, getAssets } from "@/utils/api";
import { shuffle } from "lodash";
import { cn } from "@/utils/cn";
import { Fragment } from "react";

type PhotographerResultsProps = {
  className?: string;
  photographers: Photographer[];
};

type PhotographerPreviewCardProps = {
  photographer: Photographer;
};

export default async function LandingPageCard({
  className,
  photographers,
}: PhotographerResultsProps) {
  const hiddenAccounts = [
    "gbHJdmf",
    "EfhxLZ9",
    "xhoCpeN",
    "ROeNhrw",
    "L3pHOn6",
    "2KY5XM6",
    // "prklVeM", //REMOVE
    // hide photographers w/o best profiles zach (4), aimee (12), isabella (20)
    "VqXmZF3",
    "vEmzDoN",
    "PQNMcnN",
    "nJqfPa3",
  ];
  shuffleArray(photographers);

  if (!photographers || !Array.isArray(photographers)) {
    return (
      <div className={cn("space-y-5", className)}>No photographers found.</div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-row overflow-x-auto space-x-5 border-2 border-orange-300",
        className
      )}
    >
      {photographers
        .filter(
          (photographer) => !hiddenAccounts.includes(photographer.accountId)
        )
        .map((photographer, idx) => (
          <Fragment key={photographer.id}>
            <Card photographer={photographer} />
            {idx !== photographers.length - 1}
          </Fragment>
        ))}
      <Link
        href="/discover"
        passHref
        className="inline-block self-center justify-self-center px-20 py-2 bg-black text-white font-semibold rounded-md whitespace-nowrap"
      >
        See More
      </Link>
    </div>
  );
}

export async function Card({ photographer }: PhotographerPreviewCardProps) {
  const account = await getAccount(photographer.accountId);
  const assets = await getAssets(photographer.accountId);

  return (
    <div className="my-2 py-5 rounded-md bg-white border-2 border-purple-700 w-[30%] h-full">
      <ScrollArea className="h-full w-full rounded-md border-2 border-blue-200">
        <div className="flex w-max gap-1">
          {shuffle(assets)
            .slice(0, 7)
            .map((asset, idx) => (
              <div
                key={idx}
                className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden border md:w-80 lg:w-[28rem]"
              >
                <div
                  className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${asset.cdnPath})`,
                    filter: "blur(20px)",
                    zIndex: 0,
                    opacity: 0.5,
                  }}
                />
                <Image
                  alt=""
                  src={asset.cdnPath}
                  placeholder="blur"
                  blurDataURL={asset.placeholderBase64}
                  fill
                  style={{ objectFit: "contain", zIndex: 1 }}
                />
              </div>
            ))}
          {assets.length > 7 && (
            <div className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden border w-80 lg:w-[28rem]">
              <Link
                href={`/discover/${encodeURIComponent(account.fullName)}`}
                passHref
                target="_blank"
                className="text-md bg-white px-3 py-1 font-medium text-black shadow-md absolute left-1/2 top-1/2 z-10 m-2 -translate-x-1/2 -translate-y-1/2 transform "
              >
                View all
              </Link>
              <div
                className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${assets[7].cdnPath})`,
                  filter: "blur(5px)",
                }}
              />
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col justify-between gap-2 rounded-md p-2 shadow-lg md:row-start-1 pl-3 border-2 border-red-700 ">
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center gap-2">
            <div>
              <p className="text-sm font-medium">{account.fullName}</p>
              <p className="text-xs text-gray-600">{photographer.location}</p>
            </div>
          </div>
          <div className="whitespace-nowrap pt-2 text-right">
            <p className="text-xs text-gray-600">Est. Hourly Price</p>
            <p className="text-lg font-semibold">
              ${photographer.estimatedHourlyPriceRange[0]} - $
              {photographer.estimatedHourlyPriceRange[1]}
            </p>
          </div>
        </div>

        <div className="mt-1">
          <p className="mt-2 text-xs uppercase text-gray-600">About</p>
          <p className="line-clamp-2 text-sm ">
            {photographer.about}
          </p>

          <p className="mt-2 text-xs uppercase text-gray-600">School</p>
          <p className="text-sm">{photographer.school}</p>

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

        <div className="mt-2 w-full rounded-md border border-gray-600 px-2 py-1 text-sm font-medium text-black">
          <Link
            href={`/discover/${encodeURIComponent(account.fullName)}`}
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

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
