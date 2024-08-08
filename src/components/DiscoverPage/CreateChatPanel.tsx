"use client";

import { PhotographerAccount } from "@/src/utils/types";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { cn } from "@/src/utils/cn";
import { useRouter } from "next/navigation";
import { useMemo, FormEvent } from "react";

export default function CreateChatPanel({
  account,
}: {
  account: PhotographerAccount;
}) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return null;
  }

  const userID = user.id;
  const convoID = useMemo(() => uuidv4(), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.append("convoID", convoID);
    formData.append("userID", userID);
    formData.append("accountID", account.clerk_id);

    await fetch("/api/database-updates/create-chat", {
      method: "POST",
      body: formData,
    });
    router.push(`/messages/${encodeURIComponent(convoID)}`);
    setIsLoading(false);
  };

  return (
    <div>
      <p className="text-xl font-medium mb-2">Request a Quote</p>
      <p className="text-sm text-gray-600 pb-3">
        Great! There is some information that we need before you can start
        chatting with {account.full_name}
      </p>
      <form
        className="mt-3 space-y-3"
        method="POST"
        onSubmit={handleSubmit}
        target="_blank"
      >
        <div>
          <label htmlFor="eventTitle" className="sm text-sm font-medium">
            Event Title{" "}
          </label>
          <input
            id="eventTitle"
            name="eventTitle"
            required
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            placeholder="Grad Pics"
          />
        </div>
        <div>
          <label htmlFor="location" className="sm text-sm font-medium">
            Location{" "}
            <i>(please be as specific as possible OR put exact address )</i>
          </label>
          <input
            id="location"
            name="location"
            required
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            placeholder="MIT Dome"
          />
        </div>
        <div>
          <label htmlFor="eventDate" className="sm text-sm font-medium">
            Date
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            required
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label htmlFor="startTime" className="sm text-sm font-medium">
            Start Time <i>(optional)</i>
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            defaultValue=""
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="sm text-sm font-medium">
            End Time <i>(optional)</i>
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            defaultValue=""
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
          />
        </div>
        <div>
          <label htmlFor="organization" className="sm text-sm font-medium">
            Organization <i>(if applicable)</i>
          </label>
          <input
            id="organization"
            name="organization"
            defaultValue=""
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            placeholder="GoPhotos"
          />
        </div>
        <div>
          <label htmlFor="eventDescription" className="sm text-sm font-medium">
            Event Description
          </label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            required
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            placeholder="Please be sure to include an overall description of the event, types of photos you expect, & any other necessary information."
          />
        </div>
        <RequestQuoteButton isLoading={isLoading} />
      </form>
    </div>
  );
}

export function RequestQuoteButton({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="relative mt-2">
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
        )}
      >
        {isLoading ? "Sending..." : "Send request"}
      </button>
      {isLoading && (
        <>
          <div className="absolute top-0 z-10 h-full w-full rounded-md bg-gray-800/60 " />
          <div className="absolute left-1/2 top-1/2 z-20 -m-2.5 h-5 w-5 animate-spin rounded-full border-4 border-b-transparent border-l-white border-r-white border-t-white" />
        </>
      )}
    </div>
  );
}
