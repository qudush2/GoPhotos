"use client";

import { useState, useEffect } from "react";
import Upload from '@/src/components/Images/AccountProfile/Upload'
import Delete from '@/src/components/Images/AccountProfile/Delete'
import EditMetadata from '@/src/components/Images/AccountProfile/EditMetadata'
import Select from '@/src/components/Images/AccountProfile/Select'
import Display from '@/src/components/Images/AccountProfile/Display'
import { s3Images } from "@/src/utils/types";

interface ImageManagerProps {
  folderId: string;
  isPhotographer: boolean;
}

export default function ImageManager({
  folderId,
}: ImageManagerProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [images, setImages] = useState<s3Images[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

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

  const handleMetadataUpdate = () => {
    fetchImages();
    setIsEditingMetadata(false);
    setSelectMode(false);
    setSelectedImages(new Set());
    setSelectedSkill(null);
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedImages(new Set());
    }
  };

  const selectAll = () => {
    if (selectMode) {
      setSelectedImages(new Set(images.map(img => img.key)));
    }
  };

  const toggleEditMetadata = () => {
    setIsEditingMetadata(!isEditingMetadata);
    if (!isEditingMetadata) {
      setSelectMode(true);
    } else {
      setSelectMode(false);
      setSelectedImages(new Set());
    }
  };

  return (
    <div className="space-y-4">
      <Upload
        folderId={folderId}
        onUploadComplete={handleUploadComplete}
      />
      <div className="flex flex-wrap items-end gap-3">
        <Delete
          selectedImages={selectedImages}
          onDeleteComplete={handleDeleteComplete}
          selectMode={selectMode}
        />
        <Select
          selectMode={selectMode}
          toggleSelectMode={toggleSelectMode}
          selectAll={selectAll}
          selectedCount={selectedImages.size}
        />
      </div>
      <EditMetadata
        selectedImages={selectedImages}
        onMetadataUpdate={handleMetadataUpdate}
        isEditingMetadata={isEditingMetadata}
        toggleEditMetadata={toggleEditMetadata}
        selectedSkill={selectedSkill}
        setSelectedSkill={setSelectedSkill}
      />
      <Display
        images={images}
        onImageSelect={handleImageSelect}
        selectedImages={selectedImages}
        isLoading={isLoading}
        selectMode={selectMode || isEditingMetadata}
      />
    </div>
  );
}