import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Link,
  Button,
} from "@nextui-org/react";
import { JobDetails, Account, Asset } from "@/utils/types";
import { ScrollArea, ScrollBar } from "@/components/scroll-area";
import {
  getAccountDetailsByName,
  getAssets,
} from "@/utils/api";
import { shuffle } from "lodash";
import Image from "next/image";

export default async function BookingCardCustomer({
  jobDetails,
  pgName,
  className,
}: {
  jobDetails: JobDetails;
  pgName: string;
  className?: string;
}) {
  const {
    event_title,
    loc,
    event_date,
    price_finalized,
    job_price,
  } = jobDetails;

  const account = (await getAccountDetailsByName(pgName)) as Account;
  const assets = (await getAssets(account.id)) as Asset[];

  return (
    <Card className="px-2">
      <CardHeader className="flex gap-3">
        <div className="flex ml-2">
          <p className="text-xl font-medium">
            {event_title} with {account.fullName.split(" ")[0]}
          </p>
        </div>
      </CardHeader>
      <Divider className="h-[1px] bg-black my-2" />
      <CardBody>
        <Link
          href={`/discover/${encodeURIComponent(account.fullName)}`}
          target="_blank"
        >
          <a>
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
                        backgroundImage: `url(${asset.cdnPath})`,
                        filter: "blur(20px)",
                        zIndex: 0,
                        opacity: 0.5,
                      }}
                    />
                    <Image
                      alt=""
                      src={asset.cdnPath}
                      placeholder="blur"
                      blurDataURL={asset.placeholderBase64}
                      fill
                      className="object-contain z-10"
                    />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </a>
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

        {!price_finalized && (
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
        {price_finalized && (
          <>
          <div className="flex flex-col items-center">
            <br />
            <p className="text-base mb-2">
              here is the price as agreed upon by you and the photographer:{" "}
              <span className="font-bold">${job_price}</span>
            </p>
            <PayNowButton jobDetails={jobDetails}/>
            <p className="text-sm italic">
              final price includes service fees + additional charges that help
              maintain this platform
            </p>
          </div>
          </>
        )}

        <br />
        <br />
        <p className="text-base italic">
          How it works:
          <ul className="list-disc">
            <li className="mt-2">
              After you accept the photographer's quoted price, you will be
              given payment instructions.
            </li>
            <li className="mt-2">
              The photographer will not recieve this payment until after they
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
              You may cancel for a full refund up to 1 week before the date of
              the event ({event_date})
            </li>
          </ul>
        </p>

        <br />
        <p className="text-base italic font-bold">
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


export function PayNowButton({
  jobDetails,
}: {
  jobDetails: JobDetails;
}) {
  const { conversation_id, job_price } = jobDetails;

  return (
    <>
      <form
        action="/api/create-checkout-session"
        method="POST"
        target='_blank'
        className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white flex items-center justify-center"
      >
        <input type="hidden" name="conversation_id" value={conversation_id} />
        <input type="hidden" name="job_price" value={job_price} />
        <Button type="submit">
          Pay Now
        </Button>
      </form>
    </>
  );
}