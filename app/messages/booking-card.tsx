import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Link,
  Button,
} from "@nextui-org/react";
import { JobDetails } from "@/utils/types";
import PhotographerPriceForm from "./photographer-price-form";

export default function BookingCard({
  jobDetails,
  isPG,
  className,
}: {
  jobDetails: JobDetails;
  isPG: boolean;
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
    conversation_id,
    price_finalized,
    job_price,
    payment_url,
  } = jobDetails;

  //for customers
  if (!isPG) {
    return (
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex ml-2">
            <p className="text-lg">Details</p>
          </div>
        </CardHeader>
        <Divider className="h-[1px] bg-black my-2" />
        <CardBody>
          <p>Make beautiful websites regardless of your design experience.</p>
          {loc}
          {organization}
          <span>
            <br />
            you are seeing this because you are a customer!!!!!
          </span>
          {!price_finalized && (
            <div>
              After you have agreed to a price with the photogrpaher you will be
              given payment instructions. This is to make sure that both you and
              the photographer are
            </div>
          )}
          {price_finalized && (
            <div>
              here is the price of the job proposed by the photographer: $
              {job_price}
              <Button
                as={Link}
                href={payment_url}
                target="_blank"
                className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
              >
                Pay Now
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }

  //for photographers
  if (isPG) {
    return (
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex ml-2">
            <p className="text-lg">Details</p>
          </div>
        </CardHeader>
        <Divider className="h-[1px] bg-black my-2" />
        <CardBody>
          <p>Make beautiful websites regardless of your design experience.</p>
          {loc}
          {organization}
          <span>
            <br />
            you are seeing this because you are a photographer!!!!! Submit the
            final price once the customer accepts it. They will then pay and you
            will get notified.
          </span>
          {!price_finalized && (
            <PhotographerPriceForm jobDetails={jobDetails} />
          )}
          {price_finalized && (
            <div>
              here is the price of the job that the customer will pay: $
              {job_price}
              <br /> You will be notified when your client has been paid, which
              will confirm the job for both you and the customer
            </div>
          )}
        </CardBody>
      </Card>
    );
  }
}
