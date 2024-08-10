"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { ShareIcon } from "@heroicons/react/20/solid";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@radix-ui/react-dialog";

export default function ShareProfileButton({
  photographerName,
  photographerURL,
}: {
  photographerName: string;
  photographerURL: string;
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/share-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, photographerName, photographerURL }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred while sharing the profile.");
      }
    } catch (err) {
      setError("An error occurred while sharing the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-black text-white px-3 py-1 rounded-md">
          <ShareIcon className="w-4 h-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <DialogClose className="absolute inset-0 cursor-default" />
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative z-10">
          <DialogTitle className="text-lg font-semibold mb-4">
            Share Profile
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter recipient's email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
          {isSuccess && (
            <p className="text-green-600 mt-2">Profile shared successfully!</p>
          )}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
