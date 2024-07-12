"use client";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { JobDetails, Customer } from "@/src/utils/types";
import PhotographerPriceForm from "../PhotographerPriceForm";
import React, { useState } from "react";

export default function BookingCardPhotographer({
  jobDetails,
  customer,
  className,
}: {
  jobDetails: JobDetails;
  customer: Customer;
  className?: string;
}) {
  const {
    event_title,
    loc,
    start_time,
    end_time,
    event_date,
    organization,
    description,
    price_finalized,
    job_price,
    paid,
    conversation_id,
    pictures_uploaded,
    picture_url,
    picture_upload_time,
  } = jobDetails;

  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const picture_url = event.currentTarget.picture_url.value;

    await fetch("/api/picture-uploaded-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation_id, picture_url, jobDetails }),
    });

    window.location.reload();
  };

  return (
    <Card className="px-2">
      <CardHeader className="flex gap-3">
        <div className="flex ml-2">
          <p className="text-lg">Photographer Panel</p>
        </div>
      </CardHeader>
      <Divider className="h-[1px] bg-black my-2" />
      <CardBody>
        <p className="text-lg font-medium">
          {event_title} for {customer.full_name}
        </p>
        <br />
        <p className="text-lg underline">Proposed Booking Details</p>
        <p>Event Title: {event_title}</p>
        <p>Location: {loc}</p>
        <p>Initial Date: {event_date}</p>
        {start_time && <p> Time: {start_time}</p>}
        {end_time && <p> Time: {end_time}</p>}
        {organization && <p>Organizatoin: {organization}</p>}
        Description: {description}
        <br />
        {!price_finalized && (
          <>
            <PhotographerPriceForm jobDetails={jobDetails} />
            <br />
          </>
        )}
        {price_finalized && !paid && !pictures_uploaded && (
          <>
            <div>
              <br />
              here is the price of the job that the customer will pay:{" "}
              <span className="font-bold">${job_price}</span>
              <br /> You will be notified when your client has been paid. This
              will then confirm the booking.
              <br /> <br />
            </div>
            <>
              <p className="font-medium text-xl">How it works:</p>
              <ul className="list-disc">
                <li className="mt-2">
                  After you have given your quote and your client accepts it,
                  enter the agreed upon price here.
                </li>
                <li className="mt-2">
                  The customer will then be given payment instructions. After
                  the customer has paid, you will be notified. This will then
                  confirm the booking.
                </li>
                <li className="mt-2">
                  You will then receive your quoted price (in it's full amount
                  with any applicable taxes removed) after you have returned the
                  customer's pictures.
                </li>
                <li className="mt-2">
                  A gallery upload form will become available after the date of
                  the proposed job.
                </li>
                <li className="mt-2">
                  This is to remove any discrepancies and protect the money
                  being transacted between you and the customer. It also helps
                  you manage all of your income from photography, for tax
                  purposes.
                </li>
                <li className="mt-2 italic">
                  Customers may cancel for a full refund up to 1 week before the
                  date of the event ({event_date})
                </li>
              </ul>
            </>
          </>
        )}
        {price_finalized && paid && !pictures_uploaded && (
          <>
            <div className="mt-10">
              <p className="flex flex-col items-center text-lg font-bold inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text px-0.5 italic leading-snug text-transparent">
                Congrats, your event {event_title} has been confirmed! <br />{" "}
                {customer.full_name.split(" ")[0]} has paid ${job_price}.
              </p>

              <p className="font-medium text-xl mt-10">What's Next:</p>
              <ul className="list-disc">
                <li className="mt-2">
                  Upload a public link to share with{" "}
                  {customer.full_name.split(" ")[0]}. After submitting the link,
                  they will be notified via email that their pictures are ready
                  to be viewed.
                </li>
                <div className="mt-5">
                  <form method="POST" onSubmit={handleSubmit}>
                    <label
                      htmlFor="picture_url"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Link
                    </label>
                    <input
                      type="text"
                      id="picture_url"
                      name="picture_url"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Paste the public URL for your images"
                    />
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 bg-black text-white font-bold py-2 px-4 rounded"
                    >
                      Submit Link
                    </button>
                  </form>
                </div>
                <li className="mt-5">
                  The payout process will begin shortly after you return your
                  images.
                </li>
              </ul>
            </div>
          </>
        )}
        {paid && pictures_uploaded && (
          <>
            <p className="font-medium text-xl mt-5">What's Next:</p>
            <p className="mt-2">
              Here is the link you uploaded:
              <a
                href={picture_url}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {" "}
                Pictures for {event_title}
              </a>
            </p>
            <p className="mt-1">
              This was uploaded at{" "}
              {new Date(picture_upload_time).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </p>
            {showUpdateForm && (
              <form method="POST" onSubmit={handleSubmit}>
                <label
                  htmlFor="picture_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Link
                </label>
                <input
                  type="text"
                  id="picture_url"
                  name="picture_url"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Paste the public URL for your images"
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-black text-white font-bold py-2 px-4 rounded"
                >
                  Submit Link
                </button>
              </form>
            )}
            <button
              className="mt-4 px-4 py-2 bg-black text-white font-bold rounded"
              onClick={() => setShowUpdateForm(!showUpdateForm)}
            >
              {showUpdateForm ? "Close Reupload Form" : "Update Link"}
            </button>

            <p className="mt-1">
              The payout process will being after{" "}
              {customer.full_name.split(" ")[0]} has confirmed they recieved the
              images, or 3 days after you return the images.
            </p>
          </>
        )}
        <p className="text-base italic font-bold mt-5">
          If you have questions or concerns, or have ideas to improve the logic
          of GoPhotos, please email me:{" "}
          <a
            href="mailto:hello@gophotos.us"
            className="text-blue-500 hover:underline"
          >
            qudus@gophotos.us
          </a>
          or text me 312-843-4137
        </p>
      </CardBody>
    </Card>
  );
}
