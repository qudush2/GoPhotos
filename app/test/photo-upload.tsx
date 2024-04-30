"use client";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";

export default function PhotoUpload() {
  return (
    <>
      <CldUploadWidget uploadPreset="default_unsigned">
        {({ open }) => {
          return <button onClick={() => open()}>Upload an Image</button>;
        }}
      </CldUploadWidget>
    </>
  );
}
