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
import { getAccountByClerkId, getPortfolioPictures } from "@/src/utils/db";
import { shuffle } from "lodash";
import Image from "next/image";
import { format, subDays } from "date-fns";

export default async function BookingCardCustomer({
  jobDetails,
  className,
}: {
  jobDetails: JobDetails;
  className?: string;
}) {
  const {
    event_title,
    loc,
    event_date,
    price_finalized,
    job_price,
    paid,
    pictures_uploaded,
  } = jobDetails;

  const account = await getAccountByClerkId(jobDetails.photographer_clerk_id);
  const assets = await getPortfolioPictures(account.clerk_id);

  return (
    <Card className="px-2">
      <CardHeader className="flex gap-3">
        <div className="flex ml-2">
          <p className="text-xl font-medium">
            {event_title} with {account.full_name.split(" ")[0]}
          </p>
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
                      backgroundImage: `url(${asset.url})`,
                      filter: "blur(20px)",
                      zIndex: 0,
                      opacity: 0.5,
                    }}
                  />
                  <Image
                    alt=""
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
              The quote of the job has not been finalized. After the price has
              been finazlied, you will be able to pay.
            </p>
            <Button
              className="w-full rounded-md bg-gray-300 px-3 py-2 text-sm font-medium text-gray-500 flex items-center justify-center"
              disabled
            >
              Pay Now
            </Button>
          </div>
        )}
        {price_finalized && !paid && !pictures_uploaded && (
          <>
            <div className="flex flex-col items-center">
              <br />
              <p className="text-base mb-2">
                here is the price as agreed upon by you and the photographer:{" "}
                <span className="font-bold">${job_price}</span>
              </p>
              <PayNowButton jobDetails={jobDetails} />
              <p className="text-sm italic">
                final price includes service fees + additional charges that help
                maintain this platform
              </p>
            </div>
          </>
        )}
        {price_finalized && paid && !pictures_uploaded && (
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

        {paid && pictures_uploaded && (
          <div className="mt-10">
            <p className="flex flex-col items-center text-lg">
              Your pictures are ready to be viewed!
            </p>
            <div className="flex justify-center mt-4">
              <Link
                href={`/gallery/${jobDetails.conversation_id}`}
                className="px-4 py-2 bg-black text-white font-bold rounded inline-block"
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

export function PayNowButton({ jobDetails }: { jobDetails: JobDetails }) {
  const { conversation_id, job_price } = jobDetails;

  return (
    <>
      <form
        action="/api/stripe/create-checkout-session"
        method="POST"
        target="_blank"
        className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white flex items-center justify-center"
      >
        <input type="hidden" name="conversation_id" value={conversation_id} />
        <input type="hidden" name="job_price" value={job_price} />
        <Button type="submit">Pay Now</Button>
      </form>
    </>
  );
}
