"use server";

import { sendEmail } from "@/utils/api";
import { Account } from "@/utils/types";

type State = {
  isSent: boolean;
  hasError: boolean;
};

export default async function sendQuoteRequestAction(
  photographer: Account,
  _state: State,
  formData: FormData
) {
  const {
    name,
    email,
    phoneNumber,
    location,
    startTime,
    endTime,
    eventDate,
    organization,
    eventDescription,
  } = Object.fromEntries(formData);

  return await sendEmail(
    {
      email: email.toString(),
      name: name.toString(),
      date: eventDate.toString(),
	  location: location.toString(),
	  startTime: startTime?.toString(),
	  endTime: endTime?.toString(),
      eventDescription: eventDescription.toString(),
      phoneNumber: phoneNumber.toString(),
      organization: organization?.toString(),
    },
    {
      email: photographer.email,
      name: photographer.fullName,
    }
  );
}
