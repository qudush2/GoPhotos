"use client";

import { useState } from "react";
import { Switch } from "@nextui-org/react";
import PhotographerLandingPage from "@/src/components/LandingPages/Photographer/Photographer";
import CustomerLandingPage from "@/src/components/LandingPages/Customer/Customer";
import AnimatedBackground from "@/src/components/LandingPages/AnimatedBackground";
import { LandingPageImage } from "@/src/utils/types";

export default function LandingPageSwitch({
  LPImages,
}: {
  LPImages: LandingPageImage[];
}) {
  const [isPhotographer, setIsPhotographer] = useState(false);
  const [backgroundKey, setBackgroundKey] = useState(0);

  const handleSwitchChange = () => {
    setIsPhotographer(!isPhotographer);
    setBackgroundKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <AnimatedBackground key={backgroundKey} />
      <div className="lg:mx-24 mx-6 md:py-20 py-3 space-y-5 md:space-y-10 md:mb-20">
        <div className="flex justify-center gap-2 md:gap-4 py-2 md:py-5">
          <span
            className={`text-sm md:text-base uppercase flex items-center ${!isPhotographer ? "font-semibold" : "text-gray-500"}`}
          >
            Hire a Photographer
          </span>
          <Switch
            checked={isPhotographer}
            onChange={handleSwitchChange}
            size="sm"
            color="primary"
            classNames={{
              wrapper:
                "group-data-[selected=true]:bg-[#FC7674] bg-white border border-[#FC7674] group-data-[selected=true]:border-transparent mr-0",
              thumb: "group-data-[selected=true]:bg-white bg-[#FC7674]",
            }}
          />
          <span
            className={`text-sm md:text-base uppercase flex items-center ${isPhotographer ? "font-semibold" : "text-gray-500"}`}
          >
            I'm a Photographer
          </span>
        </div>
        {isPhotographer ? (
          <PhotographerLandingPage />
        ) : (
          <CustomerLandingPage LPImages={LPImages} />
        )}
      </div>
    </>
  );
}
