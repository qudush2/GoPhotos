"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type SearchProps = {};

export default function SearchArea({}: SearchProps) {
  const router = useRouter();
  const [photographyType, setPhotographyType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

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
    <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto">
      <div className="w-full">
        <select
          id="location"
          name="location"
          className="w-full h-12 rounded-md border border-gray-500 text-sm outline-none px-3"
          onChange={handleLocationChange}
          value={selectedLocation}
        >
          <option value="">Select Location</option>
          <option value="Boston, MA">Boston, MA</option>
          <option value="Cambridge, MA">Cambridge, MA</option>
        </select>
      </div>

      <div className="w-full">
        <select
          id="photographyType"
          name="photographyType"
          className="w-full h-12 rounded-md border border-gray-500 text-sm outline-none px-3"
          onChange={handlePhotographyTypeChange}
          value={photographyType}
        >
          <option value="">Select Photography Type</option>
          <option value="Portrait">Portrait</option>
          <option value="Graduation">Graduation</option>
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
        </select>
      </div>

      <div className="w-full">
        <Button
          onClick={handleSearch}
          className="w-full h-10 rounded-md text-base text-white animated-gradient-button"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
