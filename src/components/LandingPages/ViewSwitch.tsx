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
      <div className="mx-24 py-20 space-y-10">
        <div className="flex justify-center gap-4 py-5">
          <span
            className={`text-base uppercase ${!isPhotographer ? "font-semibold" : "text-gray-500"}`}
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
            className={`text-base uppercase ${isPhotographer ? "font-semibold" : "text-gray-500"}`}
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
