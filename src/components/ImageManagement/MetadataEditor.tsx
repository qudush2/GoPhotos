"use client";

import { useState, useEffect } from "react";
import { SKILLS } from "@/src/utils/fetchImages";

interface MetadataEditorProps {
  selectedImages: Set<string>;
  onMetadataUpdate: () => void;
  currentSkills: string[];
  selectedSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
}

export default function MetadataEditor({
  selectedImages,
  onMetadataUpdate,
  currentSkills,
  selectedSkill,
  setSelectedSkill,
}: MetadataEditorProps) {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set(currentSkills)
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setSelectedSkills(new Set(currentSkills));
  }, [currentSkills]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prevSkills) => {
      const newSkills = new Set(prevSkills);
      if (newSkills.has(skill)) {
        newSkills.delete(skill);
      } else {
        newSkills.add(skill);
      }
      return newSkills;
    });
  };

  const updateMetadata = async () => {
    if (selectedImages.size === 0) return;

    setIsUpdating(true);
    try {
      const skillsArray = Array.from(selectedSkills);
      const response = await fetch("/api/images/update-metadata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageKeys: Array.from(selectedImages),
          skills: skillsArray,
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
      <h3 className="text-lg font-semibold mb-2">Select skills:</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`px-2 py-1 rounded ${
              selectedSkills.has(skill) ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
      <button
        onClick={updateMetadata}
        disabled={isUpdating || selectedImages.size === 0}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isUpdating ? "Updating..." : "Update Metadata"}
      </button>
    </div>
  );
}