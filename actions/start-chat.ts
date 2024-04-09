"use server";

import { Account } from "@/utils/types";
import { createJob, getPGClerkId, addJobDetails } from "@/utils/db";

type State = {
  isSent: boolean;
  hasError: boolean;
};

export default async function sendQuoteRequestAction(
  account: Account,
  userID: string,
  convoID: string,
  _state: State,
  formData: FormData
) {
  const {
    eventTitle,
    location,
    startTime,
    endTime,
    eventDate,
    organization,
    eventDescription,
  } = Object.fromEntries(formData);

  const pgClerkId = await getPGClerkId(account.email);

  await addJobDetails(
    convoID,
    eventTitle.toString(),
    location.toString(),
    startTime.toString(),
    endTime.toString(),
    eventDate.toString(),
    organization.toString(),
    eventDescription.toString()
  );

  return await createJob(pgClerkId, userID, convoID);
}
