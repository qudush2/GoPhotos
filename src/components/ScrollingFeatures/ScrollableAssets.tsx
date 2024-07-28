"use client";

import {
  ScrollArea,
  ScrollBar,
} from "@/src/components/ScrollingFeatures/ScrollArea";
import ImageModal from "@/src/components/Images/Modal";

interface ScrollableAssetsProps {
  assets: Array<{ url: string }>;
}

export default function ScrollableAssets({ assets }: ScrollableAssetsProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex flex-col gap-1">
        <div className="flex w-max gap-1">
          {assets.slice(0, Math.ceil(assets.length / 2)).map((asset, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden w-80 lg:w-[28rem]"
              style={{
                position: "relative",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{
                  filter: "blur(20px)",
                  backgroundImage: `url(${asset.url})`,
                  zIndex: 0,
                }}
              />
              <ImageModal alt="" src={asset.url} />
            </div>
          ))}
        </div>
        <div className="flex w-max gap-1">
          {assets.slice(Math.ceil(assets.length / 2)).map((asset, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden w-80 lg:w-[28rem]"
            >
              <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{
                  filter: "blur(20px)",
                  backgroundImage: `url(${asset.url})`,
                  zIndex: 0,
                }}
              />
              <ImageModal alt="" src={asset.url} />
            </div>
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
