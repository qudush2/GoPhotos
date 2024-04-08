import ChatBox from "../chat-inbox";
import BookingCardCustomer from "../../../components/booking-card-customer";
import BookingCardPhotographer from "../../../components/booking-card-photographer";

import {
  getJobDetails,
  getAccountByEmail,
  getEmailByClerk,
  getCustomerInfo,
} from "../../../utils/db";
import { currentUser } from "@clerk/nextjs";
import { JobDetails, Customer, Account } from "@/utils/types";

export default async function MessageUniquePage({
  params,
}: {
  params: { convoId: string };
}) {
  const jobDetails = (await getJobDetails(params.convoId)) as JobDetails;
  const customer = (await getCustomerInfo(
    jobDetails.customer_clerk_id
  )) as Customer;
  const pgClerkID = jobDetails.photographer_clerk_id;
  const account = (await getAccountByEmail(
    await getEmailByClerk(pgClerkID)
  )) as Account;

  const decodedId = decodeURIComponent(params.convoId);

  const user = await currentUser();

  if (!user) {
    return null;
  }

  if (user) {
    const isPG = user.publicMetadata.isPhotographer as boolean;

    return (
      <div className="px-20 mb-10 grid grid-cols-7 h-[80vh]">
        <div className="border-2 border-red-500 w-full col-span-5">
          <ChatBox
            jobDetails={jobDetails}
            convoId={decodedId}
            pgEmail={account.email}
            pgName={account.fullName}
            pgClerkID={pgClerkID}
            customer={customer}
          />
        </div>
        <div className="col-span-2 border border-blue-500 overflow-auto">
          {!isPG && (
            <BookingCardCustomer
              jobDetails={jobDetails}
              pgName={account.fullName}
              className="h-full"
            />
          )}
          {isPG && (
            <BookingCardPhotographer
              jobDetails={jobDetails}
              customer={customer}
              className="h-full"
            />
          )}
        </div>
      </div>
    );
  }
}
