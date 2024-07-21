"use client";

import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import ImageDeleter from "./ImageDeleter";
import MetadataEditor from "./MetadataEditor";
import ImageGallery from "./ImageGallery";
import ImageDownloader from "./ImageDownloader";
import { s3Images } from "@/src/utils/types";

interface ImageManagerProps {
  folderId: string;
  isPhotographer: boolean;
  metadataEditable: boolean;
  isAdminPage?: boolean;
}

export default function ImageManager({
  folderId,
  isPhotographer,
  metadataEditable,
  isAdminPage = false,
}: ImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [images, setImages] = useState<s3Images[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
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
      setError("Failed to load images");
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

  const handleToggleImageSkill = async (key: string) => {
    if (!selectedSkill) {
      console.error("No skill selected");
      return;
    }

    try {
      const image = images.find((img) => img.key === key);
      if (!image) {
        console.error("Image not found");
        return;
      }

      const updatedSkills = image.skills.includes(selectedSkill)
        ? image.skills.filter((skill) => skill !== selectedSkill)
        : [...image.skills, selectedSkill];

      const response = await fetch("/api/images/update-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageKey: key,
          skills: updatedSkills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update image skills");
      }

      await fetchImages();
    } catch (error) {
      console.error("Error updating image skills:", error);
    }
  };

  const handleUploadComplete = () => {
    fetchImages();
  };

  const handleDeleteComplete = () => {
    fetchImages();
    setSelectedImages(new Set());
  };

  const handleMetadataUpdate = () => {
    fetchImages();
    setIsEditingMetadata(false);
  };

  const currentSkills = Array.from(selectedImages).reduce((skills, key) => {
    const image = images.find((img) => img.key === key);
    return image ? [...new Set([...skills, ...image.skills])] : skills;
  }, [] as string[]);

  return (
    <div className="space-y-4">
      {!isAdminPage && isPhotographer && (
        <>
          <ImageUploader
            folderId={folderId}
            onUploadComplete={handleUploadComplete}
          />
          <ImageDeleter
            selectedImages={selectedImages}
            onDeleteComplete={handleDeleteComplete}
          />
          {metadataEditable && (
            <>
              <MetadataEditor
                selectedImages={selectedImages}
                onMetadataUpdate={handleMetadataUpdate}
                selectedSkill={selectedSkill}
                setSelectedSkill={setSelectedSkill}
                currentSkills={currentSkills}
              />
              <button
                onClick={() => setIsEditingMetadata(!isEditingMetadata)}
                className="bg-purple-500 text-white px-4 py-2 rounded"
              >
                {isEditingMetadata ? "Cancel Editing" : "Edit Metadata"}
              </button>
            </>
          )}
        </>
      )}
      {!isAdminPage && (
        <ImageDownloader selectedImages={selectedImages} images={images} />
      )}
      <ImageGallery
        images={images}
        onImageSelect={handleImageSelect}
        selectedImages={selectedImages}
        isEditingMetadata={isEditingMetadata}
        onToggleImageSkill={handleToggleImageSkill}
        isLoading={isLoading}
        error={error}
        isAdminPage={isAdminPage}
      />
    </div>
  );
}
