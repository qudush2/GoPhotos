"use client";

import { cn } from "@/src/utils/cn";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SKILLS } from "@/src/utils/types";

type SearchProps = {
  className?: string;
  pgType?: string;
  location?: string;
};

export default function SearchArea({
  className,
  pgType,
  location,
}: SearchProps) {
  const router = useRouter();
  const [photographyType, setPhotographyType] = useState(pgType ?? "");
  const [selectedLocation, setSelectedLocation] = useState(location ?? "");

  const handlePhotographyTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPhotographyType(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (photographyType) {
      searchParams.append("photographyType", photographyType);
    }
    if (selectedLocation) {
      searchParams.append("location", selectedLocation);
    }
    router.push(
      `/discover${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    );
  };

  return (
    <div className={cn("@container", className)}>
      <div className="grid @md:grid-cols-8 @md:gap-2">
        <div className="@md:col-span-3">
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <select
            id="location"
            name="location"
            className="w-full h-10 rounded-md border border-gray-200 text-sm outline-none px-3"
            onChange={handleLocationChange}
            value={selectedLocation}
          >
            <option value=""></option>
            <option value="Boston, MA">Boston, MA</option>
            <option value="Cambridge, MA">Cambridge, MA</option>
          </select>
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
            value={photographyType}
          >
            <option value=""></option>
            {SKILLS.map((skill) => (
              <option value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        <div className="@md:col-span-2 @md:col-start-7 flex flex-col justify-end">
          <Button
            onClick={handleSearch}
            className="w-full h-10 rounded-md bg-black px-3 text-sm font-medium text-white"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
