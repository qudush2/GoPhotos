import { cn } from "@/utils/cn";

import PhotographerPreviewCard from "./photographer-preview-card";
import { Fragment } from "react";
import { Photographer } from "@/utils/types";

type PhotographerResultsProps = {
  className?: string;
  photographers: Photographer[];
  pgType: string
};

export default async function PhotographerResults({
  className,
  photographers,
  pgType
}: PhotographerResultsProps) {
  const hiddenAccounts = [
    "gbHJdmf",
    "EfhxLZ9",
    "xhoCpeN",
    "ROeNhrw",
    "L3pHOn6",
  ];
  shuffleArray(photographers);

  if (!photographers || !Array.isArray(photographers)) {
    return (
      <div className={cn("space-y-5", className)}>No photographers found.</div>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      {photographers
        .filter(
          (photographer) => !hiddenAccounts.includes(photographer.accountId)
        )
        .map((photographer, idx) => (
          <Fragment key={photographer.id}>
            <PhotographerPreviewCard photographer={photographer} pgType={pgType}/>
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
