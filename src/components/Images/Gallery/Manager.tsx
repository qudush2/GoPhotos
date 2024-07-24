"use client";

import { useState, useEffect } from "react";
import Upload from "@/src/components/Images/Gallery/Upload";
import Delete from "@/src/components/Images/Gallery/Delete";
import Download from "@/src/components/Images/Gallery/Download";
import Display from "@/src/components/Images/Gallery/Display";
import Select from "@/src/components/Images/Gallery/Select";
import { s3Images } from "@/src/utils/types";

interface ImageManagerProps {
  folderId: string;
  isPhotographer: boolean;
}

export default function ImageManager({
  folderId,
  isPhotographer,
}: ImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [images, setImages] = useState<s3Images[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectMode, setSelectMode] = useState(false);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/images/fetch?folderId=${encodeURIComponent(folderId)}`
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
  };

  useEffect(() => {
    fetchImages();
  }, [folderId]);

  const handleImageSelect = (key: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleUploadComplete = () => {
    fetchImages();
  };

  const handleDeleteComplete = () => {
    fetchImages();
    setSelectedImages(new Set());
  };

  const toggleSelectMode = () => {
    setSelectMode((prevMode) => !prevMode);
    setSelectedImages(new Set()); // Clear selected images when toggling select mode
  };

  const selectAll = () => {
    setSelectedImages(new Set(images.map(image => image.key)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        {isPhotographer && (
          <>
            <Upload folderId={folderId} onUploadComplete={handleUploadComplete} />
            <Delete
              selectedImages={selectedImages}
              onDeleteComplete={handleDeleteComplete}
              selectMode={selectMode}
            />
          </>
        )}
        <Download selectedImages={selectedImages} images={images} />
        <Select
          selectMode={selectMode}
          toggleSelectMode={toggleSelectMode}
          selectAll={selectAll}
          selectedCount={selectedImages.size}
        />
      </div>
      <Display
        images={images}
        onImageSelect={handleImageSelect}
        selectedImages={selectedImages}
        isLoading={isLoading}
        selectMode={selectMode}
      />
    </div>
  );
}