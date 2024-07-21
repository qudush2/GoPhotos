"use client";

import { useState } from "react";
import "react-lazy-load-image-component/src/effects/blur.css";
import { s3Images } from "@/src/utils/types";
import ImageModal from "./ImageModal";

interface ImageGalleryProps {
  images: s3Images[];
  onImageSelect: (key: string) => void;
  selectedImages: Set<string>;
  isEditingMetadata: boolean;
  onToggleImageSkill: (key: string) => void;
  isLoading: boolean;
  error: string | null;
  isAdminPage?: boolean;
}

export default function ImageGallery({
  images,
  onImageSelect,
  selectedImages,
  isEditingMetadata,
  isLoading,
  error,
  isAdminPage = false,
}: ImageGalleryProps) {
  const [selectMode, setSelectMode] = useState(false);

  if (isLoading) return <div>Loading images...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      selectedImages.clear();
    }
  };

  const selectAll = () => {
    images.forEach((image) => onImageSelect(image.key));
  };

  return (
    <div className="space-y-4">
      {!isAdminPage && (
        <div className="flex space-x-2">
          <button
            onClick={toggleSelectMode}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {selectMode ? "Exit Select Mode" : "Select Images"}
          </button>
          {selectMode && (
            <>
              <button
                onClick={selectAll}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Select All
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded">
                {selectedImages.size} Selected
              </button>
            </>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.length === 0 ? (
          <div>No images found</div>
        ) : (
          images.map((image) => (
            <div
              key={image.key}
              onClick={() => selectMode && onImageSelect(image.key)}
              className={`cursor-pointer relative aspect-square ${
                selectedImages.has(image.key) ? "ring-4 ring-blue-500" : ""
              }`}
            >
              <ImageModal
                src={image.url}
                alt={image.key.split("/").pop() || "Image"}
                selectMode={selectMode}
              />
              {isEditingMetadata && (
                <div className="mt-2 text-sm">
                  Skills: {image.skills.join(", ") || "None"}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
