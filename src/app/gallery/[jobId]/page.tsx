import { currentUser } from "@clerk/nextjs/server";
import { getJobDetails, getCustomerInfo } from "@/src/utils/db";
import Manager from "@/src/components/Images/Gallery/Manager";
import NotifyCustomerButton from "@/src/components/NotifyCustomerButton";
import Link from "next/link";

export default async function GalleryPage({
  params,
}: {
  params: { jobId: string };
}) {
  const user = await currentUser();

  const jobDetails = await getJobDetails(params.jobId);
  const isPhotographer = user!.id === jobDetails.photographer_clerk_id;
  const customerInfo = await getCustomerInfo(jobDetails.customer_clerk_id);
  const isCustomer = user!.id === customerInfo.clerkid;

  if (!jobDetails) {
    return <div>Job not found</div>;
  }

  const folderId = `client-galleries/${params.jobId}`;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-6">
        {jobDetails.event_title} Gallery
      </h1>
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
        {isPhotographer && (
          <NotifyCustomerButton
            jobDetails={jobDetails}
            customerInfo={customerInfo}
          />
        )}
        {(isPhotographer || isCustomer) && (
          <Link
            href={`/messages/${jobDetails.conversation_id}`}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Jump to Messages
          </Link>
        )}
      </div>
      <Manager
        folderId={folderId}
        isPhotographer={isPhotographer}
        convoID={params.jobId}
      />
    </div>
  );
}
