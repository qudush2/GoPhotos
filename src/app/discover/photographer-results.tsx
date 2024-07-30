import { cn } from "@/src/utils/cn";

import PhotographerPreviewCard from "./photographer-preview-card";
import { Fragment } from "react";
import { PhotographerAccount } from "@/src/utils/types";
import { isVisible } from "@/src/utils/db";

type PhotographerResultsProps = {
  className?: string;
  photographers: PhotographerAccount[];
  pgType: string;
  bypassVisibility?: boolean;
};

export default async function PhotographerResults({
  className,
  photographers,
  pgType,
  bypassVisibility = process.env.bypass_vis === "true",
}: PhotographerResultsProps) {
  shuffleArray(photographers);

  if (!photographers || !Array.isArray(photographers)) {
    return (
      <div className={cn("space-y-5", className)}>No photographers found.</div>
    );
  }

  const visiblePhotographers = await Promise.all(
    photographers.map(async (photographer) => ({
      visible: (await isVisible(photographer.clerk_id)) || (bypassVisibility && photographer.clerk_id === 'user_2f7VEMmcqr2ihVrGyLo1AlmlhtC'),
      photographer,
    }))
  ).then((results) =>
    results
      .filter((result) => result.visible)
      .map((result) => result.photographer)
  );

  return (
    <div className={cn("space-y-5", className)}>
      {visiblePhotographers.map((photographer, idx) => (
        <Fragment key={photographer.clerk_id}>
          <PhotographerPreviewCard
            photographer={photographer}
            pgType={pgType}
          />
          {idx !== visiblePhotographers.length - 1}
        </Fragment>
      ))}
    </div>
  );
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
