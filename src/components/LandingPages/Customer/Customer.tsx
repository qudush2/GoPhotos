"use client";

import Search from "@/src/components/LandingPages/Customer/Search";
import { LandingPageImage } from "@/src/utils/types";
import { Divider } from "@nextui-org/divider";
import RightColumn from "@/src/components/LandingPages/Customer/RightColumn";
import LeftColumn from "@/src/components/LandingPages/Customer/LeftColumn";

export default function CustomerLandingPage({
  LPImages,
}: {
  LPImages: LandingPageImage[];
}) {
  return (
    <div className="flex flex-col space-y-10">
      <div className="w-full text-center flex flex-col items-center">
        <p className="font-playfair text-7xl">
          Hiring Photographers
          <br />
          <span className="inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text italic leading-snug text-transparent">
            Simplified.
          </span>
        </p>
        <p className="text-xl font-medium text-gray-500 font-sans w-full max-w-2xl mx-auto pt-7">
          <span className="bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text text-transparent font-bold">
            GoPhotos
          </span>{" "}
          is your all-in-one platform for effortlessly finding, hiring, and
          collaborating with photographers.
        </p>
      </div>
      <div className="w-full flex justify-center">
        <Search />
      </div>
      <div className="w-full flex relative">
        <div className="w-2/5 pr-6 sticky top-0 h-screen">
          <LeftColumn />
        </div>
        <Divider orientation="vertical" className="h-auto" />
        <div className="w-3/5">
          <RightColumn LPImages={LPImages} />
        </div>
      </div>
    </div>
  );
}
