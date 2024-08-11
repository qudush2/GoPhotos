"use client";

import { Divider, Button, Link } from "@nextui-org/react";
import LeftColumn from "@/src/components/LandingPages/LeftColumn";
import { LandingPageImage } from "@/src/utils/types";
import RightColumn from "@/src/components/LandingPages/Photographer/RightColumn/RightColumn";

export default function CustomerLandingPage({
  LPImages,
}: {
  LPImages: LandingPageImage[];
}) {
  return (
    <div className="flex flex-col space-y-10">
      <div className="w-full text-center flex flex-col items-center">
        <p className="font-playfair text-5xl md:text-7xl">
          One Platform
          <br />
          <span className="inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text italic leading-snug text-transparent">
            Seamless&nbsp;
          </span>
          Workflow
        </p>
        <p className="text-lg md:text-xl font-medium text-gray-500 font-sans w-full max-w-2xl mx-auto pt-7">
          <span className="bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text text-transparent font-bold">
            GoPhotos
          </span>{" "}
          is your all-in-one platform for effortlessly finding clients, managing
          bookings, and growing your photography business.
        </p>
      </div>
      <div className="flex justify-center">
        <Button
          as={Link}
          className="h-10 px-7 rounded-md text-base text-white animated-gradient-button"
          href="/apply"
        >
          Join Now
        </Button>
      </div>
      <div className="w-full flex flex-col md:flex-row relative">
        <div className="order-2 md:order-1 w-full md:w-3/5 lg:pr-24 md:pr-10">
          <RightColumn LPImages={LPImages} />
        </div>
        <div className="order-1 md:order-2 w-full md:w-2/5 lg:pl-24 sticky top-0 md:h-screen bg-white md:bg-transparent py-5 md:py-0 z-30">
          <LeftColumn LPInfo={photographerLPInfo} />
        </div>
        <Divider
          orientation="vertical"
          className="h-auto mx-4 hidden md:block md:absolute md:left-[60%] md:top-0 md:bottom-0"
        />
      </div>
    </div>
  );
}

const photographerLPInfo = {
  header: "Streamline your photography process",
  text: "From showcasing your portfolio to delivering final images, manage your entire photography business in one centralized hub.",
  buttonTitle: "Join Now",
  buttonLink: "/apply",
};
