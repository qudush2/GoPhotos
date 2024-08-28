"use client";

import { useState } from "react";
import JSZip from "jszip";

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

    try {
      const response = await fetch("/api/images/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageKeys: keys }),
      });

      if (!response.ok) throw new Error("Failed to get presigned URLs");
      const { presignedUrls } = await response.json();
      const totalSize = presignedUrls.reduce(
        (sum: number, item: { size: number }) => sum + item.size,
        0
      );
      let downloadedSize = 0;
      const startTime = Date.now();

      const zip = new JSZip();
      await Promise.all(
        presignedUrls.map(
          async ({
            url,
            name,
            size,
          }: {
            url: string;
            name: string;
            size: number;
          }) => {
            const response = await fetch(url);
            const blob = await response.blob();
            zip.file(name, blob);

            downloadedSize += size;
            const progress = (downloadedSize / totalSize) * 100;
            setDownloadProgress(progress);

            const elapsedSeconds = (Date.now() - startTime) / 1000;
            const bytesPerSecond = downloadedSize / elapsedSeconds;
            const remainingBytes = totalSize - downloadedSize;
            const remainingSeconds =
              bytesPerSecond > 0 ? remainingBytes / bytesPerSecond : 0;
            setDownloadTime(`Estimated time: ${Math.ceil(remainingSeconds)}s`);
          }
        )
      );

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
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
