"use client";

import { useState } from "react";
import { PhotographerAccount } from "@/src/utils/types";
import { SKILLS } from "@/src/utils/types";

export default function EditProfile({
  photographerAccount,
}: {
  photographerAccount: PhotographerAccount;
}) {
  const [formData, setFormData] = useState(photographerAccount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/database-updates/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage("Profile updated successfully");
      } else {
        const errorText = await response.text();
        setSubmitMessage(`Failed to update profile: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSubmitMessage("An error occurred while updating the profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updatedSkills };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="about" className="block text-xl mb-2">
          About
        </label>
        <textarea
          id="about"
          name="about"
          value={formData.about}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="custom_url" className="block text-xl mb-2">
          Custom URL
        </label>
        <div className="flex items-center">
          <span className="bg-gray-100 p-2 rounded-l border border-r-0">
            https://www.gophotos.us/
          </span>
          <input
            type="text"
            id="custom_url"
            name="custom_url"
            value={formData.custom_url}
            onChange={(e) => {
              const sanitizedValue = e.target.value.replace(
                /[^a-zA-Z0-9.\-_!]/g,
                ""
              );
              setFormData((prev) => ({ ...prev, custom_url: sanitizedValue }));
            }}
            pattern="^[a-zA-Z0-9.\-_!]+$"
            required
            aria-describedby="custom_url-help"
            className="flex-grow p-2 border rounded-r"
            placeholder="your-custom-url"
          />
        </div>
        <p id="custom_url-help" className="text-sm text-gray-600 mt-1">
          Allowed characters: letters, numbers, ., -, _, and !
        </p>
      </div>

      <div>
        <label htmlFor="location" className="block text-xl mb-2">
          Location
        </label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a location</option>
          <option value="Boston, MA">Boston, MA</option>
          <option value="Cambridge, MA">Cambridge, MA</option>
        </select>
      </div>

      <div>
        <label htmlFor="school" className="block text-xl mb-2">
          School
        </label>
        <input
          type="text"
          id="school"
          name="school"
          value={formData.school}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xl mb-2" id="price-range-label">
          Hourly Price Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            id="price_low"
            name="price_low"
            aria-label="Minimum hourly price"
            value={formData.price_low}
            onChange={handleChange}
            className="w-24 p-2 border rounded"
            min="0"
          />
          <span className="text-xl">-</span>
          <input
            type="number"
            id="price_high"
            name="price_high"
            aria-label="Maximum hourly price"
            value={formData.price_high}
            onChange={handleChange}
            className="w-24 p-2 border rounded"
            min="0"
          />
        </div>
      </div>

      <div>
        <label htmlFor="visible" className="block text-xl mb-2">
          Profile Visible
        </label>
        <input
          type="checkbox"
          id="visible"
          name="visible"
          checked={formData.visible}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, visible: e.target.checked }))
          }
          className="mr-2"
        />
        <label htmlFor="visible">Make profile visible</label>
      </div>

      <div>
        <p className="text-xl mt-10">Skills</p>
        <hr className="my-2 border-gray-300" />
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSkillToggle(skill)}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                formData.skills.includes(skill)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-5"
      >
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
      {submitMessage && (
        <p role="status" aria-live="polite" className="mt-2 text-sm text-gray-600">
          {submitMessage}
        </p>
      )}
    </form>
  );
}
