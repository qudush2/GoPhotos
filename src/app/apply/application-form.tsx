"use client";

import React, { useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import Upload from '@/src/components/Images/Apply/Upload'

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

  const skillOptions = skills.map((skill) => ({ value: skill, label: skill }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadComplete) {
      alert("Please upload your portfolio images before submitting.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          >
            <option value="">Select a location</option>
            <option value="Boston, MA">Boston, MA</option>
            <option value="Cambridge, MA">Cambridge, MA</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price_low" className="block mb-1">
              Minimum Price
            </label>
            <input
              type="number"
              id="price_low"
              name="price_low"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="price_high" className="block mb-1">
              Maximum Price
            </label>
            <input
              type="number"
              id="price_high"
              name="price_high"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="school" className="block mb-1">
              School
            </label>
            <input
              type="text"
              id="school"
              name="school"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="hires" className="block mb-1">
              Number of Hires
            </label>
            <input
              type="number"
              id="hires"
              name="hires"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label htmlFor="skills" className="block mb-1">
            Skills
          </label>
          <Select
            isMulti
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

      <div>
        <label htmlFor="portfolio" className="block mb-1">
          Upload up to 15 images that showcase your work with the skills you
          have selected.
        </label>
        <Upload
          folderId={`photographer-application/${clerkID}`}
          onUploadComplete={() => setUploadComplete(true)}
        />
      </div>

      <div>
        <label htmlFor="other" className="block mb-1">
          Any other questions, comments, or feedback
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
