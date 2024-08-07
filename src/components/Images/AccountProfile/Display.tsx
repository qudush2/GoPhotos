"use client";

import "react-lazy-load-image-component/src/effects/blur.css";
import { s3Images } from "@/src/utils/types";
import ImageModal from "@/src/components/Images/Modal";

interface ImageGalleryProps {
  images: s3Images[];
  onImageSelect: (key: string) => void;
  selectedImages: Set<string>;
  isLoading: boolean;
  selectMode: boolean;
}

export default function ImageGallery({
  images,
  onImageSelect,
  selectedImages,
  isLoading,
  selectMode,
}: ImageGalleryProps) {

  if (isLoading) return <div>Loading images...</div>;

  return (
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
              <div className="mt-2 text-sm">
                Skills: {image.skills.join(", ") || "None"}
              </div>
            </div>
          ))
        )}
      </div>
  );
}