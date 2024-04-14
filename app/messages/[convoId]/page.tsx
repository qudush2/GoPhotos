import ChatBox from "../chat-inbox";
import BookingCardCustomer from "../../../components/booking-card-customer";
import BookingCardPhotographer from "../../../components/booking-card-photographer";
import { Banner, BannerCollapseButton } from "flowbite-react";
import { HiX } from "react-icons/hi";

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
      <div className="flex h-[80vh] w-full overflow-auto px-7 sm:px-20 sm:mb-10">
        <Banner className="absolute w-screen z-50 bg-black lg:hidden left-0">
          <div className="flex w-full justify-between p-4">
            <p className="flex items-center text-sm font-normal text-white">
              Open on desktop to view full booking menu.
            </p>
            <BannerCollapseButton className="border-0 bg-transparent text-gray-500 pl-4">
              <HiX className="h-4 w-4" />
            </BannerCollapseButton>
          </div>
        </Banner>

        <div
          className="grid grid-cols-3 w-full h-full border-2
        lg:grid-cols-7"
        >
          <div
            className="col-span-3
          lg:col-span-5"
          >
            <ChatBox
              jobDetails={jobDetails}
              convoId={decodedId}
              pgEmail={account.email}
              pgName={account.fullName}
              pgClerkID={pgClerkID}
              customer={customer}
            />
          </div>

          <div
            className="hidden h-[80vh] overflow-auto border-l
          lg:block lg:col-span-2"
          >
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
      </div>
    );
  }
}
