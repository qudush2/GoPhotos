import { useState } from "react";
import { s3Images } from "@/src/utils/types";

interface SetCoverImageProps {
  selectedImages: Set<string>;
  selectMode: boolean;
  images: s3Images[];
  convoID: string;
}

export default function SetCoverImage({
  selectedImages,
  convoID,
  selectMode,
  images,
}: SetCoverImageProps) {
  const [isSettingCover, setIsSettingCover] = useState(false);

  const handleSetCoverImage = async () => {
    if (selectedImages.size === 1) {
      setIsSettingCover(true);
      try {
        const selectedKey = Array.from(selectedImages)[0];
        const selectedImage = images.find((img) => img.key === selectedKey);

        if (!selectedImage) {
          throw new Error("Selected image not found");
        }

        const response = await fetch(
          "/api/database-updates/update-cover-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              convoID: convoID,
              coverImageURL: selectedImage.url,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update cover image");
        }

        console.log("Cover image updated successfully");
      } catch (error) {
        console.error("Error setting cover image:", error);
      } finally {
        setIsSettingCover(false);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleSetCoverImage}
        disabled={isSettingCover || !selectMode || selectedImages.size !== 1}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isSettingCover ? "Setting Cover..." : "Set as Cover Image"}
      </button>
    </div>
  );
}
