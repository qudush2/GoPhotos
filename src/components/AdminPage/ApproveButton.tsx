"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ApproveButton({
  clerkID,
  email,
  refresh,
}: {
  clerkID: string;
  email: string;
  refresh: boolean;
}) {
  const [isApproving, setIsApproving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch("/api/applications/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clerkID, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve application");
      }

      // Display success message
      toast.success("Application approved successfully");

      // Display alert message if present
      if (data.alert) {
        toast(data.alert, {
          icon: "⚠️",
          className: "bg-yellow-100 text-yellow-800",
        });
      }

      // Log S3 transfer results for admin information
      if (data.s3Result) {
        console.log("S3 transfer results:", data.s3Result);
      }

      if (refresh) {
        router.refresh();
      } else {
        router.push("/admin/photographer-application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application. Please try again.");
    } finally {
      setIsApproving(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      {!showConfirmation ? (
        <button
          onClick={() => setShowConfirmation(true)}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          Approve
        </button>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isApproving ? "Approving..." : "Confirm Approve"}
          </button>
          <button
            onClick={() => setShowConfirmation(false)}
            className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
