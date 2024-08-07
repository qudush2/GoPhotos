"use client";

import "react-lazy-load-image-component/src/effects/blur.css";
import { s3Images } from "@/src/utils/types";
import ImageModal from "@/src/components/Images/Modal";
import { useState, useEffect, useCallback } from "react";

export default function Display({ folderID }: { folderID: string }) {
  const [images, setImages] = useState<s3Images[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/images/fetch?folderId=${encodeURIComponent(folderID)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [folderID]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div>Loading images...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length === 0 ? (
            <div>No images found</div>
          ) : (
            images.map((image) => (
              <div
                key={image.key}
                className="cursor-pointer relative aspect-square"
              >
                <ImageModal
                  src={image.url}
                  alt={image.key.split("/").pop() || "Image"}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
