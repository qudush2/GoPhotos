import { JobDetails } from "@/src/utils/types";
import { Button } from "@nextui-org/react";

interface PayNowButtonProps {
  jobDetails: JobDetails;
  className: string;
}

export default function PayNowButton({
  jobDetails,
  className,
}: PayNowButtonProps) {
  const { conversation_id, job_price } = jobDetails;

  return (
    <>
      <form
        action="/api/stripe/create-checkout-session"
        method="POST"
        target="_blank"
        className="w-full"
      >
        <input type="hidden" name="conversation_id" value={conversation_id} />
        <input type="hidden" name="job_price" value={job_price} />
        <Button type="submit" className={className}>
          Pay Now
        </Button>
      </form>
    </>
  );
}
