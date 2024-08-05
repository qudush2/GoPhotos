"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ImageModalProps {
  src: string;
  alt: string;
  className?: string;
  selectMode?: boolean;
}

export default function Modal({
  src,
  alt,
  className,
  selectMode,
}: ImageModalProps) {
  useEffect(() => {
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    const checkbox = document.getElementById(
      `image-modal-${src}`
    ) as HTMLInputElement;
    checkbox?.addEventListener("change", handleChange);

    return () => {
      checkbox?.removeEventListener("change", handleChange);
      document.body.style.overflow = "";
    };
  }, [src]);

  return (
    <>
      {!selectMode && (
        <input
          type="checkbox"
          id={`image-modal-${src}`}
          className="hidden peer"
        />
      )}
      <label
        htmlFor={selectMode ? undefined : `image-modal-${src}`}
        className="cursor-pointer relative w-full h-full block"
      >
        <Image alt={alt} src={src} fill className="object-contain z-[1]" />
      </label>
      {!selectMode && (
        <label
          htmlFor={`image-modal-${src}`}
          className="fixed inset-0 bg-black bg-opacity-80 hidden peer-checked:flex items-center justify-center cursor-pointer z-50 backdrop-blur-sm"
        >
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={src}
              alt={alt}
              fill
              className="rounded-md object-contain"
            />
          </div>
        </label>
      )}
    </>
  );
}
