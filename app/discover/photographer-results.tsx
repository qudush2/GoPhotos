import { cn } from "@/utils/cn";

import PhotographerPreviewCard from "./photographer-preview-card";
import { Fragment } from "react";
import { Photographer } from "@/utils/types";
import {isVisible} from '@/utils/db'

type PhotographerResultsProps = {
  className?: string;
  photographers: Photographer[];
  pgType: string;
  bypassVisibility? : boolean,
};

export default async function PhotographerResults({
  className,
  photographers,
  pgType,
  bypassVisibility = false, // change to true to display test account, SET TO FALSE BEFORE PUSH
}: PhotographerResultsProps) {
  shuffleArray(photographers);

  if (!photographers || !Array.isArray(photographers)) {
    return (
      <div className={cn("space-y-5", className)}>No photographers found.</div>
    );
  }

  const visiblePhotographers = await Promise.all(
    photographers.map(async (photographer) => ({
      visible: await isVisible(photographer.accountId) || (bypassVisibility && photographer.accountId === 'prklVeM'),
      photographer,
    }))
  ).then(results => results.filter(result => result.visible).map(result => result.photographer));


  return (
    <div className={cn("space-y-5", className)}>
      {visiblePhotographers
        .map((photographer, idx) => (
          <Fragment key={photographer.id}>
            <PhotographerPreviewCard
              photographer={photographer}
              pgType={pgType}
            />
            {idx !== photographers.length - 1}
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

