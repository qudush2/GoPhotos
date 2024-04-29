import {
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@nextui-org/react";
import { JobDetails, Customer } from "@/utils/types";
import PhotographerPriceForm from "./photographer-price-form";

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
  } = jobDetails;
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
        <p>Date: {event_date}</p>
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
        {price_finalized && !paid && (
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
              After you have given your quote and your client accepts it, enter
              the agreed upon price here.
            </li>
            <li className="mt-2">
              The customer will then be given payment instructions. After the
              customer has paid, you will be notified. This will then confirm
              the booking.
            </li>
            <li className="mt-2">
              You will then receive your quoted price (in it's full amount with
              any applicable taxes removed) after you have returned the
              customer's pictures.
            </li>
            <li className="mt-2">
              A gallery upload form will become available after the date of the
              proposed job.
            </li>
            <li className="mt-2">
              This is to remove any discrepancies and protect the money being
              transacted between you and the customer. It also helps you manage
              all of your income from photography, for tax purposes.
            </li>
            <li className="mt-2 italic">
              Customers may cancel for a full refund up to 1 week before the
              date of the event ({event_date})
            </li>
          </ul>
        </>
        </>
        )}

      {price_finalized && paid && (
          <>
          <div className="mt-10">
            <p className="flex flex-col items-center text-lg font-bold inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text px-0.5 italic leading-snug text-transparent">
              Congrats, your event {event_title} has been confirmed! <br/> {customer.full_name.split(' ')[0]} has paid ${job_price}.
            </p>

            <p className="font-medium text-xl mt-10">What's Next:</p>
          <ul className="list-disc">
            <li className="mt-2">
              A section to upload your images will appear hear closer to the date of the gig.
            </li>
            <li className="mt-2">
              After you submit your photos and {customer.full_name.split(' ')[0]} has confirmed recieving it (or after 3 days), the payout process will begin for you.
              You should then receive your payment within a week! 
            </li>
          </ul>
          </div>
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
