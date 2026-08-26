"use client";

import "react-lazy-load-image-component/src/effects/blur.css";
import { s3Images } from "@/src/utils/types";
import ImageModal from "@/src/components/Images/Modal";
import { buildIndexedPhotoAlt } from "@/src/utils/imageAlt";

interface ImageGalleryProps {
  images: s3Images[];
  onImageSelect: (key: string) => void;
  selectedImages: Set<string>;
  isLoading: boolean;
  selectMode: boolean;
}

export default function Display({
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
        images.map((image, index) => (
          <div
            key={image.key}
            onClick={() => selectMode && onImageSelect(image.key)}
            className={`cursor-pointer relative aspect-square ${
              selectMode && selectedImages.has(image.key)
                ? "ring-4 ring-blue-500"
                : ""
            }`}
          >
            <ImageModal
              src={image.url}
              alt={buildIndexedPhotoAlt("Event photo", index, images.length)}
              selectMode={selectMode}
            />
          </div>
        ))
      )}
    </div>
  );
}
