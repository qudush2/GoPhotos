import {getCustomerGalleries, getPGGalleries, getJobDetails, isPGClerk} from '@/src/utils/db'
import {currentUser} from "@clerk/nextjs/server"
import Link from 'next/link'

export default async function Gallery() {
  const user = await currentUser()
  const isPhotographer = await isPGClerk(user!.id)
  let jobIDs: string[] = []

  if (isPhotographer) {
    jobIDs = await getPGGalleries(user!.id)
  } else {
    jobIDs = await getCustomerGalleries(user!.id)
  }

  const jobDetails = await Promise.all(jobIDs.map(id => getJobDetails(id)))

  return (
    <div className="px-8 md:px-20 md:py-7">
      <h1 className="text-2xl font-bold mb-4">Your Galleries</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {jobDetails.map((job, index) => (
          <li key={jobIDs[index]}>
            <Link href={`/gallery/${job.conversation_id}`} className="block bg-gray-100 p-4 rounded hover:bg-gray-200 transition-colors">
              {job.event_title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}