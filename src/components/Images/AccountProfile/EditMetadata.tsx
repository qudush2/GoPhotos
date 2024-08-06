"use client";

import { useState } from "react";
import { SKILLS } from "@/src/utils/types";
import { s3Images } from "@/src/utils/types";

interface MetadataEditorProps {
  selectedImages: Set<string>;
  onMetadataUpdate: () => void;
  isEditingMetadata: boolean;
  toggleEditMetadata: () => void;
  selectedSkill: string | null;
  setSelectedSkill: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function MetadataEditor({
  selectedImages,
  onMetadataUpdate,
  isEditingMetadata,
  toggleEditMetadata,
  selectedSkill,
  setSelectedSkill,
}: MetadataEditorProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkill(prevSkill => prevSkill === skill ? null : skill);
  };

  const updateMetadata = async () => {
    if (selectedImages.size === 0 || !selectedSkill) return;

    setIsUpdating(true);
    try {
      const response = await fetch("/api/images/update-metadata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageKeys: Array.from(selectedImages),
          skill: selectedSkill,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update metadata");
      }

      onMetadataUpdate();
    } catch (error) {
      console.error("Error updating metadata:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <button
        onClick={toggleEditMetadata}
        className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
      >
        {isEditingMetadata ? "Cancel" : "Edit Metadata"}
      </button>
      {isEditingMetadata && (
        <>
          <h3 className="text-lg font-semibold mb-2">Select a skill:</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-2 py-1 rounded ${
                  selectedSkill === skill ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          <button
            onClick={updateMetadata}
            disabled={isUpdating || selectedImages.size === 0 || !selectedSkill}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Metadata"}
          </button>
        </>
      )}
    </div>
  );
}