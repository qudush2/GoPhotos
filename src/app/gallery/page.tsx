import {
  getCustomerGalleries,
  getPGGalleries,
  getJobDetails,
  isPGClerk,
} from "@/src/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

export default async function Gallery() {
  const user = await currentUser();
  const isPhotographer = await isPGClerk(user!.id);
  let jobIDs: string[] = [];

  if (isPhotographer) {
    jobIDs = await getPGGalleries(user!.id);
  } else {
    jobIDs = await getCustomerGalleries(user!.id);
  }

  const jobDetails = await Promise.all(jobIDs.map((id) => getJobDetails(id)));

  return (
    <div className="px-8 md:px-20 md:py-7">
      <h1 className="text-2xl font-bold mb-4">Your Galleries</h1>
      {jobDetails.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobDetails.map((job, index) => (
            <li
              key={jobIDs[index]}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link
                href={`/gallery/${job.conversation_id}`}
                className="block hover:opacity-75 transition-opacity"
              >
                <div className="relative h-80 w-full">
                  {job.pictures_uploaded ? (
                    job.cover_image ? (
                      <Image
                        src={job.cover_image}
                        alt={job.event_title}
                        layout="fill"
                        objectFit="cover"
                        className="bg-gray-100"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No cover image</span>
                      </div>
                    )
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No images uploaded</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {job.event_title}
                  </h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center py-8">
          You don't have any galleries to show yet.
        </p>
      )}
    </div>
  );
}
