"use client";

import { cn } from "@/src/utils/cn";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";

type SearchProps = {
  className?: string;
  pgType?: string;
};

export default function SearchArea({ className, pgType }: SearchProps) {
  const [photographyType, setPhotographyType] = useState(
    pgType ?? "Graduation"
  );
  const handlePhotographyTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPhotographyType(e.target.value);
  };

  return (
    <div className={cn("@container", className)}>
      <div className="grid @md:grid-cols-8 @md:gap-2">
        <div className="@md:col-span-3">
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            className="w-full h-10 rounded-md border border-gray-200 text-sm outline-none px-3"
            defaultValue="Boston, MA + Cambridge, MA"
            readOnly
          />
        </div>

        <div className="@md:col-span-3">
          <label
            htmlFor="photographyType"
            className="block text-sm font-medium mb-1"
          >
            Photography Type
          </label>
          <select
            id="photographyType"
            name="photographyType"
            className="w-full h-10 rounded-md border border-gray-200 text-sm outline-none px-3"
            onChange={handlePhotographyTypeChange}
            defaultValue={pgType}
          >
            <option value="Graduation">Graduation</option>
            <option value="Portrait">Portrait</option>
            <option value="Candid">Candid</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="University Event">University Event</option>
            <option value="Sport">Sport</option>
            <option value="Journalism">Journalism</option>
            <option value="Headshot">Headshot</option>
            <option value="Concert">Concert</option>
            <option value="Fashion">Fashion</option>
            <option value="Outdoor Photoshoot">Outdoor Photoshoot</option>
            <option value="Videography">Videography</option>
            <option value="View All">View All</option>
          </select>
        </div>

        <div className="@md:col-span-2 @md:col-start-7 flex flex-col justify-end">
          <Button
            as={Link}
            href={
              photographyType === "View All"
                ? "/discover"
                : `/discover?photographyType=${photographyType}`
            }
            className="w-full h-10 rounded-md bg-black px-3 text-sm font-medium text-white"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
