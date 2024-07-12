"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/src/components/Dialog";
import Image from "next/image";
import { Asset } from "@/src/utils/types";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface ViewAllImagesProps {
  assets: Asset[];
}

export default function ViewAllImages({ assets }: ViewAllImagesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        View All
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col max-w-full m-0 p-0 h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">
              All Images ({assets.length})
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-grow overflow-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {assets.map((asset, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/2] overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                    style={{
                      filter: "blur(20px)",
                      backgroundImage: `url(${asset.cdnPath})`,
                      zIndex: 0,
                    }}
                  />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      alt=""
                      src={asset.cdnPath}
                      placeholder="blur"
                      blurDataURL={asset.placeholderBase64}
                      fill
                      style={{ objectFit: "contain", zIndex: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
