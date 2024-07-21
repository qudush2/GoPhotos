import { getApplication } from "@/src/utils/db";
import Link from "next/link";
import ApproveButton from "../approve-button";
import ImageManager from "@/src/components/ImageManagement/ImageManager";

export default async function ApplicationDetails({
  params,
}: {
  params: { clerkID: string };
}) {
  const application = await getApplication(params.clerkID);

  if (!application) {
    return (
      <div className="px-20 py-7">
        <h1 className="text-2xl font-bold mb-6">Application Not Found</h1>
        <p>The requested application does not exist.</p>
        <Link
          href="/admin/photographer-application"
          className="text-blue-500 hover:underline"
        >
          Back to All Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/admin/photographer-application"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Back to All Applications
      </Link>
      <h1 className="text-2xl font-bold mb-6">Application Details</h1>
      <div className="bg-white shadow-xl border-black border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{application.full_name}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Email:</p>
            <p>{application.email}</p>
          </div>
          <div>
            <p className="font-semibold">Location:</p>
            <p>{application.location}</p>
          </div>
          <div>
            <p className="font-semibold">Price Range:</p>
            <p>
              ${application.price_low} - ${application.price_high}
            </p>
          </div>
          <div>
            <p className="font-semibold">School:</p>
            <p>{application.school}</p>
          </div>
          <div>
            <p className="font-semibold">Skills:</p>
            <p>{application.skills.join(", ")}</p>
          </div>
          <div>
            <p className="font-semibold">Number of Hires:</p>
            <p>{application.hires}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold">About:</p>
          <p>{application.about}</p>
        </div>
        {application.other && (
          <div className="mt-4">
            <p className="font-semibold">Additional Comments:</p>
            <p>{application.other}</p>
          </div>
        )}
        <div className="mt-6">
          <ApproveButton
            clerkID={params.clerkID}
            email={application.email}
            refresh={false}
          />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Portfolio Images</h2>
        <ImageManager
          folderId={`photographer-application/${params.clerkID}`}
          isPhotographer={false}
          metadataEditable={false}
          isAdminPage={true}
        />
      </div>
    </div>
  );
}
