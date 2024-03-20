"use client";

import { cn } from "@/utils/cn";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";

type SearchProps = {
  className?: string;
  pgType?: string;
};

export default function SearchArea({ className, pgType }: SearchProps) {
  const [photographyType, setPhotographyType] = useState(pgType ?? "Portrait");
  const handlePhotographyTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPhotographyType(e.target.value);
  };

  return (
    <div className={cn("@container", className)}>
      <div className="grid @md:grid-cols-6 @md:gap-2">
        <div className="mt-3 @md:col-span-2 @md:mt-0">
          <label htmlFor="location" className="sm text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            defaultValue="Boston, MA + Cambridge, MA"
            readOnly
          />
        </div>

        <div className="@md:col-span-2">
          <label htmlFor="photographyType" className="text-sm font-medium">
            Photography Type
          </label>
          <select
            id="photographyType"
            name="photographyType"
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            onChange={handlePhotographyTypeChange}
            defaultValue={pgType}
          >
            <option value="Portrait">Portrait</option>
            <option value="Candid">Candid</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="University Event">University Event</option>
            <option value="Sport">Sport</option>
            <option value="Journalism">Journalism</option>
            <option value="Graduation">Graduation</option>
            <option value="Headshot">Headshot</option>
            <option value="Concert">Concert</option>
            <option value="Fashion">Fashion</option>
            <option value="Outdoor Photoshoot">Outdoor Photoshoot</option>
            <option value="Videography">Videography</option>
          </select>
        </div>

        <div className="mt-3 @md:col-span-1 @md:col-start-5 @md:mt-6">
          <Button
            as={Link}
            href={`/discover?photographyType=${photographyType}`}
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}

// skills: "Portrait", " Candid", "Corporate Event", "University Event", "Sport", "Journalism", "Graduation", "Headshot", "Concert", "Fashion", "Outdoor Photoshoot", "Videography", "Pet Portrait"
