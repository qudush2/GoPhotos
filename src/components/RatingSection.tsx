"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Rating } from "@/src/utils/types";

interface RatingSectionProps {
  conversationId: string;
  photographerId: string;
  customerId: string;
  existingRating: Rating | null;
  isCustomer: boolean;
}

export default function RatingSection({
  conversationId,
  photographerId,
  customerId,
  existingRating,
  isCustomer,
}: RatingSectionProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingRating) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/database-updates/create-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          photographerId,
          customerId,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        alert("Rating submitted successfully!");
        window.location.reload();
      } else {
        throw new Error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number, interactive: boolean) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        className={`h-6 w-6 ${
          star <= ratingValue ? "text-yellow-400" : "text-gray-300"
        } ${interactive ? "cursor-pointer" : ""}`}
        onClick={() => interactive && setRating(star)}
      />
    ));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">
        {existingRating ? "Rating" : "Rate Your Experience"}
      </h3>
      <div className="flex mb-2">
        {renderStars(rating, !existingRating && isCustomer)}
      </div>
      {existingRating ? (
        <p className="mt-2">{comment}</p>
      ) : isCustomer ? (
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Leave a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
