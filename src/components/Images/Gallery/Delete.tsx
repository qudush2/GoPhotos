"use client";

import { useState } from "react";

interface ImageDeleterProps {
  selectedImages: Set<string>;
  onDeleteComplete: () => void;
  selectMode: boolean;
}

export default function Delete({
  selectedImages,
  onDeleteComplete,
  selectMode,
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
    <div>
      <button
        onClick={deleteSelectedImages}
        disabled={isDeleting || !selectMode || selectedImages.size === 0}
        className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete Selected"}
      </button>
    </div>
  );
}