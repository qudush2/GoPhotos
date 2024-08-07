"use client";
import { Button } from "@nextui-org/react";
import Link from 'next/link';
import ImageCarousel from './ImageCarousel';

export default function CustomerLandingPage() {
  return (
    <div className="flex flex-col items-end">
      <div className="w-full text-center space-y-3 mb-10">
        <p className="font-playfair text-5xl">
          Creative Hiring&nbsp;
          <span className="inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text pl-0.5 italic leading-snug text-transparent">
            Simplified.
          </span>
        </p>
        <p>
          Hiring for local photography talent done right
        </p>
      </div>
      <div className="w-full flex justify-center space-x-5 mb-10">
        <Button
          as={Link}
          href="/discover"
          className="flex-1 max-w-[200px] rounded-md text-base text-white bg-[#FC7674]"
        >
          Book Today
        </Button>
        <Button
          as={Link}
          href="/discover"
          className="flex-1 max-w-[200px] rounded-md text-base bg-white border-2 border-[#FC7674]"
        >
          Explore
        </Button>
      </div>
      <div className="w-full max-w-3xl">
        <ImageCarousel />
      </div>
    </div>
  );
}