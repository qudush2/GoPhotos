"use client";

import React, { useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import Upload from "@/src/components/Images/Apply/Upload";

interface ApplicationFormProps {
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  clerkID: string;
}

export default function ApplicationForm({
  firstName,
  lastName,
  email,
  skills,
  clerkID,
}: ApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [otherLocation, setOtherLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const skillOptions = skills.map((skill) => ({ value: skill, label: skill }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadComplete) {
      alert("Please upload your portfolio images before submitting.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const university = formData.get("school") as string;
    if (!university) {
      formData.set("school", "N/A");
    }
    const other = formData.get("other") as string;
    if (!other) {
      formData.set("other", "nothing else");
    }

    try {
      const response = await fetch("/api/applications/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      router.refresh();
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = () => {
    const form = document.querySelector("form");
    if (form) form.requestSubmit();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block mb-1">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              defaultValue={firstName}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              defaultValue={lastName}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={email}
            readOnly
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label htmlFor="location" className="block mb-1">
            Location
          </label>
          <select
            id="location"
            name="location"
            required
            className="w-full px-3 py-2 border rounded"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Select a location</option>
            <option value="Boston, MA">Boston, MA</option>
            <option value="Cambridge, MA">Cambridge, MA</option>
            <option value="other">Other</option>
          </select>
        </div>
        {selectedLocation === "other" && (
          <div>
            <label htmlFor="otherLocation" className="block mb-1">
              Specify Location
            </label>
            <input
              type="text"
              id="otherLocation"
              name="otherLocation"
              value={otherLocation}
              onChange={(e) => setOtherLocation(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your location"
            />
          </div>
        )}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price_low" className="block mb-1 font-medium">
                Minimum Hourly Price
              </label>
              <input
                type="number"
                id="price_low"
                name="price_low"
                required
                aria-describedby="price-range-help"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="price_high" className="block mb-1 font-medium">
                Maximum Hourly Price
              </label>
              <input
                type="number"
                id="price_high"
                name="price_high"
                required
                aria-describedby="price-range-help"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <p id="price-range-help" className="text-sm text-gray-600 italic">
            Note: This price range helps potential clients understand your rates
            before reaching out. It's not a fixed value, and you're not
            obligated to stay within this range. We understand that job costs
            may vary, and you'll still determine the final price for each job.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="school" className="block mb-1 font-medium">
              Current University
            </label>
            <input
              type="text"
              id="school"
              name="school"
              aria-describedby="school-help"
              className="w-full px-3 py-2 border rounded"
            />
            <p id="school-help" className="text-sm text-gray-600 italic mt-2">
              If applicable. Leave empty if not currently enrolled.
            </p>
          </div>
          <div>
            <label htmlFor="hires" className="block mb-1 font-medium">
              Approximate Number of Photography Jobs Completed
            </label>
            <input
              type="number"
              id="hires"
              name="hires"
              required
              aria-describedby="hires-help"
              className="w-full px-3 py-2 border rounded"
            />
            <p id="hires-help" className="text-sm text-gray-600 italic mt-2">
              This number will be displayed on your profile and will increase
              with each new GoPhotos job you complete.
            </p>
          </div>
        </div>
        <div>
          <label htmlFor="skills" className="block mb-1">
            Skills
          </label>
          <Select
            isMulti
            inputId="skills"
            name="skills"
            options={skillOptions}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        <div>
          <label htmlFor="about" className="block mb-1">
            About
          </label>
          <textarea
            id="about"
            name="about"
            required
            className="w-full px-3 py-2 border rounded"
            rows={4}
          ></textarea>
        </div>
      </form>

      <div className="space-y-2">
        <p className="block mb-1 font-medium">
          Upload up to 15 images that showcase your work with the skills you
          have selected.
        </p>
        <p className="text-sm text-gray-600 italic">
          Note: These will be the first images to appear on your portfolio. You
          will be able to update these afterwards.
        </p>
        <Upload
          folderId={`photographer-application/${clerkID}`}
          onUploadComplete={() => setUploadComplete(true)}
        />
      </div>

      <div>
        <label htmlFor="other" className="block mb-1">
          Any other questions, comments, or feedback. <br />
          Have other friends who should join GoPhotos? Leave their instagram
          here.
        </label>
        <textarea
          id="other"
          name="other"
          className="w-full px-3 py-2 border rounded"
          rows={4}
        ></textarea>
      </div>

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isSubmitting || !uploadComplete}
        onClick={handleButtonClick}
      >
        {isSubmitting
          ? "Submitting..."
          : uploadComplete
            ? "Submit Application"
            : "Upload Images to Submit"}
      </button>
      {!uploadComplete && (
        <p className="text-red-500 mt-2">
          Please upload your portfolio images before submitting.
        </p>
      )}
    </div>
  );
}
