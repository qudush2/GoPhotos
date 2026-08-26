import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Link,
  Button,
} from "@nextui-org/react";
import { JobDetails } from "@/src/utils/types";
import {
  ScrollArea,
  ScrollBar,
} from "@/src/components/ScrollingFeatures/ScrollArea";
import PayNowButton from "@/src/components/PayNowButton";
import { getAccountByClerkId, getPortfolioPictures } from "@/src/utils/db";
import { shuffle } from "lodash";
import Image from "next/image";
import { format, subDays } from "date-fns";
import { getJobStatus } from "@/src/utils/types";
import { getImageUrl } from "@/src/utils/imageOptimization";

export default async function BookingCardCustomer({
  jobDetails,
  className,
}: {
  jobDetails: JobDetails;
  className?: string;
}) {
  const { text: statusText, color: statusColor } = getJobStatus(jobDetails);

  const {
    event_title,
    loc,
    event_date,
    price_finalized,
    job_price,
    paid,
    pictures_uploaded,
    picture_url,
    mit_po,
  } = jobDetails;

  const account = await getAccountByClerkId(jobDetails.photographer_clerk_id);
  let assets = await getPortfolioPictures(account.clerk_id);
  assets = assets.map((asset) => ({
    ...asset,
    url: getImageUrl(asset.key),
  }));

  return (
    <Card className={`px-2 relative overflow-hidden ${className}`}>
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: statusColor }}
      />
      <CardHeader className="flex gap-3">
        <div className="flex ml-2 justify-between w-full items-center">
          <p className="text-xl font-medium">
            {event_title} with {account.full_name.split(" ")[0]}
          </p>
          <span
            className="text-sm font-medium px-2 py-1 rounded"
            style={{ backgroundColor: statusColor, color: "#000" }}
          >
            {statusText}
          </span>
        </div>
      </CardHeader>
      <Divider className="h-[1px] bg-black my-2" />
      <CardBody>
        <Link
          href={`/discover/${encodeURIComponent(account.custom_url)}`}
          target="_blank"
        >
          <ScrollArea className="h-full w-full rounded-md md:col-start-2">
            <div className="flex w-max gap-1">
              {shuffle(assets).map((asset, idx) => (
                <div
                  key={idx}
                  className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden border w-80 md:w-80 lg:w-[28rem]"
                  style={{
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${asset.url})?width=100&height=100`,
                      filter: "blur(20px)",
                      zIndex: 0,
                      opacity: 0.5,
                    }}
                  />
                  <Image
                    alt={`Portfolio photo by ${account.full_name}`}
                    src={asset.url}
                    fill
                    className="object-contain z-10"
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Link>
        <p className="text-base italic">
          Scroll to view more or click on the image to return the photographer's
          portfolio page
        </p>
        <br />

        <p className="text-lg underline">Proposed Booking Details</p>
        <p>Event Title: {event_title}</p>
        <p>Location: {loc}</p>
        <p>Date: {event_date}</p>

        {!price_finalized && !paid && !pictures_uploaded && (
          <div className="flex flex-col items-center">
            <br />
            <p className="text-base mb-2">
              The quote of the job has not been finalized. After the price has been finalized, 
              {mit_po && " you will be able to download an invoice and"} you will be able to pay.
            </p>
            <Button
              className="w-full rounded-md bg-gray-300 px-3 text-sm font-medium text-gray-500 flex items-center justify-center"
              disabled
            >
              Pay Now
            </Button>
          </div>
        )}
        {price_finalized && !paid && (
          <>
            <div className="flex flex-col items-center w-full">
              <br />
              <p className="text-base mb-2">
                here is the price as agreed upon by you and the photographer:{" "}
                <span className="font-bold">${job_price}</span>
              </p>
              {mit_po ? (
                <>
                  <Button
                    className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white flex items-center justify-center mb-2"
                    onClick={async () => {
                      const response = await fetch('/api/invoice', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ jobId: jobDetails.conversation_id }),
                      });

                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${event_title}-invoice.pdf`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                      } else {
                        console.error('Failed to generate invoice');
                      }
                    }}
                  >
                    Download Invoice
                  </Button>
                  <p className="text-sm italic mb-2">
                    Here is your invoice for processing. For MIT users, this can be submitted via Purchase Order.
                  </p>
                </>
              ) : (
                <PayNowButton
                  jobDetails={jobDetails}
                  className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white flex items-center justify-center"
                />
              )}
              <p className="text-sm italic">
                final price includes service fees + additional charges that help maintain this platform
              </p>
            </div>
          </>
        )}
        {price_finalized &&
          paid &&
          !pictures_uploaded && (
            <>
              <div className="mt-10">
                <p className="flex flex-col items-center text-lg font-bold inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text px-0.5 italic leading-snug text-transparent">
                  Congrats, your event {event_title} has been confirmed!
                </p>

                <p className="mt-5">
                  You will be notified via email when your images have been
                  uploaded.
                </p>

                <p className="mt-5 italic">
                  You may cancel for a full refund by{" "}
                  {format(subDays(new Date(event_date), 7), "PPP")}
                </p>
              </div>
            </>
          )}

        {paid &&
          pictures_uploaded && (
            <div className="mt-10">
              <p className="flex flex-col items-center text-lg">
                Your pictures are ready to be viewed!
              </p>
              <div className="flex justify-center mt-4">
                <Link
                  href={picture_url || `/gallery/${jobDetails.conversation_id}`}
                  className="px-4 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 transition-colors"
                >
                  View Images
                </Link>
              </div>
              <p className="text-center mt-4 text-sm italic">
                Please review your images and confirm receipt. If we don't hear
                from you within 3 days, we'll assume you're satisfied with the
                images.
              </p>
            </div>
          )}

        {!paid && !pictures_uploaded && (
          <>
            <p className="text-base mt-10"></p>
            How it works:
            <ul className="list-disc">
              <li className="mt-2">
                After you accept the photographer's quoted price, you will be
                given payment instructions.
              </li>
              <li className="mt-2">
                The photographer will not receive this payment until after they
                return your pictures from "{event_title}".
              </li>
              <li className="mt-2">
                They will be notified that you have paid, which will confirm the
                booking reservation.
              </li>
              <li className="mt-2">
                This is to remove any discrepancies and protect the money being
                transacted between you and the photographer.
              </li>
              <li className="mt-2 italic">
                You may cancel for a full refund by{" "}
                {format(subDays(new Date(event_date), 7), "PPP")}
              </li>
            </ul>
          </>
        )}

        <br />
        <p className="text-base font-bold">
          If you have questions or concerns, please email{" "}
          <a
            href="mailto:hello@gophotos.us"
            className="text-blue-500 hover:underline"
          >
            hello@gophotos.us
          </a>
        </p>
      </CardBody>
    </Card>
  );
}
