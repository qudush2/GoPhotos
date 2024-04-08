"use client";
import { JobDetails } from "@/utils/types";
import { useFormStatus } from "react-dom";
import { cn } from "@/utils/cn";

export default function PhotographerPriceForm({
  jobDetails,
}: {
  jobDetails: JobDetails;
}) {
  const convoID = jobDetails.conversation_id;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const job_price = event.currentTarget.price.value;
    await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ convoID, job_price }),
    });
  };

  return (
    <>
      <form
        className="border-2 border-green-500 mt-5 pt-5 px-3"
        method="POST"
        onSubmit={handleSubmit}
      >
        <label htmlFor="price">Enter the price:</label>
        <input type="text" id="price" name="price" pattern="[0-9]+" required />
        <SendPriceButton />
      </form>
    </>
  );
}

export function SendPriceButton() {
  const { pending } = useFormStatus();

  return (
    <div className="relative mt-2">
      <button
        type="submit"
        className={cn(
          "w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
        )}
      >
        Send Price
      </button>
      {pending && (
        <>
          <div className="absolute top-0 z-10 h-full w-full rounded-md bg-gray-800/60" />
          <div className="absolute left-1/2 top-1/2 z-20 -m-2.5 h-5 w-5 animate-spin rounded-full border-4 border-b-transparent border-l-white border-r-white border-t-white" />
        </>
      )}
    </div>
  );
}
