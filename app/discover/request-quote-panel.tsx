import { Account } from "@/utils/types";
import { getAllJobIDs, getPGClerkId, createJob } from "@/utils/db";
import {RequestQuoteButton} from './request-quote-button'
import { currentUser } from "@clerk/nextjs";


export default async function RequestQuotePanel({
  photographer,
}: {
  photographer: Account;
}) {

	const user = await currentUser()
	const convoID = await generateUniqueID()
	const photographerClerkID = await getPGClerkId(photographer.email) // will return null if DNE
	const customerClerkID = user?.id || ''

	// await createJob(photographerClerkID, customerClerkID, convoID)

  return (
    <div>
      <p className="text-xl font-medium mb-2">Request a Quote</p>
      <p className="text-sm text-gray-600 pb-3">
        Great! There is some information that we need before you can start
        chatting with {photographer.fullName}
      </p>
      <form
        className="mt-3 space-y-3"
        action="/messages"
        target="_blank"
        method="POST"
      >
        <div>
          <label htmlFor="location" className="sm text-sm font-medium">
            Location{" "}
            <i>(please be as specific as possible OR put exact address )</i>
          </label>
          <input
            id="location"
            name="location"
            // required
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            placeholder="MIT Media Lab"
          />
        </div>
        <div>
          <label htmlFor="eventDate" className="sm text-sm font-medium">
            Date
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            // required
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label htmlFor="startTime" className="sm text-sm font-medium">
            Start Time <i>(optional)</i>
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="sm text-sm font-medium">
            End Time <i>(optional)</i>
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
          />
        </div>
        <div>
          <label htmlFor="organization" className="sm text-sm font-medium">
            Organization <i>(optional)</i>
          </label>
          <input
            id="organization"
            name="organization"
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            placeholder="GoPhotos"
          />
        </div>
        <div>
          <label htmlFor="eventDescription" className="sm text-sm font-medium">
            Event Description
          </label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            // required
            className="w-full rounded-md border border-gray-200 text-sm outline-none"
            placeholder="Please be sure to include an overall description of the event, types of photos you expect, & any other necessary information."
          />
        </div>
        <RequestQuoteButton customerID={customerClerkID} photographerID ={photographerClerkID} convoID={convoID}/>
      </form>
    </div>
  );
}

async function generateUniqueID() {
  const existingIDs = await getAllJobIDs();
  let uniqueID;
  do {
    uniqueID = Math.floor(100000 + Math.random() * 900000).toString();
  } while (existingIDs.includes(uniqueID));
  return uniqueID;
}

// write the form response to job details table --> this can happen on the api then it redirects after it writes to db