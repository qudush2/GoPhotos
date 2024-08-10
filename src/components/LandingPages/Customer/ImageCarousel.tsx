"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Avatar } from "@nextui-org/react";
import { LandingPageImage } from "@/src/utils/types";
import Link from "next/link";

export default function ImageCarousel({
  LPImages,
}: {
  LPImages: LandingPageImage[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledImages, setShuffledImages] = useState<LandingPageImage[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const shuffled = [...LPImages].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, [LPImages]);

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
      }, 3000);

      return () => clearInterval(timer);
    }
  }, [shuffledImages, isHovered]);

  const handleClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length);
  };

  return (
    <div
      className="relative w-full h-80 overflow-hidden"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {shuffledImages.map((image, index) => {
        const position =
          (index - currentIndex + shuffledImages.length) %
          shuffledImages.length;
        if (position > 1 && position < shuffledImages.length - 1) return null;

        let className =
          "absolute transition-all duration-500 ease-in-out transform ";

        if (position === 0) {
          className +=
            "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20";
        } else if (position === 1) {
          className +=
            "left-[calc(50%+140px)] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10";
        } else {
          className +=
            "left-[calc(50%-140px)] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10";
        }

        return (
          <div
            key={image.image_url}
            className={className}
            onMouseEnter={() => setHoveredImageIndex(index)}
            onMouseLeave={() => setHoveredImageIndex(null)}
          >
            <div className="relative">
              <Image
                src={image.image_url}
                alt={image.account.full_name.split(" ")[0]}
                width={position === 0 ? 360 : 260}
                height={position === 0 ? 270 : 195}
                className={`rounded-lg shadow-lg transition-all duration-500 ${
                  position !== 0 ? "opacity-40 blur-[1px]" : "opacity-100"
                }`}
                style={{
                  transform: `scale(${position === 0 ? 1 : 0.8})`,
                }}
              />
              {position === 0 && hoveredImageIndex === index && (
                <Link href={`/discover/${image.account.custom_url}`}>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg transition-opacity duration-300">
                    <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-300">
                      View Profile
                    </button>
                  </div>
                </Link>
              )}
              <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                <Avatar
                  showFallback
                  name={image.account.full_name
                    .split(/[\s-]/)
                    .map((n) => n.match(/[a-zA-Z]/)?.[0] || "")
                    .join("")}
                  src={image.account.pfp_url}
                  className={`border-2 border-[#FC7674] text-lg bg-white transition-all duration-500 w-[6rem] h-[6rem] ${
                    position !== 0 ? "opacity-40 blur-[1px]" : "opacity-100"
                  }`}
                  style={{
                    transform: `scale(${position === 0 ? 1 : 0.8})`,
                  }}
                />
                <div
                  className={`absolute bottom-0 -left-1/2 bg-white text-black text-sm px-4 py-1 rounded-full shadow-md border-2 border-[#FC7674] transition-all duration-500 ${
                    position !== 0 ? "opacity-40 blur-[1px]" : "opacity-100"
                  }`}
                  style={{
                    transform: `scale(${position === 0 ? 1 : 0.8})`,
                  }}
                >
                  {image.account.full_name.split(" ")[0]}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
