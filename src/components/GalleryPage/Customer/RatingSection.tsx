"use client";

import { useRef, useState } from "react";
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
  const starRefs = useRef<Array<HTMLDivElement | null>>([]);

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

  const moveRating = (star: number) => {
    setRating(star);
    starRefs.current[star - 1]?.focus();
  };

  const handleStarKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    star: number
  ) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        moveRating(star < 5 ? star + 1 : 5);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        moveRating(star > 1 ? star - 1 : 1);
        break;
      case "Home":
        e.preventDefault();
        moveRating(1);
        break;
      case "End":
        e.preventDefault();
        moveRating(5);
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        setRating(star);
        break;
      default:
        break;
    }
  };

  const renderStars = (ratingValue: number, interactive: boolean) => {
    if (!interactive) {
      return [1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          aria-hidden="true"
          className={`h-6 w-6 ${
            star <= ratingValue ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
    }

    const tabbableStar = ratingValue === 0 ? 1 : ratingValue;

    return [1, 2, 3, 4, 5].map((star) => (
      <div
        key={star}
        ref={(el) => {
          starRefs.current[star - 1] = el;
        }}
        role="radio"
        aria-checked={star === ratingValue}
        aria-label={`${star} star${star > 1 ? "s" : ""}`}
        tabIndex={star === tabbableStar ? 0 : -1}
        onClick={() => setRating(star)}
        onKeyDown={(e) => handleStarKeyDown(e, star)}
        className="rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <StarIcon
          aria-hidden="true"
          className={`h-6 w-6 cursor-pointer ${
            star <= ratingValue ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      </div>
    ));
  };

  const isInteractive = !existingRating && isCustomer;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">
        {existingRating ? "Rating" : "Rate Your Experience"}
      </h3>
      <div
        className="flex mb-2"
        role={isInteractive ? "radiogroup" : "img"}
        aria-label={
          isInteractive
            ? "Rate your experience, 1 to 5 stars"
            : `Rating: ${rating} out of 5 stars`
        }
      >
        {renderStars(rating, isInteractive)}
      </div>
      {existingRating ? (
        <p className="mt-2">{comment}</p>
      ) : isCustomer ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="rating-comment" className="sr-only">
            Comment
          </label>
          <textarea
            id="rating-comment"
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
