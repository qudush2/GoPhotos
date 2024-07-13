"use server";

import { PhotographerAccount } from "@/src/utils/types";
import { createJob, getPGClerkId, createJobDetails } from "@/src/utils/db";

type State = {
  isSent: boolean;
  hasError: boolean;
};

export default async function sendQuoteRequestAction(
  account: PhotographerAccount,
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

  await createJobDetails(
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
