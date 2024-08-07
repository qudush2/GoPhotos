"use client";

import { useState } from "react";
import { Switch } from "@nextui-org/react";
import PhotographerLandingPage from "@/src/components/LandingPages/Photographer/Photographer";
import CustomerLandingPage from "@/src/components/LandingPages/Customer/Customer";
import AnimatedBackground from '@/src/components/LandingPages/AnimatedBackground'

export default function LandingPageSwitch() {
  const [isPhotographer, setIsPhotographer] = useState(false);

  return (
    <>
    <AnimatedBackground/>
    <div className="mx-24 pb-20">
      <div className="flex justify-center gap-4 py-5">
        <span
          className={`text-sm ${!isPhotographer ? "font-semibold" : "text-gray-500"}`}
        >
          Hire a Photographer
        </span>
        <Switch
          checked={isPhotographer}
          onChange={() => setIsPhotographer(!isPhotographer)}
          size="sm"
          color="primary"
          classNames={{
            wrapper: `group-data-[selected=true]:bg-[#FC7674]`,
          }}
        />
        <span
          className={`text-sm ${isPhotographer ? "font-semibold" : "text-gray-500"}`}
        >
          I'm a Photographer
        </span>
      </div>
      {isPhotographer ? <PhotographerLandingPage /> : <CustomerLandingPage />}
    </div>
    </>
  );
}
