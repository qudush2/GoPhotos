"use client";

import { useState } from "react";

interface ImageDownloaderProps {
  selectedImages: Set<string>;
  images: { key: string; size: number }[];
}

export default function Download({
  selectedImages,
  images,
}: ImageDownloaderProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadTime, setDownloadTime] = useState("");

  const downloadImages = async (keys: string[]) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadTime("Preparing download...");

    const totalSize = keys.reduce((sum, key) => {
      const image = images.find((img) => img.key === key);
      return sum + (image?.size || 0);
    }, 0);

    try {
      const response = await fetch("/api/images/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageKeys: keys }),
      });

      if (!response.ok) throw new Error("Download failed");

      const reader = response.body!.getReader();
      let receivedLength = 0;
      const chunks = [];

      const startTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;
        const progress = totalSize ? (receivedLength / totalSize) * 100 : 0;
        setDownloadProgress(progress);

        const elapsedSeconds = (Date.now() - startTime) / 1000;
        if (elapsedSeconds > 0 && progress > 0) {
          const bytesPerSecond = receivedLength / elapsedSeconds;
          const remainingBytes = totalSize - receivedLength;
          const remainingSeconds =
            bytesPerSecond > 0 ? remainingBytes / bytesPerSecond : 0;
          setDownloadTime(`Estimated time: ${Math.ceil(remainingSeconds)}s`);
        }
      }

      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "GoPhotosImages.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadTime("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setDownloadTime("");
    }
  };

  const downloadSelected = () => {
    const keys = Array.from(selectedImages);
    if (keys.length > 0) {
      downloadImages(keys);
    } else {
      alert("Please select at least one image to download.");
    }
  };

  const downloadAll = () => {
    const keys = images.map((img) => img.key);
    if (keys.length > 0) {
      downloadImages(keys);
    } else {
      alert("No images available to download.");
    }
  };

  return (
    <div>
      <button
        onClick={downloadSelected}
        disabled={isDownloading || selectedImages.size === 0}
        className="bg-green-500 text-white px-4 py-2 rounded mr-3 disabled:opacity-50"
      >
        {isDownloading ? "Downloading..." : "Download Selected"}
      </button>
      <button
        onClick={downloadAll}
        disabled={isDownloading || images.length === 0}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isDownloading ? "Downloading..." : "Download All"}
      </button>
      {isDownloading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {downloadProgress.toFixed(2)}% Complete
          </p>
          <p className="mt-1 text-sm text-gray-600">{downloadTime}</p>
        </div>
      )}
    </div>
  );
}