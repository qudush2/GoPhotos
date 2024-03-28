import { cn } from "@/utils/cn";

import PhotographerPreviewCard from "./photographer-preview-card";
import { Fragment } from "react";
import { Photographer } from "@/utils/types";

type PhotographerResultsProps = {
  className?: string;
  photographers: Photographer[];
};

export default async function PhotographerResults({
  className,
  photographers,
}: PhotographerResultsProps) {
  // shuffleArray(photographers)

  if (!photographers || !Array.isArray(photographers)) {
    return (
      <div className={cn("space-y-5", className)}>No photographers found.</div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      {photographers.map((photographer, idx) => (
        <Fragment key={photographer.id}>
          <PhotographerPreviewCard photographer={photographer} />
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
