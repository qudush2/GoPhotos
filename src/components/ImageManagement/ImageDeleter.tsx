"use client";

import { useState } from "react";

interface ImageDeleterProps {
  selectedImages: Set<string>;
  onDeleteComplete: () => void;
}

export default function ImageDeleter({
  selectedImages,
  onDeleteComplete,
}: ImageDeleterProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/images/general", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: Array.from(selectedImages) }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete images");
      }

      onDeleteComplete();
    } catch (error) {
      console.error("Error deleting images:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={deleteSelectedImages}
      disabled={isDeleting || selectedImages.size === 0}
      className="bg-red-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete Selected"}
    </button>
  );
}
